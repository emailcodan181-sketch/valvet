/**
 * VALVET — Hook: useChat
 * Gerencia mensagens, conversas e streaming SSE.
 */

import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

const API = import.meta.env.VITE_API_URL || ''

export function useChat() {
  const { accessToken } = useAuth()
  const [messages, setMessages]                   = useState([])
  const [conversations, setConversations]         = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [isStreaming, setIsStreaming]             = useState(false)
  const [latencyMs, setLatencyMs]                 = useState(null)

  const loadConversations = useCallback(async () => {
    if (!accessToken) return
    try {
      const res = await fetch(`${API}/api/v1/chat/conversations`, {
        credentials: 'include',
        headers:     { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setConversations(data.conversations || [])
    } catch { /* silencioso */ }
  }, [accessToken])

  const selectConversation = useCallback((conv) => {
    setCurrentConversation(conv)
    setMessages([]) // Histórico completo exigiria endpoint separado (não implementado aqui)
  }, [])

  const newConversation = useCallback(() => {
    setCurrentConversation(null)
    setMessages([])
  }, [])

  const deleteConversation = useCallback(async (convId) => {
    if (!accessToken) return
    try {
      await fetch(`${API}/api/v1/chat/conversations/${convId}`, {
        method:      'DELETE',
        credentials: 'include',
        headers:     { Authorization: `Bearer ${accessToken}` },
      })
      setConversations((prev) => prev.filter((c) => c.id !== convId))
      if (currentConversation?.id === convId) newConversation()
    } catch { /* silencioso */ }
  }, [accessToken, currentConversation, newConversation])

  /**
   * Envia mensagem e consome stream SSE para efeito typewriter.
   */
  const sendMessage = useCallback(async (content) => {
    if (!content.trim() || isStreaming || !accessToken) return

    const userMsg = { role: 'user', content: content.trim(), id: Date.now() }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsStreaming(true)

    const start = Date.now()

    // Adicionar placeholder da resposta da IA
    const aiMsgId = Date.now() + 1
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', id: aiMsgId, streaming: true },
    ])

    try {
      const res = await fetch(`${API}/api/v1/chat`, {
        method:      'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          messages:       updatedMessages.map(({ role, content }) => ({ role, content })),
          conversationId: currentConversation?.id,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Erro ${res.status}`)
      }

      // Consumir stream SSE
      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer    = ''
      let fullText  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          try {
            const parsed = JSON.parse(raw)
            if (parsed.chunk) {
              fullText += parsed.chunk
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId ? { ...m, content: fullText } : m
                )
              )
            }
            if (parsed.done) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsgId ? { ...m, streaming: false } : m
                )
              )
            }
            if (parsed.error) {
              throw new Error(parsed.error)
            }
          } catch { /* linha mal formada */ }
        }
      }

      setLatencyMs(Date.now() - start)

      // Recarregar lista de conversas
      await loadConversations()
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? { ...m, content: `[ERRO] ${err.message}`, streaming: false, error: true }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }, [messages, isStreaming, accessToken, currentConversation, loadConversations])

  return {
    messages,
    conversations,
    currentConversation,
    isStreaming,
    latencyMs,
    sendMessage,
    loadConversations,
    selectConversation,
    newConversation,
    deleteConversation,
  }
}
