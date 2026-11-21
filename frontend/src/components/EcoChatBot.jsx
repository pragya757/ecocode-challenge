import { useState, useRef, useEffect } from 'react'
import api from '../services/api'
import {
  MessageSquare, Sparkles, X, Minimize2, Maximize2, Send,
  Leaf, RotateCcw, Bot, User, Check, Copy, ChevronDown
} from 'lucide-react'

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'bot',
    text: "👋 Hi! I'm **EcoBot**, your AI Green Coding Assistant.\n\nAsk me anything about energy-efficient algorithms, reducing your software's carbon footprint, using the Carbon Inspector, or navigating the platform built by **Pragya**!",
    suggestions: [
      "Who created EcoCode Challenge?",
      "How does code consume electricity?",
      "Python vs C++ energy efficiency",
      "How do I earn the Green Certificate?"
    ],
    time: 'Just now'
  }
]

// Fallback intelligence in case backend is offline/slow
const CLIENT_FALLBACKS = [
  {
    matches: ['who', 'creator', 'created', 'built', 'pragya', 'author'],
    reply: "🌱 **EcoCode Challenge was created by Pragya** to empower developers worldwide to build sustainable, energy-efficient software and measure real-world carbon impacts!",
    suggestions: ["How does code consume electricity?", "What are the 8 lessons?", "How to get certified?"]
  },
  {
    matches: ['certificate', 'cert', 'degree', 'diploma'],
    reply: "🎓 **Certificate of Green Software Engineering**:\nComplete all 8 lessons in the **Learn** tab! Then visit your **Profile** to view, customize, and export your verified SVG/PNG certificate to share on LinkedIn or GitHub.",
    suggestions: ["What are the 8 lessons?", "How do I earn EcoPoints?", "Who is Pragya?"]
  },
  {
    matches: ['carbon inspector', 'swd', 'website', 'audit', 'co2'],
    reply: "🌍 **Carbon Inspector** audits website transfer size, checks renewable hosting on **The Green Web Foundation**, and calculates emissions using the **Sustainable Web Design (SWD)** model ($E = \\text{Data} \\times 0.81 \\text{ kWh/GB} \\times 442 \\text{ gCO}_2/\\text{kWh}$).",
    suggestions: ["How to reduce payload?", "What is green hosting?", "Python green tips"]
  },
  {
    matches: ['python', 'generator', 'slot'],
    reply: "🐍 **Green Python Tips**:\n1. Use **generators** `(x for x in data)` to stream memory.\n2. Leverage built-in C-accelerated methods (`map`, `filter`, `sum`).\n3. Use `set` for **O(1)** membership tests.\n4. Declare `__slots__` on classes to eliminate `__dict__` memory overhead.",
    suggestions: ["JavaScript green tips", "Java green tips", "C++ green tips"]
  }
]

function formatMarkdown(text) {
  // Simple markdown renderer for bold, inline code, and line breaks
  const lines = text.split('\n')
  return lines.map((line, idx) => {
    // Bold parsing
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g)
    return (
      <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} className="font-bold text-emerald-400">{part.slice(2, -2)}</strong>
          }
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={pIdx} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-900 font-mono text-[11px] text-emerald-600 dark:text-emerald-300">
                {part.slice(1, -1)}
              </code>
            )
          }
          return part
        })}
      </p>
    )
  })
}

export default function EcoChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
      inputRef.current?.focus()
    }
  }, [messages, isOpen, isMinimized])

  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
    setHasUnread(false)
  }

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES)
  }

  const handleSendMessage = async (customText) => {
    const query = (customText || input).trim()
    if (!query || loading) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/assistant/chat', { message: query })
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.data.reply,
        suggestions: res.data.suggestions || [],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      // Offline / Local Fallback
      const lower = query.toLowerCase()
      let matched = CLIENT_FALLBACKS.find((f) =>
        f.matches.some((m) => lower.includes(m))
      )
      const fallbackReply = matched
        ? matched.reply
        : `🌱 **EcoBot Insight on "${query}"**:\n\nIn green software engineering, focus on minimizing **algorithmic complexity** (prefer $O(n)$ over $O(n^2)$), reducing CPU compute cycles, and caching network assets. Every computational bottleneck avoided reduces data center wattage and device power draw!`

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: fallbackReply,
        suggestions: matched?.suggestions || [
          "Who created EcoCode Challenge?",
          "How to optimize code?",
          "How does the Carbon Inspector work?"
        ],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-lg border border-emerald-500/30 backdrop-blur-md animate-fade-in pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-lime-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>Ask EcoBot AI</span>
          </div>

          <button
            onClick={handleOpen}
            className="relative p-4 rounded-full bg-gradient-to-tr from-emerald-600 via-green-600 to-lime-500 text-white shadow-2xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/20 group"
            aria-label="Open Green Coding Assistant"
          >
            <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />

            {/* Pulsing halo */}
            <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"></span>

            {/* Unread indicator */}
            {hasUnread && (
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-lime-400 border-2 border-slate-900 rounded-full"></span>
            )}
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[410px] ${
            isMinimized ? 'h-14' : 'h-[580px] max-h-[85vh]'
          } flex flex-col rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-emerald-950/20 overflow-hidden transition-all duration-300 animate-fade-in`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-700 via-green-700 to-emerald-800 text-white flex items-center justify-between select-none">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-4 h-4 text-lime-300" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-emerald-800 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <h3 className="font-bold text-sm tracking-tight text-white">EcoBot AI</h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 font-semibold text-emerald-200 border border-emerald-400/20">
                    Green Assistant
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200/80 font-medium leading-tight mt-0.5">
                  Built for Pragya's EcoCode Challenge
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-emerald-100">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs md:text-sm">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    } animate-fade-in`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <Leaf className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="max-w-[85%] space-y-2">
                      <div
                        className={`p-3.5 rounded-2xl relative group ${
                          msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-xs shadow-md shadow-emerald-600/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700/60 leading-relaxed'
                        }`}
                      >
                        {formatMarkdown(msg.text)}

                        {msg.sender === 'bot' && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-all"
                            title="Copy text"
                          >
                            {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>

                      {/* Quick Suggestions Chips */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestions.map((s, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(s)}
                              className="text-[11px] px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all font-medium text-left"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}

                      <div
                        className={`text-[10px] text-slate-400 px-1 ${
                          msg.sender === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex gap-2.5 animate-fade-in">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                      <Leaf className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center gap-1.5 text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      <span className="text-xs ml-1 text-slate-500">EcoBot is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about green code, carbon metrics, algorithms..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-emerald-600/25 flex-shrink-0"
                    title="Send query"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                  <span>Answers verified for green efficiency</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">EcoCode Challenge</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
