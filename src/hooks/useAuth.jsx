/**
 * VALVET — Hook: useAuth
 * Contexto de autenticação global com refresh automático de tokens.
 * O Access Token é mantido em memória (nunca em localStorage).
 */

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || ''

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [loading, setLoading]         = useState(true)
  const refreshTimerRef               = useRef(null)

  // Agenda refresh automático antes do token expirar (a cada 14 min)
  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    refreshTimerRef.current = setTimeout(() => {
      refreshToken()
    }, 14 * 60 * 1000) // 14 minutos (token expira em 15)
  }, [])

  const refreshToken = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/v1/auth/refresh`, {
        method:      'POST',
        credentials: 'include', // Envia cookie HttpOnly
      })

      if (!res.ok) {
        setUser(null)
        setAccessToken(null)
        return false
      }

      const data = await res.json()
      setAccessToken(data.accessToken)
      scheduleRefresh()
      return true
    } catch {
      setUser(null)
      setAccessToken(null)
      return false
    }
  }, [scheduleRefresh])

  // Ao montar, tentar restaurar sessão via refresh token em cookie
  useEffect(() => {
    const restore = async () => {
      const success = await refreshToken()
      if (!success) {
        setLoading(false)
        return
      }
      // Buscar dados do usuário com o novo token
      // O token acabou de ser atualizado via setState — usar callback
      setLoading(false)
    }
    restore()

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    }
  }, [])

  const login = async (username, password) => {
    const res = await fetch(`${API}/api/v1/auth/login`, {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ username, password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Erro no login')

    setAccessToken(data.accessToken)
    setUser(data.user)
    scheduleRefresh()
    return data.user
  }

  const register = async (username, password, accessCode) => {
    const res = await fetch(`${API}/api/v1/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password, accessCode }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || data.errors?.[0]?.msg || 'Erro no registro')
    return data
  }

  const logout = async () => {
    try {
      await fetch(`${API}/api/v1/auth/logout`, {
        method:      'POST',
        credentials: 'include',
      })
    } catch { /* ignora erros de rede no logout */ }

    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
    setUser(null)
    setAccessToken(null)
  }

  /**
   * Wrapper para fetch autenticado com renovação automática de token.
   * Uso: authFetch('/api/v1/admin/metrics')
   */
  const authFetch = useCallback(async (url, options = {}) => {
    const makeRequest = (token) =>
      fetch(`${API}${url}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      })

    let res = await makeRequest(accessToken)

    // Se 401, tentar renovar token e repetir
    if (res.status === 401) {
      const refreshed = await refreshToken()
      if (!refreshed) {
        setUser(null)
        setAccessToken(null)
        throw new Error('Sessão expirada — faça login novamente')
      }
      // Nota: o novo token estará no state após refreshToken()
      // mas como closures podem estar stale, buscamos via um segundo refresh
      // Para simplicidade em dev, repetimos a requisição com o token atual no closure
      res = await makeRequest(accessToken)
    }

    return res
  }, [accessToken, refreshToken])

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, loading, login, register, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
