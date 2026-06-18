"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Mountain, Search, Menu, X, Package, Users, Loader2, Star } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Artisans", href: "/artisans" },
  { name: "Workshops", href: "/workshops" },
  { name: "Products", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "AI Chat", href: "/chat" },
]

type SearchResult = {
  products?: any[]
  artisans?: any[]
  total?: number
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  // Debounced search with 300ms delay
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults(null)
      setShowSuggestions(false)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&type=all&limit=5`)
        const data = await response.json()
        if (data.success && data.data) {
          setSearchResults(data.data)
          setShowSuggestions(true)
        } else {
          setSearchResults({ products: [], artisans: [] })
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults(null)
        setShowSuggestions(false)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSuggestions])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setShowSuggestions(false)
      setIsSearchFocused(false)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSearchQuery("")
    }
  }

  const handleSuggestionClick = (href: string) => {
    router.push(href)
    setSearchQuery("")
    setShowSuggestions(false)
    setIsSearchFocused(false)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults(null)
    setShowSuggestions(false)
  }

  const hasResults = searchResults && (
    (searchResults.products && searchResults.products.length > 0) ||
    (searchResults.artisans && searchResults.artisans.length > 0)
  )

  return (
    <nav className="fixed top-0 w-full bg-black border-b border-gray-800 z-50" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <Image src="/favicon.jpg" alt="Uttarakhand Heritage" width={32} height={32} className="rounded" />
            <span className="text-xl font-serif font-bold text-white hidden sm:inline">Uttarakhand Heritage</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`text-white hover:text-gray-300 transition-colors ${
                    isActive(item.href) ? "text-white font-medium border-b-2 border-white" : ""
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              </div>
            ))}
          </div>

          {/* Search Bar and Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 lg:flex-initial justify-end">
            {/* Search Bar with Suggestions */}
            <div ref={searchRef} className="flex-1 max-w-xs lg:max-w-md relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search products, artisans..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => {
                      setIsSearchFocused(true)
                      if (hasResults) setShowSuggestions(true)
                    }}
                    className="pl-10 pr-10 bg-gray-800 border-white/30 text-white placeholder:text-gray-400 focus:bg-gray-700 focus:border-white/50 h-9 text-sm w-full"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
                  )}
                  {searchQuery && !isSearching && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && isSearchFocused && searchQuery.trim().length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-[420px] overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-5 text-center text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                      <p className="text-sm">Searching...</p>
                    </div>
                  ) : hasResults ? (
                    <div className="p-2">
                      {/* Products Section */}
                      {searchResults.products && searchResults.products.length > 0 && (
                        <div className="mb-2">
                          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Package className="h-3 w-3" />
                            Products
                          </div>
                          {searchResults.products.map((product: any, index: number) => (
                            <button
                              key={product._id || index}
                              onClick={() => handleSuggestionClick(`/products/${product._id || ''}`)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3 group"
                            >
                              {/* Product thumbnail */}
                              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                {product.image ? (
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                  {product.name}
                                </div>
                                <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                                  <span>{product.category}</span>
                                  {product.region && <><span>·</span><span className="truncate">{product.region}</span></>}
                                  {product.giCertified && <span className="text-green-500">· GI ✓</span>}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Divider if both sections shown */}
                      {(searchResults.products?.length ?? 0) > 0 && (searchResults.artisans?.length ?? 0) > 0 && (
                        <div className="border-t border-gray-100 dark:border-gray-800 my-1" />
                      )}

                      {/* Artisans Section */}
                      {searchResults.artisans && searchResults.artisans.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            Artisans
                          </div>
                          {searchResults.artisans.map((artisan: any, index: number) => (
                            <button
                              key={artisan._id || index}
                              onClick={() => handleSuggestionClick(`/artisans/${artisan._id || ''}`)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3 group"
                            >
                              {/* Artisan portrait */}
                              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0 border-2 border-gray-200 dark:border-gray-600">
                                {artisan.image ? (
                                  <Image
                                    src={artisan.image}
                                    alt={artisan.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover object-top"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Users className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                  {artisan.name}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5 truncate">
                                  {artisan.specialization}
                                  {artisan.district && <span> · {artisan.district}</span>}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* View All Results */}
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-1">
                        <button
                          onClick={() => handleSuggestionClick(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                          className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Search className="h-3.5 w-3.5" />
                          View all results for &ldquo;{searchQuery}&rdquo;
                        </button>
                      </div>
                    </div>
                  ) : searchQuery.trim().length >= 2 && !isSearching ? (
                    <div className="p-5 text-center text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm font-medium">No results for &ldquo;{searchQuery}&rdquo;</p>
                      <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link href="/heritage" className="hidden sm:flex">
              <Button asChild size="sm" className="bg-white text-black hover:bg-blue-500 hover:text-black whitespace-nowrap">
                <span>Explore Heritage</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden text-white hover:bg-gray-800 hover:text-white">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 h-full bg-black border-l border-gray-800 p-6"
                aria-label="Mobile navigation"
              >
                <SheetTitle className="sr-only">Mobile navigation</SheetTitle>
                <SheetDescription className="sr-only">Primary website links</SheetDescription>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <Image src="/favicon.jpg" alt="Uttarakhand Heritage" width={24} height={24} className="rounded" />
                    <span className="text-lg font-serif font-bold text-white">Uttarakhand Heritage</span>
                  </div>
                </div>

                {/* Mobile Search */}
                <div className="mb-6">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search products, artisans..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        className="pl-10 bg-gray-800 border-white/30 text-white placeholder:text-gray-400 focus:bg-gray-700 focus:border-white/50 h-10"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-4">
                  {navigationItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href}
                        className={`block py-2 text-lg font-medium transition-colors text-white hover:text-gray-300 ${
                          isActive(item.href) ? "text-white border-l-4 border-white pl-2" : ""
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800 space-y-4">
                  <Link href="/heritage" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-black text-white hover:bg-blue-500 hover:text-black">Explore Heritage</Button>
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
