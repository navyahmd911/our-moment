import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Mail, Feather, Edit3, Save, Loader2, Lock, Check } from 'lucide-react'
import { supabase, isSupabaseConfigured, type DbLetter } from '../lib/supabase'
import { useAuth } from '../context/useAuth'

interface LetterState {
  letterKey: string
  title: string
  subtitle: string
  content: string
  authorRole: 'navy' | 'ifa'
  authorName: string
  recipientName: string
  envelopeLabel: string
  waxColor: 'blush' | 'sage'
}

const DEFAULT_LETTERS: LetterState[] = [
  {
    letterKey: 'letter_navy',
    envelopeLabel: 'Surat 01',
    title: 'Buat Pacarku',
    subtitle: 'Ditulis oleh Navy untuk Ifa',
    content: '',
    authorRole: 'navy',
    authorName: 'Navy',
    recipientName: 'Ifa',
    waxColor: 'blush',
  },
  {
    letterKey: 'letter_ifa',
    envelopeLabel: 'Surat 02',
    title: 'A Letter for You',
    subtitle: 'Ditulis oleh Ifa untuk Navy',
    content: '',
    authorRole: 'ifa',
    authorName: 'Ifa',
    recipientName: 'Navy',
    waxColor: 'sage',
  },
]

export default function Letters() {
  const { user, profile, openAuthModal } = useAuth()
  const [letters, setLetters] = useState<LetterState[]>(DEFAULT_LETTERS)
  const [activeLetter, setActiveLetter] = useState<LetterState | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Muat data surat dari Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) return

    let isMounted = true

    const loadLetters = async () => {
      try {
        const { data, error } = await supabase.from('letters').select('*')
        if (!isMounted) return
        if (!error && data && data.length > 0) {
          setLetters((prev) =>
            prev.map((l) => {
              const found = data.find((d: DbLetter) => d.letter_key === l.letterKey)
              if (found) {
                return {
                  ...l,
                  title: found.title || l.title,
                  subtitle: found.subtitle || l.subtitle,
                  content: found.content || '',
                }
              }
              return l
            })
          )
        }
      } catch {
        // Abaikan jika offline
      }
    }

    loadLetters()

    return () => {
      isMounted = false
    }
  }, [])

  const handleOpenLetter = (letter: LetterState) => {
    setActiveLetter(letter)
    setEditContent(letter.content)
    setIsEditing(false)
    setSaveSuccess(false)
    setSaveError('')
  }

  // Otorisasi aman berbasis tabel couple_members
  const isCurrentAuthor = Boolean(
    profile?.isMember && activeLetter && profile.role === activeLetter.authorRole
  )

  const handleSaveLetter = async () => {
    if (!activeLetter || !isCurrentAuthor) return

    setIsSaving(true)
    setSaveError('')
    setSaveSuccess(false)

    try {
      if (isSupabaseConfigured) {
        // Hanya mengirim content; metadata dilindungi dan diatur aman oleh trigger database
        const { error } = await supabase
          .from('letters')
          .update({
            content: editContent,
          })
          .eq('letter_key', activeLetter.letterKey)

        if (error) {
          throw new Error(error.message)
        }
      }

      // Perbarui state lokal
      setLetters((prev) =>
        prev.map((l) =>
          l.letterKey === activeLetter.letterKey
            ? { ...l, content: editContent }
            : l
        )
      )
      setActiveLetter((prev) => (prev ? { ...prev, content: editContent } : null))
      setIsEditing(false)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan surat.'
      setSaveError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const waxStyles = {
    blush: 'bg-[#EBCFD3] text-[#765B62] border-[#D4A9AF]',
    sage: 'bg-[#DCE8E5] text-[#533E43] border-[#AFC4C0]',
  }

  return (
    <section id="letters" className="py-24 relative bg-[#F8F2EA]/80">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBCFD3]/60 text-[#765B62] text-xs font-medium tracking-wide mb-3">
            <Feather className="w-3.5 h-3.5 text-[#9B7B83]" />
            <span>Digital Letters</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#533E43] font-normal tracking-tight">
            Little <span className="italic">Letters</span>
          </h2>

          <p className="mt-3 text-stone-600 text-xs sm:text-sm leading-relaxed">
            Dua amplop digital khusus: <strong>Navy</strong> menulis untuk <strong>Ifa</strong>, dan <strong>Ifa</strong> menulis untuk <strong>Navy</strong>.
          </p>
        </div>

        {/* 2 Envelopes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {letters.map((letter, index) => {
            const hasWritten = Boolean(letter.content.trim())

            return (
              <motion.div
                key={letter.letterKey}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => handleOpenLetter(letter)}
                className="group bg-[#FFFDF9] rounded-2xl border-2 border-[#E5DCD3] p-5 shadow-xs hover:shadow-letter transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden"
              >
                {/* Envelope fold graphic */}
                <div
                  className="w-full h-28 bg-[#F5EFE6] border-b border-[#E5DCD3] rounded-t-xl relative flex items-center justify-center transition-colors group-hover:bg-[#F0E8DD]"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                >
                  {/* Wax seal */}
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-xs translate-y-3.5 ${
                      waxStyles[letter.waxColor]
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                </div>

                <div className="pt-7 pb-3 text-center">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#9B7B83]">
                    {letter.envelopeLabel}
                  </span>

                  <h3 className="font-serif text-xl font-medium text-[#533E43] mt-1.5 group-hover:text-[#765B62] transition-colors leading-snug">
                    {letter.title}
                  </h3>

                  <p className="mt-1 text-stone-500 text-xs font-sans">
                    {letter.subtitle}
                  </p>

                  <div className="mt-3">
                    {hasWritten ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCE8E5] text-[#533E43] text-[10px] font-medium">
                        <Check className="w-3 h-3 text-[#765B62]" />
                        <span>Sudah Ditulis</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px]">
                        <span>Belum Ada Tulisan</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EBE3D9] flex items-center justify-center text-xs text-[#765B62]">
                  <span className="font-sans text-xs flex items-center gap-1.5 text-[#9B7B83] group-hover:text-[#533E43] transition">
                    <Mail className="w-3.5 h-3.5" />
                    Buka Amplop
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>

      {/* Love Letter Modal (Handwriting aesthetic with Edit & Save for Author) */}
      <AnimatePresence>
        {activeLetter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLetter(null)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative z-10 max-w-xl w-full bg-[#FFFDF9] rounded-2xl p-6 sm:p-10 shadow-2xl border-2 border-[#E5DCD3] max-h-[90vh] flex flex-col overflow-hidden"
              style={{
                backgroundImage:
                  'radial-gradient(#EBCFD3 0.65px, transparent 0.65px), radial-gradient(#EBCFD3 0.65px, #FFFDF9 0.65px)',
                backgroundSize: '26px 26px',
                backgroundPosition: '0 0, 13px 13px'
              }}
            >
              {/* Top Washi Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#EBCFD3]/90 -rotate-1 shadow-xs" />

              {/* Close Button */}
              <button
                onClick={() => setActiveLetter(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 shadow-xs transition z-20 cursor-pointer"
                title="Tutup Surat"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Letter Header */}
              <div className="border-b border-[#E5DCD3] pb-4 mb-4 text-center">
                <span className="text-[11px] uppercase tracking-widest text-[#9B7B83] font-sans">
                  {activeLetter.envelopeLabel}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#533E43] font-normal mt-1">
                  {activeLetter.title}
                </h3>
                <span className="text-xs text-[#9B7B83] mt-0.5 block font-sans">
                  {activeLetter.subtitle}
                </span>

                {/* Author Controls */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  {isCurrentAuthor ? (
                    !isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBCFD3] text-[#533E43] text-xs font-medium hover:bg-[#D4A9AF] transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{activeLetter.content.trim() ? 'Edit Surat Saya' : 'Tulis Surat'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveLetter}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#765B62] text-white text-xs font-medium hover:bg-[#533E43] transition cursor-pointer disabled:opacity-60"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>{isSaving ? 'Menyimpan...' : 'Simpan Surat'}</span>
                      </button>
                    )
                  ) : (
                    <span className="text-[11px] text-[#9B7B83] flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Hanya <strong>{activeLetter.authorName}</strong> yang dapat mengedit surat ini</span>
                    </span>
                  )}

                  {!user && (
                    <button
                      onClick={openAuthModal}
                      className="text-[11px] text-[#765B62] underline hover:text-[#533E43] cursor-pointer"
                    >
                      Masuk akun
                    </button>
                  )}
                </div>

                {saveSuccess && (
                  <p className="text-xs text-emerald-700 mt-2 font-sans">
                    ✓ Surat berhasil disimpan ke cloud!
                  </p>
                )}
                {saveError && (
                  <p className="text-xs text-rose-600 mt-2 font-sans">
                    {saveError}
                  </p>
                )}
              </div>

              {/* Letter Body */}
              <div className="overflow-y-auto pr-2 space-y-4 text-stone-800 font-handwriting text-xl sm:text-2xl leading-relaxed flex-1">
                {isEditing ? (
                  <div className="h-full flex flex-col">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder={`Tuliskan isi suratmu untuk ${activeLetter.recipientName} di sini...`}
                      className="w-full flex-1 min-h-[220px] p-3 rounded-xl bg-white/70 border border-[#E5DCD3] font-handwriting text-xl sm:text-2xl text-stone-800 focus:outline-none focus:border-[#D4A9AF] leading-relaxed resize-none"
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setIsEditing(false)
                          setEditContent(activeLetter.content)
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-sans text-stone-600 hover:bg-stone-100 transition"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : activeLetter.content.trim() ? (
                  <div className="whitespace-pre-line">
                    {activeLetter.content}
                  </div>
                ) : (
                  <div className="py-12 text-center text-stone-400 font-handwriting text-xl flex flex-col items-center justify-center gap-2">
                    <p>
                      {isCurrentAuthor
                        ? `Kamu belum menulis surat ini. Klik "Tulis Surat" di atas untuk mulai menulis untuk ${activeLetter.recipientName}.`
                        : `Surat ini belum ditulis oleh ${activeLetter.authorName}. Pesan akan muncul di sini setelah ia menyimpannya.`}
                    </p>
                    <Heart className="w-5 h-5 text-[#EBCFD3] fill-[#EBCFD3]" />
                  </div>
                )}
              </div>

              {/* Letter Footer Signature */}
              <div className="mt-6 pt-4 border-t border-[#E5DCD3] flex items-center justify-between">
                <div>
                  <p className="font-handwriting text-lg text-stone-600">
                    Dengan penuh cinta,
                  </p>
                  <p className="font-script text-3xl text-[#765B62] -mt-1">
                    {activeLetter.authorName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#EBCFD3] text-[#765B62] border border-[#D4A9AF] flex items-center justify-center shadow-xs">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
