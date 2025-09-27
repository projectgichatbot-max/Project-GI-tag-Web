import { NextRequest } from 'next/server'
import OpenAI from 'openai'

// Production-oriented speech-to-text endpoint using OpenAI Whisper (reliable quality)
// Expects multipart/form-data or JSON with base64 audio; returns { text }
// POST /api/speech

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''

    let file: File | null = null

    let language: string | undefined

    if (contentType.startsWith('multipart/form-data')) {
      const formData = await req.formData()
      const langField = formData.get('lang')
      if (typeof langField === 'string' && langField.trim().length > 0) language = langField
      const blob = formData.get('file')
      if (!(blob instanceof File)) {
        return new Response(JSON.stringify({ error: 'file field required' }), { status: 400 })
      }
      file = blob
    } else {
      // Assume JSON { base64: string, mime?: string }
      const body = await req.json().catch(() => null)
      if (!body?.base64) {
        return new Response(JSON.stringify({ error: 'Provide base64 audio' }), { status: 400 })
      }
      const bytes = Buffer.from(body.base64, 'base64')
      file = new File([bytes], `audio.${body.mime?.split('/')?.[1] || 'webm'}`, { type: body.mime || 'audio/webm' })
      if (typeof body.lang === 'string') language = body.lang
    }

    // Whisper supports many formats; webm/ogg/mp3/m4a fine.
    const transcription = await openai.audio.transcriptions.create({
      model: 'gpt-4o-transcribe',
      file,
      response_format: 'json',
      ...(language ? { language } : {}),
    })
    const text = typeof (transcription as unknown as { text?: string })?.text === 'string'
      ? (transcription as unknown as { text?: string }).text!
      : ''
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[speech] error', err)
    return new Response(JSON.stringify({ error: 'Transcription failed', detail: message }), { status: 500 })
  }
}
