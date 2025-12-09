"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { User, MapPin, Calendar, Award, Edit, Settings, Bell, Share2, BookOpen } from "lucide-react"
import Image from "next/image"

/**
 * DashboardPage
 * Rewritten to remove all e‑commerce concepts (orders, wishlist, purchases, products)
 * and focus purely on cultural heritage learning & participation.
 */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock user profile (would come from session / DB later)
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

  const learningMilestones = [
    { id: "M-001", date: "2024-01-15", topics: ["Aipan Art Basics", "High Altitude Crops"], hours: 2.5, status: "Completed", mentor: "Kamala Devi" },
    { id: "M-002", date: "2024-01-10", topics: ["Ringaal Craft History", "Traditional Bamboo Uses"], hours: 1.75, status: "In Progress", mentor: "Mohan Singh" },
    { id: "M-003", date: "2024-01-05", topics: ["Medicinal Plants Overview"], hours: 1.2, status: "Completed", mentor: "Sunita Bisht" },
  ]

  const savedItems = [
    { id: 1, name: "Bhotia Dani Weave Pattern Study", note: "Research geometric symmetry", image: "/placeholder.svg?height=200&width=200", mentor: "Laxmi Devi", region: "Pithoragarh", available: true },
    { id: 2, name: "Traditional Copper Craft Techniques", note: "Document process variations", image: "/placeholder.svg?height=200&width=200", mentor: "Ram Prasad", region: "Almora", available: false },
    { id: 3, name: "Himalayan Honey Ecology Notes", note: "Compare pollen diversity", image: "/placeholder.svg?height=200&width=200", mentor: "Bee Keepers Collective", region: "Chamoli", available: true },
  ]

  const culturalJourney = [
    { achievement: "First Heritage Topic Completed", date: "March 2024", description: "Finished module on Munsiyari Rajma agricultural heritage", points: 100 },
    { achievement: "Artisan Connection", date: "March 2024", description: "Connected with 3 local artisans", points: 150 },
    { achievement: "Cultural Explorer", date: "April 2024", description: "Explored 5 distinct heritage domains", points: 200 },
    { achievement: "Heritage Supporter", date: "May 2024", description: "Supported 10+ artisan families' visibility", points: 300 },
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
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Learning Sessions</p>
                  <p className="text-2xl font-bold">{learningMilestones.length}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saved Topics</p>
                  <p className="text-2xl font-bold">{savedItems.length}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Artisans Connected</p>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <User className="h-6 w-6 text-primary" />
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
                <div className="bg-primary/10 p-3 rounded-full">
                  <Award className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-serif">Recent Learning Sessions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {learningMilestones.slice(0, 3).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">{session.id}</Badge>
                              <Badge className={
                                session.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }>
                                {session.status}
                              </Badge>
                            </div>
                            <p className="font-medium">{session.topics.join(", ")}</p>
                            <p className="text-sm text-muted-foreground">With {session.mentor} • {session.date}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="font-semibold">{session.hours} hrs</p>
                            <Button size="sm" variant="ghost">View Notes</Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl font-serif">Heritage Journey</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress to Heritage Guardian</span>
                          <span>{user.points}/{user.nextLevelPoints}</span>
                        </div>
                        <Progress value={(user.points / user.nextLevelPoints) * 100} className="h-2" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold">Cultural Interests</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.culturalInterests.map((interest) => (
                            <Badge key={interest} variant="secondary">{interest}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold">Quick Actions</h4>
                        <div className="space-y-2">
                          <Button size="sm" variant="outline" className="w-full justify-start bg-black text-white hover:bg-blue-500 hover:text-black">
                            <Bell className="h-4 w-4 mr-2" /> Notifications (3)
                          </Button>
                          <Button size="sm" variant="outline" className="w-full justify-start bg-black text-white hover:bg-blue-500 hover:text-black">
                            <Share2 className="h-4 w-4 mr-2" /> Share Journey
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

          {/* Learning */}
          <TabsContent value="learning" className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Learning History</CardTitle>
                <p className="text-muted-foreground">Track and review your cultural learning sessions</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningMilestones.map((session) => (
                  <Card key={session.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{session.id}</Badge>
                            <Badge className={
                              session.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : session.status === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }>
                              {session.status}
                            </Badge>
                          </div>
                          <p className="font-semibold">{session.topics.join(", ")}</p>
                          <p className="text-sm text-muted-foreground">Mentor: {session.mentor} • {session.date}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-lg font-bold text-primary">{session.hours} hrs</p>
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline">Resources</Button>
                            <Button size="sm" variant="outline">Notes</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Items */}
          <TabsContent value="saved" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Saved Study Items</CardTitle>
                <p className="text-muted-foreground">Reference cultural elements you want to revisit later</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative h-48 w-full">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                          {!item.available && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-red-600">Not Available</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-2">
                          <h4 className="font-semibold line-clamp-2">{item.name}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" /> {item.region}
                          </div>
                          <p className="text-xs text-muted-foreground">Mentor: {item.mentor}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{item.note}</p>
                          <Button size="sm" variant="outline" className="w-full bg-black text-white hover:bg-blue-500 hover:text-black">Open Notes</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile */}
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
                    <Button size="sm" variant="outline">Change Photo</Button>
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
                        <Badge key={interest} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="mt-2 bg-black text-white hover:bg-blue-500 hover:text-black">Edit Interests</Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notification Preferences</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Learning Session Reminders</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Artisan Story Updates</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>New Heritage Topics</span>
                        <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-black text-white hover:bg-blue-500 hover:text-black">Manage Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-serif">Cultural Heritage Journey</CardTitle>
                <p className="text-muted-foreground">Your achievements in supporting and learning about Uttarakhand&#39;s heritage</p>
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
                            <Calendar className="h-4 w-4 mr-1" /> {achievement.date}
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
                  <p className="text-muted-foreground mb-4">You&#39;re making a real difference in preserving Uttarakhand&#39;s cultural knowledge.</p>
                  <div className="flex justify-center space-x-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{user.points}</p>
                      <p className="text-sm text-muted-foreground">Total Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">8</p>
                      <p className="text-sm text-muted-foreground">Artisans Connected</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{learningMilestones.length}</p>
                      <p className="text-sm text-muted-foreground">Sessions Logged</p>
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
