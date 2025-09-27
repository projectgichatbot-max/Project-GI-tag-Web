"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Award, Calendar, Users, Heart, Star, Filter, Grid, List } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Sample artisan data
const artisans = [
  {
    id: 1,
    name: "Kamala Devi",
    craft: "Aipan Art",
    location: "Almora District, Kumaon",
    experience: "30+ years",
    specialization: "Traditional geometric patterns and festival decorations",
    story:
      "Master artist who learned this traditional art from her grandmother and now teaches it to preserve the cultural heritage. She has trained over 50 women in the community.",
    image: "/placeholder.svg?key=kamala",
    rating: 4.9,
    reviews: 89,
    products: 12,
    achievements: ["Master Craftsperson Award 2020", "Cultural Heritage Preserver", "Community Teacher"],
    contact: {
      phone: "+91 9876543210",
      email: "kamala.aipan@example.com",
    },
    socialImpact: "Trained 50+ women, Preserved traditional techniques",
    featured: true,
  },
  {
    id: 2,
    name: "Devi Singh Collective",
    craft: "Organic Farming",
    location: "Munsiyari Village, Pithoragarh",
    experience: "25+ years",
    specialization: "High-altitude organic Rajma cultivation",
    story:
      "A collective of 15 farming families who have been growing Rajma using traditional methods for generations. They maintain seed purity and organic practices.",
    image: "/placeholder.svg?key=devi-singh",
    rating: 4.8,
    reviews: 124,
    products: 8,
    achievements: ["Organic Certification", "Best Farmer Group 2021", "Seed Conservation Award"],
    contact: {
      phone: "+91 9876543211",
      email: "devisingh.collective@example.com",
    },
    socialImpact: "15 families supported, Organic farming promotion",
    featured: true,
  },
  {
    id: 3,
    name: "Mohan Lal Bisht",
    craft: "Ringaal Craft",
    location: "Uttarkashi, Garhwal",
    experience: "35+ years",
    specialization: "Traditional bamboo weaving and basket making",
    story:
      "Third-generation Ringaal craftsman who has innovated traditional designs while maintaining authenticity. He leads a cooperative of 20 artisans.",
    image: "/placeholder.svg?key=mohan-lal",
    rating: 4.7,
    reviews: 156,
    products: 15,
    achievements: ["Innovation in Traditional Craft", "Cooperative Leader", "Export Quality Certification"],
    contact: {
      phone: "+91 9876543212",
      email: "mohan.ringaal@example.com",
    },
    socialImpact: "20 artisans employed, Traditional innovation",
    featured: false,
  },
  {
    id: 4,
    name: "Sunita Rawat",
    craft: "Woolen Textiles",
    location: "Chamoli, Garhwal",
    experience: "20+ years",
    specialization: "Hand-spun woolen caps and traditional winter wear",
    story:
      "Expert in traditional wool processing and weaving techniques. She has revived ancient patterns and colors used by mountain communities.",
    image: "/placeholder.svg?key=sunita",
    rating: 4.6,
    reviews: 203,
    products: 18,
    achievements: ["Traditional Pattern Revival", "Women Empowerment Leader", "Quality Excellence Award"],
    contact: {
      phone: "+91 9876543213",
      email: "sunita.wool@example.com",
    },
    socialImpact: "Women's cooperative leader, Pattern preservation",
    featured: false,
  },
  {
    id: 5,
    name: "Bhotia Weaving Collective",
    craft: "Bhotia Dani Weave",
    location: "Pithoragarh, Kumaon",
    experience: "40+ years",
    specialization: "Traditional tribal weaving patterns",
    story:
      "A community collective preserving the unique weaving traditions of the Bhotia tribe. They maintain traditional looms and natural dyeing techniques.",
    image: "/placeholder.svg?key=bhotia",
    rating: 4.8,
    reviews: 45,
    products: 10,
    achievements: ["Tribal Heritage Preservation", "Natural Dyeing Expertise", "Community Collective Award"],
    contact: {
      phone: "+91 9876543214",
      email: "bhotia.weave@example.com",
    },
    socialImpact: "Tribal tradition preservation, Natural techniques",
    featured: true,
  },
  {
    id: 6,
    name: "Ram Singh Negi",
    craft: "Herbal Products",
    location: "Tehri Garhwal",
    experience: "28+ years",
    specialization: "Traditional herbal oils and medicinal products",
    story:
      "Traditional healer and herbalist who processes mountain herbs using ancient techniques. He maintains a medicinal plant garden and teaches sustainable harvesting.",
    image: "/placeholder.svg?key=ram-singh",
    rating: 4.5,
    reviews: 78,
    products: 14,
    achievements: ["Traditional Medicine Expert", "Sustainable Harvesting", "Medicinal Garden Maintainer"],
    contact: {
      phone: "+91 9876543215",
      email: "ramsingh.herbs@example.com",
    },
    socialImpact: "Medicinal knowledge preservation, Sustainable practices",
    featured: false,
  },
]

