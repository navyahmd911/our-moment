import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, BookOpen } from 'lucide-react'
import { websiteConfig } from '../data/memories'

interface OpeningPageProps {
  onOpen: () => void
}

export default function OpeningPage({ onOpen }: OpeningPageProps) {
  const [isOpening, setIsOpening] = useState(false)


  const handleOpenClick = () => {
  setIsOpening(true)
  window.dispatchEvent(new Event('start-our-moment-music'))

  setTimeout(() => {
    onOpen()
  }, 1100)
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8F2EA] px-4 overflow-hidden selection:bg-[#EBCFD3]">
      {/* Decorative ambient blurs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#EBCFD3]/35 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#DCE8E5]/40 blur-3xl pointer-events-none" />

      {/* Decorative corner accents */}
      <div className="absolute top-8 left-8 text-[#9B7B83]/40 font-serif text-sm tracking-widest hidden sm:block">
        EST. 2026
      </div>
      <div className="absolute bottom-8 right-8 text-[#9B7B83]/40 font-script text-2xl hidden sm:block">
        {websiteConfig.name}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-md w-full text-center relative z-20 flex flex-col items-center"
      >
        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EBCFD3]/50 border border-[#D4A9AF]/40 text-[#765B62] text-xs font-medium tracking-wide mb-6 shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#9B7B83]" />
          <span>A Love Story Collection</span>
        </motion.div>

        {/* Envelope Graphic */}
        <div className="relative w-72 h-52 sm:w-80 sm:h-56 my-3">
          <div className="w-full h-full bg-[#FFFDF9] rounded-2xl border-2 border-[#E5DCD3] shadow-letter p-4 relative flex flex-col items-center justify-center overflow-hidden">
            {/* Washi tape decor */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-7 bg-[#EBCFD3]/90 -rotate-1 shadow-xs z-30" />

            {/* Envelope Flap */}
            <motion.div
              animate={isOpening ? { rotateX: 180, opacity: 0 } : { rotateX: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-0 left-0 right-0 h-28 bg-[#F3ECE3] border-b border-[#E5DCD3] origin-top z-20 shadow-xs flex items-center justify-center rounded-t-2xl"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
              }}
            >
              <div className="w-9 h-9 rounded-full bg-[#EBCFD3] border-2 border-white flex items-center justify-center shadow-xs translate-y-3">
                <Heart className="w-4 h-4 fill-[#765B62] text-[#765B62]" />
              </div>
            </motion.div>

            {/* Letter peek */}
            <motion.div
              animate={isOpening ? { y: -80, opacity: [1, 0] } : { y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-11/12 h-4/5 bg-white rounded-lg border border-[#EBE3D9] p-4 flex flex-col items-center justify-center text-center shadow-xs"
            >
              <span className="font-script text-3xl text-[#765B62]">
                {websiteConfig.partner1} &amp; {websiteConfig.partner2}
              </span>
              <p className="font-handwriting text-base text-[#9B7B83] mt-1">
                {websiteConfig.tagline}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Headings */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-serif text-3xl sm:text-4xl text-[#533E43] font-normal tracking-tight mt-4"
        >
          {websiteConfig.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex items-center gap-2 mt-1 text-[#765B62] font-script text-2xl"
        >
          <span>{websiteConfig.partner1}</span>
          <Heart className="w-4 h-4 text-[#D4A9AF] fill-[#D4A9AF]" />
          <span>{websiteConfig.partner2}</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-stone-600 font-sans text-xs sm:text-sm max-w-sm mt-3 leading-relaxed"
        >
          {websiteConfig.tagline}
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-7"
        >
          <button
            onClick={handleOpenClick}
            disabled={isOpening}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#765B62] hover:bg-[#533E43] text-white text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-75"
          >
            <AnimatePresence mode="wait">
              {isOpening ? (
                <motion.span
                  key="opening"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 animate-bounce" />
                  <span>Membuka Kenangan...</span>
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2.5"
                >
                  <Heart className="w-4 h-4 text-[#EBCFD3] fill-[#EBCFD3] group-hover:scale-125 transition-transform" />
                  <span>Open Our Memories</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
