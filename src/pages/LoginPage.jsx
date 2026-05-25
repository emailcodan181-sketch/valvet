/**
 * VALVET — Página: Login
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import StatusBar from '../components/StatusBar'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 20px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: '42px',
            letterSpacing: '0.15em',
            color: 'var(--neon-purple)',
            textShadow: '0 0 20px rgba(157,78,221,0.5)',
          }}>
            VALVET
          </h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 6 }}>
            Interface Operacional de IA
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(157,78,221,0.3)',
          padding: '32px',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
            // autenticação
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Username
              </label>
              <input
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                placeholder="identificador"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid rgba(157,78,221,0.25)',
                  color: 'var(--text-primary)',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--neon-purple)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(157,78,221,0.25)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Senha
              </label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid rgba(157,78,221,0.25)',
                  color: 'var(--text-primary)',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '14px',
                  outline: 'none',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--neon-purple)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(157,78,221,0.25)'}
              />
            </div>

            {error && (
              <div style={{
                padding: '10px 12px',
                background: 'rgba(255,45,120,0.08)',
                border: '1px solid rgba(255,45,120,0.3)',
                color: 'var(--neon-pink)',
                fontSize: '12px',
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: 8, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Autenticando...' : 'Acessar Sistema'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            Não tem acesso?{' '}
            <Link to="/register" style={{ color: 'var(--neon-purple)', textDecoration: 'none' }}>
              Registrar
            </Link>
          </div>
        </div>

        {/* Warning */}
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', opacity: 0.6 }}>
          Acesso restrito — requer código de convite
        </div>
      </div>

      <StatusBar />
    </div>
  )
}
