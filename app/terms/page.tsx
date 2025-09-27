import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Scale, Shield, Users, AlertTriangle, Mail } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Scale className="h-16 w-16 mx-auto mb-4 text-amber-100" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Terms of Service</h1>
            <p className="text-xl text-amber-100 text-balance">Guidelines for using our cultural heritage platform</p>
            <p className="text-sm text-amber-200 mt-4">Last updated: January 2024</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Our Platform</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms of Service govern your use of the Uttarakhand GI Products Platform, a digital heritage
                preservation and cultural education platform. By accessing or using our services, you agree to be bound
                by these terms.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our platform is dedicated to preserving, promoting, and educating about Uttarakhand's Geographical
                Indication (GI) tagged products and cultural heritage.
              </p>
            </CardContent>
          </Card>

          {/* Platform Purpose */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-amber-600" />
                Platform Purpose & Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Our platform serves as a digital repository and educational resource for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Preserving traditional knowledge about GI-tagged products from Uttarakhand</li>
                  <li>Connecting users with authentic artisans and cultural practitioners</li>
                  <li>Providing AI-powered educational assistance about cultural heritage</li>
                  <li>Facilitating cultural learning and appreciation</li>
                  <li>Supporting sustainable cultural tourism and artisan livelihoods</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-5 w-5 text-amber-600" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Respectful Use</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Respect cultural traditions and heritage practices</li>
                    <li>Use the platform for educational and cultural appreciation purposes</li>
                    <li>Interact respectfully with artisans and community members</li>
                    <li>Provide accurate information when creating profiles or reviews</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Prohibited Activities</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Misrepresenting GI products or cultural information</li>
                    <li>Using the platform for commercial exploitation without permission</li>
                    <li>Sharing false or misleading information about artisans or products</li>
                    <li>Attempting to circumvent AI chatbot or voice recognition systems</li>
                    <li>Violating intellectual property rights of traditional knowledge holders</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Account Security</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Notify us immediately of any unauthorized access</li>
                    <li>Use strong passwords and enable available security features</li>
                    <li>Take responsibility for all activities under your account</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-amber-600" />
                Intellectual Property & Cultural Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Traditional Knowledge Protection</h3>
                  <p className="text-muted-foreground">
                    We respect and protect the traditional knowledge, cultural expressions, and intellectual property
                    rights of Uttarakhand's communities. All cultural information is shared with appropriate attribution
                    and respect for its origins.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Platform Content</h3>
                  <p className="text-muted-foreground">
                    Our platform content, including AI responses, educational materials, and technical features, is
                    protected by copyright. You may use this content for personal, educational, and cultural
                    appreciation purposes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">User-Generated Content</h3>
                  <p className="text-muted-foreground">
                    By sharing content on our platform, you grant us permission to use it for cultural preservation and
                    educational purposes while retaining your ownership rights.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI and Voice Services */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>AI Chatbot & Voice Recognition Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Our AI-powered services are designed to enhance your cultural learning experience:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>
                    AI responses are generated based on verified cultural information and may not be 100% accurate
                  </li>
                  <li>Voice recognition features process audio locally when possible to protect privacy</li>
                  <li>
                    AI recommendations are for educational purposes and should not replace expert cultural guidance
                  </li>
                  <li>We continuously improve AI accuracy but cannot guarantee perfect cultural interpretation</li>
                  <li>Users should verify important cultural or health information with appropriate experts</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Artisan Connections */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Artisan Connections & Cultural Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">When connecting with artisans through our platform:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>We facilitate connections but are not responsible for individual transactions</li>
                  <li>Respect artisan time, expertise, and cultural knowledge</li>
                  <li>Any direct interactions with artisans are for educational and cultural exchange purposes</li>
                  <li>Report any inappropriate behavior or cultural misrepresentation</li>
                  <li>Understand that traditional crafts require time and may have seasonal availability</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Disclaimers & Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cultural Information</h3>
                  <p className="text-muted-foreground">
                    While we strive for accuracy, cultural information is provided for educational purposes. Traditional
                    practices may vary by region and family traditions.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Health Claims</h3>
                  <p className="text-muted-foreground">
                    Traditional health benefits mentioned are based on cultural knowledge and should not replace
                    professional medical advice.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Service Availability</h3>
                  <p className="text-muted-foreground">
                    We strive to maintain continuous service but cannot guarantee uninterrupted access to all platform
                    features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-600" />
                Contact & Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                For questions about these Terms of Service or platform support:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong> support@uttarakhandgi.org
                </p>
                <p>
                  <strong>Cultural Heritage Team:</strong> heritage@uttarakhandgi.org
                </p>
                <p>
                  <strong>Address:</strong> Cultural Heritage Platform, Dehradun, Uttarakhand, India
                </p>
                <p>
                  <strong>Phone:</strong> +91-XXXX-XXXXXX
                </p>
              </div>
              <Separator className="my-6" />
              <p className="text-sm text-muted-foreground">
                These Terms of Service may be updated to reflect changes in our services or legal requirements.
                Continued use of the platform after changes constitutes acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
