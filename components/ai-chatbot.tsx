"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Mic, MicOff, Send, Bot, User, Volume2, X, Minimize2, Maximize2 } from "lucide-react"
import type { SpeechRecognition } from "types/speech-recognition" // Assuming SpeechRecognition type is declared in a separate file

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  isVoice?: boolean
}

interface Product {
  name: string
  category: string
  region: string
  description: string
  healthBenefits?: string[]
  culturalSignificance?: string
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Namaste! I'm your AI assistant for Uttarakhand's GI-tagged products. You can ask me about products, their health benefits, cultural significance, or use voice commands. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputValue(transcript)
        setIsListening(false)
        // Auto-send voice input
        handleSendMessage(transcript, true)
      }

      recognitionInstance.onerror = () => {
        setIsListening(false)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Sample product data for AI responses
  const sampleProducts: Product[] = [
    {
      name: "Munsiyari Rajma",
      category: "Agricultural",
      region: "Pithoragarh District",
      description: "Small-sized red kidney beans grown in high-altitude organic conditions",
      healthBenefits: [
        "Rich in protein",
        "High in iron and calcium",
        "Good for heart health",
        "Helps in weight management",
      ],
      culturalSignificance:
        "Traditional crop of Munsiyari region, cultivated for generations using organic farming methods",
    },
    {
      name: "Aipan Art",
      category: "Handicraft",
      region: "Kumaon Region",
      description: "Traditional decorative folk art using natural pigments and geometric patterns",
      culturalSignificance:
        "Sacred art form used in religious ceremonies and festivals, passed down through generations",
    },
    {
      name: "Ringaal Craft",
      category: "Handicraft",
      region: "Uttarkashi",
      description: "Bamboo craft items made from ringaal bamboo found in Himalayan regions",
      culturalSignificance: "Eco-friendly traditional craft supporting local artisan communities",
    },
    {
      name: "Tejpat (Bay Leaves)",
      category: "Agricultural",
      region: "Garhwal",
      description: "Aromatic bay leaves used in cooking and traditional medicine",
      healthBenefits: [
        "Aids digestion",
        "Anti-inflammatory properties",
        "Helps control diabetes",
        "Rich in antioxidants",
      ],
    },
  ]

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser. Please use Chrome or Edge.")
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const processUserQuery = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase()

    // Intent detection based on keywords
    if (lowerQuery.includes("health") || lowerQuery.includes("benefit") || lowerQuery.includes("nutrition")) {
      const product = sampleProducts.find(
        (p) => lowerQuery.includes(p.name.toLowerCase()) || lowerQuery.includes(p.category.toLowerCase()),
      )

      if (product && product.healthBenefits) {
        return `Here are the health benefits of ${product.name}:\n\n${product.healthBenefits.map((benefit) => `• ${benefit}`).join("\n")}\n\n${product.description}`
      }

      return "I can help you learn about the health benefits of our GI-tagged products like Munsiyari Rajma (rich in protein and iron), Tejpat (aids digestion), and other organic products. Which specific product would you like to know about?"
    }

    if (lowerQuery.includes("culture") || lowerQuery.includes("tradition") || lowerQuery.includes("significance")) {
      const product = sampleProducts.find(
        (p) => lowerQuery.includes(p.name.toLowerCase()) || lowerQuery.includes(p.category.toLowerCase()),
      )

      if (product && product.culturalSignificance) {
        return `Cultural significance of ${product.name}:\n\n${product.culturalSignificance}\n\nThis product represents the rich heritage of ${product.region} and supports local communities.`
      }

      return "Our GI-tagged products carry deep cultural significance. Aipan Art is used in religious ceremonies, Ringaal Craft supports eco-friendly traditions, and Munsiyari Rajma represents generations of organic farming. Which cultural aspect interests you most?"
    }

    if (lowerQuery.includes("rajma") || lowerQuery.includes("kidney bean")) {
      const rajma = sampleProducts.find((p) => p.name.includes("Rajma"))
      return `${rajma?.name} from ${rajma?.region}:\n\n${rajma?.description}\n\nHealth Benefits:\n${rajma?.healthBenefits?.map((b) => `• ${b}`).join("\n")}\n\nCultural Significance:\n${rajma?.culturalSignificance}`
    }

    if (lowerQuery.includes("aipan") || lowerQuery.includes("art")) {
      const aipan = sampleProducts.find((p) => p.name.includes("Aipan"))
      return `${aipan?.name} from ${aipan?.region}:\n\n${aipan?.description}\n\nCultural Significance:\n${aipan?.culturalSignificance}\n\nThis traditional art form uses natural pigments and geometric patterns that have spiritual meaning in Kumaoni culture.`
    }

    if (lowerQuery.includes("ringaal") || lowerQuery.includes("bamboo")) {
      const ringaal = sampleProducts.find((p) => p.name.includes("Ringaal"))
      return `${ringaal?.name} from ${ringaal?.region}:\n\n${ringaal?.description}\n\nCultural Significance:\n${ringaal?.culturalSignificance}\n\nRingaal bamboo grows naturally in the Himalayas and is sustainably harvested by local artisans.`
    }

    if (lowerQuery.includes("garhwal") || lowerQuery.includes("region") || lowerQuery.includes("where")) {
      return "Our GI-tagged products come from various regions of Uttarakhand:\n\n• Munsiyari Rajma - Pithoragarh District\n• Aipan Art - Kumaon Region\n• Ringaal Craft - Uttarkashi\n• Tejpat - Garhwal\n• Woolen Products - Various hill regions\n\nEach region has unique geographical conditions that make these products special!"
    }

    if (lowerQuery.includes("buy") || lowerQuery.includes("purchase") || lowerQuery.includes("order")) {
      return "This platform focuses on cultural education and heritage preservation. You can explore our authentic GI-tagged products through our product catalog to learn about their cultural significance, health benefits, and traditional uses. Each product page includes detailed information about the artisan, origin, and cultural heritage. Would you like me to help you learn about a specific type of heritage product?"
    }

    // Default response for general queries
    return `I understand you're asking about "${query}". I can help you with:\n\n• Health benefits of GI-tagged products\n• Cultural significance and traditions\n• Product origins and regions\n• Artisan stories and crafting techniques\n• How to support local communities\n\nTry asking: "Tell me about Munsiyari Rajma health benefits" or "What is the cultural significance of Aipan art?"`
  }

  const handleSendMessage = async (message?: string, isVoice = false) => {
    const messageText = message || inputValue.trim()
    if (!messageText) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
      isVoice,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const response = await processUserQuery(messageText)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      // Speak the response if it was a voice query
      if (isVoice) {
        speakText(response)
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-96 shadow-2xl z-50 transition-all duration-300 ${
        isMinimized ? "h-16" : "h-[600px]"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-sm">AI Heritage Assistant</CardTitle>
          <Badge variant="secondary" className="text-xs bg-primary-foreground/20 text-primary-foreground">
            Voice Enabled
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-[calc(600px-80px)] p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "bot" && (
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.type === "user" && message.isVoice && <Mic className="h-3 w-3" />}
                      {message.type === "bot" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => speakText(message.content)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                  {message.type === "user" && (
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about GI products, health benefits, or cultural significance..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVoiceRecognition}
                className={`${isListening ? "bg-red-100 text-red-600" : ""}`}
                disabled={isLoading}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={() => handleSendMessage()} disabled={!inputValue.trim() || isLoading} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Try: "Tell me about Munsiyari Rajma" or click the mic for voice input
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
