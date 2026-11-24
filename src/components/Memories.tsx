import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Heart, Sparkles, Plus, Trash2, Image as ImageIcon, User, Lock } from 'lucide-react'
import { memoriesList } from '../data/memories'
import { supabase, isSupabaseConfigured, type DbMemory } from '../lib/supabase'
import { useAuth } from '../context/useAuth'
import UploadPhotoModal from './UploadPhotoModal'

interface DisplayMemory {
  id: string | number
  title: string
  image: string
  rotation?: number
  isOnline?: boolean
  userId?: string
  storagePath?: string
  uploaderName?: string
}

export default function Memories() {
  const { user, openAuthModal } = useAuth()
  const [photos, setPhotos] = useState<DisplayMemory[]>(() => memoriesList)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // Muat foto privat dari Supabase menggunakan Signed URL
  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      return
    }

    let isMounted = true

    const fetchPrivateMemories = async () => {
      try {
        setIsSyncing(true)

        // 1. Ambil metadata foto dari tabel memories
        const { data, error } = await supabase
          .from('memories')
          .select('*')
          .order('created_at', { ascending: false })

        if (!isMounted) return
        if (error || !data || data.length === 0) {
          setIsSyncing(false)
          return
        }

        // 2. Minta Signed URLs aman berdurasi 3600 detik (1 jam) dari Private Storage
        const paths = data.map((item: DbMemory) => item.storage_path)
        const { data: signedUrlsData, error: signedError } = await supabase.storage
          .from('memories')
          .createSignedUrls(paths, 3600)

        if (!isMounted) return
        if (signedError || !signedUrlsData) {
          setIsSyncing(false)
          return
        }

        // Buat kamus signedUrl berdasarkan path
        const urlMap = new Map<string, string>()
        signedUrlsData.forEach((item) => {
          if (item.signedUrl && item.path) {
            urlMap.set(item.path, item.signedUrl)
          }
        })

        // 3. Gabungkan metadata dengan Signed URL masing-masing
        const mapped: DisplayMemory[] = data.map((item: DbMemory, idx: number) => ({
          id: item.id,
          title: item.title,
          image: urlMap.get(item.storage_path) || '/images/memory-1.svg',
          rotation: (idx % 2 === 0 ? -1.5 : 1.5) * ((idx % 3) * 0.4 + 0.6),
          isOnline: true,
          userId: item.user_id,
          storagePath: item.storage_path,
          uploaderName: item.uploader_name,
        }))

        setPhotos(mapped)
      } catch {
        // Abaikan jika gagal
      } finally {
        if (isMounted) setIsSyncing(false)
      }
    }

    fetchPrivateMemories()

    return () => {
      isMounted = false
    }
  }, [user])

  const handleOpenUpload = () => {
    if (!user) {
      openAuthModal()
    } else {
      setIsUploadModalOpen(true)
    }
  }

  const handleUploadSuccess = (newMemory: DbMemory, signedUrl: string) => {
    const newDisplayItem: DisplayMemory = {
      id: newMemory.id,
      title: newMemory.title,
      image: signedUrl,
      rotation: -1.5,
      isOnline: true,
      userId: newMemory.user_id,
      storagePath: newMemory.storage_path,
      uploaderName: newMemory.uploader_name,
    }
    // Masukkan foto baru di awal galeri
    setPhotos((prev) => [newDisplayItem, ...prev.filter((p) => p.isOnline)])
  }

  const handleDeletePhoto = async (e: React.MouseEvent, photo: DisplayMemory) => {
    e.stopPropagation()
    if (!user || photo.userId !== user.id) return

    const confirmDelete = window.confirm(`Hapus foto "${photo.title}" dari galeri privat bersama?`)
    if (!confirmDelete) return

    setDeletingId(photo.id)

    try {
      if (photo.storagePath) {
        await supabase.storage.from('memories').remove([photo.storagePath])
      }
      await supabase.from('memories').delete().eq('id', photo.id)
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
      if (selectedPhotoIndex !== null) setSelectedPhotoIndex(null)
    } catch {
      alert('Gagal menghapus foto.')
    } finally {
      setDeletingId(null)
    }
  }

  const currentPhoto: DisplayMemory | null =
    selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null

  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev + 1) % photos.length : 0
    )
  }, [selectedPhotoIndex, photos.length])

  const handlePrevPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev - 1 + photos.length) % photos.length : 0
    )
  }, [selectedPhotoIndex, photos.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return
      if (e.key === 'Escape') setSelectedPhotoIndex(null)
      if (e.key === 'ArrowRight') handleNextPhoto()
      if (e.key === 'ArrowLeft') handlePrevPhoto()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPhotoIndex, handleNextPhoto, handlePrevPhoto])

  return (
    <section id="memories" className="py-24 relative bg-[#F8F2EA]/60">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBCFD3]/60 text-[#765B62] text-xs font-medium tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Scrapbook &amp; Polaroid Gallery</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#533E43] font-normal tracking-tight">
            Our <span className="italic">Memories</span>
          </h2>

          <p className="mt-3 text-stone-600 text-xs sm:text-sm leading-relaxed">
            Kumpulan potret momen berharga Navy &amp; Ifa. Foto disimpan secara privat menggunakan signed URL dan hanya dapat diakses oleh anggota pasangan yang masuk.
          </p>

          {/* Action: Add Photo Button & Status Banner */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={handleOpenUpload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#765B62] hover:bg-[#533E43] text-white text-xs font-medium tracking-wide shadow-xs hover:shadow transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#EBCFD3]" />
              <span>+ Tambah Foto</span>
            </button>

            {!user && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/80 border border-[#E5DCD3] text-[#765B62] text-[11px]">
                <Lock className="w-3 h-3 text-[#9B7B83]" />
                <span>Masuk sebagai Navy atau Ifa untuk membuka galeri foto cloud pribadi Anda</span>
              </div>
            )}
          </div>
        </div>

        {/* Polaroid Scrapbook Grid */}
        {isSyncing ? (
          <div className="py-16 text-center text-xs text-[#9B7B83]">
            Menghubungkan ke storage privat...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-5 pt-4">
            {photos.map((memory, index) => {
              const rot = memory.rotation || 0
              const tapeClass = index % 2 === 0 ? 'washi-tape-blush' : 'washi-tape-sage'
              const isOwner = user && memory.userId === user.id

              return (
                <motion.article
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % 5) * 0.08 }}
                  style={{ rotate: `${rot}deg` }}
                  whileHover={{ rotate: 0, scale: 1.04, y: -6, zIndex: 10 }}
                  onClick={() => setSelectedPhotoIndex(index)}
                  className={`bg-white p-3 pb-5 rounded-lg shadow-polaroid hover:shadow-polaroid-hover border border-[#E5DCD3] transition-all duration-300 cursor-pointer flex flex-col justify-between group relative ${tapeClass}`}
                >
                  {/* Photo frame */}
                  <div className="w-full aspect-square bg-[#F8F2EA] overflow-hidden rounded-xs relative border border-[#EBE3D9]">
                    <img
                      src={memory.image}
                      alt={memory.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    <div className="absolute inset-0 bg-[#765B62]/0 group-hover:bg-[#765B62]/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full bg-white/80 text-[#765B62] shadow-xs">
                        <ImageIcon className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Delete button for photo owner */}
                    {isOwner && (
                      <button
                        onClick={(e) => handleDeletePhoto(e, memory)}
                        disabled={deletingId === memory.id}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-rose-50 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-xs z-20 cursor-pointer"
                        title="Hapus foto saya"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Uploader badge if available */}
                    {memory.uploaderName && (
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/50 text-white text-[9px] backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <User className="w-2.5 h-2.5" />
                        {memory.uploaderName}
                      </span>
                    )}
                  </div>

                  {/* Polaroid text footer (Judul saja, tanpa tanggal & tanpa caption) */}
                  <div className="mt-3 text-center">
                    <h3 className="font-handwriting text-xl text-[#533E43] tracking-wide font-medium leading-tight line-clamp-1">
                      {memory.title}
                    </h3>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}

      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {currentPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 max-w-2xl w-full bg-[#FFFDF9] rounded-2xl p-4 sm:p-6 shadow-2xl border border-[#E5DCD3] flex flex-col overflow-hidden max-h-[92vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white text-[#765B62] transition z-20 cursor-pointer shadow-xs"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image in Modal */}
              <div className="relative w-full h-72 sm:h-96 bg-[#F8F2EA] rounded-xl overflow-hidden border border-[#EBE3D9] flex items-center justify-center shadow-inner">
                <img
                  src={currentPhoto.image}
                  alt={currentPhoto.title}
                  className="w-full h-full object-contain object-center"
                />

                {/* Left/Right Navigation */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevPhoto()
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#765B62] shadow-md transition cursor-pointer"
                  title="Foto sebelumnya (◄)"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextPhoto()
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#765B62] shadow-md transition cursor-pointer"
                  title="Foto berikutnya (►)"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Title, Counter, and Uploader badge */}
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-[#EBCFD3] text-[#765B62]" />
                  <h3 className="font-serif text-xl sm:text-2xl text-[#533E43]">
                    {currentPhoto.title}
                  </h3>
                  {currentPhoto.uploaderName && (
                    <span className="text-[11px] text-[#9B7B83] bg-[#F8F2EA] px-2 py-0.5 rounded-full border border-[#E5DCD3]">
                      Oleh: {currentPhoto.uploaderName}
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono text-[#9B7B83]">
                  {(selectedPhotoIndex ?? 0) + 1} / {photos.length}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Photo Modal */}
      <UploadPhotoModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </section>
  )
}
