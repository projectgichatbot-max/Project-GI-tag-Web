import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cookie, Shield, Settings, AlertCircle } from "lucide-react"

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-muted py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-serif font-bold">
              Cookie Policy
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Learn how we use cookies to improve your experience on our platform
          </p>
          <Badge className="mt-4">Last Updated: October 5, 2025</Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <CardTitle>What Are Cookies?</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              understanding how you use our site.
            </p>
            <p className="text-muted-foreground">
              We use cookies to enhance your experience on the Uttarakhand GI Products platform, 
              preserve cultural heritage information, and ensure the security of your data.
            </p>
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Types of Cookies We Use
        </h2>

        <div className="space-y-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Essential Cookies</CardTitle>
              <CardDescription>Required for the website to function properly</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                These cookies are necessary for the website to function and cannot be switched off in our systems.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Authentication and security</li>
                <li>Session management</li>
                <li>Load balancing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Functional Cookies</CardTitle>
              <CardDescription>Enable enhanced functionality and personalization</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                These cookies enable the website to provide enhanced functionality and personalization.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Language preferences</li>
                <li>Regional settings (Kumaon/Garhwal preferences)</li>
                <li>Theme preferences (light/dark mode)</li>
                <li>Saved heritage items and wishlists</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Analytics Cookies</CardTitle>
              <CardDescription>Help us understand how visitors use our website</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                These cookies help us understand how visitors interact with our website by collecting and 
                reporting information anonymously.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Page views and navigation patterns</li>
                <li>Popular heritage products and artisan profiles</li>
                <li>Error tracking and performance monitoring</li>
                <li>User engagement with cultural content</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">4. Marketing Cookies</CardTitle>
              <CardDescription>Used to deliver relevant content and advertisements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                These cookies are used to make advertising messages more relevant to you and your interests.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Relevant heritage product recommendations</li>
                <li>Workshop and event notifications</li>
                <li>Social media integration</li>
                <li>Email campaign tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Third-Party Cookies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We also use services from trusted third parties that may set their own cookies:
            </p>
            <div className="space-y-3">
              <div className="border-l-2 border-primary pl-4">
                <h4 className="font-medium mb-1">Google Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  To understand user behavior and improve our platform
                </p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <h4 className="font-medium mb-1">Firebase</h4>
                <p className="text-sm text-muted-foreground">
                  For authentication and real-time database functionality
                </p>
              </div>
              <div className="border-l-2 border-primary pl-4">
                <h4 className="font-medium mb-1">Cloudinary</h4>
                <p className="text-sm text-muted-foreground">
                  For efficient image delivery and optimization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Managing Your Cookie Preferences
        </h2>

        <Card className="mb-8">
          <CardContent className="pt-6 space-y-4">
            <p className="text-muted-foreground">
              You have several options to manage or disable cookies:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Browser Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Most web browsers allow you to control cookies through their settings. You can set your 
                  browser to refuse cookies or delete certain cookies. Please note that if you disable cookies, 
                  some features of our website may not function properly.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Browser-Specific Instructions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Chrome: Settings → Privacy and security → Cookies and other site data</li>
                  <li>Firefox: Options → Privacy & Security → Cookies and Site Data</li>
                  <li>Safari: Preferences → Privacy → Cookies and website data</li>
                  <li>Edge: Settings → Privacy, search, and services → Cookies</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Our Cookie Consent Tool</h4>
                <p className="text-sm text-muted-foreground">
                  When you first visit our website, you&apos;ll see a cookie consent banner. You can choose to 
                  accept all cookies, reject non-essential cookies, or customize your preferences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Cookie Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Session Cookies</h4>
              <p className="text-sm text-muted-foreground">
                Deleted automatically when you close your browser
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Persistent Cookies</h4>
              <p className="text-sm text-muted-foreground">
                Remain on your device for a set period (typically 30 days to 2 years) or until you delete them
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changes to This Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for 
              other operational, legal, or regulatory reasons. We encourage you to review this page periodically 
              for the latest information on our cookie practices.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Questions About Cookies?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> privacy@uttarakhandgiproducts.com</p>
              <p><strong>Address:</strong> Dehradun, Uttarakhand, India</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
