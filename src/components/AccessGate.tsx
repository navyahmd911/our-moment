import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Heart, KeyRound, AlertCircle } from 'lucide-react'
import { websiteConfig } from '../data/memories'

interface AccessGateProps {
  children: React.ReactNode
}

// SHA-256 generator in pure Web Crypto API (standard browser built-in)
async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message.trim())
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function AccessGate({ children }: AccessGateProps) {
  const isProtectionEnabled = import.meta.env.VITE_ENABLE_PASSWORD_PROTECTION === 'true'
  const targetHash = (import.meta.env.VITE_ACCESS_PASSWORD_HASH as string || '').trim().toLowerCase()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Jika proteksi tidak diaktifkan, langsung lolos
    if (!isProtectionEnabled || !targetHash) return true
    return sessionStorage.getItem('our_moment_auth') === 'granted'
  })

  const [inputPassword, setInputPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputPassword) return

    setIsLoading(true)
    setErrorMessage('')

    try {
      const computedHash = await sha256(inputPassword)
      if (computedHash === targetHash) {
        sessionStorage.setItem('our_moment_auth', 'granted')
        setIsAuthenticated(true)
      } else {
        setErrorMessage('Password belum tepat. Coba masukkan kata sandi rahasia kita.')
      }
    } catch {
      setErrorMessage('Terjadi kendala saat memverifikasi sandi.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#F8F2EA] flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-[#EBCFD3]/40 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#E5DCD3] shadow-letter relative z-10 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-[#EBCFD3] text-[#765B62] border border-white mx-auto flex items-center justify-center shadow-xs mb-4">
          <Lock className="w-6 h-6 text-[#765B62]" />
        </div>

        <span className="text-[11px] uppercase tracking-widest font-semibold text-[#9B7B83]">
          Ruang Pribadi
        </span>

        <h2 className="font-serif text-2xl text-[#533E43] font-normal mt-1 mb-2">
          {websiteConfig.name}
        </h2>

        <p className="text-xs text-stone-600 mb-6 leading-relaxed">
          Website ini didedikasikan khusus untuk <strong>{websiteConfig.partner1}</strong> &amp; <strong>{websiteConfig.partner2}</strong>. Masukkan kata sandi untuk membukanya.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Masukkan kata sandi..."
              value={inputPassword}
              onChange={(e) => {
                setInputPassword(e.target.value)
                setErrorMessage('')
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F2EA]/70 border border-[#E5DCD3] text-[#765B62] placeholder:text-[#B49FA5] text-sm focus:outline-none focus:border-[#D4A9AF] transition"
              autoFocus
            />
            <KeyRound className="w-4 h-4 text-[#B49FA5] absolute right-3.5 top-3.5" />
          </div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-xs text-rose-600 justify-center bg-rose-50 py-2 px-3 rounded-lg border border-rose-200"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading || !inputPassword}
            className="w-full py-3 rounded-xl bg-[#765B62] hover:bg-[#533E43] text-white text-xs sm:text-sm font-medium tracking-wide transition shadow-xs active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 text-[#EBCFD3] fill-[#EBCFD3]" />
            <span>{isLoading ? 'Memeriksa...' : 'Buka Kenangan'}</span>
          </button>
        </form>

        <p className="mt-5 text-[11px] text-[#9B7B83] font-sans">
          {websiteConfig.tagline}
        </p>
      </motion.div>
    </div>
  )
}
