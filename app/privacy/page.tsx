import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-amber-100" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Privacy Policy</h1>
            <p className="text-xl text-amber-100 text-balance">How we protect and handle your personal information</p>
            <p className="text-sm text-amber-200 mt-4">Last updated: January 2024</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At Uttarakhand GI Products Platform, we are committed to protecting your privacy and ensuring the
                security of your personal information. This Privacy Policy explains how we collect, use, store, and
                protect your data when you use our cultural heritage platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to preserve and promote Uttarakhand's cultural heritage while maintaining the highest
                standards of data protection and user privacy.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-amber-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Name, email address, and contact information when you register</li>
                    <li>Profile information and preferences you choose to share</li>
                    <li>Communication history with our support team and artisans</li>
                    <li>Cultural interests and learning preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Pages visited, time spent on the platform, and navigation patterns</li>
                    <li>Search queries and AI chatbot interactions</li>
                    <li>Voice recordings when using speech recognition features (processed locally)</li>
                    <li>Device information, browser type, and IP address</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cultural Engagement Data</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Products viewed and cultural content accessed</li>
                    <li>Workshop participation and learning progress</li>
                    <li>Feedback and reviews about GI products and artisans</li>
                    <li>Cultural heritage achievements and milestones</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-5 w-5 text-amber-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Platform Services</h3>
                  <p className="text-muted-foreground">
                    To provide personalized cultural content, AI-powered search results, artisan connections, and
                    educational resources about GI-tagged products.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Cultural Preservation</h3>
                  <p className="text-muted-foreground">
                    To understand user interests in traditional crafts and heritage products, helping us improve our
                    cultural preservation efforts and content quality.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                  <p className="text-muted-foreground">
                    To send you updates about new GI products, cultural events, artisan workshops, and platform
                    improvements that align with your interests.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Research and Development</h3>
                  <p className="text-muted-foreground">
                    To improve our AI chatbot, voice recognition features, and cultural content recommendations while
                    maintaining anonymity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-amber-600" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Encryption of data in transit and at rest using AES-256 standards</li>
                  <li>Secure authentication and authorization protocols</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                  <li>Voice data processed locally on your device when possible</li>
                  <li>Secure backup and disaster recovery procedures</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-amber-600" />
                Data Sharing & Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  We do not sell your personal information. We may share data only in these limited circumstances:
                </p>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Artisan Connections</h3>
                  <p className="text-muted-foreground">
                    When you choose to connect with artisans, we share necessary contact information to facilitate
                    cultural learning and authentic product access.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
                  <p className="text-muted-foreground">
                    We work with trusted partners for hosting, analytics, and AI services, all bound by strict data
                    protection agreements.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                  <p className="text-muted-foreground">
                    We may disclose information when required by law or to protect the rights and safety of our users
                    and cultural heritage community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Rights & Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of your personal data we hold
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your personal data
                  </li>
                  <li>
                    <strong>Portability:</strong> Receive your data in a machine-readable format
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing communications
                  </li>
                  <li>
                    <strong>Voice Data:</strong> Control voice recognition features and data retention
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-600" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Email:</strong> privacy@uttarakhandgi.org
                </p>
                <p>
                  <strong>Address:</strong> Cultural Heritage Data Protection Office, Dehradun, Uttarakhand, India
                </p>
                <p>
                  <strong>Phone:</strong> +91-XXXX-XXXXXX
                </p>
              </div>
              <Separator className="my-6" />
              <p className="text-sm text-muted-foreground">
                This Privacy Policy may be updated periodically to reflect changes in our practices or legal
                requirements. We will notify you of significant changes through email or platform notifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
