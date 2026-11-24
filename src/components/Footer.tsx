import { Heart, Sparkles, ArrowUp } from 'lucide-react'
import { websiteConfig } from '../data/memories'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-[#F8F2EA] border-t border-[#EBCFD3] pt-16 pb-12 overflow-hidden text-stone-600">
      {/* Decorative ambient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#EBCFD3]/40 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        
        {/* Heart icon with gentle pulse */}
        <div className="w-12 h-12 rounded-full bg-[#EBCFD3] border border-white flex items-center justify-center text-[#765B62] shadow-xs mb-6">
          <Heart className="w-6 h-6 fill-[#765B62]" />
        </div>

        {/* Tagline */}
        <p className="font-serif italic text-xl sm:text-2xl text-[#533E43] max-w-xl leading-relaxed">
          &ldquo;{websiteConfig.tagline}&rdquo;
        </p>

        {/* Couple names & calling */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className="font-script text-3xl sm:text-4xl text-[#765B62]">
            {websiteConfig.partner1} &amp; {websiteConfig.partner2}
          </span>
          <span className="text-xs font-handwriting text-[#9B7B83]">
            {websiteConfig.ifaCallForNavy} &bull; {websiteConfig.navyCallForIfa}
          </span>
        </div>

        {/* Decorative divider */}
        <div className="w-32 h-[1px] bg-[#D4A9AF]/60 my-7 flex items-center justify-center">
          <Sparkles className="w-3 h-3 text-[#9B7B83] bg-[#F8F2EA] px-1" />
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-stone-50 border border-[#E5DCD3] text-xs font-medium text-[#765B62] shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Kembali ke Atas</span>
        </button>

        {/* Copyright */}
        <div className="mt-8 text-[11px] text-[#9B7B83] font-sans">
          {websiteConfig.name} &bull; Dibuat khusus dengan cinta &copy; 2026
        </div>
      </div>
    </footer>
  )
}
