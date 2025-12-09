"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, MapPin, Star, Search, BookOpen, Award, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function WorkshopsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const workshops = [
    {
      id: 1,
      title: "Traditional Aipan Art Workshop",
      instructor: "Meera Bisht",
      instructorImage: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
      category: "Art & Craft",
      duration: "3 days",
      maxParticipants: 12,
      rating: 4.9,
      reviews: 45,
      location: "Almora, Uttarakhand",
      startDate: "Nov 15, 2025",
      description: "Learn the sacred art of Aipan with traditional techniques and patterns",
      image: "/aipan-art-traditional-patterns-geometric.jpg",
      highlights: [
        "Traditional geometric patterns",
        "Rice paste preparation",
        "Sacred symbolism understanding",
        "Hands-on practice sessions"
      ],
      available: true
    },
    {
      id: 2,
      title: "Organic Farming Techniques",
      instructor: "Rajesh Negi",
      instructorImage: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
      category: "Agriculture",
      duration: "2 days",
      maxParticipants: 15,
      rating: 4.8,
      reviews: 38,
      location: "Munsiyari, Pithoragarh",
      startDate: "Nov 20, 2025",
      description: "Learn traditional organic farming methods used in high-altitude regions",
      image: "/munsiyari-rajma-kidney-beans-red.jpg",
      highlights: [
        "Seed preservation techniques",
        "High-altitude farming",
        "Organic pest control",
        "Traditional crop rotation"
      ],
      available: true
    },
    {
      id: 3,
      title: "Traditional Textile Weaving",
      instructor: "Kamla Devi",
      instructorImage: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
      category: "Textile",
      duration: "5 days",
      maxParticipants: 10,
      rating: 4.7,
      reviews: 32,
      location: "Kumaon Region",
      startDate: "Dec 1, 2025",
      description: "Master traditional handloom weaving techniques and create authentic textiles",
      image: "/traditional-woolen-cap-uttarakhand-colorful.jpg",
      highlights: [
        "Handloom setup and operation",
        "Natural dye preparation",
        "Traditional patterns",
        "Complete textile creation"
      ],
      available: true
    },
    {
      id: 4,
      title: "Ringaal Bamboo Craft Workshop",
      instructor: "Suresh Chandola",
      instructorImage: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
      category: "Art & Craft",
      duration: "4 days",
      maxParticipants: 12,
      rating: 4.6,
      reviews: 28,
      location: "Garhwal, Uttarakhand",
      startDate: "Dec 10, 2025",
      description: "Learn the ancient art of Ringaal bamboo weaving and basket making",
      image: "/ringaal-bamboo-craft-basket-traditional.jpg",
      highlights: [
        "Bamboo selection and preparation",
        "Traditional weaving patterns",
        "Basket and utility items",
        "Sustainable harvesting"
      ],
      available: true
    }
  ]

  const categories = ["All", "Art & Craft", "Agriculture", "Textile", "Culinary"]

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         workshop.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || workshop.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <div className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold mb-4">
            Heritage Workshops & Training
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Learn traditional crafts, farming techniques, and cultural practices directly from master artisans
            of Uttarakhand. Preserve and practice ancient knowledge with hands-on training.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workshops or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-64">
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{workshops.length}</p>
              <p className="text-sm text-muted-foreground">Active Workshops</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground">Participants</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">15+</p>
              <p className="text-sm text-muted-foreground">Master Artisans</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Workshops Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredWorkshops.map((workshop) => (
            <Card key={workshop.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={workshop.image}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {workshop.category}
                    </Badge>
                    {workshop.available && (
                      <Badge variant="default" className="text-xs">
                        Available
                      </Badge>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="absolute top-2 left-2 bg-white hover:bg-gray-100 h-8 w-8 p-0"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Image
                      src={workshop.instructorImage}
                      alt={workshop.instructor}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium">{workshop.instructor}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{workshop.rating}</span>
                        <span className="text-xs text-muted-foreground">({workshop.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {workshop.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    {workshop.highlights.slice(0, 2).map((highlight, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                        <p className="text-xs text-muted-foreground">{highlight}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{workshop.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Max {workshop.maxParticipants}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{workshop.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs">{workshop.startDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">
                        Free cultural education workshop supported by local artisans
                      </p>
                    </div>
                    <Link href={`/contact?workshop=${workshop.id}`}>
                      <Button>
                        Express Interest
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWorkshops.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No workshops found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <Card className="mt-12 bg-muted">
          <CardHeader>
            <CardTitle>Become a Workshop Instructor</CardTitle>
            <CardDescription>
              Are you a master artisan? Share your traditional knowledge and skills with enthusiasts
              from around the world.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/contact?type=instructor">
              <Button>Apply as Instructor</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
