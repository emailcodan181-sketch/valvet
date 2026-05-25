/**
 * VALVET — Página: Chat
 * Interface principal com sidebar, área de chat e streaming typewriter.
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useChat } from '../hooks/useChat'
import StatusBar from '../components/StatusBar'

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ conversations, currentConversation, onSelect, onNew, onDelete, onAdmin, user, onLogout }) {
  return (
    <div style={{
      width: 240,
      minWidth: 240,
      height: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid rgba(157,78,221,0.15)',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 28,
    }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid rgba(157,78,221,0.1)' }}>
        <div style={{ fontFamily: 'Share Tech Mono', fontSize: '18px', color: 'var(--neon-purple)', letterSpacing: '0.12em', marginBottom: 4 }}>
          VALVET
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          INTERFACE OPERACIONAL
        </div>
      </div>

      {/* New chat button */}
      <div style={{ padding: '12px 12px 8px' }}>
        <button
          onClick={onNew}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'rgba(157,78,221,0.1)',
            border: '1px solid rgba(157,78,221,0.3)',
            color: 'var(--neon-purple)',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textAlign: 'left',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(157,78,221,0.2)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(157,78,221,0.1)'}
        >
          + Nova Conversa
        </button>
      </div>

      {/* Conversations */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px' }}>
        {conversations.length === 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 20, padding: '0 12px' }}>
            Nenhuma conversa
          </div>
        ) : (
          conversations.map((conv) => (
            <ConvItem
              key={conv.id}
              conv={conv}
              active={currentConversation?.id === conv.id}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {/* User info */}
      <div style={{ borderTop: '1px solid rgba(157,78,221,0.1)', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 28, height: 28,
            background: 'rgba(157,78,221,0.2)',
            border: '1px solid rgba(157,78,221,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', color: 'var(--neon-purple)',
            fontFamily: 'Share Tech Mono',
          }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>{user?.username}</div>
            {user?.isAdmin && (
              <div style={{ fontSize: '10px', color: 'var(--neon-pink)', letterSpacing: '0.1em' }}>ADMIN</div>
            )}
          </div>
        </div>

        {user?.isAdmin && (
          <button
            onClick={onAdmin}
            style={{
              width: '100%',
              padding: '6px 10px',
              background: 'rgba(255,45,120,0.08)',
              border: '1px solid rgba(255,45,120,0.25)',
              color: 'var(--neon-pink)',
              fontSize: '11px',
              fontFamily: 'JetBrains Mono',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,45,120,0.15)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,45,120,0.08)'}
          >
            Painel Admin
          </button>
        )}

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '6px 10px',
            background: 'transparent',
            border: '1px solid rgba(100,116,139,0.3)',
            color: 'var(--text-muted)',
            fontSize: '11px',
            fontFamily: 'JetBrains Mono',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.target.style.borderColor = 'rgba(255,45,120,0.4)'; e.target.style.color = 'var(--neon-pink)' }}
          onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(100,116,139,0.3)'; e.target.style.color = 'var(--text-muted)' }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}

function ConvItem({ conv, active, onSelect, onDelete }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '7px 10px',
        marginBottom: 2,
        background: active ? 'rgba(157,78,221,0.12)' : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderLeft: active ? '2px solid var(--neon-purple)' : '2px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.1s',
      }}
    >
      <div
        onClick={() => onSelect(conv)}
        style={{ flex: 1, overflow: 'hidden', fontSize: '12px', color: active ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
      >
        {conv.title}
      </div>
      {hovered && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(conv.id) }}
          style={{ background: 'transparent', border: 'none', color: 'var(--neon-pink)', fontSize: '12px', padding: '0 2px', lineHeight: 1 }}
        >
          ×
        </button>
      )}
    </div>
  )
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div
      className="fade-in-up"
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 16,
      }}
    >
      {!isUser && (
        <div style={{
          width: 28, height: 28, minWidth: 28,
          background: 'rgba(157,78,221,0.15)',
          border: '1px solid rgba(157,78,221,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', color: 'var(--neon-purple)',
          fontFamily: 'Share Tech Mono',
          marginRight: 10, marginTop: 2, flexShrink: 0,
        }}>
          V
        </div>
      )}
      <div style={{
        maxWidth: '72%',
        padding: '12px 16px',
        background: isUser ? 'rgba(157,78,221,0.12)' : 'var(--bg-secondary)',
        border: isUser
          ? '1px solid rgba(157,78,221,0.3)'
          : '1px solid rgba(255,255,255,0.06)',
        fontSize: '14px',
        lineHeight: 1.7,
        color: isUser ? 'var(--text-primary)' : 'var(--text-primary)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {msg.content}
        {msg.streaming && (
          <span style={{
            display: 'inline-block', width: 8, height: 14,
            background: 'var(--neon-purple)', marginLeft: 2, verticalAlign: 'text-bottom',
            animation: 'blink 0.8s step-end infinite',
          }} />
        )}
        {msg.error && (
          <span style={{ color: 'var(--neon-pink)', fontSize: '11px', display: 'block', marginTop: 4 }}>
            ↑ erro ao processar resposta
          </span>
        )}
      </div>
    </div>
  )
}

