import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, HelpCircle, MessageCircle, Book, Shield } from "lucide-react"

const faqCategories = [
  {
    id: "gi-products",
    title: "GI-Tagged Products",
    icon: Shield,
    questions: [
      {
        question: "What does GI-tagged mean?",
        answer:
          "Geographical Indication (GI) tagging is a certification that identifies products as originating from a specific geographical location, where a given quality, reputation, or other characteristic is essentially attributable to that origin. For Uttarakhand products, this means they are authentic, traditional, and maintain specific quality standards tied to their regional heritage.",
      },
      {
        question: "Why are GI-tagged products important?",
        answer:
          "GI-tagged products preserve cultural heritage, protect traditional knowledge, ensure authenticity, support local artisans and farmers, prevent counterfeiting, and maintain quality standards. They also help consumers identify genuine traditional products and support sustainable local economies.",
      },
      {
        question: "How can I verify if a product is genuinely GI-tagged?",
        answer:
          "Look for the official GI certification mark, check the product's registration details on the GI Registry website, verify the producer's credentials, and ensure the product meets the specified quality parameters. Our platform only features verified GI-tagged products from authentic sources.",
      },
      {
        question: "What makes Uttarakhand's GI products unique?",
        answer:
          "Uttarakhand's GI products are unique due to the region's diverse geography, traditional knowledge systems, organic farming practices, artisanal skills passed down through generations, and the use of indigenous materials and techniques that cannot be replicated elsewhere.",
      },
    ],
  },
  {
    id: "cultural-heritage",
    title: "Cultural Heritage",
    icon: Book,
    questions: [
      {
        question: "What is the cultural significance of Aipan art?",
        answer:
          "Aipan art is a sacred geometric art form practiced in Uttarakhand for centuries. It combines mathematical precision with spiritual beliefs, serving as both decoration and protection. The patterns are drawn during festivals and ceremonies, representing cosmic order and connecting the earthly realm with the divine.",
      },
      {
        question: "How is traditional knowledge being preserved?",
        answer:
          "Traditional knowledge is preserved through documentation, digital archiving, artisan training programs, cultural workshops, educational initiatives, and platforms like ours that showcase and explain the significance of traditional practices to younger generations and global audiences.",
      },
      {
        question: "Can I learn traditional crafts mentioned on your platform?",
        answer:
          "Yes! Many artisans featured on our platform offer workshops and training sessions. You can contact them directly through their profiles, or check our events section for upcoming cultural workshops and learning opportunities in traditional crafts.",
      },
      {
        question: "What role do festivals play in GI product traditions?",
        answer:
          "Festivals are integral to GI product traditions as they provide occasions for creating traditional items, passing down knowledge, celebrating harvests, and maintaining cultural practices. Many GI products are specifically associated with particular festivals and seasonal celebrations.",
      },
    ],
  },
  {
    id: "health-nutrition",
    title: "Health & Nutrition",
    icon: HelpCircle,
    questions: [
      {
        question: "What are the health benefits of Munsiyari Rajma?",
        answer:
          "Munsiyari Rajma is rich in protein, fiber, iron, potassium, and antioxidants. It helps in managing diabetes, supports heart health, aids in weight management, provides sustained energy, and is excellent for digestive health. The high-altitude growing conditions enhance its nutritional density.",
      },
      {
        question: "Are traditional Uttarakhand products organic?",
        answer:
          "Many traditional Uttarakhand products are naturally organic due to traditional farming practices that avoid synthetic chemicals. However, not all have formal organic certification. We clearly indicate which products have organic certification and which follow traditional natural practices.",
      },
      {
        question: "How do I incorporate these traditional foods into my modern diet?",
        answer:
          "Traditional Uttarakhand foods can be easily incorporated into modern diets through simple recipes, gradual substitution of regular ingredients, seasonal consumption patterns, and by understanding their nutritional benefits. Our blog section provides practical tips and recipes for modern adaptation.",
      },
      {
        question: "Are there any dietary restrictions I should know about?",
        answer:
          "Most traditional Uttarakhand products are naturally vegetarian and suitable for various dietary preferences. However, some may contain specific ingredients or be processed in facilities that handle allergens. Always check product descriptions and consult with healthcare providers if you have specific dietary concerns.",
      },
    ],
  },
  {
    id: "platform-usage",
    title: "Platform Usage",
    icon: MessageCircle,
    questions: [
      {
        question: "How does the AI chatbot work?",
        answer:
          "Our AI chatbot uses natural language processing to understand your queries about GI products, cultural heritage, health benefits, and artisan information. It can respond to both text and voice inputs, providing detailed information about Uttarakhand's traditional products and connecting you with relevant resources.",
      },
      {
        question: "Can I use voice commands to search for products?",
        answer:
          "Yes! Our platform supports voice recognition technology. Click the microphone icon and speak your query naturally, such as 'Show me health-based GI products from Garhwal' or 'Tell me about Aipan art.' The system will process your voice input and provide relevant results.",
      },
      {
        question: "How do I connect with artisans?",
        answer:
          "You can connect with artisans through their individual profile pages, which include contact information, workshop schedules, and direct messaging options. Many artisans also offer virtual consultations and can provide custom products or learning opportunities.",
      },
      {
        question: "Is there a mobile app available?",
        answer:
          "Currently, our platform is web-based and fully responsive, working seamlessly on mobile devices. We're developing a dedicated mobile app that will include additional features like offline access to cultural content and enhanced voice recognition capabilities.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Frequently Asked Questions</h1>
            <p className="text-xl text-amber-100 text-balance">
              Everything you need to know about Uttarakhand's GI-tagged heritage products
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for answers about GI products, culture, health benefits..."
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          {faqCategories.map((category) => (
            <Card key={category.id} className="mb-8 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <category.icon className="h-6 w-6 text-amber-600" />
                  {category.title}
                  <Badge variant="secondary" className="ml-auto">
                    {category.questions.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`} className="border-b last:border-b-0">
                      <AccordionTrigger className="px-6 py-4 text-left hover:bg-amber-50/50 transition-colors">
                        <span className="font-medium text-gray-900 text-balance">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-muted-foreground leading-relaxed text-pretty">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="max-w-2xl mx-auto mt-16">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-8 text-center">
              <HelpCircle className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? Our cultural heritage experts and support team are here to
                help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-amber-600 hover:bg-amber-700">Contact Support</Button>
                <Button variant="outline">Ask Our AI Chatbot</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
