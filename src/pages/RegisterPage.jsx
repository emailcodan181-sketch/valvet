/**
 * VALVET — Página: Registro
 * Requer código de acesso único gerado pelo admin.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import StatusBar from '../components/StatusBar'

// Validação client-side em tempo real
function validatePassword(pwd) {
  const checks = {
    length:    pwd.length >= 8,
    upper:     /[A-Z]/.test(pwd),
    number:    /[0-9]/.test(pwd),
    special:   /[^a-zA-Z0-9]/.test(pwd),
  }
  return checks
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm]     = useState({ username: '', password: '', accessCode: '' })
  const [error, setError]   = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pwdChecks, setPwdChecks] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
    if (name === 'password') setPwdChecks(validatePassword(value))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form.username.trim(), form.password, form.accessCode.trim())
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const checks = pwdChecks
  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--bg-tertiary)',
    border: '1px solid rgba(157,78,221,0.25)',
    color: 'var(--text-primary)',
    fontFamily: 'JetBrains Mono',
    fontSize: '14px',
    outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontSize: '11px', color: 'var(--text-muted)',
    marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase',
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
          }}>VALVET</h1>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 6 }}>
            Criar Conta
          </p>
        </div>

        {success ? (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(0,245,255,0.3)',
            padding: '32px',
            textAlign: 'center',
          }}>
            <div style={{ color: 'var(--neon-cyan)', fontSize: '24px', marginBottom: 12 }}>✓</div>
            <div style={{ color: 'var(--neon-cyan)', fontSize: '14px', marginBottom: 8 }}>Conta criada com sucesso</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Redirecionando para login...</div>
          </div>
        ) : (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid rgba(157,78,221,0.3)', padding: '32px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
              // novo acesso
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="3–20 chars, alfanumérico"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--neon-purple)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(157,78,221,0.25)'}
                />
              </div>

              <div>
                <label style={labelStyle}>Senha</label>
                <input
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="mínimo 8 caracteres"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--neon-purple)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(157,78,221,0.25)'}
                />
                {form.password && (
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[
                      { key: 'length',  label: '8+ chars' },
                      { key: 'upper',   label: 'maiúscula' },
                      { key: 'number',  label: 'número' },
                      { key: 'special', label: 'especial' },
                    ].map(({ key, label }) => (
                      <span key={key} style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        border: `1px solid ${checks[key] ? 'rgba(0,245,255,0.4)' : 'rgba(255,45,120,0.3)'}`,
                        color: checks[key] ? 'var(--neon-cyan)' : 'var(--neon-pink)',
                        background: checks[key] ? 'rgba(0,245,255,0.05)' : 'rgba(255,45,120,0.05)',
                      }}>
                        {checks[key] ? '✓' : '○'} {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={labelStyle}>Código de Acesso</label>
                <input
                  name="accessCode"
                  type="text"
                  value={form.accessCode}
                  onChange={handleChange}
                  placeholder="64 caracteres hex"
                  style={{ ...inputStyle, fontFamily: 'JetBrains Mono', fontSize: '12px' }}
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
                {loading ? 'Registrando...' : 'Criar Conta'}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
              Já tem conta?{' '}
              <Link to="/login" style={{ color: 'var(--neon-purple)', textDecoration: 'none' }}>
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
      <StatusBar />
    </div>
  )
}
