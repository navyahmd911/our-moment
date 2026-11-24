import { useState, useRef, useEffect, useCallback } from 'react'
import { Volume2, VolumeX, Music, Disc } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { websiteConfig } from '../data/memories'

// Gentle chord progression in F major for romantic acoustic background harmony
const CHORDS = [
  [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj7
  [146.83, 174.61, 220.00, 261.63, 329.63], // Dm9
  [116.54, 146.83, 174.61, 220.00, 293.66], // Bbmaj7
  [130.81, 164.81, 196.00, 293.66, 329.63], // Cadd9
]

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [usingHtmlAudio, setUsingHtmlAudio] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const isPlayingRef = useRef(false)
  const intervalRef = useRef<number | null>(null)
  const stepRef = useRef(0)

  // Web Audio synth fallback note player
  const playSynthNote = useCallback((freq: number, duration: number, delay: number, velocity: number = 0.08) => {
    if (!audioContextRef.current || isMuted) return
    const ctx = audioContextRef.current

    try {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)

      const startTime = ctx.currentTime + delay
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(velocity, startTime + 0.04)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.start(startTime)
      osc.stop(startTime + duration)
    } catch {
      // Audio context closing or inactive
    }
  }, [isMuted])

  const triggerNextSynthChord = useCallback(() => {
    if (!isPlayingRef.current) return
    const chord = CHORDS[stepRef.current % CHORDS.length]
    stepRef.current += 1

    chord.forEach((note, index) => {
      const noteDelay = index * 0.35 + (Math.random() * 0.05)
      const duration = 2.8
      playSynthNote(note, duration, noteDelay, index === 0 ? 0.12 : 0.07)
    })
  }, [playSynthNote])

  // Toggle play/pause handler
  const togglePlay = async () => {
    if (isPlaying) {
      // Pause action
      isPlayingRef.current = false
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
      return
    }

    // Try HTML5 Audio element first with user's MP3 file in public/music/hannah-montana.mp3
    if (!audioRef.current) {
      audioRef.current = new Audio(websiteConfig.music.src)
      audioRef.current.loop = true
    }

    try {
      await audioRef.current.play()
      setUsingHtmlAudio(true)
      setIsPlaying(true)
      isPlayingRef.current = true
    } catch {
      // If audio file doesn't exist yet (404 / decode error), seamlessly fall back to gentle synth melody
      setUsingHtmlAudio(false)
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioContextRef.current = new AudioCtx()
      }
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      isPlayingRef.current = true
      setIsPlaying(true)
      triggerNextSynthChord()
      intervalRef.current = window.setInterval(() => {
        triggerNextSynthChord()
      }, 2600)
    }
  }

  const toggleMute = () => {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    if (audioRef.current) {
      audioRef.current.muted = nextMuted
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
      }
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 shadow-xs cursor-pointer ${
          isPlaying
            ? 'bg-[#EBCFD3]/80 border-[#D4A9AF] text-[#533E43] shadow-[#EBCFD3]/50'
            : 'bg-white/80 border-[#E5DCD3] text-[#765B62] hover:bg-[#F8F2EA]'
        }`}
        title={
          isPlaying
            ? `Jeda Musik (${websiteConfig.music.title})`
            : `Putar Musik ("${websiteConfig.music.title}" – ${websiteConfig.music.artist})`
        }
      >
        <span className="relative flex items-center justify-center">
          <Disc
            className={`w-3.5 h-3.5 ${
              isPlaying ? 'animate-spin text-[#765B62]' : 'text-[#9B7B83]'
            }`}
            style={{ animationDuration: '4s' }}
          />
          {isPlaying && (
            <motion.span
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute w-2 h-2 rounded-full bg-[#D4A9AF]"
            />
          )}
        </span>

        <span className="hidden sm:inline font-sans">
          {isPlaying
            ? `${websiteConfig.music.title}`
            : 'Putar Musik'}
        </span>

        <AnimatePresence>
          {isPlaying && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex items-center gap-0.5 ml-0.5 text-xs text-[#765B62]"
            >
              <Music className="w-3 h-3 text-[#765B62]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {isPlaying && (
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-full bg-white/70 border border-[#E5DCD3] text-[#765B62] hover:bg-[#F8F2EA] transition cursor-pointer"
          title={isMuted ? 'Bunyikan' : 'Senyapkan'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#765B62]" />}
        </button>
      )}

      {/* Helper text tooltip for user audio upload */}
      {isPlaying && !usingHtmlAudio && (
        <span className="hidden lg:inline text-[10px] text-[#9B7B83] italic">
          (Melodi piano aktif • Masukkan {websiteConfig.music.src} untuk lagu asli)
        </span>
      )}
    </div>
  )
}
