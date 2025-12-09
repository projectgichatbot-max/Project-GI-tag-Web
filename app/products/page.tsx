"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Star, Grid, List, SlidersHorizontal, BookOpen, Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { productsApi, type Product } from "@/lib/api"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [hasPrevPage, setHasPrevPage] = useState(false)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [giCertified, setGiCertified] = useState<boolean | null>(null)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  
  // Refs to prevent duplicate fetches and track initialization
  const abortControllerRef = useRef<AbortController | null>(null)
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hasInitializedRef = useRef(false)
  const currentRequestIdRef = useRef(0)

  // Categories based on actual seeded data
  const categories = ["All", "Agricultural", "Handicraft", "Textile"]
  
  // Regions based on actual seeded data
  const regions = [
    "All",
    "Almora",
    "Almora, Bageshwar, Chamoli",
    "Almora, Chamoli",
    "Bageshwar, Almora",
    "Chamoli",
    "Chamoli, Pithoragarh",
    "Chamoli, Tehri",
    "Chamoli, Uttarakhand",
    "Chamoli, Uttarkashi",
    "Dehradun, Haridwar, Udham Singh Nagar",
    "Garhwal region",
    "Kumaon",
    "Kumaon & Garhwal",
    "Kumaon region",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh (Berinag)",
    "Pithoragarh district",
    "Ramgarh, Nainital",
    "Ramnagar, Nainital",
    "Uttarkashi"
  ]
  
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
    { value: "name", label: "Name (A-Z)" }
  ]

  // Fetch products from API with proper backend filtering
  const fetchProducts = async (page: number, requestId: number, signal?: AbortSignal) => {
    try {
      console.log(`🚀 Starting request #${requestId}`)
      setLoading(true)
      setError(null)
      
      // Create a unique key for this request
      const params: any = {
        page: page,
        limit: 12,
        available: true
      }
      
      // Add filters only if they are selected
      if (selectedCategory !== 'All') {
        params.category = selectedCategory
      }
      
      if (selectedRegion !== 'All') {
        params.region = selectedRegion
      }
      
      if (giCertified !== null) {
        params.giCertified = giCertified
      }
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim()
      }
      
      const response = await productsApi.getAll(params)
      
      // Check if this request is still the current one
      if (requestId !== currentRequestIdRef.current) {
        console.log(`🚫 Request #${requestId} cancelled - newer request exists`)
        return
      }
      
      // Check if request was aborted
      if (signal?.aborted) {
        console.log(`⚠️ Request #${requestId} aborted`)
        return
      }
      
      console.log(`✅ Request #${requestId} completed successfully`)
      
      if (response.success && response.data) {
        const sortedProducts = [...response.data]
        
        // Apply sorting
        switch (sortBy) {
          case "rating":
            sortedProducts.sort((a: any, b: any) => b.rating - a.rating)
            break
          case "name":
            sortedProducts.sort((a: any, b: any) => a.name.localeCompare(b.name))
            break
          case "newest":
          default:
            sortedProducts.sort((a: any, b: any) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            break
        }
        
        setProducts(sortedProducts)
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages)
          setTotalItems(response.pagination.totalItems)
          setHasNextPage(response.pagination.hasNextPage)
          setHasPrevPage(response.pagination.hasPrevPage)
        }
      } else {
        setError(response.error || 'Failed to fetch products')
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      setError('Failed to fetch products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // SINGLE useEffect to handle ALL data fetching
  useEffect(() => {
    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current)
      fetchTimeoutRef.current = null
    }
    
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Increment request ID to invalidate previous requests
    currentRequestIdRef.current += 1
    const requestId = currentRequestIdRef.current
    
    // Create new abort controller
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    
    // Determine delay: 500ms for search, 0ms for initial load or filter changes
    const delay = hasInitializedRef.current && searchQuery ? 500 : 0
    
    console.log(`📝 Scheduling request #${requestId} with ${delay}ms delay`)
    
    // Schedule fetch
    fetchTimeoutRef.current = setTimeout(() => {
      fetchProducts(1, requestId, abortController.signal)
      setCurrentPage(1)
      hasInitializedRef.current = true // Mark as initialized after first fetch
    }, delay)
    
    // Cleanup function
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current)
        fetchTimeoutRef.current = null
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, selectedRegion, giCertified, sortBy])

  // Handle page changes (separate from filter changes)
  const handlePageChange = (newPage: number) => {
    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Increment request ID
    currentRequestIdRef.current += 1
    const requestId = currentRequestIdRef.current
    
    // Create new abort controller
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    
    setCurrentPage(newPage)
    fetchProducts(newPage, requestId, abortController.signal)
  }

  // Remove the local filtering - backend handles it
  const displayProducts = products

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading heritage products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => {
            currentRequestIdRef.current += 1
            const requestId = currentRequestIdRef.current
            const abortController = new AbortController()
            abortControllerRef.current = abortController
            fetchProducts(currentPage, requestId, abortController.signal)
          }}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold mb-4 text-balance">
            GI-Tagged Heritage Products of Uttarakhand
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
            Discover authentic products with Geographical Indication tags, each telling a unique story of tradition,
            cultural heritage, and artisan craftsmanship.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Explore Heritage</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                    setSelectedRegion("All")
                    setGiCertified(null)
                    setSortBy("newest")
                  }}
                >
                  Clear All
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Search Heritage Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, region, or cultural..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Heritage Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Cultural Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-[300px]">
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* GI Certified Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">GI Certification</label>
                <Select 
                  value={giCertified === null ? "all" : giCertified.toString()} 
                  onValueChange={(value) => setGiCertified(value === "all" ? null : value === "true")}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="true">GI Certified Only</SelectItem>
                    <SelectItem value="false">Non-Certified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Filters */}
              <div>
                <label className="text-sm font-medium mb-2 block">Cultural Themes</label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-black text-white hover:bg-blue-500 hover:text-black"
                    onClick={() => setSelectedCategory("Handicraft")}
                  >
                    Traditional Handicrafts
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-black text-white hover:bg-blue-500 hover:text-black"
                    onClick={() => setSelectedCategory("Agricultural")}
                  >
                    Heritage Food Products
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-black text-white hover:bg-blue-500 hover:text-black"
                    onClick={() => setSelectedCategory("Textile")}
                  >
                    Traditional Textiles
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <p className="text-muted-foreground">
                  {totalItems} heritage product{totalItems !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading products...</span>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your filters.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayProducts.map((product) => (
                  <Card key={product._id} className="group hover:shadow-lg transition-all duration-300 border-0">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {product.category}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2">
                          {!product.available && (
                            <Badge variant="outline" className="text-xs bg-white text-black border-0">
                              Learning Only
                            </Badge>
                          )}
                          <Button size="sm" variant="ghost" className="bg-black/80 text-white hover:bg-blue-500 hover:text-black h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1 text-balance">{product.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.region}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-pretty">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{product.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">({product.reviewsCount} reviews)</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Cultural Heritage
                          </Badge>
                        </div>
                        <Link href={`/products/${product._id}`}>
                          <Button className="w-full">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayProducts.map((product) => (
                  <Card key={product._id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {product.category}
                                </Badge>
                                {!product.available && (
                                  <Badge variant="outline" className="text-xs">
                                    Learning Only
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <MapPin className="h-3 w-3 mr-1" />
                                {product.region}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center mb-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm ml-1">{product.rating}</span>
                                <span className="text-xs text-muted-foreground ml-1">({product.reviewsCount})</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                Cultural Heritage
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3 text-pretty">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {product.healthBenefits.slice(0, 2).map((benefit, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Link href={`/products/${product._id}`}>
                                <Button size="sm">
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Learn More
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {displayProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No heritage products found</h3>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Try adjusting your search criteria or filters to discover more cultural heritage products.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All")
                      setSelectedRegion("All")
                      setGiCertified(null)
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!hasPrevPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}