// ── Typing Indicator ──────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingLeft: 38 }}>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>VALVET está processando</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot"
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--neon-purple)', display: 'inline-block' }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Message Input ─────────────────────────────────────────────────────────────
function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('')
  const ref = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const submit = () => {
    if (!text.trim() || disabled) return
    onSend(text)
    setText('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const handleInput = (e) => {
    setText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px'
  }

  const charCount = text.length
  const atLimit   = charCount >= 2000

  return (
    <div style={{
      borderTop: '1px solid rgba(157,78,221,0.15)',
      padding: '12px 16px',
      background: 'var(--bg-primary)',
      paddingBottom: 40, // espaço para status bar
    }}>
      <div style={{
        display: 'flex',
        gap: 10,
        background: 'var(--bg-tertiary)',
        border: '1px solid rgba(157,78,221,0.25)',
        padding: '8px 12px',
        transition: 'border-color 0.15s',
      }}>
        <textarea
          ref={ref}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          maxLength={2000}
          rows={1}
          placeholder="Mensagem para VALVET... (Enter para enviar)"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'JetBrains Mono',
            fontSize: '14px',
            outline: 'none',
            resize: 'none',
            lineHeight: 1.6,
            minHeight: 24,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', gap: 4 }}>
          <span style={{ fontSize: '10px', color: atLimit ? 'var(--neon-pink)' : 'var(--text-muted)' }}>
            {charCount}/2000
          </span>
          <button
            onClick={submit}
            disabled={disabled || !text.trim()}
            style={{
              padding: '5px 14px',
              background: disabled || !text.trim() ? 'rgba(157,78,221,0.15)' : 'var(--neon-purple)',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              opacity: disabled || !text.trim() ? 0.5 : 1,
              transition: 'all 0.15s',
            }}
          >
            ↑ Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Chat Page ─────────────────────────────────────────────────────────────────
export default function ChatPage() {
  const { user, logout }  = useAuth()
  const navigate          = useNavigate()
  const {
    messages, conversations, currentConversation, isStreaming, latencyMs,
    sendMessage, loadConversations, selectConversation, newConversation, deleteConversation,
  } = useChat()

  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelect={selectConversation}
        onNew={newConversation}
        onDelete={deleteConversation}
        onAdmin={() => navigate('/sys/control-panel')}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid rgba(157,78,221,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon-cyan)', animation: 'blink 2s ease-in-out infinite' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {currentConversation ? currentConversation.title : 'Nova Conversa'}
          </span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {messages.length === 0 && (
            <div style={{
              height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 12,
            }}>
              <div style={{ fontFamily: 'Share Tech Mono', fontSize: '32px', color: 'rgba(157,78,221,0.2)', letterSpacing: '0.2em' }}>
                VALVET
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 340 }}>
                Interface de IA operacional. Comece uma conversa.
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <TypingIndicator />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <MessageInput onSend={sendMessage} disabled={isStreaming} />
      </div>

      <StatusBar latencyMs={latencyMs} />
    </div>
  )
}
