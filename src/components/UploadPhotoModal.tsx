
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  UploadCloud,
  Image as ImageIcon,
  AlertCircle,
  Heart,
  Loader2,
} from 'lucide-react'
import { supabase, type DbMemory } from '../lib/supabase'
import { useAuth } from '../context/useAuth'

interface UploadPhotoModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newMemory: DbMemory, signedUrl: string) => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export default function UploadPhotoModal({
  isOpen,
  onClose,
  onSuccess,
}: UploadPhotoModalProps) {
  const { user, profile } = useAuth()

  const [title, setTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Membersihkan seluruh form ketika modal ditutup.
  useEffect(() => {
    if (!isOpen) {
      setTitle('')
      setSelectedFile(null)
      setErrorMessage('')

      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }
        return null
      })

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setIsUploading(false)
    }
  }, [isOpen])

  // Membersihkan preview ketika komponen dilepas.
  useEffect(() => {
    return () => {
      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }
        return null
      })
    }
  }, [])

  const clearSelectedFile = () => {
    setSelectedFile(null)

    setPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }
      return null
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    setErrorMessage('')

    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      clearSelectedFile()
      setErrorMessage(
        'Format berkas tidak didukung. Harap pilih gambar JPEG, PNG, WEBP, atau GIF.'
      )
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      clearSelectedFile()
      setErrorMessage(
        'Ukuran gambar terlalu besar. Maksimal ukuran foto adalah 5 MB.'
      )
      return
    }

    clearSelectedFile()

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !title.trim() || !user || isUploading) {
      return
    }

    if (!profile?.isMember) {
      setErrorMessage(
        'Akun Anda belum terdaftar di tabel couple_members. Daftarkan akun Anda ke Supabase.'
      )
      return
    }

    setIsUploading(true)
    setErrorMessage('')

    try {
      // 1. Membuat nama file unik.
      const fileExt = selectedFile.name.split('.').pop() || 'jpg'

      const cleanFileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.${fileExt}`

      const filePath = `${user.id}/${cleanFileName}`

      // 2. Upload foto ke private Supabase Storage.
      const { error: uploadError } = await supabase.storage
        .from('memories')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(
          `Gagal mengunggah foto ke storage: ${uploadError.message}`
        )
      }

      // 3. Simpan metadata foto ke database.
      const { data: insertedData, error: dbError } = await supabase
        .from('memories')
        .insert({
          title: title.trim(),
          storage_path: filePath,
          user_id: user.id,
          uploader_name: profile.name,
        })
        .select()
        .single()

      if (dbError) {
        throw new Error(
          `Gagal menyimpan data foto ke database: ${dbError.message}`
        )
      }

      // 4. Membuat signed URL untuk menampilkan foto.
      const { data: signedData, error: signedError } =
        await supabase.storage
          .from('memories')
          .createSignedUrl(filePath, 3600)

      if (signedError || !signedData?.signedUrl) {
        throw new Error('Gagal mendapatkan signed URL foto.')
      }

      // 5. Beritahu komponen Memories bahwa upload berhasil.
      onSuccess(insertedData as DbMemory, signedData.signedUrl)

      // 6. Reset form setelah upload berhasil.
      setTitle('')
      setSelectedFile(null)
      setErrorMessage('')

      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }
        return null
      })

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      onClose()
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat mengunggah foto.'

      setErrorMessage(msg)
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!isUploading) onClose()
        }}
        className="absolute inset-0"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative z-10 max-w-lg w-full bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border-2 border-[#E5DCD3] shadow-letter text-stone-800 overflow-hidden"
      >
        {/* Dekorasi washi tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#DCE8E5] -rotate-1 shadow-xs" />

        {/* Tombol tutup */}
        <button
          type="button"
          onClick={onClose}
          disabled={isUploading}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#765B62] shadow-xs transition cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#DCE8E5] text-[#533E43] border border-white mx-auto flex items-center justify-center shadow-xs mb-3">
            <UploadCloud className="w-5 h-5" />
          </div>

          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#9B7B83]">
            Galeri Privat Bersama
          </span>

          <h3 className="font-serif text-2xl text-[#533E43] font-normal mt-1">
            Tambah Foto Kenangan
          </h3>

          <p className="text-xs text-stone-600 mt-1">
            Diunggah oleh <strong>{profile?.name || 'Anda'}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Area upload foto */}
          <div
            onClick={() => {
              if (!isUploading) fileInputRef.current?.click()
            }}
            className="border-2 border-dashed border-[#E5DCD3] hover:border-[#D4A9AF] rounded-2xl p-4 text-center cursor-pointer bg-[#F8F2EA]/40 transition group relative overflow-hidden"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative aspect-video max-h-48 mx-auto rounded-xl overflow-hidden border border-[#EBE3D9] shadow-xs">
                <img
                  src={previewUrl}
                  alt="Pratinjau Foto"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-medium">
                  Klik untuk mengganti foto
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#765B62] shadow-xs group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-6 h-6 text-[#9B7B83]" />
                </div>

                <p className="text-xs font-medium text-[#765B62]">
                  Pilih foto dari perangkat Anda
                </p>

                <p className="text-[11px] text-[#9B7B83]">
                  JPG, PNG, WEBP, atau GIF (Maksimal 5 MB)
                </p>
              </div>
            )}
          </div>

          {/* Input judul */}
          <div>
            <label className="block text-[11px] font-medium text-[#765B62] mb-1">
              Judul Kenangan (Polaroid)
            </label>

            <input
              type="text"
              placeholder="Contoh: Kencan Sore di Malang"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={40}
              disabled={isUploading}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E5DCD3] text-xs text-[#765B62] focus:outline-none focus:border-[#D4A9AF] transition disabled:opacity-60"
            />
          </div>

          {/* Pesan error */}
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

          {/* Tombol simpan */}
          <button
            type="submit"
            disabled={isUploading || !selectedFile || !title.trim()}
            className="w-full py-3 rounded-xl bg-[#765B62] hover:bg-[#533E43] text-white text-xs font-medium tracking-wide transition shadow-xs active:scale-98 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#EBCFD3]" />
                <span>Mengunggah ke Storage Privat...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 text-[#EBCFD3] fill-[#EBCFD3]" />
                <span>Simpan ke Galeri Bersama</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
