"use client"
import React, { useState } from 'react'
import { Button } from './Button'

export const FloatingChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!text.trim() || loading) return
    const q = text
    setText('')
    const userMessage = { role: 'user' as const, content: q }
    setMessages((m) => [...m, userMessage])
    setLoading(true)

    try {
      // Call the AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.message }
      ])
    } catch (error: any) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: `Sorry, I encountered an error: ${error.message}. Please make sure your API key is configured.` }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button with helpful label */}
      <div className="fixed bottom-5 right-5 z-40">
        {!open && (
          <div className="absolute bottom-16 right-0 bg-kaggle-navy text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-pulse">
            💡 Need Help? Ask AI Teacher!
          </div>
        )}
        <button
          className="rounded-full bg-kaggle-blue p-4 text-white shadow-card hover:shadow-card-hover hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kaggle-blue focus-visible:ring-offset-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close AI Teacher' : 'Open AI Teacher'}
          aria-expanded={open}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-80 rounded-lg border border-gray-200 bg-white shadow-card">
          <div className="bg-gradient-to-r from-kaggle-blue to-blue-500 px-4 py-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  🤖 AI Learning Assistant
                </h3>
                <p className="text-xs text-white/90 mt-0.5">Ask me anything about careers & tech!</p>
              </div>
              <button
                className="text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 rounded"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 space-y-2 max-h-80 overflow-auto text-sm" aria-live="polite">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-kaggle-navy font-semibold mb-2">👋 Hi! I'm your AI Learning Assistant</p>
                  <p className="text-gray-600 text-xs">I can help you with careers, coding, learning paths, and tech concepts. Just type your question below!</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-semibold mb-2">💬 Try asking me:</p>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setText("How do I start learning web development?")}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-kaggle-blue/10 rounded border border-gray-200 hover:border-kaggle-blue text-xs text-gray-700 transition-colors"
                    >
                      📚 How do I start learning web development?
                    </button>
                    <button
                      onClick={() => setText("What's the difference between frontend and backend?")}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-kaggle-blue/10 rounded border border-gray-200 hover:border-kaggle-blue text-xs text-gray-700 transition-colors"
                    >
                      💻 What's the difference between frontend and backend?
                    </button>
                    <button
                      onClick={() => setText("What skills do I need for a data science career?")}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-kaggle-blue/10 rounded border border-gray-200 hover:border-kaggle-blue text-xs text-gray-700 transition-colors"
                    >
                      🎯 What skills do I need for a data science career?
                    </button>
                  </div>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={m.role === 'user' ? 'inline-block rounded bg-kaggle-blue/10 px-2 py-1' : 'inline-block rounded bg-gray-100 px-2 py-1'}>
                  {m.content}
                </span>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <span className="inline-block rounded bg-gray-100 px-2 py-1">
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-kaggle-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Thinking...
                  </span>
                </span>
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="border-t border-gray-200 p-3 flex gap-2"
            aria-label="Chat input"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type your question here..."
              className="flex-1 input text-sm"
              aria-label="Message"
              disabled={loading}
            />
            <Button type="submit" disabled={loading}>
              {loading ? '...' : 'Send'}
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