const crafts = [
  "All Crafts",
  "Aipan Art",
  "Organic Farming",
  "Ringaal Craft",
  "Woolen Textiles",
  "Bhotia Dani Weave",
  "Herbal Products",
]
const locations = [
  "All Locations",
  "Almora District",
  "Munsiyari Village",
  "Uttarkashi",
  "Chamoli",
  "Pithoragarh",
  "Tehri Garhwal",
]
const sortOptions = ["Featured", "Experience", "Rating", "Most Products", "Alphabetical"]

export default function ArtisansPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCraft, setSelectedCraft] = useState("All Crafts")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [sortBy, setSortBy] = useState("Featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  const filteredArtisans = artisans.filter((artisan) => {
    const matchesSearch =
      artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artisan.specialization.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCraft = selectedCraft === "All Crafts" || artisan.craft === selectedCraft
    const matchesLocation = selectedLocation === "All Locations" || artisan.location.includes(selectedLocation)

    return matchesSearch && matchesCraft && matchesLocation
  })

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Badge className="mb-4 bg-amber-100 text-amber-800">Meet Our Artisans</Badge>
            <h1 className="text-4xl font-serif font-bold mb-4 text-balance">The Master Craftspeople of Uttarakhand</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover the talented artisans who preserve traditional crafts and create authentic GI-tagged products
              with generations of inherited knowledge and skill.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-card rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCraft("All Crafts")
                    setSelectedLocation("All Locations")
                    setSortBy("Featured")
                  }}
                >
                  Clear All
                </Button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Search Artisans</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, craft, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Craft Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Craft Specialization</label>
                <Select value={selectedCraft} onValueChange={setSelectedCraft}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {crafts.map((craft) => (
                      <SelectItem key={craft} value={craft}>
                        {craft}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Filters */}
              <div>
                <label className="text-sm font-medium mb-2 block">Quick Filters</label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setSortBy("Featured")}
                  >
                    Featured Artisans
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setSelectedCraft("Aipan Art")}
                  >
                    Traditional Artists
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setSelectedCraft("Organic Farming")}
                  >
                    Organic Farmers
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
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <p className="text-muted-foreground">{filteredArtisans.length} artisans found</p>
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

            {/* Featured Artisans Banner */}
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Featured Master Artisans</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {artisans
                  .filter((a) => a.featured)
                  .slice(0, 3)
                  .map((artisan) => (
                    <Card
                      key={artisan.id}
                      className="group hover:shadow-lg transition-all duration-300 border-2 border-primary/20"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 overflow-hidden rounded-full">
                            <Image
                              src={artisan.image || "/placeholder.svg"}
                              alt={artisan.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{artisan.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{artisan.craft}</p>
                          </div>
                          <Badge className="bg-primary/10 text-primary">Featured</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Artisans Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredArtisans.map((artisan) => (
                  <Card key={artisan.id} className="group hover:shadow-lg transition-all duration-300 border-0">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <Image
                          src={artisan.image || "/placeholder.svg"}
                          alt={artisan.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="text-xs">
                            {artisan.craft}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2">
                          {artisan.featured && <Badge className="bg-primary text-xs">Featured</Badge>}
                          <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white h-8 w-8 p-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-1 text-balance">{artisan.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {artisan.location}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Calendar className="h-3 w-3 mr-1" />
                          {artisan.experience} experience
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 text-pretty">
                          {artisan.specialization}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm ml-1">{artisan.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">({artisan.reviews})</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{artisan.products} products</span>
                        </div>
                        <Link href={`/artisans/${artisan.id}`}>
                          <Button className="w-full">View Profile</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredArtisans.map((artisan) => (
                  <Card key={artisan.id} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={artisan.image || "/placeholder.svg"}
                            alt={artisan.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold">{artisan.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {artisan.craft}
                                </Badge>
                                {artisan.featured && <Badge className="bg-primary text-xs">Featured</Badge>}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mb-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {artisan.location}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <Calendar className="h-3 w-3 mr-1" />
                                {artisan.experience} experience
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center mb-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm ml-1">{artisan.rating}</span>
                                <span className="text-xs text-muted-foreground ml-1">({artisan.reviews})</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{artisan.products} products</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3 text-pretty">{artisan.specialization}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {artisan.achievements.slice(0, 2).map((achievement, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Award className="h-3 w-3 mr-1" />
                                  {achievement}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Link href={`/artisans/${artisan.id}`}>
                                <Button size="sm">View Profile</Button>
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

            {filteredArtisans.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No artisans found</h3>
                  <p className="text-muted-foreground mb-4 text-pretty">
                    Try adjusting your search criteria or filters to find artisans.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCraft("All Crafts")
                      setSelectedLocation("All Locations")
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

      {/* Support Artisans Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4 text-balance">Support Our Artisan Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Your support helps preserve traditional crafts and provides sustainable livelihoods to artisan families
              across Uttarakhand.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0">
              <CardContent className="p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Direct Support</h3>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Purchase directly from artisans, ensuring fair prices and sustainable income for their families.
                </p>
                <Button variant="outline">Shop Products</Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0">
              <CardContent className="p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Skill Development</h3>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Support training programs that help artisans improve their skills and reach new markets.
                </p>
                <Button variant="outline">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0">
              <CardContent className="p-6">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cultural Preservation</h3>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Help preserve traditional knowledge and techniques for future generations.
                </p>
                <Button variant="outline">Get Involved</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
