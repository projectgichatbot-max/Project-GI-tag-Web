import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, BookOpen, MessageCircle, Phone, Mail, Download, ExternalLink } from "lucide-react"

export default function SupportPage() {
  const faqs = [
    {
      question: "What are GI-tagged products?",
      answer:
        "Geographical Indication (GI) tagged products are items that have a specific geographical origin and possess qualities or reputation due to that origin. In Uttarakhand, these include traditional handicrafts like Aipan art, agricultural products like Munsiyari Rajma, and textiles that represent our cultural heritage.",
    },
    {
      question: "How do I verify the authenticity of GI-tagged products?",
      answer:
        "All authentic GI-tagged products come with official certification marks and documentation. Look for the GI logo, certificate number, and artisan information. Our platform only features verified products directly sourced from certified artisans and producers.",
    },
    {
      question: "Can I visit the artisans directly?",
      answer:
        "Yes! We facilitate direct connections between customers and artisans. Many artisans offer workshop visits, cultural experiences, and custom orders. Contact us to arrange visits or use our 'Meet the Maker' feature on product pages.",
    },
    {
      question: "What is the return policy for handmade products?",
      answer:
        "We understand that handmade products are unique. Returns are accepted within 15 days if the product is significantly different from the description. However, minor variations in handmade items are normal and celebrated as part of their authenticity.",
    },
    {
      question: "How do I care for traditional textiles and handicrafts?",
      answer:
        "Each product comes with specific care instructions. Generally, traditional textiles should be hand-washed with mild detergent, air-dried away from direct sunlight. Handicrafts should be kept in dry conditions and dusted regularly. Detailed care guides are available for each product category.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we ship within India. International shipping is being planned for select products. Subscribe to our newsletter to be notified when international shipping becomes available.",
    },
    {
      question: "How can I become a partner artisan?",
      answer:
        "We welcome skilled artisans who create authentic GI-tagged products. You'll need to provide proof of traditional skills, product samples, and GI certification (if applicable). Contact our artisan relations team for the application process.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, UPI, net banking, and digital wallets. For bulk orders, we also accept bank transfers. All transactions are secured with industry-standard encryption.",
    },
  ]

  const guides = [
    {
      title: "Understanding GI Tags",
      description: "Learn about the significance and benefits of Geographical Indication tags",
      category: "Education",
    },
    {
      title: "Product Care Guide",
      description: "How to maintain and preserve your traditional products",
      category: "Maintenance",
    },
    {
      title: "Artisan Stories",
      description: "Discover the heritage and techniques behind each craft",
      category: "Culture",
    },
    {
      title: "Ordering Process",
      description: "Step-by-step guide to placing and tracking orders",
      category: "Shopping",
    },
    {
      title: "Custom Orders",
      description: "How to request personalized products from artisans",
      category: "Shopping",
    },
    {
      title: "Cultural Significance",
      description: "Understanding the cultural importance of each product category",
      category: "Culture",
    },
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">Support Center</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-balance">How Can We Help You?</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Find answers to your questions, learn about our products, and get the support you need to explore
            Uttarakhand's cultural heritage.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input placeholder="Search for help articles, FAQs, or guides..." className="pl-10 h-12 text-lg" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Get instant help from our support team</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Call Support</h3>
              <p className="text-sm text-muted-foreground">Speak directly with our experts</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground">Send detailed inquiries via email</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Help Guides</h3>
              <p className="text-sm text-muted-foreground">Browse comprehensive guides</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="guides">Help Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact Options</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Frequently Asked Questions</CardTitle>
                <p className="text-muted-foreground">
                  Find quick answers to the most common questions about our GI-tagged products and services.
                </p>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center space-x-3">
                          <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pt-4 pb-2">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Help Guides & Documentation</CardTitle>
                <p className="text-muted-foreground">
                  Comprehensive guides to help you understand and care for your GI-tagged products.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {guides.map((guide, index) => (
                    <Card key={index} className="border hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {guide.category}
                          </Badge>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground">{guide.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Contact Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-semibold">Live Chat</h4>
                      <p className="text-sm text-muted-foreground">Available Mon-Fri, 9 AM - 6 PM</p>
                      <Button size="sm" className="mt-2">
                        Start Chat
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-semibold">Phone Support</h4>
                      <p className="text-sm text-muted-foreground">+91 135 XXX XXXX</p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Call Now
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="font-semibold">Email Support</h4>
                      <p className="text-sm text-muted-foreground">support@uttarakhandheritage.com</p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Send Email
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Response Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Live Chat</span>
                    <Badge className="bg-green-100 text-green-800">Instant</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Phone Support</span>
                    <Badge className="bg-blue-100 text-blue-800">Immediate</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">Email</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Within 24 hours</Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Complex Issues</span>
                    <Badge className="bg-purple-100 text-purple-800">2-3 business days</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Downloads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Product Care Guide (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    GI Certification Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Artisan Directory
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Cultural Heritage Booklet
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Video Tutorials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold mb-2">Coming Soon</h4>
                    <p className="text-sm text-muted-foreground">
                      Video tutorials on product care, cultural significance, and artisan techniques
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Community</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Community Forum
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Artisan Network
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Cultural Events
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Newsletter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
