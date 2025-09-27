// Client utilities for recording audio and calling the /api/speech endpoint
// Uses MediaRecorder (webm/opus) and falls back gracefully.

export interface RecorderController {
  start: () => Promise<void>
  stop: () => Promise<Blob | null>
  isRecording: () => boolean
  supported: () => boolean
}

export function createRecorder(): RecorderController {
  let mediaRecorder: MediaRecorder | null = null
  let chunks: BlobPart[] = []
  let recording = false

  async function start() {
    if (recording) return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
    chunks = []
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }
    mediaRecorder.start()
    recording = true
  }

  async function stop(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!mediaRecorder) return resolve(null)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        mediaRecorder?.stream.getTracks().forEach(t => t.stop())
        recording = false
        resolve(blob)
      }
      mediaRecorder.stop()
    })
  }

  function supported() {
    return typeof window !== 'undefined' && 'MediaRecorder' in window
  }

  return { start, stop, isRecording: () => recording, supported }
}

export async function transcribeBlob(blob: Blob, lang?: string): Promise<string> {
  const form = new FormData()
  form.append('file', blob, 'speech.webm')
  if (lang) form.append('lang', lang)
  const res = await fetch('/api/speech', { method: 'POST', body: form })
  if (!res.ok) throw new Error('Transcription failed')
  const data = await res.json()
  return data.text || ''
}

// Basic browser TTS fallback
export function speak(text: string, voiceHint?: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  if (voiceHint) {
    const voice = speechSynthesis.getVoices().find(v => v.name.includes(voiceHint))
    if (voice) u.voice = voice
  }
  speechSynthesis.speak(u)
}
