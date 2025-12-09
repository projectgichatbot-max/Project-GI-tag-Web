import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mountain,
  Leaf,
  Palette,
  Wheat,
  Shirt,
  Award,
  MapPin,
  Calendar,
  Users,
  Heart,
  Star,
  ChevronRight,
  Globe,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HeritagePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Badge className="mb-4 bg-amber-100 text-amber-800">Cultural Heritage</Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-balance">
              The Rich Heritage of
              <span className="block text-primary">Uttarakhand</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Discover the timeless traditions, sacred crafts, and cultural treasures of the "Land of the Gods" - where
              every product tells a story of heritage and devotion.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-black text-white hover:bg-blue-500 hover:text-black">
                Explore Our Heritage
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction to Uttarakhand */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-balance">Uttarakhand: The Land of the Gods</h2>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                Uttarakhand, known as the "Land of the Gods," is rich in traditional art forms, folk music, dance, and
                handcrafted textiles. Its cultural heritage is deeply rooted in village life, carried forward through
                generations.
              </p>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                However, modernization and migration are causing many traditional practices to vanish. Art forms like
                Aipan folk art, Ringaal bamboo craft, and oral traditions like Jagars are at risk of being lost. Many
                crafts have GI (Geographical Indication) tags, highlighting the need for an interactive digital medium
                to promote and preserve cultural assets.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">13</div>
                  <div className="text-sm text-muted-foreground">Districts</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">50+</div>
                  <div className="text-sm text-muted-foreground">GI Products</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/uttarakhand-mountains-landscape-sunrise-golden-hou.jpg"
                alt="Uttarakhand landscape"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Categories */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4 text-balance">Heritage Categories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Explore the diverse categories of Uttarakhand's cultural heritage
            </p>
          </div>

          <Tabs defaultValue="handicrafts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="handicrafts" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Handicrafts & Art
              </TabsTrigger>
              <TabsTrigger value="agriculture" className="flex items-center gap-2">
                <Wheat className="h-4 w-4" />
                Agricultural Products
              </TabsTrigger>
              <TabsTrigger value="textiles" className="flex items-center gap-2">
                <Shirt className="h-4 w-4" />
                Textiles & Apparel
              </TabsTrigger>
            </TabsList>

            <TabsContent value="handicrafts">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0">
                  <CardContent className="p-0">
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <Image
                        src="/aipan-art-traditional-patterns-geometric.jpg"
                        alt="Aipan Art"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">Handicraft</Badge>
                        <Badge className="bg-green-100 text-green-800">GI Tagged</Badge>
                      </div>
                      <h3 className="text-xl font-serif font-semibold mb-3">Aipan Art</h3>
                      <p className="text-muted-foreground mb-4 text-pretty">
                        Traditional geometric patterns painted with rice paste on red ochre background. This sacred art
                        form represents various aspects of nature and divinity, practiced during festivals and
                        ceremonies.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          Kumaon Region
                        </div>
                        <Link href="/products?category=Handicraft">
                          <Button size="sm" variant="outline">
                            View Products
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0">
                  <CardContent className="p-0">
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <Image
                        src="/ringaal-bamboo-craft-basket-traditional.jpg"
                        alt="Ringaal Craft"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">Handicraft</Badge>
                        <Badge className="bg-green-100 text-green-800">GI Tagged</Badge>
                      </div>
                      <h3 className="text-xl font-serif font-semibold mb-3">Ringaal Craft</h3>
                      <p className="text-muted-foreground mb-4 text-pretty">
                        Handwoven baskets and containers made from Ringaal bamboo. This eco-friendly craft is known for
                        its durability and intricate weaving patterns, passed down through generations of skilled
                        artisans.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          Uttarkashi
                        </div>
                        <Link href="/products?category=Handicraft">
                          <Button size="sm" variant="outline">
                            View Products
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="agriculture">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0">
                  <CardContent className="p-0">
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <Image
                        src="/munsiyari-rajma-kidney-beans-red.jpg"
                        alt="Munsiyari Rajma"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">Agricultural</Badge>
                        <Badge className="bg-green-100 text-green-800">GI Tagged</Badge>
                      </div>
                      <h3 className="text-xl font-serif font-semibold mb-3">Munsiyari Rajma</h3>
                      <p className="text-muted-foreground mb-4 text-pretty">
                        Small-sized red kidney beans grown in high-altitude organic conditions. Rich in iron, calcium,
                        and protein, these beans are a traditional staple of the Kumaon region with exceptional taste
                        and nutritional value.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          Pithoragarh District
                        </div>
                        <Link href="/products?category=Agricultural">
                          <Button size="sm" variant="outline">
                            View Products
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">Agricultural</Badge>
                      <Badge className="bg-green-100 text-green-800">GI Tagged</Badge>
                    </div>
                    <h3 className="text-xl font-serif font-semibold mb-3">Tejpatta (Bay Leaves)</h3>
                    <p className="text-muted-foreground mb-4 text-pretty">
                      Aromatic bay leaves with medicinal properties, organically grown in the Garhwal Himalayas. Used in
                      traditional cooking and Ayurvedic medicine, known for digestive and anti-inflammatory benefits.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Leaf className="h-4 w-4 text-green-600 mr-2" />
                        <span>Digestive aid and anti-inflammatory</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Award className="h-4 w-4 text-amber-600 mr-2" />
                        <span>Traditional Ayurvedic medicine</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        Garhwal Himalayas
                      </div>
                      <Link href="/products?category=Agricultural">
                        <Button size="sm" variant="outline">
                          View Products
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="textiles">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-0">
                  <CardContent className="p-0">
                    <div className="relative h-64 overflow-hidden rounded-t-lg">
                      <Image
                        src="/traditional-woolen-cap-uttarakhand-colorful.jpg"
                        alt="Woolen Winter Wear"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">Textile</Badge>
                        <Badge className="bg-green-100 text-green-800">GI Tagged</Badge>
                      </div>
                      <h3 className="text-xl font-serif font-semibold mb-3">Woolen Caps & Coats</h3>
                      <p className="text-muted-foreground mb-4 text-pretty">
                        Locally handwoven winter wear using sheep wool. These traditional garments provide natural
                        insulation and are perfect for cold mountain climates, representing the craftsmanship of
                        mountain communities.
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          Garhwal Region
                        </div>
                        <Link href="/products?category=Textile">
                          <Button size="sm" variant="outline">
                            View Products
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">Textile</Badge>
                      <Badge className="bg-green-100 text-green-800">GI Tagged</Badge>
                    </div>
                    <h3 className="text-xl font-serif font-semibold mb-3">Bhotia Dani Weave</h3>
                    <p className="text-muted-foreground mb-4 text-pretty">
                      Traditional woolen fabric with intricate patterns, handwoven by the Bhotia tribal community. This
                      signature craft represents the unique cultural identity and weaving expertise of the Pithoragarh
                      region.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 text-blue-600 mr-2" />
                        <span>Bhotia tribal community craft</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 text-yellow-600 mr-2" />
                        <span>Intricate traditional patterns</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        Pithoragarh
                      </div>
                      <Link href="/products?category=Textile">
                        <Button size="sm" variant="outline">
                          View Products
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Cultural Significance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4 text-balance">Cultural Significance</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Understanding the deep cultural roots and spiritual significance of Uttarakhand's heritage
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-8">
                <Mountain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-4">Sacred Geography</h3>
                <p className="text-muted-foreground text-pretty">
                  The Himalayan landscape is considered sacred, with each valley and peak holding spiritual significance
                  that influences local crafts and traditions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-8">
                <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-4">Festival Traditions</h3>
                <p className="text-muted-foreground text-pretty">
                  Many crafts and products are deeply connected to seasonal festivals and religious ceremonies,
                  preserving ancient rituals and community bonds.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-gradient-to-br from-amber-50 to-amber-100">
              <CardContent className="p-8">
                <Heart className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-4">Community Heritage</h3>
                <p className="text-muted-foreground text-pretty">
                  Traditional knowledge is passed down through generations, creating strong community bonds and
                  preserving cultural identity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Preservation Efforts */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-balance">
                Preserving Heritage for Future Generations
              </h2>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                Our mission extends beyond commerce to cultural preservation. We work closely with artisan communities
                to document traditional techniques, stories, and cultural practices that risk being lost to
                modernization.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1 rounded">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Digital Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Creating comprehensive digital archives of traditional techniques and stories
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1 rounded">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Artisan Training</h4>
                    <p className="text-sm text-muted-foreground">
                      Supporting skill transfer programs to younger generations
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1 rounded">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Global Awareness</h4>
                    <p className="text-sm text-muted-foreground">
                      Raising international awareness about Uttarakhand's cultural heritage
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?key=heritage"
                alt="Heritage preservation"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-6 text-balance">Experience Uttarakhand's Living Heritage</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Every product you explore and learn about helps preserve these ancient traditions and supports cultural heritage
            communities who keep them alive.
          </p>
          <div className="mb-10">
            <div className="inline-block bg-primary/10 border border-primary/20 rounded-lg p-4 text-left">
              <p className="font-semibold">Uttarakhand currently has 27 registered GI Tags.</p>
              <p className="text-sm text-muted-foreground">Source: DPIIT GI Registry (Government of India).</p>
              <div className="mt-2 flex gap-3 text-sm">
                <Link className="underline" href="https://search.ipindia.gov.in/GIRPublic/" target="_blank">GI Registry Search</Link>
                <Link className="underline" href="https://dpiit.gov.in/gi" target="_blank">DPIIT GI Portal</Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" className="bg-black text-white hover:bg-blue-500 hover:text-black">
                Explore Heritage Products
              </Button>
            </Link>
            <Link href="/artisans">
              <Button size="lg" variant="outline">
                Meet the Artisans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
