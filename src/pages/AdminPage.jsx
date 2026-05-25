/**
 * VALVET — Página: Painel Administrativo (/sys/control-panel)
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import StatusBar from '../components/StatusBar'

const API = import.meta.env.VITE_API_URL || ''

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: `1px solid rgba(${color}, 0.25)`,
      padding: '16px 20px',
      flex: 1, minWidth: 160,
    }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: '28px', fontFamily: 'Share Tech Mono', color: `rgb(${color})`, lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function CodeModal({ code, onClose }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ fontFamily: 'Share Tech Mono', color: 'var(--neon-cyan)', fontSize: '14px', marginBottom: 16 }}>✓ CÓDIGO GERADO</div>
        <div style={{ padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1px solid rgba(0,245,255,0.3)', fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--neon-cyan)', wordBreak: 'break-all', marginBottom: 12 }}>
          {code.code}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--neon-pink)', marginBottom: 16, padding: '8px 12px', border: '1px solid rgba(255,45,120,0.25)', background: 'rgba(255,45,120,0.05)' }}>
          ⚠ Este código não será exibido novamente
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 16 }}>
          Expira: {new Date(code.expiresAt).toLocaleString('pt-BR')}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={copy} className="btn-primary" style={{ flex: 1 }}>{copied ? '✓ Copiado!' : 'Copiar Código'}</button>
          <button onClick={onClose} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid rgba(100,116,139,0.3)', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '13px' }}>Fechar</button>
        </div>
      </div>
    </div>
  )
}

function UsersPanel({ authFetch, currentUserId }) {
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(null) // { id, action }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await authFetch('/api/v1/admin/users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch { }
    finally { setLoading(false) }
  }, [authFetch])

  useEffect(() => { load() }, [load])

  const action = async (id, type) => {
    try {
      await authFetch(`/api/v1/admin/users/${id}/${type}`, { method: 'POST' })
      setConfirm(null)
      await load()
    } catch { }
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(157,78,221,0.15)', marginBottom: 24 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(157,78,221,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Usuários
        </span>
        <button onClick={load} style={{ background: 'transparent', border: '1px solid rgba(157,78,221,0.3)', color: 'var(--neon-purple)', fontFamily: 'JetBrains Mono', fontSize: '11px', padding: '4px 12px' }}>
          ↻ Atualizar
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>Carregando...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Cargo</th>
                <th>Status</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>Nenhum usuário</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} style={{ opacity: u.banned ? 0.6 : 1 }}>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--neon-cyan)' }}>{u.username}</td>
                  <td>
                    <span style={{ fontSize: '11px', color: u.isAdmin ? 'var(--neon-purple)' : 'var(--text-muted)' }}>
                      {u.isAdmin ? '★ ADMIN' : 'usuário'}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: '11px', padding: '2px 8px',
                      background: u.banned ? 'rgba(255,45,120,0.1)' : 'rgba(0,245,255,0.1)',
                      color: u.banned ? 'var(--neon-pink)' : 'var(--neon-cyan)',
                      border: `1px solid ${u.banned ? 'rgba(255,45,120,0.3)' : 'rgba(0,245,255,0.3)'}`,
                    }}>
                      {u.banned ? 'BANIDO' : 'ATIVO'}
                    </span>
                  </td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleString('pt-BR')}</td>
                  <td>
                    {u.id !== currentUserId && (
                      confirm?.id === u.id ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => action(u.id, confirm.action)} className="btn-danger" style={{ fontSize: '10px', padding: '3px 10px' }}>Confirmar</button>
                          <button onClick={() => setConfirm(null)} style={{ background: 'transparent', border: '1px solid rgba(100,116,139,0.3)', color: 'var(--text-muted)', fontSize: '10px', padding: '3px 10px', fontFamily: 'JetBrains Mono' }}>Cancelar</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 6 }}>
                          {u.banned ? (
                            <button onClick={() => setConfirm({ id: u.id, action: 'unban' })} className="btn-primary" style={{ fontSize: '10px', padding: '3px 10px' }}>Desbanir</button>
                          ) : (
                            <button onClick={() => setConfirm({ id: u.id, action: 'ban' })} className="btn-danger" style={{ fontSize: '10px', padding: '3px 10px' }}>Banir</button>
                          )}
                          <button onClick={() => action(u.id, 'kick')} style={{ background: 'transparent', border: '1px solid rgba(157,78,221,0.3)', color: 'var(--neon-purple)', fontSize: '10px', padding: '3px 10px', fontFamily: 'JetBrains Mono' }}>Kick</button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CodesPanel({ authFetch }) {
  const [codes, setCodes]           = useState([])
  const [loading, setLoading]       = useState(false)
  const [generating, setGenerating] = useState(false)
  const [newCode, setNewCode]       = useState(null)
  const [confirmRevokeId, setConfirmRevokeId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await authFetch('/api/v1/admin/codes')
      const data = await res.json()
      setCodes(data.codes || [])
    } catch { }
    finally { setLoading(false) }
  }, [authFetch])

  useEffect(() => { load() }, [load])

  const generate = async () => {
    setGenerating(true)
    try {
      const res  = await authFetch('/api/v1/admin/codes/generate', { method: 'POST' })
      const data = await res.json()
      setNewCode(data)
      await load()
    } catch { }
    finally { setGenerating(false) }
  }

  const revoke = async (id) => {
    try {
      await authFetch(`/api/v1/admin/codes/${id}`, { method: 'DELETE' })
      setConfirmRevokeId(null)
      await load()
    } catch { }
  }

  const badgeClass = (s) => `badge badge-${s.toLowerCase()}`

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(157,78,221,0.15)', marginBottom: 24 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(157,78,221,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Códigos de Acesso</span>
        <button onClick={generate} disabled={generating} className="btn-primary" style={{ fontSize: '11px', padding: '6px 16px' }}>
          {generating ? 'Gerando...' : '+ Gerar Código'}
        </button>
      </div>
      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>Carregando...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Código</th><th>Status</th><th>Criado em</th><th>Expira em</th><th>Usado em</th><th></th></tr>
            </thead>
            <tbody>
              {codes.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>Nenhum código</td></tr>
              ) : codes.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', color: 'var(--neon-cyan)' }}>{c.codeMasked}</td>
                  <td><span className={badgeClass(c.status)}>{c.status}</span></td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleString('pt-BR')}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(c.expiresAt).toLocaleString('pt-BR')}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.usedAt ? new Date(c.usedAt).toLocaleString('pt-BR') : '—'}</td>
                  <td>
                    {c.status === 'ATIVO' && (
                      confirmRevokeId === c.id ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => revoke(c.id)} className="btn-danger" style={{ fontSize: '10px', padding: '3px 10px' }}>Confirmar</button>
                          <button onClick={() => setConfirmRevokeId(null)} style={{ background: 'transparent', border: '1px solid rgba(100,116,139,0.3)', color: 'var(--text-muted)', fontSize: '10px', padding: '3px 10px', fontFamily: 'JetBrains Mono' }}>Cancelar</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmRevokeId(c.id)} className="btn-danger" style={{ fontSize: '10px', padding: '3px 10px' }}>Revogar</button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {newCode && <CodeModal code={newCode} onClose={() => setNewCode(null)} />}
    </div>
  )
}

function LogsPanel({ authFetch }) {
  const [logs, setLogs]             = useState([])
  const [pagination, setPagination] = useState(null)
  const [filters, setFilters]       = useState({ status: '', search: '', from: '', to: '', page: 1 })
  const [loading, setLoading]       = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.set('status', filters.status)
      if (filters.search) params.set('search', filters.search)
      if (filters.from)   params.set('from', filters.from)
      if (filters.to)     params.set('to', filters.to)
      params.set('page', filters.page)
      params.set('limit', '50')
      const res  = await authFetch(`/api/v1/admin/logs?${params}`)
      const data = await res.json()
      setLogs(data.logs || [])
      setPagination(data.pagination)
    } catch { }
    finally { setLoading(false) }
  }, [authFetch, filters])

  useEffect(() => { load() }, [load])

  const exportCsv = () => {
    const header = 'Timestamp,Username,IP,Status,Motivo,User-Agent\n'
    const rows   = logs.map((l) => `"${l.createdAt}","${l.username}","${l.ip}","${l.status}","${l.reason || ''}","${(l.userAgent || '').substring(0, 60)}"`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'valvet-logs.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(157,78,221,0.15)' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(157,78,221,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Logs de Segurança</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value, page: 1 }))} style={{ padding: '5px 10px', fontSize: '11px', fontFamily: 'JetBrains Mono', background: 'var(--bg-tertiary)', border: '1px solid rgba(157,78,221,0.25)', color: 'var(--text-muted)' }}>
            <option value="">Todos</option>
            <option value="SUCCESS">Sucesso</option>
            <option value="FAILURE">Falha</option>
          </select>
          <input type="text" placeholder="Buscar IP ou usuário" value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))} style={{ padding: '5px 10px', fontSize: '11px', width: 180 }} />
          <input type="date" value={filters.from} onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value, page: 1 }))} style={{ padding: '5px 10px', fontSize: '11px' }} />
          <input type="date" value={filters.to} onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value, page: 1 }))} style={{ padding: '5px 10px', fontSize: '11px' }} />
          <button onClick={exportCsv} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid rgba(157,78,221,0.3)', color: 'var(--neon-purple)', fontSize: '11px', fontFamily: 'JetBrains Mono' }}>Exportar CSV</button>
        </div>
      </div>
      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>Carregando...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Timestamp</th><th>Usuário</th><th>IP</th><th>Status</th><th>Motivo</th><th>User-Agent</th></tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 24 }}>Nenhum log</td></tr>
              ) : logs.map((l) => (
                <tr key={l.id} className={l.status === 'FAILURE' ? 'row-failure' : ''}>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(l.createdAt).toLocaleString('pt-BR')}</td>
                  <td style={{ fontSize: '12px' }}>{l.username}</td>
                  <td style={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: 'var(--neon-cyan)' }}>{l.ip}</td>
                  <td><span className={`badge badge-${l.status.toLowerCase()}`}>{l.status}</span></td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{l.reason || '—'}</td>
                  <td style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{(l.userAgent || '').substring(0, 60)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pagination && pagination.pages > 1 && (
        <div style={{ padding: '12px 20px', display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
          <button onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))} disabled={filters.page <= 1} style={{ background: 'transparent', border: '1px solid rgba(157,78,221,0.3)', color: 'var(--neon-purple)', padding: '4px 12px', fontFamily: 'JetBrains Mono', fontSize: '11px', opacity: filters.page <= 1 ? 0.4 : 1 }}>← Anterior</button>
          <span>{filters.page} / {pagination.pages}</span>
          <button onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))} disabled={filters.page >= pagination.pages} style={{ background: 'transparent', border: '1px solid rgba(157,78,221,0.3)', color: 'var(--neon-purple)', padding: '4px 12px', fontFamily: 'JetBrains Mono', fontSize: '11px', opacity: filters.page >= pagination.pages ? 0.4 : 1 }}>Próximo →</button>
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const { user, authFetch, logout } = useAuth()
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    authFetch('/api/v1/admin/metrics')
      .then((r) => r.json())
      .then(setMetrics)
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: 40 }}>
      <div style={{ borderBottom: '1px solid rgba(157,78,221,0.15)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: 'Share Tech Mono', fontSize: '16px', color: 'var(--neon-purple)', letterSpacing: '0.1em' }}>VALVET</span>
          <span style={{ fontSize: '11px', color: 'var(--neon-pink)', letterSpacing: '0.1em' }}>SYS / CONTROL-PANEL</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{user?.username}</span>
          <button onClick={() => navigate('/')} style={{ background: 'transparent', border: '1px solid rgba(157,78,221,0.3)', color: 'var(--neon-purple)', fontFamily: 'JetBrains Mono', fontSize: '11px', padding: '5px 12px' }}>Chat</button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(100,116,139,0.3)', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '11px', padding: '5px 12px' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
        {metrics && (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
            <MetricCard label="Usuários" value={metrics.totalUsers} color="157,78,221" />
            <MetricCard label="Códigos Ativos" value={metrics.codes.ativos} color="0,245,255" />
            <MetricCard label="Códigos Usados" value={metrics.codes.usados} sub={`${metrics.codes.expirados} expirados`} color="100,116,139" />
            <MetricCard label="Logins 24h" value={metrics.logins24h.total} sub={`${metrics.logins24h.sucessos} sucesso / ${metrics.logins24h.falhas} falha`} color="0,245,255" />
            <MetricCard label="Taxa de Falha" value={metrics.logins24h.failRate} color={parseFloat(metrics.logins24h.failRate) > 30 ? '255,45,120' : '0,245,255'} />
          </div>
        )}

        <UsersPanel authFetch={authFetch} currentUserId={user?.id} />
        <CodesPanel authFetch={authFetch} />
        <LogsPanel authFetch={authFetch} />
      </div>

      <StatusBar />
    </div>
  )
}