import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Heart, Sparkles, Hourglass, Cake } from 'lucide-react'
import { websiteConfig, specialDatesList, type SpecialDate } from '../data/memories'

interface DurationState {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
}

interface CountdownState {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function SpecialDates() {
  const [duration, setDuration] = useState<DurationState>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
  })

  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date()
      const start = new Date(websiteConfig.officialDate)

      // Total days elapsed
      const diffMs = now.getTime() - start.getTime()
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      let years = now.getFullYear() - start.getFullYear()
      let months = now.getMonth() - start.getMonth()
      let days = now.getDate() - start.getDate()

      if (days < 0) {
        months -= 1
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
        days += prevMonth.getDate()
      }

      if (months < 0) {
        years -= 1
        months += 12
      }

      const hours = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()

      setDuration({
        years: years >= 0 ? years : 0,
        months: months >= 0 ? months : 0,
        days: days >= 0 ? days : 0,
        hours: hours >= 0 ? hours : 0,
        minutes: minutes >= 0 ? minutes : 0,
        seconds: seconds >= 0 ? seconds : 0,
        totalDays: totalDays >= 0 ? totalDays : 0,
      })

      // Next Anniversary calculation (1 Juni)
      const currentYear = now.getFullYear()
      let nextAnniv = new Date(currentYear, websiteConfig.anniversaryMonth - 1, websiteConfig.anniversaryDay, 0, 0, 0)

      if (now.getTime() > nextAnniv.getTime()) {
        nextAnniv = new Date(currentYear + 1, websiteConfig.anniversaryMonth - 1, websiteConfig.anniversaryDay, 0, 0, 0)
      }

      const countdownDiffMs = nextAnniv.getTime() - now.getTime()
      const cDays = Math.floor(countdownDiffMs / (1000 * 60 * 60 * 24))
      const cHours = Math.floor((countdownDiffMs / (1000 * 60 * 60)) % 24)
      const cMinutes = Math.floor((countdownDiffMs / (1000 * 60)) % 60)
      const cSeconds = Math.floor((countdownDiffMs / 1000) % 60)

      setCountdown({
        days: cDays >= 0 ? cDays : 0,
        hours: cHours >= 0 ? cHours : 0,
        minutes: cMinutes >= 0 ? cMinutes : 0,
        seconds: cSeconds >= 0 ? cSeconds : 0,
      })
    }

    calculateTime()
    const timer = setInterval(calculateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="dates" className="py-24 relative bg-[#FFFDF9]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EBCFD3]/60 text-[#765B62] text-xs font-medium tracking-wide mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#9B7B83]" />
            <span>Momen &amp; Hari Bersejarah</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#533E43] font-normal tracking-tight">
            Special <span className="italic">Dates</span>
          </h2>

          <p className="mt-3 text-stone-600 text-xs sm:text-sm leading-relaxed">
            Menghitung setiap detik indah yang telah dilalui dan menantikan perayaan cinta berikutnya.
          </p>
        </div>

        {/* Live Counters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Main Counter Card: Time Together */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-[#F8F2EA] rounded-3xl p-6 sm:p-8 border border-[#E5DCD3] shadow-xs flex flex-col justify-between relative overflow-hidden"
          >
            {/* Washi tape decor */}
            <div className="absolute -top-3 left-10 w-24 h-6 bg-[#DCE8E5] -rotate-1 shadow-xs" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-semibold tracking-wider text-[#9B7B83]">
                  Durasi Hubungan Navy &amp; Ifa
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[#765B62] bg-white px-3 py-1 rounded-full border border-[#EBE3D9]">
                  <Clock className="w-3.5 h-3.5 text-[#9B7B83]" />
                  Realtime
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-serif text-4xl sm:text-5xl font-medium text-[#533E43]">
                  {duration.totalDays.toLocaleString('id-ID')}
                </span>
                <span className="text-sm font-sans text-stone-600 font-medium">
                  Hari Bersama (Sejak 1 Juni 2026)
                </span>
              </div>

              {/* Metric Units Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-3 text-center">
                {[
                  { label: 'Tahun', value: duration.years },
                  { label: 'Bulan', value: duration.months },
                  { label: 'Hari', value: duration.days },
                  { label: 'Jam', value: duration.hours },
                  { label: 'Menit', value: duration.minutes },
                  { label: 'Detik', value: duration.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-3 border border-[#E5DCD3] shadow-xs"
                  >
                    <div className="font-serif text-xl sm:text-2xl text-[#533E43] font-medium">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-wider text-[#9B7B83] mt-0.5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5DCD3] flex items-center justify-between text-xs text-[#765B62]">
              <span className="font-handwriting text-lg text-[#533E43]">
                Setiap detik adalah anugerah
              </span>
              <Heart className="w-4 h-4 fill-[#EBCFD3] text-[#765B62]" />
            </div>
          </motion.div>

          {/* Countdown to Next Anniversary Card (1 Juni) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-5 bg-gradient-to-br from-[#FFFDF9] via-[#F8F2EA] to-[#EBCFD3]/30 rounded-3xl p-6 sm:p-8 border border-[#E5DCD3] shadow-xs flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute -top-3 right-10 w-24 h-6 bg-[#EBCFD3] rotate-2 shadow-xs" />

            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-[#9B7B83] mb-4">
                <Hourglass className="w-3.5 h-3.5 text-[#765B62]" />
                <span>Menuju Anniversary 1 Juni</span>
              </div>

              <h3 className="font-serif text-2xl text-[#533E43] font-normal leading-tight mb-2">
                Hitung Mundur Hari Jadian
              </h3>

              <p className="text-xs text-stone-600 mb-6">
                Tanggal 1 Juni mendatang akan menjadi peringatan hari jadian resmi Navy &amp; Ifa.
              </p>

              {/* Countdown metrics */}
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Hari', val: countdown.days },
                  { label: 'Jam', val: countdown.hours },
                  { label: 'Menit', val: countdown.minutes },
                  { label: 'Detik', val: countdown.seconds },
                ].map((box, i) => (
                  <div
                    key={i}
                    className="bg-white/90 backdrop-blur-xs rounded-xl p-3 border border-[#E5DCD3] shadow-xs"
                  >
                    <div className="font-serif text-2xl text-[#765B62] font-semibold">
                      {box.val}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[#9B7B83] mt-0.5">
                      {box.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5DCD3] flex items-center justify-between text-xs text-[#9B7B83]">
              <span>Tersisa {countdown.days} hari lagi</span>
              <Sparkles className="w-4 h-4 text-[#765B62]" />
            </div>
          </motion.div>

        </div>

        {/* Special Dates Cards */}
        <div>
          <div className="text-center mb-8">
            <h3 className="font-serif text-xl sm:text-2xl text-[#533E43]">
              Hari Lahir &amp; Tanggal Penting
            </h3>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Tanggal-tanggal berharga yang membentuk cerita Navy &amp; Ifa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {specialDatesList.map((item: SpecialDate, idx: number) => {
              const isBirthday = item.tag.toLowerCase().includes('ulang tahun')

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-5 border border-[#E5DCD3] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-3">
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#DCE8E5] text-[#533E43]">
                        {item.tag}
                      </span>
                      {isBirthday ? (
                        <Cake className="w-4 h-4 text-[#D4A9AF]" />
                      ) : (
                        <Calendar className="w-3.5 h-3.5 text-[#9B7B83]" />
                      )}
                    </div>

                    <h4 className="font-serif text-lg font-medium text-[#533E43] leading-snug">
                      {item.title}
                    </h4>

                    <div className="mt-1 text-sm font-semibold text-[#765B62]">
                      {item.dateLabel}
                    </div>

                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {item.note}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#9B7B83]">
                    <span>{websiteConfig.name}</span>
                    <Heart className="w-3 h-3 text-[#EBCFD3] fill-current" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
