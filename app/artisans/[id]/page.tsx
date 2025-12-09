"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Calendar,
  Award,
  Star,
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronLeft,
  Users,
  Leaf,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

// Sample detailed artisan data
const artisanDetails = {
  1: {
    id: 1,
    name: "Kamala Devi",
    craft: "Aipan Art",
    location: "Almora District, Kumaon",
    experience: "30+ years",
    specialization: "Traditional geometric patterns and festival decorations",
    story:
      "Kamala Devi learned the sacred art of Aipan from her grandmother when she was just 12 years old. Over three decades, she has mastered the intricate geometric patterns that hold deep spiritual significance in Kumaoni culture. She has dedicated her life to preserving this traditional art form and has trained over 50 women in her community, ensuring that this beautiful tradition continues to thrive. Her work has been featured in cultural exhibitions across India and has helped bring recognition to Uttarakhand's rich artistic heritage.",
    image: "/placeholder.svg?key=kamala-profile",
    gallery: [
      "/placeholder.svg?key=kamala1",
      "/placeholder.svg?key=kamala2",
      "/placeholder.svg?key=kamala3",
      "/placeholder.svg?key=kamala4",
    ],
    rating: 4.9,
    reviews: 89,
  productsCount: 12,
    achievements: [
      "Master Craftsperson Award 2020",
      "Cultural Heritage Preserver",
      "Community Teacher",
      "Featured in National Art Exhibition",
      "UNESCO Cultural Ambassador",
    ],
    contact: {
      phone: "+91 9876543210",
      email: "kamala.aipan@example.com",
    },
    socialImpact: {
      womenTrained: 50,
      familiesSupported: 15,
      yearsActive: 30,
      communityProjects: 8,
    },
    techniques: [
      "Traditional rice paste preparation",
      "Sacred geometric pattern design",
      "Natural ochre color mixing",
      "Festival decoration creation",
      "Spiritual symbolism interpretation",
    ],
    // products removed (e-commerce) – retained cultural/workshop focus
    workshops: [
      {
        title: "Introduction to Aipan Art",
        duration: "2 days",
        price: "₹1,500",
        nextDate: "March 15, 2025",
      },
      {
        title: "Advanced Pattern Techniques",
        duration: "3 days",
        price: "₹2,500",
        nextDate: "April 10, 2025",
      },
    ],
  },
}

export default function ArtisanProfilePage() {
  const params = useParams()
  const artisanId = Number.parseInt(params.id as string)
  const artisan = artisanDetails[artisanId as keyof typeof artisanDetails]

  if (!artisan) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Artisan Not Found</h1>
          <Link href="/artisans">
            <Button>Back to Artisans</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/artisans" className="text-muted-foreground hover:text-foreground">
              Artisans
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{artisan.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/artisans" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Artisans
        </Link>

        {/* Profile Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-48 h-48 mx-auto md:mx-0 overflow-hidden rounded-lg">
                <Image
                  src={artisan.image || "/placeholder.svg"}
                  alt={artisan.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
                  <h1 className="text-3xl font-serif font-bold">{artisan.name}</h1>
                  <Badge className="bg-black text-white border-0 w-fit mx-auto md:mx-0">Master Artisan</Badge>
                </div>
                <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {artisan.location}
                </div>
                <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  {artisan.experience} of experience in {artisan.craft}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold">{artisan.rating}</span>
                    <span className="text-muted-foreground ml-1">({artisan.reviews} reviews)</span>
                  </div>
                  <span className="text-muted-foreground">{artisan.productsCount} works</span>
                </div>
                <p className="text-muted-foreground mb-6 text-pretty">{artisan.specialization}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Button className="bg-black text-white hover:bg-blue-500 hover:text-black">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Products
                  </Button>
                  <Button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Impact & Achievements</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Women Trained</span>
                    <span className="font-semibold">{artisan.socialImpact.womenTrained}+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Families Supported</span>
                    <span className="font-semibold">{artisan.socialImpact.familiesSupported}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Years Active</span>
                    <span className="font-semibold">{artisan.socialImpact.yearsActive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Community Projects</span>
                    <span className="font-semibold">{artisan.socialImpact.communityProjects}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                    <span className="text-sm">{artisan.contact.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-3" />
                    <span className="text-sm">{artisan.contact.email}</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-black text-white hover:bg-blue-500 hover:text-black border border-input">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
            <TabsTrigger value="workshops">Workshops</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <TabsContent value="story" className="mt-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Artisan's Journey</h3>
                <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">{artisan.story}</p>

                <h4 className="font-semibold mb-3">Achievements & Recognition</h4>
                <div className="space-y-2">
                  {artisan.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center">
                      <Award className="h-4 w-4 text-amber-600 mr-3" />
                      <span className="text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Cultural Impact</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="text-center border-0 bg-blue-50">
                    <CardContent className="p-4">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{artisan.socialImpact.womenTrained}+</div>
                      <div className="text-sm text-blue-700">Women Trained</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center border-0 bg-green-50">
                    <CardContent className="p-4">
                      <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{artisan.socialImpact.yearsActive}</div>
                      <div className="text-sm text-green-700">Years Active</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-800 mb-2">Community Contribution</h4>
                  <p className="text-amber-700 text-sm text-pretty">
                    Through her dedication to teaching and preserving traditional art forms,
                    {artisan.name} has become a pillar of cultural preservation in her community, ensuring that ancient
                    techniques continue to thrive in the modern world.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="techniques" className="mt-8">
            <div className="max-w-4xl">
              <h3 className="text-xl font-semibold mb-6">Traditional Techniques & Skills</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {artisan.techniques.map((technique, index) => (
                  <Card key={index} className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-200 p-2 rounded-lg">
                          <Award className="h-5 w-5 text-purple-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800 mb-2">{technique}</h4>
                          <p className="text-purple-700 text-sm">
                            Master-level expertise in this traditional technique, passed down through generations of
                            skilled artisans.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h4 className="font-semibold mb-3">Learning & Teaching Philosophy</h4>
                <p className="text-muted-foreground text-pretty">
                  "Traditional art is not just about creating beautiful objects - it's about preserving our cultural
                  soul and passing on the wisdom of our ancestors. Every pattern tells a story, every color has meaning,
                  and every technique connects us to our heritage."
                </p>
                <div className="text-right mt-2">
                  <span className="text-sm font-medium">- {artisan.name}</span>
                </div>
              </div>
            </div>
          </TabsContent>


          <TabsContent value="workshops" className="mt-8">
            <div className="max-w-4xl">
              <h3 className="text-xl font-semibold mb-6">Learning Workshops</h3>
              <div className="space-y-6">
                {artisan.workshops.map((workshop, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-4 md:mb-0">
                          <h4 className="text-lg font-semibold mb-2">{workshop.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Duration: {workshop.duration}</span>
                            <span>Next Date: {workshop.nextDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary mb-2">{workshop.price}</div>
                          <Button>Book Workshop</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Workshop Benefits</h4>
                <ul className="space-y-2 text-blue-700">
                  <li>• Learn authentic traditional techniques</li>
                  <li>• Hands-on experience with master artisan</li>
                  <li>• Take home your own creations</li>
                  <li>• Certificate of completion</li>
                  <li>• Cultural context and historical significance</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-8">
            <div className="max-w-6xl">
              <h3 className="text-xl font-semibold mb-6">Work Gallery</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artisan.gallery.map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${artisan.name} work ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
