import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, Heart, Users, Award, Target, Eye, Lightbulb, Globe, Shield, Leaf } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">About Our Mission</Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-balance">
                Preserving Uttarakhand's Cultural Heritage Through Technology
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                We are dedicated to showcasing and preserving the authentic GI-tagged products of Uttarakhand,
                connecting traditional artisans with global audiences while maintaining cultural authenticity and
                supporting local communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Explore Our Heritage
                </Button>
                <Button size="lg" variant="outline">
                  Meet Our Team
                </Button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/uttarakhand-artisan-working-traditional-craft-work.jpg"
                alt="Uttarakhand artisan at work"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4 text-balance">Our Foundation</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Built on the principles of cultural preservation, community empowerment, and authentic storytelling
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-8">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground text-pretty">
                  To create a comprehensive digital platform that preserves, promotes, and celebrates the authentic
                  GI-tagged products of Uttarakhand while empowering local artisans and communities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-8">
                <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground text-pretty">
                  To become the leading platform for authentic Himalayan heritage products, bridging the gap between
                  traditional craftsmanship and modern consumers worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="p-8">
                <div className="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-4">Our Values</h3>
                <p className="text-muted-foreground text-pretty">
                  Authenticity, cultural respect, community empowerment, sustainable practices, and transparent
                  storytelling guide everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4 text-balance">What We Do</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our comprehensive approach to cultural preservation and artisan empowerment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mountain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Product Curation</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Carefully curate authentic GI-tagged products with verified origins and quality
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Artisan Support</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Provide digital platforms and market access to traditional craftspeople
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Cultural Education</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Share stories, traditions, and cultural significance of each product
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Global Reach</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  Connect Uttarakhand's heritage with audiences worldwide
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4 text-balance">Our Impact</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Making a difference in preserving culture and supporting communities
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">GI-Tagged Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Artisan Partners</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15</div>
              <div className="text-muted-foreground">Districts Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4 text-balance">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              What makes us the trusted platform for authentic Uttarakhand heritage products
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Authenticity Guaranteed</h3>
                    <p className="text-muted-foreground text-pretty">
                      Every product is verified for GI authenticity and sourced directly from certified artisans
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Direct Artisan Support</h3>
                    <p className="text-muted-foreground text-pretty">
                      Your purchases directly support traditional craftspeople and their communities
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Cultural Stories</h3>
                    <p className="text-muted-foreground text-pretty">
                      Learn the rich history and cultural significance behind each product
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Leaf className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Sustainable Practices</h3>
                    <p className="text-muted-foreground text-pretty">
                      Promoting eco-friendly and sustainable traditional production methods
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Heart className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Community Impact</h3>
                    <p className="text-muted-foreground text-pretty">
                      Contributing to rural economic development and cultural preservation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Globe className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Global Accessibility</h3>
                    <p className="text-muted-foreground text-pretty">
                      Making Uttarakhand's heritage accessible to people worldwide
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6 text-balance">Join Us in Preserving Cultural Heritage</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Be part of our mission to preserve Uttarakhand's rich cultural heritage while supporting local artisans and
            communities. Every purchase makes a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Products
              </Button>
            </Link>
            <Link href="/artisans">
              <Button size="lg" variant="outline">
                Meet Our Artisans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
