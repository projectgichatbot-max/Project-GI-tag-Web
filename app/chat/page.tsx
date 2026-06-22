"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Send, Mic, MicOff, Trash2, Bot, User,
  Sparkles, Globe, Info, Landmark, ChevronDown, Languages
} from "lucide-react"
import { sendChatQuery } from "@/lib/chatbot-api"
import { toast } from "sonner"
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, translateText, type Language } from "@/lib/translate"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Message {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
  tag?: string | null
  source?: "knowledge_base" | "cache" | "web_scrape"
  sourceUrl?: string | null
  error?: boolean
  langCode?: string // language the message was sent/received in
}

// ─────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────
const SUGGESTED_QUERIES = [
  "List all GI tags",
  "Tell me about Ringaal Craft",
  "What is Munsyari Rajma",
  "Bal Mitai",
  "Information about Tejpatta",
]

const TAGS = [
  "Tejpatta",
  "Ringaal Craft",
  "Munsyari Rajma",
  "Aipan Art",
  "Thulma Blanket",
  "Basmati Rice",
  "Bal Mithai",
  "Bichhu Buti Fiber",
  "Mandua",
  "Jhangora",
]

// ─────────────────────────────────────────────
// Chat Page
// ─────────────────────────────────────────────
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      content: "Namaste! I am your Uttarakhand GI Tags Assistant. Ask me anything about Uttarakhand's 27 registered GI Tags or traditional sweets like Bal Mithai.",
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  // Language state
  const [selectedLang, setSelectedLang] = useState<Language>(DEFAULT_LANGUAGE)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const langMenuRef = useRef<HTMLDivElement>(null)

  // Typewriter effect state
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null)
  const [streamedContent, setStreamedContent] = useState<Record<string, string>>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null) // always holds the current recognition instance

  // ── Language menu: close on outside click ───
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ── Init / Re-init Speech Recognition when language changes ────────────
  const initRecognition = useCallback((lang: Language) => {
    if (typeof window === "undefined") return
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    // Stop any currently running instance before creating a new one
    try {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null // prevent the old onend from firing
        recognitionRef.current.stop()
      }
    } catch {
      // Ignore: stop() throws if not started
    }
    setIsListening(false)

    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = lang.voiceCode // 🔑 Dynamic language for voice input

    rec.onstart = () => setIsListening(true)

    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(transcript)
    }

    rec.onerror = (event: any) => {
      setIsListening(false)
      if (event.error === "no-speech") {
        toast("No speech detected. Try speaking again!")
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "bot",
            content: "I didn't catch that. Please try speaking again!",
            timestamp: new Date(),
          }
        ])
      } else {
        console.error("Speech recognition error:", event.error)
      }
    }

    rec.onend = () => setIsListening(false)
    recognitionRef.current = rec
    setRecognition(rec)
  }, []) // stable — only uses refs and state setters (which are stable)

  // Single effect: runs on mount AND whenever selectedLang changes
  useEffect(() => {
    initRecognition(selectedLang)
  }, [selectedLang, initRecognition])

  // ── Typewriter effect for bot messages ─────────────────────────────
  useEffect(() => {
    if (!streamingMsgId) return
    const fullContent = messages.find(m => m.id === streamingMsgId)?.content || ""
    let idx = 0
    const interval = setInterval(() => {
      idx = Math.min(idx + 8, fullContent.length)
      setStreamedContent(prev => ({ ...prev, [streamingMsgId]: fullContent.slice(0, idx) }))
      if (idx >= fullContent.length) {
        clearInterval(interval)
        setStreamingMsgId(null)
      }
    }, 15)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamingMsgId])

  // ── Auto-scroll (scrolls container, NOT the page) ────────────────────
  useEffect(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, isLoading, isTranslating])

  // ── Language selector handler ─────────────────────────────────────────
  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang)
    setLangMenuOpen(false)
    toast(`Language changed to ${lang.label} (${lang.nativeLabel})`)
  }

  // ── Core send handler ─────────────────────────────────────────────────
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim()
    if (!text) return

    if (!textToSend) setInputValue("")

    // Stop mic if active
    if (isListening && recognition) recognition.stop()

    // 1. Show user's original message immediately
    const userMsgId = Date.now().toString()
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        content: text,
        timestamp: new Date(),
        langCode: selectedLang.code,
      }
    ])
    setIsLoading(true)

    try {
      // 2. Translate user input to English (if not already English)
      let queryInEnglish = text
      if (selectedLang.translationCode !== "en") {
        setIsTranslating(true)
        queryInEnglish = await translateText(text, selectedLang.translationCode, "en")
        setIsTranslating(false)
      }

      // 3. Send English query to chatbot API (existing logic untouched)
      const data = await sendChatQuery(queryInEnglish)

      // 4. Translate English response back to user's language
      let finalResponse = data.response
      if (selectedLang.translationCode !== "en") {
        setIsTranslating(true)
        finalResponse = await translateText(data.response, "en", selectedLang.translationCode)
        setIsTranslating(false)
      }

      // 5. Display translated response with typewriter effect
      const botMsgId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: "bot",
          content: finalResponse,
          timestamp: new Date(),
          tag: data.tag,
          source: data.source,
          sourceUrl: data.source_url,
          langCode: selectedLang.code,
        }
      ])
      // Trigger typewriter — reveal progressively
      setStreamedContent(prev => ({ ...prev, [botMsgId]: "" }))
      setStreamingMsgId(botMsgId)
    } catch (error: any) {
      setIsTranslating(false)
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: error.message || "Failed to get a response. Please try again.",
          timestamp: new Date(),
          error: true,
        }
      ])
    } finally {
      setIsLoading(false)
      setIsTranslating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceInput = () => {
    if (!recognition) {
      alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.")
      return
    }
    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "bot",
        content: "Namaste! I am your Uttarakhand GI Tags Assistant. Ask me anything about Uttarakhand's 27 registered GI Tags or traditional sweets like Bal Mithai.",
        timestamp: new Date(),
      }
    ])
    setInputValue("")
    setIsLoading(false)
    setIsTranslating(false)
  }

  const formatSourceUrl = (url: string | null | undefined): string => {
    if (!url) return ""
    try {
      const parsed = new URL(url)
      if (parsed.hostname.includes("wikipedia.org")) return "Wikipedia"
      if (parsed.hostname.includes("uttarakhandtourism.gov.in")) return "Uttarakhand Tourism"
      return parsed.hostname.replace("www.", "")
    } catch {
      return "Web Search"
    }
  }

  const formatBotMessage = (text: string) => {
    const lines = text.split("\n")
    let inList = false
    const elements: React.ReactNode[] = []

    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      const isListItem = trimmed.startsWith("•") || trimmed.startsWith("*") || trimmed.startsWith("-")

      if (isListItem) {
        inList = true
        const itemText = trimmed.substring(1).trim()
        elements.push(
          <li key={`li-${idx}`} className="ml-6 list-disc my-1 text-slate-200 leading-relaxed text-sm md:text-base">
            {itemText}
          </li>
        )
      } else {
        inList = false
        if (trimmed) {
          elements.push(
            <p key={`p-${idx}`} className="my-2.5 text-slate-100 leading-relaxed text-sm md:text-base text-pretty">
              {trimmed}
            </p>
          )
        } else {
          elements.push(<div key={`space-${idx}`} className="h-2" />)
        }
      }
    })

    return elements
  }

  const voicePlaceholder = isListening
    ? `Listening in ${selectedLang.label}... Speak now`
    : `Ask in ${selectedLang.label} (${selectedLang.nativeLabel})...`

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="h-screen overflow-hidden pt-16 bg-[#0B0F19] text-white flex flex-col lg:flex-row">

      {/* ── Left Sidebar ─────────────────────────── */}
      <aside className="w-full lg:w-72 xl:w-80 shrink-0 bg-[#111827] border-b lg:border-b-0 lg:border-r border-slate-800 p-5 flex flex-col gap-5 select-none overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-100">Uttarakhand AI</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Powered by fuzzy intent matching. Ask in any Indian language.
          </p>
        </div>

        {/* Language Selector in Sidebar (desktop) */}
        <div className="hidden lg:block">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Language / भाषा
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang)}
                className={`text-left px-2.5 py-1.5 rounded-lg text-xs transition-all border ${
                  selectedLang.code === lang.code
                    ? "bg-amber-600/20 border-amber-500/50 text-amber-300 font-semibold"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="mr-1">{lang.flag}</span>
                <span>{lang.label}</span>
                {lang.code !== "en" && (
                  <span className="block text-[9px] opacity-60 mt-0.5 truncate">{lang.nativeLabel}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Popular GI Tags */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Popular GI Tags</h3>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-slate-900 border-slate-800 text-slate-300 capitalize text-[10px] py-0.5 px-2 hover:bg-slate-800 cursor-pointer border"
                onClick={() => setInputValue(`Tell me about ${tag}`)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto hidden lg:flex flex-col gap-3 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Languages className="h-4 w-4 text-amber-500" />
            <span>12 Indian Languages Supported</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="h-4 w-4 text-slate-500" />
            <span>Powered by Next.js API</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Landmark className="h-4 w-4 text-slate-500" />
            <span>27+ Registered GI Tags</span>
          </div>
        </div>
      </aside>

      {/* ── Main Chat ────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-0 bg-[#0B0F19]">

        {/* Header */}
        <div className="px-4 md:px-6 py-3 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <Bot className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="font-serif font-semibold text-sm md:text-base">Uttarakhand GI Tags Assistant</h1>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Active · {selectedLang.nativeLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language selector — mobile (dropdown) */}
            <div className="relative lg:hidden" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>{selectedLang.flag} {selectedLang.label}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-50 bg-[#1E293B] border border-slate-700 rounded-xl shadow-xl overflow-hidden w-52">
                  <div className="px-3 py-2 border-b border-slate-700">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Select Language</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors ${
                          selectedLang.code === lang.code
                            ? "bg-amber-600/20 text-amber-300"
                            : "text-slate-300 hover:bg-slate-700 hover:text-white"
                        }`}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <div>
                          <div className="font-medium leading-tight">{lang.label}</div>
                          {lang.code !== "en" && (
                            <div className="text-[10px] opacity-60">{lang.nativeLabel}</div>
                          )}
                        </div>
                        {selectedLang.code === lang.code && (
                          <span className="ml-auto text-amber-400 text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Chat */}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 gap-1.5 text-xs h-8"
              title="Clear Chat History"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scroll-smooth min-h-0"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 md:gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Bot Avatar */}
                {msg.role === "bot" && (
                  <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full flex-shrink-0 flex items-center justify-center border ${
                    msg.error
                      ? "bg-rose-950/30 border-rose-500/30 text-rose-400"
                      : "bg-[#1E293B] border-slate-800 text-amber-400"
                  }`}>
                    <Bot className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                  msg.role === "user"
                    ? "bg-amber-600 text-white rounded-tr-none"
                    : msg.error
                      ? "bg-rose-950/20 border border-rose-500/20 text-rose-200 rounded-tl-none"
                      : "bg-[#1E293B] border border-slate-800 text-slate-100 rounded-tl-none"
                }`}>
                  <div className="text-xs text-slate-400/80 mb-1 flex items-center justify-between gap-2">
                    <span className="font-medium">
                      {msg.role === "user" ? "You" : "GI Tag AI"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {msg.langCode && msg.langCode !== "en" && (
                        <span className="text-[9px] bg-slate-700/60 px-1.5 py-0.5 rounded-full text-slate-400">
                          {SUPPORTED_LANGUAGES.find(l => l.code === msg.langCode)?.nativeLabel}
                        </span>
                      )}
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {msg.role === "bot" && !msg.error
                      ? formatBotMessage(streamedContent[msg.id] ?? msg.content)
                      : <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    }
                    {/* Blinking cursor during typewriter */}
                    {streamingMsgId === msg.id && (
                      <span className="inline-block w-0.5 h-4 bg-amber-400 animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>

                  {/* Metadata: source tag */}
                  {msg.role === "bot" && !msg.error && (msg.tag || msg.source) && (
                    <div className="mt-3 pt-2 border-t border-slate-800 flex flex-wrap gap-2 items-center justify-between text-[10px] text-slate-400">
                      <div className="flex gap-2">
                        {msg.tag && (
                          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 capitalize">
                            Tag: {msg.tag}
                          </span>
                        )}
                        {msg.source && (
                          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 capitalize">
                            Engine: {msg.source.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      {msg.sourceUrl && (
                        <a
                          href={msg.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:underline flex items-center gap-1 hover:text-amber-300"
                        >
                          <Globe className="h-3 w-3" />
                          Source: {formatSourceUrl(msg.sourceUrl)}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-amber-600/20 border border-amber-600/30 flex-shrink-0 flex items-center justify-center text-amber-300">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing / Translating Animation */}
            {(isLoading || isTranslating) && (
              <div className="flex gap-3 md:gap-4 justify-start">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#1E293B] border border-slate-800 flex items-center justify-center text-amber-400">
                  <Bot className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-2 shadow-md">
                  <div className="flex space-x-1.5">
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  {isTranslating && (
                    <span className="text-xs text-slate-500 ml-1">Translating...</span>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 md:px-6 py-4 border-t border-slate-800 bg-[#0F172A] shrink-0">
          <div className="max-w-4xl mx-auto space-y-3">

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-400 font-medium hidden md:inline">Suggestions:</span>
              {SUGGESTED_QUERIES.map((query) => (
                <button
                  key={query}
                  type="button"
                  disabled={isLoading || isTranslating}
                  onClick={() => handleSendMessage(query)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs py-1 px-3 rounded-full transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {query}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              {/* Voice mic */}
              <Button
                type="button"
                onClick={toggleVoiceInput}
                className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
                  isListening
                    ? "bg-rose-600 border-rose-500 text-white animate-pulse"
                    : "bg-[#1E293B] border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
                size="icon"
                title={isListening ? "Stop listening" : `Voice input in ${selectedLang.label}`}
                disabled={isLoading || isTranslating}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              {/* Text input */}
              <Input
                type="text"
                placeholder={voicePlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || isTranslating}
                className="flex-1 bg-[#192231] border-slate-800 focus:border-amber-500/50 text-white h-11 px-4 rounded-xl placeholder:text-slate-500 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              />

              {/* Send */}
              <Button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isLoading || isTranslating || !inputValue.trim()}
                className="h-11 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white disabled:bg-slate-800 disabled:text-slate-500 font-semibold gap-1.5 transition-all flex-shrink-0"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>

            {/* Status bar */}
            <div className="text-center text-xs text-slate-500">
              {isListening && (
                <span className="text-rose-400 animate-pulse">
                  🎤 Listening in {selectedLang.label} ({selectedLang.nativeLabel})...
                </span>
              )}
              {isTranslating && !isListening && (
                <span className="text-amber-400">⟳ Translating...</span>
              )}
              {!isListening && !isTranslating && selectedLang.code !== "en" && (
                <span>
                  Auto-translating {selectedLang.nativeLabel} ↔ English
                </span>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
