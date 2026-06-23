"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Shield, Award, Leaf, Users, Calendar, ChevronLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { productsApi, type Product, type Recipe } from "@/lib/api"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

// ─── Minimal artisan shape needed by this page ────────────────────────────────
interface LinkedArtisan {
  _id: string
  name: string
  image: string
  specialization: string
  district: string
  region: string
  experience: string
  bio: string
  rating: number
  reviewsCount: number
  featured: boolean
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [newUser, setNewUser] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [linkedArtisan, setLinkedArtisan] = useState<LinkedArtisan | null>(null)
  const [artisanLoading, setArtisanLoading] = useState(false)

  useEffect(() => {
    let active = true
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await productsApi.getById(productId)
        if (!active) return
        if (response.success && response.data) {
          setProduct(response.data)
        } else {
          setError(response.error || "Product not found")
        }
      } catch {
        if (!active) return
        setError("Failed to load product")
      } finally {
        if (active) setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }

    return () => {
      active = false
    }
  }, [productId])

  // ── Fetch real artisan linked to this product ────────────────────────────────
  useEffect(() => {
    if (!product?._id) return
    let active = true
    setArtisanLoading(true)
    fetch(`/api/artisans?productId=${product._id}&limit=1`)
      .then(r => r.json())
      .then(json => {
        if (!active) return
        if (json.success && json.data?.length > 0) {
          setLinkedArtisan(json.data[0])
        }
      })
      .catch(() => {/* non-fatal, fall back to product.artisan */})
      .finally(() => { if (active) setArtisanLoading(false) })
    return () => { active = false }
  }, [product?._id])

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading heritage product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">{error || "We could not find this heritage product."}</p>
          <Link href="/heritage">
            <Button>Back to Heritage</Button>
          </Link>
        </div>
      </div>
    )
  }

  const rating = product.rating ?? 4.8
  const reviewsCount = product.reviewsCount ?? product.reviews?.length ?? 0
  const mainImage = product.images?.[selectedImage] || product.images?.[0] || "/placeholder.svg"
  const imageList = (product.images && product.images.length > 0 ? product.images : ["/placeholder.svg"]).slice(0, 8)
  const healthBenefits = product.healthBenefits?.length ? product.healthBenefits : ["Preserves cultural heritage"]
  const longDescription = product.longDescription || product.description
  const recipes = (product.recipes && product.recipes.length > 0 ? product.recipes : buildFallbackRecipes(product)).slice(0, 3)

  const handleSubmitReview = async () => {
    if (!product?._id) return
    if (!newComment.trim()) {
      setError("Please add a short comment with your rating.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const response = await productsApi.addReview(product._id, {
        user: newUser.trim() || "Guest",
        rating: newRating,
        comment: newComment.trim(),
      })
      if (response.success && response.data) {
        setProduct(response.data)
        setNewComment("")
        setNewUser("")
      } else {
        setError(response.error || "Could not save your rating.")
      }
    } catch {
      setError("Could not save your rating.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-muted py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/heritage" className="text-muted-foreground hover:text-foreground">
              Heritage
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/heritage" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Heritage Items
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image src={mainImage} alt={product.name} fill className="object-cover" priority />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {imageList.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Image src={image || "/placeholder.svg"} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge className="bg-green-100 text-green-800">{product.giCertified ? "GI Tagged" : "Heritage"}</Badge>
              </div>
              <h1 className="text-3xl font-serif font-bold mb-2 text-balance">{product.name}</h1>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {product.region}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-semibold">{rating}</span>
                  <span className="text-muted-foreground ml-1">({reviewsCount} reviews)</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary text-white"
                  onClick={() => setActiveTab("reviews")}
                >
                  Write a Review
                </Button>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
              {product.available ? "Authentic GI heritage item." : "This item is showcased for cultural and educational exploration."}
              {product.giRegistrationNumber && <span className="block text-xs mt-2">GI Reg. No: {product.giRegistrationNumber}</span>}
            </div>



            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Authentic GI Heritage</div>
                <div className="text-xs text-muted-foreground">Verified cultural origin</div>
              </div>
              <div className="text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-sm font-medium">Documented Tradition</div>
                <div className="text-xs text-muted-foreground">Preserved knowledge</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="health">Health Benefits</TabsTrigger>
              <TabsTrigger value="recipes">Recipes</TabsTrigger>
              <TabsTrigger value="cultural">Cultural Heritage</TabsTrigger>
              <TabsTrigger value="artisan">Meet the Artisan</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Description</h3>
                  <p className="text-muted-foreground mb-6 text-pretty">{longDescription}</p>

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
                  <h3 className="text-xl font-semibold mb-4">Cultural Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span>Domain</span>
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
                    <h4 className="font-semibold mb-3">Recognitions & Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Award className="h-3 w-3 mr-1" />
                        {product.giCertified ? "GI Tagged" : "Documented Heritage"}
                      </Badge>
                      {product.giRegistrationNumber && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Reg. No: {product.giRegistrationNumber}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="mt-8">
              <div className="max-w-4xl">
                <h3 className="text-xl font-semibold mb-6">Health & Nutritional Context</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {healthBenefits.map((benefit, index) => (
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

            <TabsContent value="recipes" className="mt-8">
              <div className="max-w-5xl space-y-6">
                {recipes.map((recipe, idx) => (
                  <Card key={idx} className="border">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-semibold">{recipe.title}</h3>
                          {recipe.summary && <p className="text-muted-foreground text-pretty">{recipe.summary}</p>}
                        </div>
                        <div className="flex gap-3 text-sm text-muted-foreground">
                          {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
                          {recipe.cookTime && <span>Cook: {recipe.cookTime}</span>}
                          {recipe.serves && <span>Serves: {recipe.serves}</span>}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Ingredients</h4>
                          <ul className="space-y-1 text-muted-foreground">
                            {recipe.ingredients.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Steps</h4>
                          <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                            {recipe.steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cultural" className="mt-8">
              <div className="max-w-4xl">
                <h3 className="text-xl font-semibold mb-6">Cultural Significance</h3>
                <Card className="border-0 bg-amber-50">
                  <CardContent className="p-6">
                    <p className="text-amber-800 text-pretty leading-relaxed">{product.culturalSignificance}</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="artisan" className="mt-8">
              <div className="max-w-4xl">
                <h3 className="text-xl font-semibold mb-6">Artisan / Community</h3>

                {artisanLoading ? (
                  <div className="flex items-center gap-3 text-muted-foreground py-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading artisan info...</span>
                  </div>
                ) : linkedArtisan ? (
                  /* ── Real artisan from DB ── */
                  <Card className="border shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-6">
                        {/* Photo */}
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-full bg-muted border-2 border-amber-200">
                          <Image
                            src={linkedArtisan.image || `https://randomuser.me/api/portraits/men/50.jpg`}
                            alt={linkedArtisan.name}
                            fill
                            className="object-cover object-top"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://randomuser.me/api/portraits/men/50.jpg` }}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="text-xl font-semibold">{linkedArtisan.name}</h4>
                            {linkedArtisan.featured && (
                              <Badge className="bg-amber-500 text-white text-xs border-0">⭐ Featured</Badge>
                            )}
                          </div>

                          <div className="flex items-center text-muted-foreground text-sm mb-1">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {linkedArtisan.district}, {linkedArtisan.region}
                          </div>

                          <div className="flex items-center text-muted-foreground text-sm mb-1">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {linkedArtisan.experience} experience
                          </div>

                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium">{(linkedArtisan.rating || 4.5).toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({linkedArtisan.reviewsCount || 0} reviews)</span>
                          </div>

                          <Badge variant="secondary" className="mb-3 text-xs">{linkedArtisan.specialization}</Badge>

                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{linkedArtisan.bio}</p>

                          <div className="flex gap-3">
                            <Link href={`/artisans/${linkedArtisan._id}`}>
                              <Button size="sm" className="bg-black text-white hover:bg-black/80">View Profile</Button>
                            </Link>
                            <Link href={`/artisans?specialization=${encodeURIComponent(linkedArtisan.specialization)}`}>
                              <Button variant="outline" size="sm">More by this Artisan</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* ── Fallback: product.artisan static data or generic ── */
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-6">
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
                          <Users className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold mb-2">{product.artisan?.name || "Community Collective"}</h4>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {product.artisan?.village || product.artisan?.district || product.region}
                          </div>
                          <div className="flex items-center text-muted-foreground mb-4">
                            <Calendar className="h-4 w-4 mr-1" />
                            {product.artisan?.experience || "Generational craftsmanship"}
                          </div>
                          <p className="text-muted-foreground text-pretty">
                            {product.artisan?.bio || product.culturalSignificance}
                          </p>
                          <div className="mt-4">
                            <Link href="/artisans">
                              <Button variant="outline" size="sm">Browse All Artisans</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Community Reflections</h3>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const form = document.getElementById("review-form")
                      form?.scrollIntoView({ behavior: "smooth", block: "center" })
                    }}
                  >
                    Share Insight
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-primary mb-2">{rating}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">{reviewsCount} reflections</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-3">Engagement Breakdown</h4>
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
                      <h4 className="font-semibold mb-3">Reflection Highlights</h4>
                      <div className="space-y-2">
                        <Badge variant="outline" className="mr-2">
                          Authentic
                        </Badge>
                        <Badge variant="outline" className="mr-2">
                          Cultural Value
                        </Badge>
                        <Badge variant="outline" className="mr-2">
                          Community Pride
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  {product.reviews?.length ? (
                    product.reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="font-semibold">{review.user}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                                <span>{new Date(review.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground mt-2 text-pretty">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Be the first to share your reflection.</p>
                  )}
                </div>

                <Card className="mt-8" id="review-form">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="text-lg font-semibold">Add your rating</h4>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your name</label>
                        <Input value={newUser} onChange={(e) => setNewUser(e.target.value)} placeholder="Guest" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Rating (1-5)</label>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          value={newRating}
                          onChange={(e) => setNewRating(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Comment</label>
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share how this heritage item connects to you..."
                      />
                    </div>
                    <Button onClick={handleSubmitReview} disabled={submitting}>
                      {submitting ? "Saving..." : "Submit Rating"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function buildFallbackRecipes(product: Product): Recipe[] {
  const baseName = product.name || "Heritage Ingredient"
  const mainIngredient = baseName
  const isDrink = /tea|sharbat|juice/i.test(baseName)
  const isGrain = /rice|millet|dal|beans|gram|lentil|soybean|oil|peach|litchi|fruit|spice/i.test(baseName)

  if (isDrink) {
    return [
      {
        title: `${baseName} Refresh`,
        summary: `Traditional beverage using ${baseName}.`,
        prepTime: "10 mins",
        cookTime: "10 mins",
        serves: "2",
        ingredients: [`2 cups water`, `2 tsp ${mainIngredient}`, `Honey or jaggery to taste`, `Lemon slice`],
        steps: [
          "Boil water and add the main ingredient.",
          "Steep for 5 minutes, then strain.",
          "Sweeten with honey or jaggery.",
          "Serve warm with a slice of lemon.",
        ],
      },
    ]
  }

  if (isGrain) {
    return [
      {
        title: `${baseName} Pahadi Bowl`,
        summary: `Simple heritage preparation highlighting ${baseName}.`,
        prepTime: "15 mins",
        cookTime: "25 mins",
        serves: "3-4",
        ingredients: [
          `1 cup ${mainIngredient}`,
          "2 cups water/stock",
          "1 tsp ghee or mustard oil",
          "Cumin, turmeric, salt to taste",
        ],
        steps: [
          `Rinse and soak ${mainIngredient} for 20 minutes if grain/legume.`,
          "Warm ghee, temper with cumin and turmeric.",
          `Add the main ingredient, toast lightly, then add water/stock and salt.`,
          "Simmer/pressure cook until tender; rest 5 minutes and serve warm.",
        ],
      },
    ]
  }

  return [
    {
      title: `${baseName} Showcase`,
      summary: "Cultural presentation idea to experience the heritage item.",
      prepTime: "15 mins",
      cookTime: "30 mins",
      serves: "4",
      ingredients: [
        `${mainIngredient}`,
        "Supporting herbs/spices from the region",
        "Local grains or bread to accompany",
      ],
      steps: [
        `Highlight ${mainIngredient} as the hero ingredient.`,
        "Prepare a gentle base (light gravy or platter) to let aromas stand out.",
        "Combine and warm gently; avoid overpowering spices.",
        "Serve with regional accompaniments and share the story of its origin.",
      ],
    },
  ]
}
