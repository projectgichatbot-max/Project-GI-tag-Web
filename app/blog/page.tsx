import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Search, BookOpen, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "The Ancient Art of Aipan: Sacred Geometry in Uttarakhand Culture",
    excerpt:
      "Discover the spiritual significance and mathematical precision behind Aipan art, a traditional floor painting practice that connects generations.",
    content:
      "Aipan art represents more than decoration—it's a sacred practice that has preserved mathematical concepts and spiritual beliefs for centuries...",
    author: "Dr. Meera Bisht",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Traditional Arts",
    tags: ["Aipan", "Sacred Art", "Cultural Heritage", "Mathematics"],
    image: "/aipan-art-traditional-patterns-geometric.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Munsiyari Rajma: The Himalayan Superfood with Ancient Roots",
    excerpt:
      "Explore the nutritional powerhouse that has sustained mountain communities for generations and its role in sustainable agriculture.",
    content:
      "High in the Himalayas, where the air is thin and the soil is rich, grows a remarkable legume that has been the backbone of mountain nutrition...",
    author: "Rajesh Negi",
    date: "2024-01-12",
    readTime: "6 min read",
    category: "Agriculture & Nutrition",
    tags: ["Munsiyari Rajma", "Superfood", "Sustainable Farming", "Health"],
    image: "/munsiyari-rajma-kidney-beans-red.jpg",
    featured: true,
  },
  {
    id: 3,
    title: "Ringaal Craft: Weaving Sustainability from Himalayan Bamboo",
    excerpt:
      "Learn how artisans transform mountain bamboo into beautiful, eco-friendly products that support both culture and environment.",
    content:
      "In the misty forests of Uttarakhand, a special type of bamboo called Ringaal grows naturally, providing the raw material for an ancient craft...",
    author: "Sunita Rawat",
    date: "2024-01-10",
    readTime: "7 min read",
    category: "Handicrafts",
    tags: ["Ringaal", "Bamboo Craft", "Sustainability", "Eco-friendly"],
    image: "/traditional-woolen-caps-coats-uttarakhand-winter-w.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "The Science Behind GI Tagging: Protecting Cultural Identity",
    excerpt:
      "Understanding how Geographical Indication certification preserves traditional knowledge and supports local communities.",
    content:
      "Geographical Indication (GI) tagging is more than a certification—it's a powerful tool for cultural and economic preservation...",
    author: "Prof. Anand Sharma",
    date: "2024-01-08",
    readTime: "10 min read",
    category: "GI Knowledge",
    tags: ["GI Certification", "Cultural Protection", "Legal Framework", "Heritage"],
    image: "/uttarakhand-mountains-landscape-sunrise-golden-hou.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Voices from the Mountains: Artisan Stories of Resilience",
    excerpt:
      "Meet the master craftspeople who are keeping traditional skills alive in the face of modernization challenges.",
    content:
      "Behind every GI-tagged product is a human story of dedication, skill, and cultural pride. These are the voices of Uttarakhand's artisans...",
    author: "Kavita Joshi",
    date: "2024-01-05",
    readTime: "12 min read",
    category: "Artisan Stories",
    tags: ["Artisan Interviews", "Cultural Preservation", "Traditional Skills", "Community"],
    image: "/uttarakhand-artisan-working-traditional-craft-work.jpg",
    featured: false,
  },
]

const categories = [
  "All",
  "Traditional Arts",
  "Agriculture & Nutrition",
  "Handicrafts",
  "GI Knowledge",
  "Artisan Stories",
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Cultural Heritage Blog</h1>
            <p className="text-xl text-amber-100 text-balance">
              Stories, insights, and knowledge about Uttarakhand's GI-tagged treasures
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search articles about GI products, culture, artisans..." className="pl-10 h-12" />
            </div>
            <Select>
              <SelectTrigger className="w-full md:w-48 h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="h-12 px-8 bg-amber-600 hover:bg-amber-700">Search</Button>
          </div>
        </div>

        {/* Featured Articles */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Stories</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts
              .filter((post) => post.featured)
              .map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black text-white border-0">{post.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-balance">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 text-pretty">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <Link href={`/blog/${post.id}`}>
                        <Button variant="outline" className="group bg-black text-white hover:bg-blue-500 hover:text-black">
                          Read More
                          <BookOpen className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* All Articles */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest Articles</h2>
          <div className="space-y-6">
            {blogPosts
              .filter((post) => !post.featured)
              .map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                    <CardContent className="md:w-2/3 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{post.category}</Badge>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 text-balance">{post.title}</h3>
                      <p className="text-muted-foreground mb-4 text-pretty">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </div>
                        </div>
                        <Link href={`/blog/${post.id}`}>
                          <Button variant="outline" size="sm">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-2xl mx-auto mt-16">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Connected with Heritage</h3>
              <p className="text-muted-foreground mb-6">
                Get weekly insights about Uttarakhand's cultural treasures, artisan stories, and GI product updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input placeholder="Enter your email" className="flex-1" />
                <Button className="bg-amber-600 hover:bg-amber-700">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
