import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Heart, Star, ChevronRight, Mountain, Leaf, Users } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/uttarakhand-mountains-landscape-sunrise-golden-hou.jpg"
            alt="Uttarakhand Mountains"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <Badge className="mb-6 bg-accent/20 text-white border-white/20">Land of the Gods</Badge>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-balance">
            Discover Authentic
            <span className="block text-accent">GI-Tagged Products</span>
            of Uttarakhand
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto text-pretty">
            Explore traditional handicrafts, organic foods, and cultural treasures that preserve the rich heritage of
            the Himalayas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
              Explore Products
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              Meet Artisans
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4 text-balance">Authentic Heritage Categories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Each product tells a story of tradition, craftsmanship, and cultural significance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-t-lg">
                <Image
                  src="/traditional-aipan-art-patterns-uttarakhand.jpg"
                  alt="Handicrafts & Handlooms"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary">Handicrafts</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-2">Handicrafts & Handlooms</h3>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Aipan Art, Ringaal Craft, and traditional textiles crafted by skilled artisans
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">12+ Products</span>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-t-lg">
                <Image
                  src="/munsiyari-rajma-kidney-beans-organic-uttarakhand.jpg"
                  alt="Organic Foods"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-secondary">Organic Foods</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-2">Agricultural Products</h3>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Munsiyari Rajma, Tejpat, and other organic products from the Himalayas
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">8+ Products</span>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card">
            <CardContent className="p-0">
              <div className="relative h-64 overflow-hidden rounded-t-lg">
                <Image
                  src="/traditional-woolen-caps-coats-uttarakhand-winter-w.jpg"
                  alt="Apparel & Textiles"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-accent">Textiles</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-semibold mb-2">Apparel & Wool Products</h3>
                <p className="text-muted-foreground mb-4 text-pretty">
                  Handwoven winter wear and traditional clothing using sheep wool
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">6+ Products</span>
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why GI Matters Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">Cultural Preservation</Badge>
              <h2 className="text-4xl font-serif font-bold mb-6 text-balance">Why GI-Tagged Products Matter</h2>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                Geographical Indication (GI) tags protect and promote regional identity, ensuring product quality while
                preserving traditional knowledge and supporting local communities.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Authentic Quality</h3>
                    <p className="text-muted-foreground text-pretty">
                      Each product maintains traditional methods and regional authenticity
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Artisan Support</h3>
                    <p className="text-muted-foreground text-pretty">
                      Direct support to local craftspeople and farming communities
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mountain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Heritage Preservation</h3>
                    <p className="text-muted-foreground text-pretty">
                      Protecting traditional knowledge for future generations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/uttarakhand-artisan-working-traditional-craft-work.jpg"
                alt="Artisan at work"
                width={800}
                height={600}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4 text-balance">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover some of our most celebrated GI-tagged products
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Munsiyari Rajma",
              category: "Agricultural",
              region: "Pithoragarh District",
              image: "/munsiyari-rajma-kidney-beans-red.jpg",
              rating: 4.8,
            },
            {
              name: "Aipan Art Painting",
              category: "Handicraft",
              region: "Kumaon Region",
              image: "/aipan-art-traditional-patterns-geometric.jpg",
              rating: 4.9,
            },
            {
              name: "Ringaal Craft Basket",
              category: "Handicraft",
              region: "Uttarkashi",
              image: "/ringaal-bamboo-craft-basket-traditional.jpg",
              rating: 4.7,
            },
            {
              name: "Woolen Winter Cap",
              category: "Textile",
              region: "Garhwal",
              image: "/traditional-woolen-cap-uttarakhand-colorful.jpg",
              rating: 4.6,
            },
          ].map((product, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0">
              <CardContent className="p-0">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button size="sm" variant="ghost" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold mb-1 text-balance">{product.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {product.region}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            View All Products
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  )
}
