"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { User, Heart, ShoppingBag, MapPin, Calendar, Award, Edit, Settings, Bell, Download, Share2 } from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock user data
  const user = {
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "March 2024",
    location: "Delhi, India",
    culturalInterests: ["Handicrafts", "Traditional Art", "Organic Foods"],
    membershipLevel: "Heritage Explorer",
    points: 1250,
    nextLevelPoints: 2000,
  }

  const recentOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      items: ["Munsiyari Rajma (2kg)", "Aipan Art Canvas"],
      total: "₹1,850",
      status: "Delivered",
      artisan: "Kamala Devi",
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      items: ["Ringaal Craft Basket", "Woolen Winter Cap"],
      total: "₹2,200",
      status: "In Transit",
      artisan: "Mohan Singh",
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      items: ["Tejpat (Bay Leaves) 500g"],
      total: "₹450",
      status: "Delivered",
      artisan: "Sunita Bisht",
    },
  ]

  const wishlistItems = [
    {
      id: 1,
      name: "Bhotia Dani Weave Shawl",
      price: "₹3,500",
      image: "/placeholder.svg?height=200&width=200",
      artisan: "Laxmi Devi",
      region: "Pithoragarh",
      inStock: true,
    },
    {
      id: 2,
      name: "Traditional Copper Utensils Set",
      price: "₹2,800",
      image: "/placeholder.svg?height=200&width=200",
      artisan: "Ram Prasad",
      region: "Almora",
      inStock: false,
    },
    {
      id: 3,
      name: "Himalayan Honey (1kg)",
      price: "₹1,200",
      image: "/placeholder.svg?height=200&width=200",
      artisan: "Bee Keepers Collective",
      region: "Chamoli",
      inStock: true,
    },
  ]

  const culturalJourney = [
    {
      achievement: "First GI Product Purchase",
      date: "March 2024",
      description: "Purchased authentic Munsiyari Rajma",
      points: 100,
    },
    {
      achievement: "Artisan Connection",
      date: "March 2024",
      description: "Connected with 3 local artisans",
      points: 150,
    },
    {
      achievement: "Cultural Explorer",
      date: "April 2024",
      description: "Explored 5 different product categories",
      points: 200,
    },
    {
      achievement: "Heritage Supporter",
      date: "May 2024",
      description: "Supported 10+ artisan families",
      points: 300,
    },
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-serif font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
              <p className="text-muted-foreground">
                {user.membershipLevel} • Member since {user.joinDate}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wishlist Items</p>
                  <p className="text-2xl font-bold">{wishlistItems.length}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Artisans Supported</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Heritage Points</p>
                  <p className="text-2xl font-bold">{user.points}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif">Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{order.id}</Badge>
                            <Badge
                              className={
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <p className="font-medium">{order.items.join(", ")}</p>
                          <p className="text-sm text-muted-foreground">
                            By {order.artisan} • {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{order.total}</p>
                          <Button size="sm" variant="ghost">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Heritage Progress */}
              <div>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif">Heritage Journey</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress to Heritage Guardian</span>
                        <span>
                          {user.points}/{user.nextLevelPoints}
                        </span>
                      </div>
                      <Progress value={(user.points / user.nextLevelPoints) * 100} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Cultural Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {user.culturalInterests.map((interest) => (
                          <Badge key={interest} variant="secondary">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline" className="w-full justify-start bg-transparent">
                          <Bell className="h-4 w-4 mr-2" />
                          Notifications (3)
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start bg-transparent">
                          <Download className="h-4 w-4 mr-2" />
                          Download Certificates
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start bg-transparent">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Journey
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Order History</CardTitle>
                <p className="text-muted-foreground">Track and manage your orders</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <Card key={order.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">{order.id}</Badge>
                            <Badge
                              className={
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "In Transit"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {order.date}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Items</h4>
                            <ul className="text-sm space-y-1">
                              {order.items.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Artisan</h4>
                            <p className="text-sm">{order.artisan}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Total</h4>
                            <p className="text-lg font-bold text-primary">{order.total}</p>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                          <Button size="sm" variant="outline">
                            Track Order
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact Artisan
                          </Button>
                          <Button size="sm">Reorder</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-serif">My Wishlist</CardTitle>
                <p className="text-muted-foreground">Save products you love for later</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="border hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative h-48 overflow-hidden rounded-t-lg">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          >
                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                          </Button>
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-red-600">Out of Stock</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold mb-2 text-balance">{item.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {item.region}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">By {item.artisan}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">{item.price}</span>
                            <Button size="sm" disabled={!item.inStock} className={!item.inStock ? "opacity-50" : ""}>
                              {item.inStock ? "Add to Cart" : "Notify Me"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="sm" variant="outline">
                      Change Photo
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-lg">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{user.location}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Member Since</label>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p>{user.joinDate}</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Edit Profile</Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-serif">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Cultural Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {user.culturalInterests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                      Edit Interests
                    </Button>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Notification Preferences</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">New Product Alerts</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Artisan Updates</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Order Updates</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Manage Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Cultural Heritage Journey</CardTitle>
                <p className="text-muted-foreground">Your achievements in supporting Uttarakhand's heritage</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {culturalJourney.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-muted rounded-lg">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{achievement.achievement}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {achievement.date}
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">+{achievement.points} points</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-primary/5 rounded-lg text-center">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Heritage Explorer</h3>
                  <p className="text-muted-foreground mb-4">
                    You're making a real difference in preserving Uttarakhand's cultural heritage!
                  </p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{user.points}</p>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">8</p>
                      <p className="text-sm text-muted-foreground">Artisans Supported</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">12</p>
                      <p className="text-sm text-muted-foreground">Products Purchased</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
