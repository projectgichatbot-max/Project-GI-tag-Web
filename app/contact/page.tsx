import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, MessageSquare, HeadphonesIcon, Users, Globe } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-white border-0">Get in Touch</Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-balance">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Have questions about our GI-tagged products, need support, or want to connect with artisans? We're here to
            help preserve and promote Uttarakhand's cultural heritage.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number (Optional)</label>
                  <Input type="tel" placeholder="+91 XXXXX XXXXX" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="What is this regarding?" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Tell us about your inquiry, feedback, or how we can help you..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Inquiry Type</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Product Information",
                      "Artisan Connection",
                      "Bulk Orders",
                      "Partnership",
                      "Technical Support",
                      "Cultural Heritage",
                      "Other",
                    ].map((type) => (
                      <Badge
                        key={type}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-black text-white hover:bg-blue-500 hover:text-black">
                  Send Message
                  <MessageSquare className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-sm text-muted-foreground">
                      Heritage Preservation Center
                      <br />
                      Dehradun, Uttarakhand 248001
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-sm text-muted-foreground">
                      +91 135 XXX XXXX
                      <br />
                      +91 98XXX XXXXX (WhatsApp)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p className="text-sm text-muted-foreground">
                      info@uttarakhandheritage.com
                      <br />
                      support@uttarakhandheritage.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Options */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Support Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <HeadphonesIcon className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-sm">Live Chat</h4>
                    <p className="text-xs text-muted-foreground">Available 9 AM - 6 PM</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-sm">Artisan Connect</h4>
                    <p className="text-xs text-muted-foreground">Direct artisan communication</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold text-sm">Community Forum</h4>
                    <p className="text-xs text-muted-foreground">Connect with other enthusiasts</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  Frequently Asked Questions
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Shipping & Returns
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Artisan Guidelines
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Bulk Order Inquiry
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Partnership Opportunities
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Visit Our Heritage Center</CardTitle>
              <p className="text-muted-foreground">
                Located in the heart of Dehradun, our center showcases authentic GI-tagged products and hosts cultural
                workshops.
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive map will be integrated here
                    <br />
                    showing our location in Dehradun, Uttarakhand
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
