"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Award, Calendar, Users, Heart, Star, Filter, Grid, List, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Artisan {
  _id: string
  name: string
  specialization: string
  district: string
  village: string
  region: string
  experience: string
  bio: string
  image: string
  cloudinaryPublicId: string
  products: string[]
  skills: string[]
  achievements: string[]
  featured: boolean
  rating: number
  reviewsCount: number
  tags: string[]
}

// ─── Feature Mini Card (separate component — hooks are valid here) ─────────────
function FeaturedMiniCard({ artisan }: { artisan: Artisan }) {
  const [imgError, setImgError] = useState(false)
  const fallback = `https://randomuser.me/api/portraits/men/50.jpg`
  const imgSrc = imgError || !artisan.image ? fallback : artisan.image

  return (
    <Link href={`/artisans/${artisan._id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-amber-200 dark:border-amber-800 hover:border-amber-400 cursor-pointer overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 overflow-hidden rounded-full flex-shrink-0 bg-muted">
              <Image
                src={imgSrc}
                alt={artisan.name}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{artisan.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{artisan.specialization}</p>
            </div>
            <Badge className="bg-amber-500 text-white text-xs border-0 flex-shrink-0">Featured</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <Card className="border-0 overflow-hidden animate-pulse">
      <div className="h-52 bg-muted rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-9 bg-muted rounded w-full mt-2" />
      </div>
    </Card>
  )
}

// ─── Artisan Grid Card ─────────────────────────────────────────────────────────
function ArtisanGridCard({ artisan }: { artisan: Artisan }) {
  const [imgError, setImgError] = useState(false)
  const fallback = `https://randomuser.me/api/portraits/men/50.jpg`
  const imgSrc = imgError || !artisan.image ? fallback : artisan.image

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-56 overflow-hidden rounded-t-lg bg-muted">
          <Image
            src={imgSrc}
            alt={artisan.name}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Top badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
            {artisan.featured && (
              <Badge className="bg-amber-500 text-white text-xs border-0 shadow">⭐ Featured</Badge>
            )}
          </div>
          {/* Specialization bottom-left */}
          <div className="absolute bottom-3 left-3 right-3">
            <Badge variant="secondary" className="text-xs bg-white/90 text-foreground shadow mb-1">
              {artisan.specialization}
            </Badge>
            <div className="flex items-center text-white/90 text-xs">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{artisan.district}, {artisan.region}</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-base mb-1 leading-snug">{artisan.name}</h3>
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3 mr-1" />
            {artisan.experience} experience
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {artisan.bio}
          </p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium">{(artisan.rating || 4.5).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({artisan.reviewsCount || 0})</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {(artisan.products?.length || 0)} product{(artisan.products?.length || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <Link href={`/artisans/${artisan._id}`}>
            <Button className="w-full bg-foreground text-background hover:bg-foreground/80 transition-colors" size="sm">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Artisan List Card ────────────────────────────────────────────────────────
function ArtisanListCard({ artisan }: { artisan: Artisan }) {
  const [imgError, setImgError] = useState(false)
  const fallback = `https://randomuser.me/api/portraits/men/50.jpg`
  const imgSrc = imgError || !artisan.image ? fallback : artisan.image

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex gap-5">
          <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={imgSrc}
              alt={artisan.name}
              fill
              className="object-cover object-top"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold">{artisan.name}</h3>
                <Badge variant="secondary" className="text-xs">{artisan.specialization}</Badge>
                {artisan.featured && <Badge className="bg-amber-500 text-white text-xs border-0">Featured</Badge>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{(artisan.rating || 4.5).toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({artisan.reviewsCount || 0})</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{artisan.district}, {artisan.region}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{artisan.experience}</span>
              <span>{artisan.products?.length || 0} products</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{artisan.bio}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {(artisan.achievements || []).slice(0, 1).map((ach, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />{ach}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Heart className="h-4 w-4" /></Button>
                <Link href={`/artisans/${artisan._id}`}>
                  <Button size="sm">View Profile</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ArtisansPage() {
  const [artisans, setArtisans] = useState<Artisan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Filter options — loaded once from the unfiltered fetch
  const [specializations, setSpecializations] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const filterOptionsLoaded = useRef(false)

  // Debounce ref — properly typed with initial null value
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery])

  // Fetch ALL artisans once for building filter options
  useEffect(() => {
    if (filterOptionsLoaded.current) return
    filterOptionsLoaded.current = true
    fetch('/api/artisans?limit=100')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data) {
          const specs = Array.from(new Set<string>(
            (json.data as Artisan[]).map((a) => a.specialization).filter(Boolean)
          )).sort()
          const regs = Array.from(new Set<string>(
            (json.data as Artisan[]).map((a) => a.region).filter(Boolean)
          )).sort()
          setSpecializations(specs)
          setRegions(regs)
        }
      })
      .catch(() => {/* non-fatal */})
  }, [])

  // Fetch artisans whenever filters change
  const fetchArtisans = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('limit', '50')
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (selectedSpecialization !== 'all') params.set('specialization', selectedSpecialization)
      if (selectedRegion !== 'all') params.set('region', selectedRegion)

      const res = await fetch(`/api/artisans?${params.toString()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error || 'API error')

      let data: Artisan[] = json.data || []

      // Client-side sort
      if (sortBy === 'featured') {
        data = [...data].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating || 0) - (a.rating || 0))
      } else if (sortBy === 'rating') {
        data = [...data].sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else if (sortBy === 'products') {
        data = [...data].sort((a, b) => (b.products?.length || 0) - (a.products?.length || 0))
      } else if (sortBy === 'alphabetical') {
        data = [...data].sort((a, b) => a.name.localeCompare(b.name))
      }

      setArtisans(data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load artisans'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, selectedSpecialization, selectedRegion, sortBy])

  useEffect(() => {
    fetchArtisans()
  }, [fetchArtisans])

  const clearAllFilters = () => {
    setSearchQuery("")
    setDebouncedSearch("")
    setSelectedSpecialization("all")
    setSelectedRegion("all")
    setSortBy("featured")
  }

  const hasActiveFilters = !!(searchQuery || selectedSpecialization !== 'all' || selectedRegion !== 'all')
  const featuredArtisans = artisans.filter(a => a.featured).slice(0, 3)

  return (
    <div className="min-h-screen pt-16">
      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-0">
            Meet Our Artisans
          </Badge>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            The Master Craftspeople of Uttarakhand
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the talented artisans who preserve traditional crafts and create authentic
            GI-tagged products with generations of inherited knowledge and skill.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Filters Sidebar ── */}
          <aside className={`lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-card rounded-xl p-6 border shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </h2>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
                    <X className="h-3 w-3 mr-1" /> Clear All
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="text-sm font-medium mb-2 block">Search Artisans</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="artisan-search"
                    placeholder="Name, craft, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Craft Specialization */}
              <div className="mb-5">
                <label className="text-sm font-medium mb-2 block">Craft / Specialization</label>
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger id="filter-specialization">
                    <SelectValue placeholder="All Crafts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Crafts</SelectItem>
                    {specializations.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Region */}
              <div className="mb-5">
                <label className="text-sm font-medium mb-2 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger id="filter-region">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Filters */}
              <div>
                <label className="text-sm font-medium mb-3 block">Quick Filters</label>
                <div className="space-y-2">
                  <Button
                    id="qf-featured"
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm font-medium transition-all ${
                      !hasActiveFilters && sortBy === 'featured'
                        ? 'bg-black text-white hover:bg-black/90 hover:text-white ring-2 ring-amber-400'
                        : 'bg-black text-white hover:bg-black/80 hover:text-white'
                    }`}
                    onClick={() => clearAllFilters()}
                  >
                    ⭐ Featured Artisans
                  </Button>
                  <Button
                    id="qf-artists"
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm font-medium transition-all ${
                      searchQuery === 'art craft wood carving weaving'
                        ? 'bg-black text-white hover:bg-black/90 hover:text-white ring-2 ring-amber-400'
                        : 'bg-black text-white hover:bg-black/80 hover:text-white'
                    }`}
                    onClick={() => {
                      setSearchQuery('art craft wood carving weaving')
                      setSelectedSpecialization('all')
                      setSelectedRegion('all')
                    }}
                  >
                    🎨 Traditional Artists
                  </Button>
                  <Button
                    id="qf-farmers"
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm font-medium transition-all ${
                      searchQuery === 'organic farming cultivation'
                        ? 'bg-black text-white hover:bg-black/90 hover:text-white ring-2 ring-amber-400'
                        : 'bg-black text-white hover:bg-black/80 hover:text-white'
                    }`}
                    onClick={() => {
                      setSearchQuery('organic farming cultivation')
                      setSelectedSpecialization('all')
                      setSelectedRegion('all')
                    }}
                  >
                    🌱 Organic Farmers
                  </Button>
                  <Button
                    id="qf-kumaon"
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm font-medium transition-all ${
                      selectedRegion === 'Kumaon'
                        ? 'bg-black text-white hover:bg-black/90 hover:text-white ring-2 ring-amber-400'
                        : 'bg-black text-white hover:bg-black/80 hover:text-white'
                    }`}
                    onClick={() => { setSelectedRegion('Kumaon'); setSearchQuery('') }}
                  >
                    🏔️ Kumaon Region
                  </Button>
                  <Button
                    id="qf-garhwal"
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm font-medium transition-all ${
                      selectedRegion === 'Garhwal'
                        ? 'bg-black text-white hover:bg-black/90 hover:text-white ring-2 ring-amber-400'
                        : 'bg-black text-white hover:bg-black/80 hover:text-white'
                    }`}
                    onClick={() => { setSelectedRegion('Garhwal'); setSearchQuery('') }}
                  >
                    🏔️ Garhwal Region
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0">

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />Filters
                </Button>
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" /> Loading...</span>
                    : <span><span className="font-medium text-foreground">{artisans.length}</span> artisan{artisans.length !== 1 ? 's' : ''} found</span>
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-select" className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="products">Most Products</SelectItem>
                    <SelectItem value="alphabetical">A–Z</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none border-0"
                    id="view-grid"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-none border-0"
                    id="view-list"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Featured Artisans Banner — only on unfiltered view with loaded data */}
            {!loading && !hasActiveFilters && featuredArtisans.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-serif font-semibold mb-4">⭐ Featured Master Artisans</h2>
                <div className="grid md:grid-cols-3 gap-3">
                  {featuredArtisans.map((artisan) => (
                    <FeaturedMiniCard key={artisan._id} artisan={artisan} />
                  ))}
                </div>
              </div>
            )}

            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}><X className="h-3 w-3 ml-1" /></button>
                  </Badge>
                )}
                {selectedSpecialization !== 'all' && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    {selectedSpecialization}
                    <button onClick={() => setSelectedSpecialization('all')}><X className="h-3 w-3 ml-1" /></button>
                  </Badge>
                )}
                {selectedRegion !== 'all' && (
                  <Badge variant="secondary" className="gap-1 px-3 py-1">
                    {selectedRegion}
                    <button onClick={() => setSelectedRegion('all')}><X className="h-3 w-3 ml-1" /></button>
                  </Badge>
                )}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
                <Button variant="outline" onClick={fetchArtisans}>Try Again</Button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Grid View */}
            {!loading && !error && artisans.length > 0 && viewMode === "grid" && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {artisans.map(a => <ArtisanGridCard key={a._id} artisan={a} />)}
              </div>
            )}

            {/* List View */}
            {!loading && !error && artisans.length > 0 && viewMode === "list" && (
              <div className="space-y-4">
                {artisans.map(a => <ArtisanListCard key={a._id} artisan={a} />)}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && artisans.length === 0 && (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Users className="h-14 w-14 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No artisans found</h3>
                  <p className="text-muted-foreground mb-5">Try adjusting your search or filters.</p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Support Section ── */}
      <section className="py-20 bg-muted/50 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">Support Our Artisan Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your support helps preserve traditional crafts and provides sustainable livelihoods to artisan families across Uttarakhand.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, bg: 'bg-blue-100 dark:bg-blue-950/30', iconColor: 'text-blue-600', title: 'Direct Support', desc: 'Connect with artisans to learn about their traditional techniques and cultural heritage.' },
              { icon: Award, bg: 'bg-green-100 dark:bg-green-950/30', iconColor: 'text-green-600', title: 'Skill Development', desc: 'Support training programs that help artisans improve their skills and reach new markets.' },
              { icon: Heart, bg: 'bg-amber-100 dark:bg-amber-950/30', iconColor: 'text-amber-600', title: 'Cultural Preservation', desc: 'Help preserve traditional knowledge and techniques for future generations.' },
            ].map(({ icon: Icon, bg, iconColor, title, desc }) => (
              <Card key={title} className="text-center border-0 hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className={`${bg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 ${iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
