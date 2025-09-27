"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Share2,
  MapPin,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  Award,
  Leaf,
  Users,
  Calendar,
  ChevronLeft,
  Play,
  Volume2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

// Sample detailed product data
const productDetails = {
  1: {
    id: 1,
    name: "Munsiyari Rajma",
    category: "Agricultural",
    region: "Pithoragarh District (Munsiyari)",
    description: "Small-sized red beans, rich in taste, grown in high-altitude organic conditions",
    longDescription:
      "Munsiyari Rajma is a premium variety of kidney beans grown in the high-altitude regions of Pithoragarh district. These small-sized red beans are cultivated using traditional organic farming methods passed down through generations. The unique climatic conditions and soil composition of the Munsiyari region give these beans their distinctive taste and nutritional profile.",
    images: [
      "/munsiyari-rajma-kidney-beans-red.jpg",
      "/placeholder.svg?key=rajma2",
      "/placeholder.svg?key=rajma3",
      "/placeholder.svg?key=rajma4",
    ],
    rating: 4.8,
    reviews: 124,
    price: "₹450",
    originalPrice: "₹500",
    unit: "per kg",
    healthBenefits: [
      "Rich in iron & calcium",
      "High protein content (22g per 100g)",
      "Diabetic-friendly with low glycemic index",
      "High fiber content aids digestion",
      "Rich in folate and magnesium",
    ],
    culturalSignificance:
      "Traditional staple food of Kumaon region, often prepared during festivals and special occasions. The beans are considered sacred and are offered in local temples during harvest festivals.",
    nutritionalInfo: {
      protein: "22g",
      carbs: "60g",
      fiber: "15g",
      iron: "8.2mg",
      calcium: "143mg",
      calories: "333 kcal",
    },
    inStock: true,
    stockQuantity: 45,
    artisan: {
      name: "Devi Singh Collective",
      location: "Munsiyari Village",
      experience: "25+ years",
      story:
        "A collective of 15 farming families who have been growing Rajma using traditional methods for generations.",
    },
    certifications: ["GI Tagged", "Organic Certified", "FSSAI Approved"],
    harvestSeason: "September - October",
    shelfLife: "12 months",
    storageInstructions: "Store in a cool, dry place away from direct sunlight",
  },
  2: {
    id: 2,
    name: "Aipan Art Painting",
    category: "Handicraft",
    region: "Kumaon Region",
    description: "Traditional geometric patterns painted with rice paste, representing cultural heritage",
    longDescription:
      "Aipan is a traditional folk art of Kumaon region, characterized by intricate geometric patterns painted with rice paste on red ochre background. This sacred art form is practiced during festivals, ceremonies, and auspicious occasions. Each pattern has deep spiritual significance and represents various aspects of nature and divinity.",
    images: [
      "/aipan-art-traditional-patterns-geometric.jpg",
      "/placeholder.svg?key=aipan2",
      "/placeholder.svg?key=aipan3",
      "/placeholder.svg?key=aipan4",
    ],
    rating: 4.9,
    reviews: 89,
    price: "₹1,200",
    originalPrice: "₹1,500",
    unit: "per piece",
    healthBenefits: ["Therapeutic art practice", "Stress relief through meditation", "Enhances creativity and focus"],
    culturalSignificance:
      "Sacred art form used in festivals and ceremonies, believed to bring prosperity and ward off evil spirits. Traditionally painted by women during Diwali, weddings, and other auspicious occasions.",
    artisan: {
      name: "Kamala Devi",
      location: "Almora District",
      experience: "30+ years",
      story:
        "Master artist who learned this traditional art from her grandmother and now teaches it to preserve the cultural heritage.",
    },
    certifications: ["GI Tagged", "Handicrafts Board Certified"],
    dimensions: '12" x 16"',
    materials: "Rice paste, natural ochre, handmade paper",
    careInstructions: "Keep away from moisture and direct sunlight",
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const product = productDetails[productId as keyof typeof productDetails]

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!product) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
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
            <Link href="/products" className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.category === "Handicraft" && (
                <Button size="sm" variant="secondary" className="absolute bottom-4 right-4">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Making Process
                </Button>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge className="bg-green-100 text-green-800">GI Tagged</Badge>
              </div>
              <h1 className="text-3xl font-serif font-bold mb-2 text-balance">{product.name}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {product.region}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground ml-1">({product.reviews} reviews)</span>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">
                  Write a Review
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{product.price}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                )}
                <span className="text-muted-foreground">{product.unit}</span>
              </div>
              {product.originalPrice && (
                <div className="text-sm text-green-600">
                  Save ₹
                  {Number.parseInt(product.originalPrice.replace("₹", "")) -
                    Number.parseInt(product.price.replace("₹", ""))}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">In Stock</span>
                  {product.stockQuantity && (
                    <span className="text-muted-foreground">({product.stockQuantity} available)</span>
                  )}
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </Button>
                </div>
                <span className="text-muted-foreground">
                  Total: ₹{Number.parseInt(product.price.replace("₹", "")) * quantity}
                </span>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" disabled={!product.inStock}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsWishlisted(!isWishlisted)}>
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" size="lg" className="w-full bg-transparent">
                <Volume2 className="h-4 w-4 mr-2" />
                Ask AI Assistant About This Product
              </Button>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Free Shipping</div>
                <div className="text-xs text-muted-foreground">On orders above ₹500</div>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Authentic</div>
                <div className="text-xs text-muted-foreground">GI Tagged Product</div>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Quality Assured</div>
                <div className="text-xs text-muted-foreground">Direct from artisans</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="health">Health Benefits</TabsTrigger>
              <TabsTrigger value="cultural">Cultural Heritage</TabsTrigger>
              <TabsTrigger value="artisan">Meet the Artisan</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <p className="text-muted-foreground mb-6 text-pretty">{product.longDescription}</p>

                  {product.nutritionalInfo && (
                    <div>
                      <h4 className="font-semibold mb-3">Nutritional Information (per 100g)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b">
                            <span className="capitalize">{key}</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span>Category</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Region</span>
                      <span className="font-medium">{product.region}</span>
                    </div>
                    {product.harvestSeason && (
                      <div className="flex justify-between py-2 border-b">
                        <span>Harvest Season</span>
                        <span className="font-medium">{product.harvestSeason}</span>
                      </div>
                    )}
                    {product.shelfLife && (
                      <div className="flex justify-between py-2 border-b">
                        <span>Shelf Life</span>
                        <span className="font-medium">{product.shelfLife}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between py-2 border-b">
                        <span>Dimensions</span>
                        <span className="font-medium">{product.dimensions}</span>
                      </div>
                    )}
                    {product.materials && (
                      <div className="flex justify-between py-2 border-b">
                        <span>Materials</span>
                        <span className="font-medium">{product.materials}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Award className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-8">
              <div className="max-w-4xl">
                <h3 className="text-xl font-semibold mb-6">Health Benefits & Nutritional Value</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {product.healthBenefits.map((benefit, index) => (
                    <Card key={index} className="border-0 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Leaf className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">{benefit}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {product.storageInstructions && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Storage Instructions</h4>
                    <p className="text-blue-700">{product.storageInstructions}</p>
                  </div>
                )}

                {product.careInstructions && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Care Instructions</h4>
                    <p className="text-blue-700">{product.careInstructions}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="cultural" className="mt-8">
              <div className="max-w-4xl">
                <h3 className="text-xl font-semibold mb-6">Cultural Heritage & Significance</h3>
                <Card className="border-0 bg-amber-50">
                  <CardContent className="p-6">
                    <p className="text-amber-800 text-pretty leading-relaxed">{product.culturalSignificance}</p>
                  </CardContent>
                </Card>

                <div className="mt-8 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Traditional Uses</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Festival celebrations and ceremonies</li>
                      <li>• Daily household consumption</li>
                      <li>• Religious offerings and rituals</li>
                      <li>• Community gatherings and events</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Cultural Impact</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Preserves traditional knowledge</li>
                      <li>• Supports local communities</li>
                      <li>• Maintains cultural identity</li>
                      <li>• Promotes sustainable practices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="artisan" className="mt-8">
              <div className="max-w-4xl">
                <h3 className="text-xl font-semibold mb-6">Meet the Artisan</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-6">
                      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-2">{product.artisan.name}</h4>
                        <div className="flex items-center text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {product.artisan.location}
                        </div>
                        <div className="flex items-center text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {product.artisan.experience} of experience
                        </div>
                        <p className="text-muted-foreground text-pretty">{product.artisan.story}</p>

                        <div className="mt-4 flex gap-3">
                          <Button variant="outline" size="sm">
                            View Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            More Products
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <Button>Write a Review</Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-primary mb-2">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{product.reviews} reviews</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3">Rating Breakdown</h4>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div key={stars} className="flex items-center gap-2">
                            <span className="text-sm w-2">{stars}</span>
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <div className="flex-1 bg-muted rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">
                              {stars === 5 ? "70%" : stars === 4 ? "20%" : "10%"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3">Review Highlights</h4>
                      <div className="space-y-2">
                        <Badge variant="outline" className="mr-2">
                          Quality
                        </Badge>
                        <Badge variant="outline" className="mr-2">
                          Authentic
                        </Badge>
                        <Badge variant="outline" className="mr-2">
                          Fast Delivery
                        </Badge>
                        <Badge variant="outline" className="mr-2">
                          Great Taste
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: "Priya Sharma",
                      rating: 5,
                      date: "2 weeks ago",
                      review:
                        "Excellent quality Rajma! The taste is authentic and reminds me of my grandmother's cooking. Will definitely order again.",
                    },
                    {
                      name: "Rajesh Kumar",
                      rating: 4,
                      date: "1 month ago",
                      review:
                        "Good product, well packaged. The beans cook evenly and have great texture. Slightly expensive but worth it for the quality.",
                    },
                  ].map((review, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-semibold">{review.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-pretty">{review.review}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold mb-8">Related Products</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Tejpatta (Bay Leaves)", price: "₹200", image: "/placeholder.svg?key=tejpat" },
              { name: "Chyura Oil", price: "₹350", image: "/placeholder.svg?key=chyura" },
              { name: "Jhangora Millet", price: "₹180", image: "/placeholder.svg?key=jhangora" },
              { name: "Himalayan Honey", price: "₹450", image: "/placeholder.svg?key=honey" },
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0">
                <CardContent className="p-0">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-balance">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">{item.price}</span>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
