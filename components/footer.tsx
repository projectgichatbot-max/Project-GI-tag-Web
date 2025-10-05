import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mountain, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart, Award, Leaf } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="h-6 w-6" />
              <span className="text-lg font-serif font-bold">Uttarakhand Heritage</span>
            </div>
            <p className="text-secondary-foreground/80 mb-6 text-pretty">
              Preserving and promoting the authentic cultural heritage of Uttarakhand through GI-tagged products and
              artisan stories.
            </p>

            {/* Key Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm">
                <Award className="h-4 w-4 mr-2 text-amber-400" />
                <span>GI-Tagged Authenticity</span>
              </div>
              <div className="flex items-center text-sm">
                <Heart className="h-4 w-4 mr-2 text-red-400" />
                <span>Direct Artisan Support</span>
              </div>
              <div className="flex items-center text-sm">
                <Leaf className="h-4 w-4 mr-2 text-green-400" />
                <span>Sustainable Practices</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Youtube className="h-4 w-4" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-3 text-secondary-foreground/80">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Handicraft" className="hover:text-white transition-colors">
                  Handicrafts
                </Link>
              </li>
              <li>
                <Link href="/products?category=Agricultural" className="hover:text-white transition-colors">
                  Food Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Textile" className="hover:text-white transition-colors">
                  Textiles
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-white transition-colors">
                  Meet Artisans
                </Link>
              </li>
              <li>
                <Link href="/heritage" className="hover:text-white transition-colors">
                  Cultural Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn Section */}
          <div>
            <h3 className="font-semibold mb-4">Learn</h3>
            <ul className="space-y-3 text-secondary-foreground/80">
              <li>
                <Link href="/heritage" className="hover:text-white transition-colors">
                  Cultural Heritage
                </Link>
              </li>
              <li>
                <Link href="/heritage#gi-importance" className="hover:text-white transition-colors">
                  Why GI Matters
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-white transition-colors">
                  Artisan Stories
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="hover:text-white transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Connected</h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-secondary-foreground/80">
                <Mail className="h-4 w-4 mr-2" />
                <span>projectgichatbot@gmail.com</span>
              </div>
              <div className="flex items-center text-sm text-secondary-foreground/80">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91-135-2471102</span>
              </div>
              <div className="flex items-start text-sm text-secondary-foreground/80">
                <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                <span>Dehradun, Uttarakhand, India</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-medium mb-3">Newsletter</h4>
              <p className="text-sm text-secondary-foreground/80 mb-3">
                Get updates on new products and artisan stories
              </p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your email"
                  className="bg-background/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/60"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-secondary-foreground/60">
                &copy; 2025 Uttarakhand Heritage. Preserving culture through technology.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <Link href="/privacy" className="text-secondary-foreground/60 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-secondary-foreground/60 hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-secondary-foreground/60 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-secondary-foreground/20 text-secondary-foreground/80">
                <Award className="h-3 w-3 mr-1" />
                GI Certified
              </Badge>
              <Badge variant="outline" className="border-secondary-foreground/20 text-secondary-foreground/80">
                <Heart className="h-3 w-3 mr-1" />
                Artisan Supported
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
