"use client"

import { useState } from 'react'
import { createRecorder, transcribeBlob, speak } from '@/lib/speech-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Mic, Square, Volume2 } from 'lucide-react'

const recorder = typeof window !== 'undefined' ? createRecorder() : null

export function SpeechConsole() {
  const [text, setText] = useState('')
  const [lang, setLang] = useState<'hi-IN' | 'en-IN'>('hi-IN')
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'error'>('idle')
  const [err, setErr] = useState<string | null>(null)

  async function handleRecord() {
    if (!recorder) return
    try {
      await recorder.start()
      setErr(null)
      setStatus('recording')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to start recorder'
      setErr(message)
      setStatus('error')
    }
  }

  async function handleStop() {
    if (!recorder) return
    setStatus('processing')
    const blob = await recorder.stop()
    if (!blob) { setStatus('idle'); return }
    try {
      const t = await transcribeBlob(blob, lang)
      setText(t)
      setStatus('idle')
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Transcription failed'
      setErr(message)
      setStatus('error')
    }
  }

  const unsupported = !!(recorder && !recorder.supported())

  return (
    <Card className="border-0 bg-muted/40">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Language:</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'hi-IN' | 'en-IN')}
              className="rounded-md border bg-background px-2 py-1 text-xs"
            >
              <option value="hi-IN">Hindi (hi-IN)</option>
              <option value="en-IN">English (en-IN)</option>
            </select>
          </div>
          {unsupported && (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
              Your browser does not support MediaRecorder. Please use Chrome / Edge or update your browser.
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Badge className={status === 'recording' ? 'bg-black text-white border-0' : 'bg-black text-white border-0'}>
            {status === 'recording' ? 'Recording' : status === 'processing' ? 'Processing' : 'Idle'}
          </Badge>
          {status === 'processing' && <Loader2 className="h-4 w-4 animate-spin" />}
          {err && <span className="text-xs text-red-500">{err}</span>}
        </div>
        <div className="flex gap-3">
          {status !== 'recording' && (
            <Button disabled={status === 'processing' || unsupported} onClick={handleRecord}>
              <Mic className="h-4 w-4 mr-2" /> Start
            </Button>
          )}
          {status === 'recording' && (
            <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={handleStop}>
              <Square className="h-4 w-4 mr-2" /> Stop
            </Button>
          )}
          <Button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground" onClick={() => speak(text || 'Koi transcript nahin mila')} disabled={!text}>
            <Volume2 className="h-4 w-4 mr-2" /> Speak
          </Button>
        </div>
        <div className="min-h-[120px] whitespace-pre-wrap text-sm rounded-md bg-background p-3 border">
          {text || 'Press Start, speak, then Stop to transcribe.'}
        </div>
      </CardContent>
    </Card>
  )
}
