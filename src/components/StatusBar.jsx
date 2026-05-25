/**
 * VALVET — Componente: StatusBar
 * Barra de status inferior fixa: latência, usuário, horário UTC.
 */

import { useState, useEffect } from 'react'
import { useAuth } from "../hooks/useAuth";

export default function StatusBar({ latencyMs }) {
  const { user } = useAuth()
  const [utcTime, setUtcTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setUtcTime(
        now.toUTCString().replace('GMT', 'UTC').split(' ').slice(0, 5).join(' ')
      )
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="status-bar">
      {/* Status online */}
      <span className="status-online" style={{ color: 'var(--neon-cyan)' }}>
        VALVET ONLINE
      </span>

      {/* Latência */}
      {latencyMs !== null && (
        <span>
          LATÊNCIA:{' '}
          <span style={{ color: latencyMs < 1000 ? 'var(--neon-cyan)' : 'var(--neon-pink)' }}>
            {latencyMs}ms
          </span>
        </span>
      )}

      {/* Spacer */}
      <span style={{ flex: 1 }} />

      {/* Usuário logado */}
      {user && (
        <span>
          USR:{' '}
          <span style={{ color: 'var(--neon-purple)' }}>{user.username}</span>
          {user.isAdmin && (
            <span style={{ color: 'var(--neon-pink)', marginLeft: 6 }}>[ADMIN]</span>
          )}
        </span>
      )}

      {/* Horário UTC */}
      <span style={{ color: 'var(--text-muted)' }}>{utcTime}</span>
    </div>
  )
}
