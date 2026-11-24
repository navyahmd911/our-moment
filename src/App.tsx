
import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, Pause, Music2 } from 'lucide-react'
import { AuthProvider } from './context/AuthContext'
import AccessGate from './components/AccessGate'
import AuthModal from './components/AuthModal'
import OpeningPage from './components/OpeningPage'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Memories from './components/Memories'
import Journey from './components/Journey'
import Letters from './components/Letters'
import SpecialDates from './components/SpecialDates'
import Footer from './components/Footer'
import FloatingPetals from './components/FloatingPetals'

export default function App() {
  const [showOpening, setShowOpening] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const startMusic = async () => {
      if (!audioRef.current) {
        const audio = new Audio('/music/backsound.mp3')
        audio.loop = true
        audio.volume = 0.35
        audioRef.current = audio
      }

      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch (error) {
        console.error('Musik gagal diputar:', error)
        setIsPlaying(false)
      }
    }

    window.addEventListener('start-our-moment-music', startMusic)

    return () => {
      window.removeEventListener('start-our-moment-music', startMusic)
      audioRef.current?.pause()
      audioRef.current = null
    }
  }, [])

  const toggleMusic = async () => {
    if (!audioRef.current) {
      const audio = new Audio('/music/backsound.mp3')
      audio.loop = true
      audio.volume = 0.35
      audioRef.current = audio
    }

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play()
        setIsPlaying(true)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    } catch (error) {
      console.error('Musik gagal diputar:', error)
      setIsPlaying(false)
    }
  }

  return (
    <AuthProvider>
      <AccessGate>
        <div className="min-h-screen bg-[#F8F2EA] text-[#765B62] font-sans relative selection:bg-[#EBCFD3] selection:text-[#533E43]">

          <FloatingPetals />

          <AuthModal />

          <AnimatePresence mode="wait">
            {showOpening && (
              <OpeningPage onOpen={() => setShowOpening(false)} />
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 flex flex-col min-h-screen"
          >
            <Navbar onReopenIntro={() => setShowOpening(true)} />

            <main className="flex-1">
              <Hero />
              <Memories />
              <Journey />
              <Letters />
              <SpecialDates />
            </main>

            <Footer />
          </motion.div>

          {/* Floating Music Player */}
          {!showOpening && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleMusic}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#765B62] text-white shadow-lg border border-[#EBCFD3]/40 hover:bg-[#533E43] transition-colors cursor-pointer"
            >
              <span className="relative flex items-center justify-center">
                <Music2 className="w-4 h-4 text-[#EBCFD3]" />
                {isPlaying && (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    className="absolute -inset-1.5 rounded-full border border-dashed border-[#EBCFD3]/60"
                  />
                )}
              </span>

              <span className="text-xs font-medium">
                {isPlaying ? 'Playing' : 'Play Music'}
              </span>

              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </motion.button>
          )}

        </div>
      </AccessGate>
    </AuthProvider>
  )
}
