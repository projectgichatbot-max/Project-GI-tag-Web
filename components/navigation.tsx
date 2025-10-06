"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Mountain, Search, Menu, ChevronDown, Volume2, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  { name: "Home", href: "/" },
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
            {/* AI Assistant Button removed as requested */}

            {/* Search */}
            <Link href="/search">
              <Button asChild variant="ghost" size="sm">
                <span className="inline-flex items-center">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </span>
              </Button>
            </Link>

            {/* Learning Resources */}
            <Link href="/learning" className="hidden sm:flex">
              <Button asChild variant="ghost" size="sm">
                <span className="inline-flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />Learn
                </span>
              </Button>
            </Link>

            {/* Artisan Stories */}
            <Link href="/blog" className="hidden sm:flex">
              <Button asChild variant="ghost" size="sm">
                <span className="inline-flex items-center">
                  <Users className="h-4 w-4 mr-2" />Stories
                </span>
              </Button>
            </Link>

            {/* CTA Button */}
            <Link href="/heritage" className="hidden sm:flex">
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                <span>Explore Heritage</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 h-full bg-background p-6"
                aria-label="Mobile navigation"
              >
                <SheetTitle className="sr-only">Mobile navigation</SheetTitle>
                <SheetDescription className="sr-only">Primary website links</SheetDescription>
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
                  <Link href="/heritage" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90">Explore Heritage</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
