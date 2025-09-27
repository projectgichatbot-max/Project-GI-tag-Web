import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, User, Heart, Share2, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// This would typically come from a database or CMS
const getBlogPost = (id: string) => {
  const posts = {
    "1": {
      id: 1,
      title: "The Ancient Art of Aipan: Sacred Geometry in Uttarakhand Culture",
      content: `
        <p>Aipan art represents more than decoration—it's a sacred practice that has preserved mathematical concepts and spiritual beliefs for centuries in the mountains of Uttarakhand.</p>
        
        <h2>The Sacred Mathematics of Aipan</h2>
        <p>Every Aipan design follows precise geometric principles that reflect the cosmic order. The intricate patterns, drawn with rice paste on red ochre backgrounds, incorporate mathematical concepts like symmetry, fractals, and golden ratios that were understood by mountain communities long before modern mathematics formalized these principles.</p>
        
        <h2>Cultural Significance and Rituals</h2>
        <p>Aipan art is deeply intertwined with the spiritual life of Uttarakhand's communities. These designs are created during festivals, weddings, and religious ceremonies, serving as both decoration and spiritual protection. Each pattern has specific meanings and is believed to invite prosperity, ward off evil, and connect the earthly realm with the divine.</p>
        
        <h2>Traditional Techniques and Materials</h2>
        <p>The art form uses only natural materials: red ochre (geru) mixed with water for the base, and rice paste (pithhar) for the white designs. The tools are simple—fingers, twigs, and sometimes brushes made from local materials. This simplicity belies the complexity and precision required to create the intricate patterns.</p>
        
        <h2>Preservation Challenges and Modern Adaptations</h2>
        <p>As younger generations migrate to cities and traditional practices face the pressure of modernization, Aipan art faces the risk of being lost. However, cultural preservation efforts and the GI tagging of this art form are helping to maintain its authenticity while allowing for contemporary adaptations that keep the tradition alive.</p>
        
        <h2>Learning and Practicing Aipan Today</h2>
        <p>Today, Aipan art is being taught in schools and cultural centers across Uttarakhand. Workshops and online tutorials are making this ancient art form accessible to a global audience, ensuring that the sacred geometry and cultural wisdom embedded in these patterns continue to inspire future generations.</p>
      `,
      author: "Dr. Meera Bisht",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "Traditional Arts",
      tags: ["Aipan", "Sacred Art", "Cultural Heritage", "Mathematics"],
      image: "/aipan-art-traditional-patterns-geometric.jpg",
    },
  }

  return posts[id as keyof typeof posts] || null
}

// Temporarily relax param typing to satisfy Next.js generated PageProps inference
export default function BlogPostPage({ params }: any) {
  const post = getBlogPost(params.id)

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="mb-4 bg-amber-600 hover:bg-amber-700 text-white border-transparent">{post.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">{post.title}</h1>
              <div className="flex items-center justify-center gap-6 text-amber-100">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/blog">
              <Button className="group bg-transparent border border-input hover:bg-accent hover:text-accent-foreground">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Article Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge key={tag} className="text-foreground border">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Article Body */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <Separator className="my-8" />

              {/* Article Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button className="h-8 rounded-md px-3 text-xs border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                    <Heart className="mr-2 h-4 w-4" />
                    Like Article
                  </Button>
                  <Button className="h-8 rounded-md px-3 text-xs border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Published on {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/munsiyari-rajma-kidney-beans-red.jpg"
                      alt="Related article"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-balance">
                      Munsiyari Rajma: The Himalayan Superfood
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Explore the nutritional powerhouse that has sustained mountain communities...
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src="/traditional-woolen-caps-coats-uttarakhand-winter-w.jpg"
                      alt="Related article"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-balance">
                      Ringaal Craft: Weaving Sustainability
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Learn how artisans transform mountain bamboo into beautiful products...
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
