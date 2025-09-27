"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Heart, Search, Filter, MapPin, Clock, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LearningPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [savedItems, setSavedItems] = useState([
    {
      id: 1,
      name: "Aipan Art Techniques",
      type: "Cultural Learning",
      region: "Kumaon Region",
      description: "Learn the sacred geometric patterns and traditional techniques of Aipan art",
      image: "/aipan-art-traditional-patterns-geometric.jpg",
      progress: 75,
      timeToComplete: "2 hours",
      difficulty: "Intermediate",
      culturalValue: "Sacred art form used in festivals and ceremonies",
      addedDate: "2024-01-10",
    },
    {
      id: 2,
      name: "Munsiyari Rajma Cultivation",
      type: "Agricultural Heritage",
      region: "Pithoragarh District",
      description:
        "Understand the traditional farming methods and cultural significance of high-altitude bean cultivation",
      image: "/munsiyari-rajma-kidney-beans-red.jpg",
      progress: 40,
      timeToComplete: "1.5 hours",
      difficulty: "Beginner",
      culturalValue: "Traditional staple food of Kumaon region",
      addedDate: "2024-01-08",
    },
    {
      id: 3,
      name: "Ringaal Bamboo Crafting",
      type: "Handicraft Tradition",
      region: "Uttarkashi",
      description: "Master the art of weaving baskets and containers from Ringaal bamboo",
      image: "/ringaal-bamboo-craft-basket-traditional.jpg",
      progress: 90,
      timeToComplete: "3 hours",
      difficulty: "Advanced",
      culturalValue: "Traditional craft passed down through generations",
      addedDate: "2024-01-05",
    },
  ])

  const removeFromLearning = (id: number) => {
    setSavedItems((items) => items.filter((item) => item.id !== id))
  }

  const filteredItems = savedItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (savedItems.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-muted/50 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-serif font-bold mb-4">Your Learning Journey Awaits</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Save cultural heritage topics and traditional crafts to create your personalized learning path
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Explore Heritage Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">My Cultural Learning Journey</h1>
            <p className="text-muted-foreground">
              {savedItems.length} heritage topics saved • Continue your cultural exploration
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Button variant="outline">
              <Award className="h-4 w-4 mr-2" />
              View Achievements
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter Topics
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your learning topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Learning Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="bg-white/80 hover:bg-white h-8 w-8 p-0"
                      onClick={() => removeFromLearning(item.id)}
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <div className="flex items-center justify-between text-white text-xs mb-1">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <div
                        className="bg-white rounded-full h-1 transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-2 text-balance">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 mr-1" />
                    {item.region}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.timeToComplete}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" size="sm">
                      {item.progress === 100 ? "Review" : item.progress > 0 ? "Continue Learning" : "Start Learning"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">Added {item.addedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No learning topics found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or explore more heritage products</p>
          </div>
        )}

        {/* Learning Progress Summary */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Learning Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{savedItems.length}</p>
                <p className="text-sm text-muted-foreground">Topics Saved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(savedItems.reduce((sum, item) => sum + item.progress, 0) / savedItems.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Average Progress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {savedItems.filter((item) => item.progress === 100).length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {savedItems.filter((item) => item.progress > 0 && item.progress < 100).length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
