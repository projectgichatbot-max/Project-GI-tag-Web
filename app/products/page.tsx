"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, MapPin, Star, Grid, List, SlidersHorizontal, BookOpen, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Sample product data based on the presentation
const products = [
  {
    id: 1,
    name: "Munsiyari Rajma",
    category: "Agricultural",
    region: "Pithoragarh District (Munsiyari)",
    description: "Small-sized red beans, rich in taste, grown in high-altitude organic conditions",
    image: "/munsiyari-rajma-kidney-beans-red.jpg",
    rating: 4.8,
    reviews: 124,
    culturalValue: "Traditional staple food of Kumaon region",
    healthBenefits: ["Rich in iron & calcium", "High protein content", "Diabetic-friendly"],
    culturalSignificance: "Traditional staple food of Kumaon region",
    available: true,
  },
  {
    id: 2,
    name: "Aipan Art Painting",
    category: "Handicraft",
    region: "Kumaon Region",
    description: "Traditional geometric patterns painted with rice paste, representing cultural heritage",
    image: "/aipan-art-traditional-patterns-geometric.jpg",
    rating: 4.9,
    reviews: 89,
    culturalValue: "Sacred art form used in festivals and ceremonies",
    healthBenefits: ["Therapeutic art practice", "Stress relief"],
    culturalSignificance: "Sacred art form used in festivals and ceremonies",
    available: true,
  },
  {
    id: 3,
    name: "Ringaal Craft Basket",
    category: "Handicraft",
    region: "Uttarkashi",
    description: "Handwoven baskets made from Ringaal bamboo, eco-friendly and durable",
    image: "/ringaal-bamboo-craft-basket-traditional.jpg",
    rating: 4.7,
    reviews: 156,
    culturalValue: "Traditional craft passed down through generations",
    healthBenefits: ["Eco-friendly", "Chemical-free"],
    culturalSignificance: "Traditional craft passed down through generations",
    available: true,
  },
  {
    id: 4,
    name: "Woolen Winter Cap",
    category: "Textile",
    region: "Garhwal",
    description: "Locally handwoven winter wear using sheep wool, perfect for cold climates",
    image: "/traditional-woolen-cap-uttarakhand-colorful.jpg",
    rating: 4.6,
    reviews: 203,
    culturalValue: "Traditional winter wear of mountain communities",
    healthBenefits: ["Natural insulation", "Breathable fabric"],
    culturalSignificance: "Traditional winter wear of mountain communities",
    available: true,
  },
  {
    id: 5,
    name: "Tejpatta (Bay Leaves)",
    category: "Agricultural",
    region: "Garhwal Himalayas",
    description: "Aromatic bay leaves with medicinal properties, organically grown",
    image: "/placeholder.svg?key=tejpat",
    rating: 4.5,
    reviews: 78,
    culturalValue: "Used in traditional cooking and Ayurvedic medicine",
    healthBenefits: ["Digestive aid", "Anti-inflammatory", "Antioxidant properties"],
    culturalSignificance: "Used in traditional cooking and Ayurvedic medicine",
    available: true,
  },
  {
    id: 6,
    name: "Chyura Oil",
    category: "Agricultural",
    region: "Mid-hills of Uttarakhand",
    description: "Cold-pressed oil from Chyura seeds, rich in nutrients",
    image: "/placeholder.svg?key=chyura",
    rating: 4.4,
    reviews: 92,
    culturalValue: "Traditional oil used for cooking and skincare",
    healthBenefits: ["Heart healthy", "Rich in omega fatty acids", "Natural moisturizer"],
    culturalSignificance: "Traditional oil used for cooking and skincare",
    available: false,
  },
  {
    id: 7,
    name: "Bhotia Dani Weave",
    category: "Textile",
    region: "Pithoragarh",
    description: "Traditional woolen fabric with intricate patterns, handwoven by Bhotia community",
    image: "/placeholder.svg?key=bhotia",
    rating: 4.8,
    reviews: 45,
    culturalValue: "Signature craft of Bhotia tribal community",
    healthBenefits: ["Natural wool benefits", "Temperature regulation"],
    culturalSignificance: "Signature craft of Bhotia tribal community",
    available: true,
  },
  {
    id: 8,
    name: "Jhangora (Barnyard Millet)",
    category: "Agricultural",
    region: "Hill regions of Uttarakhand",
    description: "Nutritious millet grain, diabetic-friendly and gluten-free",
    image: "/placeholder.svg?key=jhangora",
    rating: 4.3,
    reviews: 167,
    culturalValue: "Traditional grain crop of hill communities",
    healthBenefits: ["Gluten-free", "Low glycemic index", "High fiber content"],
    culturalSignificance: "Traditional grain crop of hill communities",
    available: true,
  },
]

const categories = ["All", "Agricultural", "Handicraft", "Textile"]
const regions = [
  "All Regions",
  "Kumaon Region",
  "Garhwal",
  "Pithoragarh District",
  "Uttarkashi",
  "Garhwal Himalayas",
  "Mid-hills",
  "Hill regions",
]
const sortOptions = ["Featured", "Cultural Significance", "Health Benefits", "Rating", "Newest"]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [sortBy, setSortBy] = useState("Featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.region.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      const matchesRegion = selectedRegion === "All Regions" || product.region.includes(selectedRegion)

      return matchesSearch && matchesCategory && matchesRegion
    })

    // Sort products based on cultural and educational value
    switch (sortBy) {
      case "Cultural Significance":
        filtered.sort((a, b) => b.rating - a.rating) // Use rating as proxy for cultural significance
        break
      case "Health Benefits":
        filtered.sort((a, b) => b.healthBenefits.length - a.healthBenefits.length)
        break
      case "Rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "Newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // Featured - keep original order
        break
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedRegion, sortBy])

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
            cultural heritage, and artisan craftsmanship
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
                    setSelectedRegion("All Regions")
                    setSortBy("Featured")
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
                    placeholder="Search by name, region, or cultural significance..."
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
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
                    className="w-full justify-start bg-transparent"
                    onClick={() => setSelectedCategory("Handicraft")}
                  >
                    Traditional Handicrafts
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setSelectedCategory("Agricultural")}
                  >
                    Heritage Food Products
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
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
                <p className="text-muted-foreground">{filteredProducts.length} heritage products found</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
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
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-0">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={product.image || "/placeholder.svg"}
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
                            <Badge variant="outline" className="text-xs bg-white/90">
                              Learning Only
                            </Badge>
                          )}
                          <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white h-8 w-8 p-0">
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
                            <span className="text-xs text-muted-foreground ml-1">({product.reviews} reviews)</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Cultural Heritage
                          </Badge>
                        </div>
                        <Link href={`/products/${product.id}`}>
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
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={product.image || "/placeholder.svg"}
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
                                <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
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
                              <Link href={`/products/${product.id}`}>
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

            {filteredProducts.length === 0 && (
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
                      setSelectedRegion("All Regions")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
