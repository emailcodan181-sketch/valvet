/**
 * VALVET — Route Guards
 */

import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

/**
 * PrivateRoute: redireciona para /login se não autenticado.
 */
export function PrivateRoute({ children }) {
  const { user, loading, accessToken } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="text-2xl font-display neon-text-purple mb-3" style={{ fontFamily: 'Share Tech Mono' }}>
            VALVET
          </div>
          <div className="flex gap-2 justify-center">
            <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--neon-purple)', display: 'inline-block' }} />
            <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--neon-purple)', display: 'inline-block' }} />
            <span className="typing-dot w-2 h-2 rounded-full" style={{ background: 'var(--neon-purple)', display: 'inline-block' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!user && !accessToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * AdminRoute: exibe 404 visual para não-admins (não redireciona).
 * Não revela que a rota existe para usuários comuns.
 */
export function AdminRoute({ children }) {
  const { user, loading, accessToken } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="typing-dot" />
      </div>
    )
  }

  // Não autenticado → 404 (não redireciona — não revela que a rota existe)
  if (!user || !accessToken) {
    return <NotFound />
  }

  // Autenticado mas não é admin → 404
  if (!user.isAdmin) {
    return <NotFound />
  }

  return children
}

function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-4"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}
    >
      <div style={{ fontFamily: 'Share Tech Mono', fontSize: '72px', color: 'var(--neon-purple)', opacity: 0.3 }}>
        404
      </div>
      <p style={{ fontFamily: 'JetBrains Mono', fontSize: '13px' }}>
        Página não encontrada
      </p>
    </div>
  )
}
