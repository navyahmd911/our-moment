
import { useState, useEffect } from 'react'
import {
  Heart, Menu, X, BookHeart, User,
  LogOut, LogIn, Music2, Play, Pause
} from 'lucide-react'
import { websiteConfig } from '../data/memories'
import { useAuth } from '../context/useAuth'

interface NavbarProps {
  onReopenIntro?: () => void
  isPlaying: boolean
  onToggleMusic: () => void
}

export default function Navbar({
  onReopenIntro,
  isPlaying,
  onToggleMusic,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, profile, openAuthModal, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Beranda', href: '#hero' },
    { name: 'Kenangan', href: '#memories' },
    { name: 'Perjalanan', href: '#journey' },
    { name: 'Surat', href: '#letters' },
    { name: 'Tanggal Spesial', href: '#dates' },
  ]

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    setMobileMenuOpen(false)

    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8F2EA]/90 backdrop-blur-md shadow-xs border-b border-[#EBCFD3]/60 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => scrollToSection(e, '#hero')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-[#EBCFD3] border border-white flex items-center justify-center text-[#765B62] shadow-xs group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-[#765B62]" />
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-lg font-medium text-[#533E43] tracking-tight">
              {websiteConfig.name}
            </span>
            <span className="text-[10px] tracking-widest text-[#9B7B83] uppercase -mt-1 font-sans">
              {websiteConfig.partner1} &amp; {websiteConfig.partner2}
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs tracking-wider uppercase font-medium text-[#765B62]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="hover:text-[#533E43] relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#D4A9AF] hover:after:w-full after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {/* New Music Player Button */}
          <button
            type="button"
            onClick={onToggleMusic}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            title={isPlaying ? 'Pause music' : 'Play music'}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#EBCFD3]/50 hover:bg-[#EBCFD3]/80 border border-[#D4A9AF]/40 text-[#765B62] shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <span className="relative flex items-center justify-center">
              <Music2 className="w-4 h-4 text-[#9B7B83]" />

              {isPlaying && (
                <span className="absolute -inset-1.5 rounded-full border border-dashed border-[#D4A9AF] animate-spin" />
              )}
            </span>

            <span className="hidden sm:inline text-xs font-medium">
              {isPlaying ? 'Playing' : 'Play Music'}
            </span>

            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
          </button>

          {/* User Authentication */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/80 border border-[#E5DCD3] shadow-xs text-xs">
              <span className="flex items-center gap-1 font-medium text-[#533E43]">
                <User className="w-3.5 h-3.5 text-[#D4A9AF]" />
                <span>Hai, {profile?.name || 'Partner'}</span>
              </span>

              <button
                onClick={signOut}
                title="Keluar akun"
                className="p-1 rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans text-[#765B62] bg-white/80 hover:bg-[#F8F2EA] border border-[#E5DCD3] transition shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-[#9B7B83]" />
              <span>Masuk Akun</span>
            </button>
          )}

          {/* Reopen Intro */}
          {onReopenIntro && (
            <button
              onClick={onReopenIntro}
              title="Buka kembali halaman pembuka"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-sans text-[#765B62] bg-[#EBCFD3]/40 hover:bg-[#EBCFD3]/70 border border-[#D4A9AF]/40 transition cursor-pointer"
            >
              <BookHeart className="w-3.5 h-3.5" />
              <span>Sampul</span>
            </button>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#765B62] hover:bg-[#EBCFD3]/40 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF9] border-b border-[#EBCFD3] px-6 py-5 shadow-lg flex flex-col gap-3.5">

          <div className="pb-2 border-b border-[#EBE3D9] flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-medium text-[#533E43] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#D4A9AF]" />
                  <span>Akun: {profile?.name || user.email}</span>
                </span>

                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="text-xs text-rose-600 flex items-center gap-1"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  openAuthModal()
                }}
                className="w-full py-2 rounded-xl bg-[#765B62] text-white text-xs font-medium flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5 text-[#EBCFD3]" />
                <span>Masuk sebagai Navy / Ifa</span>
              </button>
            )}
          </div>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="text-sm font-medium text-[#765B62] hover:text-[#533E43] py-1 border-b border-stone-100 flex items-center justify-between"
            >
              <span>{link.name}</span>
              <Heart className="w-3 h-3 text-[#D4A9AF]" />
            </a>
          ))}

          {onReopenIntro && (
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onReopenIntro()
              }}
              className="mt-1 flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#765B62] bg-[#EBCFD3]/40 rounded-xl"
            >
              <BookHeart className="w-4 h-4" />
              <span>Buka Kembali Halaman Sampul</span>
            </button>
          )}
        </div>
      )}
    </header>
  )
}
