"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

type SearchResult = {
  products?: any[]
  artisans?: any[]
  total?: number
}

export default function SearchPage() {
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult | null>(null)

  const runSearch = async () => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=all&limit=50`)
      const data = await res.json()
      if (data.success) setResults(data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handler = setTimeout(runSearch, 300)
    return () => clearTimeout(handler)
  }, [q])
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold mb-6">Search</h1>
        <div className="flex items-center space-x-2 mb-8">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, artisans, heritage..." onKeyDown={(e) => e.key === 'Enter' && runSearch()} />
          <Button onClick={runSearch}><Search className="h-4 w-4 mr-2" />Search</Button>
        </div>
        {loading && <p className="text-muted-foreground">Searching...</p>}
        {results && (
          <div className="space-y-6">
            {results.products?.length ? (
              <div>
                <h2 className="font-semibold mb-2">Products</h2>
                <ul className="list-disc pl-5">
                  {results.products.slice(0, 10).map((p: any, i: number) => (
                    <li key={i}><Link href={`/products/${p._id || p.id || ''}`}>{p.name || p.title}</Link></li>
                  ))}
                </ul>
              </div>
            ) : null}
            {results.artisans?.length ? (
              <div>
                <h2 className="font-semibold mb-2">Artisans</h2>
                <ul className="list-disc pl-5">
                  {results.artisans.slice(0, 10).map((a: any, i: number) => (
                    <li key={i}><Link href={`/artisans/${a._id || a.id || ''}`}>{a.name}</Link></li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
        <p className="text-muted-foreground">Try browsing our curated sections instead:</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/products"><Button variant="outline">Products</Button></Link>
          <Link href="/artisans"><Button variant="outline">Artisans</Button></Link>
          <Link href="/heritage"><Button variant="outline">Heritage</Button></Link>
        </div>
      </div>
    </div>
  )
}


