import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, ArrowDown, BookOpen, Clock, Home, MapPin } from 'lucide-react'
import { websiteConfig } from '../data/memories'

export default function Hero() {
  const [totalDaysTogether, setTotalDaysTogether] = useState<number>(0)

  useEffect(() => {
    const calcDays = () => {
      const now = new Date()
      const start = new Date(websiteConfig.officialDate)
      const diff = now.getTime() - start.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      setTotalDaysTogether(days > 0 ? days : 0)
    }
    calcDays()
  }, [])

  const scrollTo = (id: string) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-[92vh] pt-32 pb-20 flex items-center overflow-hidden">
      {/* Ambient gradient */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#EBCFD3]/30 via-[#DCE8E5]/25 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Couple Story & Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start"
          >
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#EBCFD3] text-[#765B62] text-xs font-medium tracking-wide mb-6 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#9B7B83]" />
              <span>{websiteConfig.name} &bull; Personal Memory Book</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#533E43] tracking-tight leading-[1.15]">
              {websiteConfig.name}
            </h1>

            {/* Couple names & sweet callings */}
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-script text-3xl sm:text-4xl text-[#765B62]">
                  {websiteConfig.partner1}
                </span>
                <span className="text-[11px] font-handwriting text-[#9B7B83] -mt-1">
                  (Panggilan Ifa: &ldquo;{websiteConfig.ifaCallForNavy}&rdquo;)
                </span>
              </div>

              <Heart className="w-5 h-5 text-[#EBCFD3] fill-[#EBCFD3] mx-1" />

              <div className="flex flex-col items-center lg:items-start">
                <span className="font-script text-3xl sm:text-4xl text-[#765B62]">
                  {websiteConfig.partner2}
                </span>
                <span className="text-[11px] font-handwriting text-[#9B7B83] -mt-1">
                  (Panggilan Navy: &ldquo;{websiteConfig.navyCallForIfa}&rdquo;)
                </span>
              </div>
            </div>

            {/* Tagline */}
            <p className="mt-4 font-serif italic text-stone-700 text-base sm:text-lg">
              &ldquo;{websiteConfig.tagline}&rdquo;
            </p>

            {/* Key Information Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBCFD3]/50 border border-[#D4A9AF]/40 text-[#765B62] font-medium">
                <Clock className="w-3.5 h-3.5 text-[#765B62]" />
                <span>{totalDaysTogether} Hari Bersama (Sejak 1 Juni 2026)</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE8E5]/70 border border-[#AFC4C0]/40 text-[#533E43] font-medium">
                <span>Status: {websiteConfig.status}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E5DCD3] text-[#765B62]">
                <MapPin className="w-3.5 h-3.5 text-[#9B7B83]" />
                <span>Kota Bertemu: {websiteConfig.meetingCity}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E5DCD3] text-[#765B62]">
                <Home className="w-3.5 h-3.5 text-[#9B7B83]" />
                <span>Favorit: {websiteConfig.favoritePlace}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => scrollTo('#memories')}
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#765B62] hover:bg-[#533E43] text-white text-xs sm:text-sm font-medium tracking-wide transition shadow-sm hover:shadow active:scale-95 cursor-pointer"
              >
                <span>Lihat Foto Kenangan</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => scrollTo('#letters')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#F8F2EA] border border-[#E5DCD3] text-[#765B62] text-xs sm:text-sm font-medium tracking-wide transition shadow-xs active:scale-95 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#9B7B83]" />
                <span>Buka Surat Digital</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Main Couple Photo Placeholder (Polaroid Scrapbook) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            <div className="relative w-72 sm:w-80">
              
              {/* Polaroid Frame */}
              <div className="w-full bg-white p-4 pb-8 rounded-xl shadow-polaroid-hover border border-[#E5DCD3] rotate-[2deg] hover:rotate-0 transition-transform duration-500 cursor-pointer">
                {/* Washi tape on top */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#EBCFD3]/90 -rotate-1 shadow-xs z-30" />

                <div className="w-full aspect-4/5 bg-[#F8F2EA] rounded-sm overflow-hidden border border-[#EBE3D9] relative flex items-center justify-center">
                  <img
                    src={websiteConfig.heroPhoto}
                    alt="Our Moment - Navy & Ifa"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="mt-4 text-center">
                  <p className="font-handwriting text-2xl text-[#533E43]">
                    {websiteConfig.partner1} &amp; {websiteConfig.partner2} ♥
                  </p>
                  <p className="font-sans text-[11px] text-[#9B7B83] tracking-wider uppercase mt-0.5">
                    {websiteConfig.name}
                  </p>
                </div>
              </div>

              {/* Decorative side stamp badge */}
              <div className="absolute -bottom-3 -left-4 z-30 bg-[#DCE8E5] border border-white text-[#533E43] w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-md rotate-[-10deg]">
                <Sparkles className="w-4 h-4 text-[#765B62]" />
                <span className="text-[9px] font-bold tracking-tighter">LOVE</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
