"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Send, Mic, MicOff, Trash2, Bot, User, 
  Sparkles, Globe, Info, Landmark
} from "lucide-react"
import { sendChatQuery } from "@/lib/chatbot-api"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "bot"
  content: string
  timestamp: Date
  tag?: string | null
  source?: "knowledge_base" | "cache" | "web_scrape"
  sourceUrl?: string | null
  error?: boolean
}

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
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const rec = new SpeechRecognition()
        rec.continuous = false
        rec.interimResults = true
        rec.lang = "en-IN"

        rec.onstart = () => {
          setIsListening(true)
        }

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
        }

        rec.onerror = (event: any) => {
          setIsListening(false)
          if (event.error === "no-speech") {
            toast("No speech detected. Try saying something!")
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: "bot",
                content: "I didn't catch that. Try saying something!",
                timestamp: new Date(),
              }
            ])
          } else {
            console.error("Speech recognition error:", event.error)
          }
        }

        rec.onend = () => {
          setIsListening(false)
        }

        setRecognition(rec)
      }
    }
  }, [])

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim()
    if (!text) return

    if (!textToSend) {
      setInputValue("")
    }

    // Stop listening if speech recognition is active
    if (isListening && recognition) {
      recognition.stop()
    }

    const userMsgId = Date.now().toString()
    const userMessage: Message = {
      id: userMsgId,
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const data = await sendChatQuery(text)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.response,
        timestamp: new Date(),
        tag: data.tag,
        source: data.source,
        sourceUrl: data.source_url,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error: any) {
      console.error("Chat error:", error)
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: error.message || "Failed to get a response from the service. Please make sure the chatbot backend is running.",
        timestamp: new Date(),
        error: true,
      }
      setMessages((prev) => [...prev, errorBotMessage])
    } finally {
      setIsLoading(false)
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
      alert("Voice input (Speech Recognition) is not supported in this browser. Please use Chrome, Edge, or Safari.")
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
  }

  const formatSourceUrl = (url: string | null | undefined): string => {
    if (!url) return ""
    try {
      const parsed = new URL(url)
      if (parsed.hostname.includes("wikipedia.org")) return "Wikipedia"
      if (parsed.hostname.includes("uttarakhandtourism.gov.in")) return "Uttarakhand Tourism"
      return parsed.hostname.replace("www.", "")
    } catch (e) {
      return "Web Search"
    }
  }

  const formatBotMessage = (text: string) => {
    const lines = text.split('\n')
    let inList = false
    const elements: React.ReactNode[] = []

    lines.forEach((line, idx) => {
      const trimmed = line.trim()
      const isListItem = trimmed.startsWith("•") || trimmed.startsWith("*") || trimmed.startsWith("-")

      if (isListItem) {
        if (!inList) {
          inList = true
        }
        const itemText = trimmed.substring(1).trim()
        elements.push(
          <li key={`li-${idx}`} className="ml-6 list-disc my-1 text-slate-200 leading-relaxed text-sm md:text-base">
            {itemText}
          </li>
        )
      } else {
        if (inList) {
          inList = false
        }
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

  return (
    <div className="min-h-screen pt-16 bg-[#0B0F19] text-white flex flex-col lg:flex-row">
      {/* Left Sidebar - Desktop only */}
      <aside className="w-full lg:w-80 bg-[#111827] border-b lg:border-b-0 lg:border-r border-slate-800 p-6 flex flex-col gap-6 select-none">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="font-serif font-bold text-lg text-amber-100">Uttarakhand AI</h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Local Natural Language Processing pipeline powered by RapidFuzz spelling correction and fuzzy intent matching.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Popular GI Tags</h3>
          <div className="flex flex-wrap gap-1.5 max-h-40 lg:max-h-none overflow-y-auto">
            {TAGS.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="bg-slate-900 border-slate-800 text-slate-300 capitalize text-[10px] py-0.5 px-2 hover:bg-slate-800 cursor-pointer border"
                onClick={() => setInputValue(prev => prev ? `${prev} ${tag}` : `Tell me about ${tag}`)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto hidden lg:flex flex-col gap-4 border-t border-slate-800 pt-4">
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

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-[#0B0F19]">
        {/* Chat Title Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0F172A] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
              <Bot className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="font-serif font-semibold text-base md:text-lg">Uttarakhand GI Tags Assistant</h1>
              <p className="text-[10px] md:text-xs text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Active NLP Session
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 gap-1.5 text-xs h-8"
            title="Clear Chat History"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Chat</span>
          </Button>
        </div>

        {/* Message Area */}
        <ScrollArea className="flex-1 px-4 md:px-8 py-6">
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
                  <div className="text-xs text-slate-400/80 mb-1 flex items-center justify-between">
                    <span className="font-medium">
                      {msg.role === "user" ? "You" : "GI Tag AI"}
                    </span>
                    <span>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {msg.role === "bot" && !msg.error 
                      ? formatBotMessage(msg.content) 
                      : <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    }
                  </div>

                  {/* Metadata display: Source or Tag */}
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

            {/* Typing Animation */}
            {isLoading && (
              <div className="flex gap-3 md:gap-4 justify-start">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-[#1E293B] border border-slate-800 flex items-center justify-center text-amber-400">
                  <Bot className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div className="bg-[#1E293B] border border-slate-800 rounded-2xl rounded-tl-none px-5 py-4 flex items-center space-x-1.5 shadow-md">
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input area & suggestions */}
        <div className="p-4 md:p-6 border-t border-slate-800 bg-[#0F172A]">
          <div className="max-w-4xl mx-auto space-y-4">
            
            {/* Suggested Queries Chips */}
            <div className="flex flex-wrap gap-2 items-center justify-center sm:justify-start">
              <span className="text-xs text-slate-400 font-medium hidden md:inline">Suggestions:</span>
              {SUGGESTED_QUERIES.map((query) => (
                <button
                  key={query}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSendMessage(query)}
                  className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs py-1 px-3 rounded-full transition-all duration-200 font-medium disabled:opacity-50"
                >
                  {query}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 relative">
              <Button
                type="button"
                onClick={toggleVoiceInput}
                className={`h-11 w-11 rounded-xl flex items-center justify-center border transition-all ${
                  isListening 
                    ? "bg-rose-600 border-rose-500 text-white animate-pulse" 
                    : "bg-[#1E293B] border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
                size="icon"
                title={isListening ? "Stop listening" : "Start voice input"}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder={isListening ? "Listening... Speak now..." : "Ask about an Uttarakhand GI tag..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  className="bg-[#192231] border-slate-800 focus:border-amber-500/50 text-white h-11 px-4 rounded-xl placeholder:text-slate-500 text-sm md:text-base w-full focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <Button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                className="h-11 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white disabled:bg-slate-800 disabled:text-slate-500 font-semibold gap-1.5 transition-all"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>
            
            {isListening && (
              <p className="text-center text-xs text-rose-400 animate-pulse">
                Web Speech Recognition is active. Speak clearly into your mic.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
