"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin, Calendar, Award, Star, Heart, Share2,
  Phone, Mail, ChevronLeft, Users, Leaf, ShoppingBag,
  Globe, Package, Loader2, AlertCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Workshop {
  title: string
  duration: string
  description: string
  maxParticipants: number
  available: boolean
}

interface Artisan {
  _id: string
  name: string
  village: string
  district: string
  region: string
  specialization: string
  experience: string
  bio: string
  image: string
  products: string[]
  skills: string[]
  achievements: string[]
  featured?: boolean
  rating: number
  reviewsCount: number
  contact: { phone: string; email: string; whatsapp?: string; address: string }
  workshopsOffered: Workshop[]
  availability: string
  languages: string[]
  certifications: string[]
  socialImpact: { familiesSupported: number; studentsTrained: number; culturalEvents: number; communityProjects: number }
  gallery: string[]
  tags: string[]
}

interface LinkedProduct {
  _id: string
  name: string
  category: string
  images: string[]
  cloudinaryPublicIds: string[]
  description: string
  region: string
  rating: number
  reviewsCount: number
  giCertified: boolean
}

// ─── Artisan Image with fallback ──────────────────────────────────────────────
function ArtisanImage({ artisan, fill = false, className = "" }: { artisan: Artisan; fill?: boolean; className?: string }) {
  const [imgError, setImgError] = useState(false)
  const fallback = `https://picsum.photos/seed/${artisan._id?.slice(-4) || '42'}/400/400`
  const src = imgError || !artisan.image ? fallback : artisan.image

  if (fill) {
    return <Image src={src} alt={artisan.name} fill className={`object-cover ${className}`} onError={() => setImgError(true)} />
  }
  return (
    <Image src={src} alt={artisan.name} width={220} height={220} className={`object-cover w-full h-full ${className}`} onError={() => setImgError(true)} priority />
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function LinkedProductCard({ product }: { product: LinkedProduct }) {
  const [imgError, setImgError] = useState(false)
  const imgSrc = imgError || !product.images?.[0] ? '/placeholder.svg' : product.images[0]

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 overflow-hidden cursor-pointer">
        <CardContent className="p-0">
          <div className="relative h-40 bg-muted rounded-t-lg overflow-hidden">
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
            {product.giCertified && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-600 text-white text-xs border-0">GI Certified</Badge>
              </div>
            )}
          </div>
          <div className="p-3">
            <h4 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{product.category}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs">{product.rating?.toFixed(1) || '4.5'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="min-h-screen pt-16 animate-pulse">
      <div className="bg-muted py-4 h-12" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex gap-6">
              <div className="w-48 h-48 bg-muted rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-8 bg-muted rounded w-2/3" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-20 bg-muted rounded w-full" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-48 bg-muted rounded-xl" />
            <div className="h-36 bg-muted rounded-xl" />
          </div>
        </div>
        <div className="h-12 bg-muted rounded-lg mb-8" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ArtisanProfilePage() {
  const params = useParams()
  const id = params?.id as string

  const [artisan, setArtisan] = useState<Artisan | null>(null)
  const [linkedProducts, setLinkedProducts] = useState<LinkedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchArtisan = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/artisans/${id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!json.success) throw new Error(json.error || 'Not found')
        setArtisan(json.data)
        setLinkedProducts(json.linkedProducts || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load artisan')
      } finally {
        setLoading(false)
      }
    }
    fetchArtisan()
  }, [id])

  if (loading) return <ProfileSkeleton />

  if (error || !artisan) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Artisan Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The artisan you\'re looking for could not be found.'}</p>
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
      <div className="bg-muted/50 py-3 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/artisans" className="hover:text-foreground transition-colors">Artisans</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{artisan.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/artisans" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />Back to Artisans
        </Link>

        {/* ── Profile Header ── */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative w-52 h-52 mx-auto md:mx-0 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg bg-muted">
                <ArtisanImage artisan={artisan} fill className="rounded-2xl" />
                {artisan.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-amber-500 text-white border-0 shadow">⭐ Featured</Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-serif font-bold">{artisan.name}</h1>
                  <Badge className="bg-foreground text-background border-0 w-fit mx-auto md:mx-0">Master Artisan</Badge>
                </div>

                <p className="text-muted-foreground font-medium mb-1">{artisan.specialization}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{artisan.village}, {artisan.district}</span>
                  <span className="flex items-center gap-1"><Globe className="h-4 w-4" />{artisan.region}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{artisan.experience} experience</span>
                </div>

                <div className="flex justify-center md:justify-start items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{artisan.rating?.toFixed(1) || '4.5'}</span>
                    <span className="text-sm text-muted-foreground">({artisan.reviewsCount || 0} reviews)</span>
                  </div>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Package className="h-4 w-4" />{linkedProducts.length} linked product{linkedProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <p className="text-muted-foreground mb-5 line-clamp-3 text-pretty leading-relaxed">{artisan.bio}</p>

                {/* Skills */}
                {artisan.skills?.length > 0 && (
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                    {artisan.skills.slice(0, 5).map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {linkedProducts.length > 0 && (
                    <Link href={`/products?artisan=${encodeURIComponent(artisan.name)}`}>
                      <Button className="bg-foreground text-background hover:bg-foreground/80">
                        <ShoppingBag className="h-4 w-4 mr-2" />View Products
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />Contact
                  </Button>
                  <Button variant="outline" size="icon"><Heart className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Quick Stats Sidebar ── */}
          <div className="space-y-4">
            {/* Social Impact */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-blue-500" />Impact & Achievements</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Families Supported', value: artisan.socialImpact?.familiesSupported || 0, color: 'blue' },
                    { label: 'Students Trained', value: artisan.socialImpact?.studentsTrained || 0, color: 'green' },
                    { label: 'Cultural Events', value: artisan.socialImpact?.culturalEvents || 0, color: 'amber' },
                    { label: 'Community Projects', value: artisan.socialImpact?.communityProjects || 0, color: 'purple' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`text-center p-3 rounded-lg bg-${color}-50 dark:bg-${color}-950/20`}>
                      <div className={`text-2xl font-bold text-${color}-600`}>{value}+</div>
                      <div className={`text-xs text-${color}-700 dark:text-${color}-400 leading-tight`}>{label}</div>
                    </div>
                  ))}
                </div>
                {(artisan.achievements || []).slice(0, 3).map((ach, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1">
                    <Award className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground">{ach}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-2 mb-4">
                  {artisan.contact?.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{artisan.contact.phone}</span>
                    </div>
                  )}
                  {artisan.contact?.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{artisan.contact.email}</span>
                    </div>
                  )}
                  {artisan.contact?.address && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{artisan.contact.address}</span>
                    </div>
                  )}
                </div>
                <Button className="w-full bg-foreground text-background hover:bg-foreground/80">
                  <Mail className="h-4 w-4 mr-2" />Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Languages & Certifications */}
            {(artisan.languages?.length > 0 || artisan.certifications?.length > 0) && (
              <Card>
                <CardContent className="p-5">
                  {artisan.languages?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-muted-foreground mb-2">LANGUAGES</p>
                      <div className="flex flex-wrap gap-1">
                        {artisan.languages.map((l, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{l}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {artisan.certifications?.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">CERTIFICATIONS</p>
                      <div className="flex flex-wrap gap-1">
                        {artisan.certifications.map((c, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="story" className="w-full">
          <TabsList className="flex w-full overflow-x-auto bg-muted/50 rounded-xl p-1 mb-8">
            <TabsTrigger value="story" className="flex-1">Story</TabsTrigger>
            <TabsTrigger value="skills" className="flex-1">Skills</TabsTrigger>
            <TabsTrigger value="products" className="flex-1">
              Products {linkedProducts.length > 0 && `(${linkedProducts.length})`}
            </TabsTrigger>
            <TabsTrigger value="workshops" className="flex-1">Workshops</TabsTrigger>
            {artisan.gallery?.length > 0 && <TabsTrigger value="gallery" className="flex-1">Gallery</TabsTrigger>}
          </TabsList>

          {/* Story Tab */}
          <TabsContent value="story" className="mt-0">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Artisan's Journey</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed text-pretty">{artisan.bio}</p>

                <h4 className="font-semibold mb-3">Achievements & Recognition</h4>
                <div className="space-y-2">
                  {(artisan.achievements || []).map((ach, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <Award className="h-5 w-5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Cultural Impact</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="border-0 bg-blue-50 dark:bg-blue-950/30 text-center">
                    <CardContent className="p-5">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-blue-600">{artisan.socialImpact?.studentsTrained || 0}+</div>
                      <div className="text-sm text-blue-700 dark:text-blue-400">Students Trained</div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-green-50 dark:bg-green-950/30 text-center">
                    <CardContent className="p-5">
                      <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-3xl font-bold text-green-600">{artisan.socialImpact?.familiesSupported || 0}+</div>
                      <div className="text-sm text-green-700 dark:text-green-400">Families Supported</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/20 p-5 rounded-xl border border-amber-100 dark:border-amber-900">
                  <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">Community Contribution</h4>
                  <p className="text-amber-700 dark:text-amber-400 text-sm leading-relaxed text-pretty">
                    Through dedication to teaching and preserving traditional art forms, {artisan.name} has become
                    a pillar of cultural preservation in {artisan.village}, ensuring ancient techniques continue
                    to thrive in the modern world.
                  </p>
                </div>
                {artisan.availability && (
                  <div className="mt-4 p-4 rounded-xl bg-muted/50 border">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Availability</p>
                    <p className="text-sm">{artisan.availability}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-0">
            <div className="max-w-4xl">
              <h3 className="text-xl font-semibold mb-6">Traditional Techniques & Skills</h3>
              <div className="grid md:grid-cols-2 gap-5">
                {(artisan.skills || []).map((skill, i) => (
                  <Card key={i} className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-950/20">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-200 dark:bg-purple-800 p-2 rounded-lg flex-shrink-0">
                          <Award className="h-5 w-5 text-purple-700 dark:text-purple-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-1">{skill}</h4>
                          <p className="text-purple-700 dark:text-purple-400 text-sm">
                            Expert-level traditional skill practiced with mastery passed down through generations.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 bg-muted/50 rounded-xl border">
                <h4 className="font-semibold mb-3">Learning & Teaching Philosophy</h4>
                <p className="text-muted-foreground text-pretty italic">
                  "Traditional art is not just about creating beautiful objects — it's about preserving our cultural
                  soul and passing on the wisdom of our ancestors. Every pattern tells a story, every color has meaning,
                  and every technique connects us to our heritage."
                </p>
                <div className="text-right mt-2">
                  <span className="text-sm font-medium">— {artisan.name}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="mt-0">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Linked Products</h3>
                {linkedProducts.length > 0 && (
                  <Link href={`/products?artisan=${encodeURIComponent(artisan.name)}`}>
                    <Button variant="outline" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />Browse All Products
                    </Button>
                  </Link>
                )}
              </div>

              {linkedProducts.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                  {linkedProducts.map(product => (
                    <LinkedProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-14 bg-muted/30 rounded-xl">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">No linked products yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">Products by this artisan will appear here once linked.</p>
                  <Link href="/products">
                    <Button variant="outline">Explore All Products</Button>
                  </Link>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Workshops Tab */}
          <TabsContent value="workshops" className="mt-0">
            <div className="max-w-4xl">
              <h3 className="text-xl font-semibold mb-6">Learning Workshops</h3>

              {(artisan.workshopsOffered || []).length > 0 ? (
                <div className="space-y-5">
                  {artisan.workshopsOffered.map((ws, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-semibold">{ws.title}</h4>
                              <Badge variant={ws.available ? "default" : "secondary"} className="text-xs">
                                {ws.available ? 'Available' : 'Seasonal'}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3 text-pretty">{ws.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Duration: {ws.duration}</span>
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" />Max {ws.maxParticipants} participants</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Button disabled={!ws.available} className={ws.available ? '' : 'opacity-50'}>
                              {ws.available ? 'Book Workshop' : 'Seasonal Only'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-xl">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">No workshops scheduled</h4>
                  <p className="text-sm text-muted-foreground">Contact the artisan directly to arrange a visit.</p>
                </div>
              )}

              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">Workshop Benefits</h4>
                <ul className="space-y-2 text-blue-700 dark:text-blue-400 text-sm">
                  {['Learn authentic traditional techniques from a master', 'Hands-on experience with original tools and materials', 'Take home your own creations', 'Certificate of completion', 'Cultural context and historical significance'].map((b, i) => (
                    <li key={i} className="flex items-center gap-2"><span className="text-blue-500">•</span>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* Gallery Tab — only shown if gallery images exist */}
          {artisan.gallery?.length > 0 && (
            <TabsContent value="gallery" className="mt-0">
              <div className="max-w-6xl">
                <h3 className="text-xl font-semibold mb-6">Work Gallery</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {artisan.gallery.map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer">
                      <Image
                        src={img || '/placeholder.svg'}
                        alt={`${artisan.name} work ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
