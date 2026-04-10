"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, MessageSquare, Loader2 } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          subject: subject || "General Inquiry",
          message,
          addressHint: "Dehradun",
        }),
      })

      const json = await res.json()
      if (!res.ok || !json?.success) {
        toast.error(json?.error || "Failed to send message. Please try again.")
        return
      }

      toast.success(`Message sent. Ticket: ${json.data.ticketNumber}`)
      setName("")
      setEmail("")
      setPhone("")
      setSubject("")
      setMessage("")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen pt-16">
      <section className="py-14 bg-muted">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <Badge className="mb-4 bg-black text-white border-0">Contact</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Questions, feedback, or collaboration ideas—send us a message and we’ll get back to you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left: Contact details + Map */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Reach us directly</CardTitle>
                  <p className="text-muted-foreground">We’re based in Dehradun.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <a className="text-sm text-muted-foreground underline" href="mailto:projectgichatbot@gmail.com">
                        projectgichatbot@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Phone</div>
                      <a className="text-sm text-muted-foreground underline" href="tel:+919720444666">
                        097204 44666
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Address</div>
                      <div className="text-sm text-muted-foreground">Dehradun, Uttarakhand</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">Locate us:</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <iframe
                    title="Dehradun Google Map"
                    src="https://www.google.com/maps?q=Dehradun,+Uttarakhand&output=embed"
                    className="w-full h-80 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right: Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-serif">Send a message</CardTitle>
                <p className="text-muted-foreground">Your message will be saved in MongoDB (`contacts` collection).</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone (optional)</label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="097204 44666" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="min-h-[140px]"
                      placeholder="Write your message..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-black text-white hover:bg-blue-500 hover:text-black"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message <MessageSquare className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
