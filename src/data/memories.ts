export interface MemoryItem {
  id: number
  title: string
  image: string
  rotation?: number // Tilt angle for scrapbook effect (-2 to 2)
}

export interface JourneyMilestone {
  id: number
  dateLabel: string
  title: string
  tag: string
  story: string
  iconName: 'Coffee' | 'MapPin' | 'Heart' | 'Sparkles' | 'Gift' | 'Home'
}

export interface LoveLetter {
  id: number
  envelopeLabel: string
  title: string
  subtitle: string
  placeholderContent: string[]
  closing: string
  sender: string
  waxColor: 'blush' | 'sage' | 'dusty'
}

export interface SpecialDate {
  id: number
  title: string
  dateLabel: string
  year?: number
  month: number // 1-12
  day: number   // 1-31
  tag: string
  note: string
}

export const websiteConfig = {
  name: 'Our Moment',
  tagline: 'Every little moment has a story.',
  partner1: 'Navy',
  partner2: 'Ifa',
  navyCallForIfa: 'sayangkuu',
  ifaCallForNavy: 'Cintaku',
  status: 'LDR',
  meetingFrequency: 'Tidak menentu',
  favoritePlace: 'Rumah Ifa',
  meetingCity: 'Malang',
  // Tanggal jadian resmi: 1 Juni 2026 (Format: YYYY-MM-DD)
  officialDate: '2026-06-01',
  anniversaryDay: 1,
  anniversaryMonth: 6, // Juni
  // Path foto utama (dapat diganti dengan foto asli Anda di public/images/)
  heroPhoto: '/images/hero-placeholder.svg',
  // Info Musik
  music: {
    title: 'Hannah Montana',
    artist: 'Rex Orange County',
    src: '/music/hannah-montana.mp3',
  }
}

// 5 Galeri Foto Awal
// Sesuai instruksi: Jangan menampilkan tanggal dan caption pada foto.
export const memoriesList: MemoryItem[] = [
  {
    id: 1,
    title: 'Awal Pertemuan',
    image: '/images/memory-1.svg',
    rotation: -1.8,
  },
  {
    id: 2,
    title: 'Tawa Bersama',
    image: '/images/memory-2.svg',
    rotation: 1.5,
  },
  {
    id: 3,
    title: 'Momen Berharga',
    image: '/images/memory-3.svg',
    rotation: -1.2,
  },
  {
    id: 4,
    title: 'Tempat Favorit',
    image: '/images/memory-4.svg',
    rotation: 2.0,
  },
  {
    id: 5,
    title: 'Cerita Kita',
    image: '/images/memory-5.svg',
    rotation: -2.2,
  },
]

// Timeline Hubungan (Hanya informasi nyata yang diberikan, tidak mengarang tanggal)
export const journeyList: JourneyMilestone[] = [
  {
    id: 1,
    dateLabel: '28 Mei 2026',
    title: 'Mulai Saling Mengenal',
    tag: 'Awal Kenal',
    story: 'Navy mengajak Ifa untuk ngopi. Navy yang pertama kali mendekati Ifa, membuka jalan percakapan pertama yang membawa mereka saling mengenal.',
    iconName: 'Coffee',
  },
  {
    id: 2,
    dateLabel: 'Bulan Mei (Tanggal belum ditentukan)',
    title: 'Pertemuan Pertama di Malang',
    tag: 'Momen Pertama',
    story: 'Pertemuan tatap muka pertama kali berlangsung di Kota Malang, menjadi momen berharga yang menandai perjumpaan nyata.',
    iconName: 'MapPin',
  },
  {
    id: 3,
    dateLabel: '1 Juni 2026',
    title: 'Resmi Jadian',
    tag: 'Anniversary',
    story: 'Setelah saling mengenal satu sama lain, Navy dan Ifa resmi memutuskan untuk melangkah bersama sebagai sepasang kekasih.',
    iconName: 'Heart',
  },
  {
    id: 4,
    dateLabel: '10 Oktober',
    title: 'Momen Paling Berkesan',
    tag: 'Ulang Tahun Ifa',
    story: 'Hari ulang tahun Ifa menjadi salah satu momen yang paling berkesan dan bermakna mendalam dalam perjalanan hubungan ini.',
    iconName: 'Gift',
  },
  {
    id: 5,
    dateLabel: 'Perjalanan Kita',
    title: 'Menjalani LDR & Rumah Ifa',
    tag: 'Keseharian',
    story: 'Meskipun menjalani hubungan jarak jauh (LDR) dengan frekuensi bertemu yang tidak menentu, Rumah Ifa selalu menjadi tempat favorit yang penuh kehangatan saat berjumpa.',
    iconName: 'Home',
  },
]

// Dua Surat Digital dengan Placeholder Kosong yang Bersih
// Pengguna dapat mengisi teks surat asli sendiri nanti di sini
export const lettersList: LoveLetter[] = [
  {
    id: 1,
    envelopeLabel: 'Surat 01',
    title: 'Buat Pacarku',
    subtitle: 'Untuk sayangkuu, Ifa',
    placeholderContent: [
      '[Tuliskan isi suratmu untuk pacarmu di sini...]',
      'Kamu bisa menuangkan perasaan, rasa terima kasih, atau cerita manis yang ingin kamu sampaikan secara khusus untuk Ifa.',
      'Buka file src/data/memories.ts pada bagian lettersList untuk menuliskan isi surat ini kapan saja.'
    ],
    closing: 'Dengan penuh cinta,',
    sender: 'Navy',
    waxColor: 'blush',
  },
  {
    id: 2,
    envelopeLabel: 'Surat 02',
    title: 'A Letter for You',
    subtitle: 'Sebuah pesan dari lubuk hati',
    placeholderContent: [
      '[Tuliskan isi surat kedua di sini...]',
      'Ruang ini disiapkan untuk pesan masa depan, harapan hubungan, atau kata-kata manis yang ingin selalu dikenang.',
      'Edit isi pesan ini melalui file src/data/memories.ts sesuai keinginanmu.'
    ],
    closing: 'Selalu untukmu,',
    sender: 'Navy',
    waxColor: 'sage',
  },
]

// Ulang Tahun dan Tanggal Spesial
export const specialDatesList: SpecialDate[] = [
  {
    id: 1,
    title: 'Ulang Tahun Navy',
    dateLabel: '10 April 2003',
    year: 2003,
    month: 4,
    day: 10,
    tag: 'Ulang Tahun',
    note: 'Hari lahirnya Navy (Cintaku).',
  },
  {
    id: 2,
    title: 'Ulang Tahun Ifa',
    dateLabel: '10 Oktober 2006',
    year: 2006,
    month: 10,
    day: 10,
    tag: 'Ulang Tahun & Berkesan',
    note: 'Hari lahirnya Ifa (sayangkuu), momen paling berkesan dalam hubungan.',
  },
  {
    id: 3,
    title: 'Anniversary Resmi',
    dateLabel: '1 Juni (Setiap Tahun)',
    year: 2026,
    month: 6,
    day: 1,
    tag: 'Anniversary',
    note: 'Hari resmi jadian Navy & Ifa.',
  },
  {
    id: 4,
    title: 'Awal Saling Mengenal',
    dateLabel: '28 Mei 2026',
    year: 2026,
    month: 5,
    day: 28,
    tag: 'Kenalan Pertama',
    note: 'Hari pertama Navy mengajak Ifa ngopi dan mulai saling mengenal.',
  },
]
