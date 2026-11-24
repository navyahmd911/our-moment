import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Mail, Heart, AlertCircle, Sparkles, UserCheck } from 'lucide-react'
import { useAuth } from '../context/useAuth'

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signIn, isConfigured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAuthModalOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsSubmitting(true)
    setErrorMessage('')

    const { error } = await signIn(email, password)
    if (error) {
      setErrorMessage(error.message || 'Gagal masuk. Periksa kembali email dan password Anda.')
      setIsSubmitting(false)
    } else {
      setIsSubmitting(false)
      closeAuthModal()
    }
  }

  const fillQuickAccount = (accountEmail: string) => {
  setEmail(accountEmail)
  setPassword('')
  setErrorMessage('')
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="absolute inset-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative z-10 max-w-md w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border-2 border-[#E5DCD3] shadow-letter text-stone-800 overflow-hidden"
      >
        {/* Top washi tape decor */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#EBCFD3]/90 -rotate-1 shadow-xs" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#765B62] shadow-xs transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#EBCFD3] text-[#765B62] border border-white mx-auto flex items-center justify-center shadow-xs mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#9B7B83]">
            Autentikasi Akun
          </span>
          <h3 className="font-serif text-2xl text-[#533E43] font-normal mt-1">
            Masuk ke Our Moment
          </h3>
          <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
            Masuk sebagai <strong>Navy</strong> atau <strong>Ifa</strong> untuk mengunggah foto kenangan dan menulis surat digital bersama.
          </p>
        </div>

        {/* Quick select buttons */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => fillQuickAccount('navyifa@ourmoment.com')}
            className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-[#E5DCD3] hover:bg-[#F8F2EA] text-[11px] font-medium text-[#765B62] flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#D4A9AF]" />
            <span>Akun Navy</span>
          </button>
          <button
            type="button"
            onClick={() => fillQuickAccount('ifanavy@ourmoment.com')}
            className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-[#E5DCD3] hover:bg-[#F8F2EA] text-[11px] font-medium text-[#765B62] flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#AFC4C0]" />
            <span>Akun Ifa</span>
          </button>
        </div>

        {!isConfigured && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Koneksi Supabase Belum Diatur:</strong>
              <p className="mt-0.5 text-[11px]">
                Silakan isi <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> dan <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> di file <code className="font-mono">.env.local</code> sesuai panduan di <code className="font-mono">SUPABASE_SETUP.md</code>.
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium text-[#765B62] mb-1">
              Email Pengguna
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="navy@ourmoment.love / ifa@ourmoment.love"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#E5DCD3] text-xs text-[#765B62] focus:outline-none focus:border-[#D4A9AF] transition"
              />
              <Mail className="w-4 h-4 text-[#9B7B83] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#765B62] mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Masukkan kata sandi..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#E5DCD3] text-xs text-[#765B62] focus:outline-none focus:border-[#D4A9AF] transition"
              />
              <Lock className="w-4 h-4 text-[#9B7B83] absolute left-3 top-3" />
            </div>
          </div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 py-2 px-3 rounded-xl border border-rose-200"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting || !email || !password || !isConfigured}
            className="w-full py-3 rounded-xl bg-[#765B62] hover:bg-[#533E43] text-white text-xs font-medium tracking-wide transition shadow-xs active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            <Heart className="w-4 h-4 text-[#EBCFD3] fill-[#EBCFD3]" />
            <span>{isSubmitting ? 'Memproses Masuk...' : 'Masuk Akun'}</span>
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-[#EBE3D9] text-center">
          <p className="text-[11px] text-[#9B7B83] flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4A9AF]" />
            <span>Setiap momen indah tersimpan aman selamanya</span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
