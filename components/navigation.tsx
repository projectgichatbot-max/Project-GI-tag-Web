"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Mountain, Search, Menu, ChevronDown, Volume2, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  { name: "Home", href: "/" },
  {
    name: "Heritage Products",
    href: "/products",
    submenu: [
      { name: "All Products", href: "/products" },
      { name: "Handicrafts", href: "/products?category=Handicraft" },
      { name: "Agricultural", href: "/products?category=Agricultural" },
      { name: "Textiles", href: "/products?category=Textile" },
    ],
  },
  { name: "Artisans", href: "/artisans" },
  { name: "Workshops", href: "/workshops" },
  {
    name: "Heritage",
    href: "/heritage",
    submenu: [
      { name: "Cultural Heritage", href: "/heritage" },
      { name: "GI Importance", href: "/heritage#gi-importance" },
      { name: "Traditional Crafts", href: "/heritage#crafts" },
    ],
  },
  { name: "About", href: "/about" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Mountain className="h-8 w-8 text-primary" />
            <span className="text-xl font-serif font-bold text-balance">Uttarakhand Heritage</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-1 text-foreground hover:text-primary transition-colors ${
                    isActive(item.href) ? "text-primary font-medium" : ""
                  }`}
                  onMouseEnter={() => item.submenu && setActiveSubmenu(item.name)}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <span>{item.name}</span>
                  {item.submenu && <ChevronDown className="h-3 w-3" />}
                </Link>

                {/* Submenu */}
                {item.submenu && activeSubmenu === item.name && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                    onMouseEnter={() => setActiveSubmenu(item.name)}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* AI Assistant Button */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Volume2 className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>

            {/* Search */}
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Learning Resources */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <BookOpen className="h-4 w-4 mr-2" />
              Learn
            </Button>

            {/* Artisan Stories */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Users className="h-4 w-4 mr-2" />
              Stories
            </Button>

            {/* CTA Button */}
            <Button size="sm" className="hidden sm:flex bg-primary hover:bg-primary/90">
              Explore Heritage
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <Mountain className="h-6 w-6 text-primary" />
                    <span className="text-lg font-serif font-bold">Uttarakhand Heritage</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {navigationItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={`block py-2 text-lg font-medium transition-colors ${
                          isActive(item.href) ? "text-primary" : "text-foreground hover:text-primary"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {item.submenu && (
                        <div className="ml-4 mt-2 space-y-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-border space-y-4">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <Volume2 className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Explore Heritage
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
