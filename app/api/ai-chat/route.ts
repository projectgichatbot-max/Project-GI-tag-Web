import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseService } from "@/lib/database-service-fixed"

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      )
    }
    
    // Get database service
    const db = await getDatabaseService()
    
    // Process the message and generate response
    const response = await processAIMessage(message, db)
    
    return NextResponse.json({
      success: true,
      data: {
        message: response,
        conversationId: conversationId || `conv-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('AI Chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

async function processAIMessage(message: string, db: any): Promise<string> {
  const lowerMessage = message.toLowerCase()
  
  // Handle greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('namaste')) {
    return "Namaste! I'm your AI assistant for Uttarakhand's GI-tagged products. I can help you learn about traditional products, their health benefits, cultural significance, and connect you with artisans. What would you like to know?"
  }
  
  // Handle product queries
  if (lowerMessage.includes('product') || lowerMessage.includes('rajma') || lowerMessage.includes('aipan')) {
    try {
      const products = await db.getProducts({}, { page: 1, limit: 5 })
      if (products.data && products.data.length > 0) {
        const productList = products.data.map((p: any) => `• ${p.name} (${p.category}) - ${p.description}`).join('\n')
        return `Here are some of our heritage products:\n\n${productList}\n\nEach product has unique health benefits and cultural significance. Would you like to know more about any specific product?`
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    
    return "We have amazing heritage products like Munsiyari Rajma (organic kidney beans) and Aipan Art (traditional geometric patterns). Each product carries deep cultural significance and health benefits. What specific product interests you?"
  }
  
  // Handle artisan queries
  if (lowerMessage.includes('artisan') || lowerMessage.includes('craftsman') || lowerMessage.includes('maker')) {
    try {
      const artisans = await db.getArtisans({}, { page: 1, limit: 3 })
      if (artisans.data && artisans.data.length > 0) {
        const artisanList = artisans.data.map((a: any) => `• ${a.name} - ${a.specialization} from ${a.village}`).join('\n')
        return `Meet our talented artisans:\n\n${artisanList}\n\nThese skilled craftspeople preserve traditional techniques passed down through generations. Would you like to learn about their workshops or techniques?`
      }
    } catch (error) {
      console.error('Error fetching artisans:', error)
    }
    
    return "Our artisans are master craftspeople who preserve traditional techniques. They offer workshops and share their knowledge about organic farming, traditional arts, and cultural heritage. Would you like to know about specific artisans or their workshops?"
  }
  
  // Handle health benefits queries
  if (lowerMessage.includes('health') || lowerMessage.includes('benefit') || lowerMessage.includes('nutrition')) {
    return "Our heritage products offer incredible health benefits! For example:\n\n• Munsiyari Rajma: High protein (22g/100g), rich in iron and calcium, diabetic-friendly\n• Traditional foods: Grown organically, free from chemicals, packed with nutrients\n• Cultural practices: Many traditional preparation methods enhance nutritional value\n\nWould you like to know about specific health benefits of any product?"
  }
  
  // Handle cultural significance queries
  if (lowerMessage.includes('culture') || lowerMessage.includes('tradition') || lowerMessage.includes('heritage')) {
    return "Our products are deeply rooted in Uttarakhand's culture:\n\n• Munsiyari Rajma: Sacred food offered in temples, traditional festival staple\n• Aipan Art: Sacred geometric patterns for spiritual protection and prosperity\n• Each product carries stories of generations and cultural practices\n\nThese products connect you to centuries of tradition and wisdom. What aspect of the culture interests you most?"
  }
  
  // Handle search queries
  if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look for')) {
    try {
      const searchResults = await db.search(message.replace(/search|find|look for/gi, '').trim(), 'all', 5)
      if (searchResults.products.length > 0 || searchResults.artisans.length > 0) {
        let response = "Here's what I found:\n\n"
        if (searchResults.products.length > 0) {
          response += "Products:\n" + searchResults.products.map((p: any) => `• ${p.name} - ${p.description}`).join('\n') + "\n\n"
        }
        if (searchResults.artisans.length > 0) {
          response += "Artisans:\n" + searchResults.artisans.map((a: any) => `• ${a.name} - ${a.specialization}`).join('\n')
        }
        return response
      }
    } catch (error) {
      console.error('Error searching:', error)
    }
    
    return "I'd be happy to help you search! Try asking about specific products like 'Munsiyari Rajma' or 'Aipan Art', or ask about artisans and their specializations."
  }
  
  // Handle help queries
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return "I can help you with:\n\n• Learn about heritage products and their benefits\n• Connect with traditional artisans\n• Understand cultural significance\n• Find health benefits of traditional foods\n• Search for specific products or artisans\n• Answer questions about Uttarakhand's heritage\n\nJust ask me anything about our products, artisans, or cultural heritage!"
  }
  
  // Default response
  return "I'm here to help you learn about Uttarakhand's rich cultural heritage! You can ask me about:\n\n• Traditional products and their health benefits\n• Artisans and their crafts\n• Cultural significance and traditions\n• Workshops and learning opportunities\n\nWhat would you like to know?"
}
