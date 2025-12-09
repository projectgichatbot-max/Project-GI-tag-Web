"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Heart, Award, Leaf, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "footer",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsSubscribed(true)
        setEmail("")
        // Remove toast notification - only show footer success message
        // toast.success(data.data.message || "Thank you for subscribing!")
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSubscribed(false)
        }, 5000)
      } else {
        toast.error(data.error || "Failed to subscribe. Please try again.")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      toast.error("Something went wrong. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src="/favicon.jpg" 
                alt="Uttarakhand Heritage" 
                width={32} 
                height={32} 
                className="rounded"
              />
              <span className="text-lg font-serif font-bold text-white">Uttarakhand Heritage</span>
            </div>
            <p className="text-white/80 mb-6 text-sm leading-relaxed">
              Preserving and promoting the authentic cultural heritage of Uttarakhand through GI-tagged products and
              artisan stories.
            </p>

            {/* Key Features */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-white/90">
                <Award className="h-4 w-4 mr-2 text-amber-400 flex-shrink-0" />
                <span>GI-Tagged Authenticity</span>
              </div>
              <div className="flex items-center text-sm text-white/90">
                <Heart className="h-4 w-4 mr-2 text-red-400 flex-shrink-0" />
                <span>Direct Artisan Support</span>
              </div>
              <div className="flex items-center text-sm text-white/90">
                <Leaf className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                <span>Sustainable Practices</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-[#1877F2] hover:bg-[#166FE5] flex items-center justify-center transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-black hover:bg-gray-900 flex items-center justify-center transition-colors duration-200 border border-white/20"
                aria-label="X (Twitter)"
              >
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 flex items-center justify-center transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-[#FF0000] hover:bg-[#CC0000] flex items-center justify-center transition-colors duration-200"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-base">Explore</h3>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link href="/products" className="hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Handicraft" className="hover:text-white transition-colors text-sm">
                  Handicrafts
                </Link>
              </li>
              <li>
                <Link href="/products?category=Agricultural" className="hover:text-white transition-colors text-sm">
                  Food Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=Textile" className="hover:text-white transition-colors text-sm">
                  Textiles
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-white transition-colors text-sm">
                  Meet Artisans
                </Link>
              </li>
            </ul>
          </div>

          {/* Learn Section */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-base">Learn</h3>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link href="/heritage" className="hover:text-white transition-colors text-sm">
                  Cultural Heritage
                </Link>
              </li>
              <li>
                <Link href="/heritage#gi-importance" className="hover:text-white transition-colors text-sm">
                  Why GI Matters
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="hover:text-white transition-colors text-sm">
                  Artisan Stories
                </Link>
              </li>
              <li>
                <Link href="/workshops" className="hover:text-white transition-colors text-sm">
                  Workshops
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-white text-base">Stay Connected</h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start text-sm text-white/80">
                <Mail className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <a href="mailto:projectgichatbot@gmail.com" className="hover:text-white transition-colors break-all">
                  projectgichatbot@gmail.com
                </a>
              </div>
              <div className="flex items-center text-sm text-white/80">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="tel:+911352471102" className="hover:text-white transition-colors">
                  +91-135-2471102
                </a>
              </div>
              <div className="flex items-start text-sm text-white/80">
                <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Dehradun, Uttarakhand, India</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-medium mb-3 text-white text-sm">Newsletter</h4>
              <p className="text-sm text-white/80 mb-3 leading-relaxed">
                Get updates on new products and artisan stories
              </p>
              {isSubscribed ? (
                <div className="flex items-center gap-2 text-sm bg-green-600 text-white p-3 rounded-md border border-green-500 shadow-lg">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">Subscribed successfully!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="bg-gray-800 border-white/30 text-white placeholder:text-gray-400 focus:bg-gray-700 focus:border-white/50 text-sm"
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={isSubmitting}
                    className="bg-black text-white hover:bg-blue-500 hover:text-black whitespace-nowrap disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <p className="text-sm text-white/60">
                &copy; 2025 Uttarakhand Heritage. Preserving culture through technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
