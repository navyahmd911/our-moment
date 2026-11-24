import { motion } from 'framer-motion'
import { Sparkles, Heart, Coffee, MapPin, Gift, Home } from 'lucide-react'
import { journeyList, type JourneyMilestone } from '../data/memories'

const iconMap = {
  Coffee,
  MapPin,
  Heart,
  Gift,
  Home,
  Sparkles,
}

export default function Journey() {
  return (
    <section id="journey" className="py-24 relative overflow-hidden bg-[#FFFDF9]">
      {/* Decorative ambient blurs */}
      <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-[#EBCFD3]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 rounded-full bg-[#DCE8E5]/25 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#DCE8E5]/80 text-[#533E43] text-xs font-medium tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#765B62]" />
            <span>Kisah Nyata Perjalanan Kita</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#533E43] font-normal tracking-tight">
            Our <span className="italic">Journey</span>
          </h2>

          <p className="mt-3 text-stone-600 text-xs sm:text-sm leading-relaxed">
            Setiap langkah kecil yang membawa kita semakin dekat dan bertumbuh bersama.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Central Stem Line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-8 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#EBCFD3] via-[#D4A9AF] to-[#EBCFD3]/40" />

          <div className="space-y-12 md:space-y-16">
            {journeyList.map((item: JourneyMilestone, index: number) => {
              const isEven = index % 2 === 0
              const IconComponent = iconMap[item.iconName] || Heart

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className={`relative flex items-center md:justify-between ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div className="ml-14 md:ml-0 md:w-[45%]">
                    <div className="bg-white rounded-2xl p-6 border border-[#E5DCD3] shadow-xs hover:shadow-md transition-all duration-300 relative group">
                      
                      {/* Subtle tape decor on top */}
                      <div className="absolute -top-2.5 left-8 w-16 h-5 bg-[#EBCFD3]/80 rounded-xs -rotate-2" />

                      {/* Header tags */}
                      <div className="flex items-center justify-between gap-2 text-xs text-[#9B7B83] mb-2.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F8F2EA] border border-[#E5DCD3] text-[#765B62] font-medium text-[11px]">
                          {item.tag}
                        </span>
                        <span className="font-sans text-xs font-medium text-[#765B62]">
                          {item.dateLabel}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-lg sm:text-xl text-[#533E43] font-medium mb-2.5">
                        {item.title}
                      </h3>

                      {/* Story */}
                      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
                        {item.story}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Icon */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#D4A9AF] text-[#765B62] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                      <IconComponent className="w-4 h-4 text-[#765B62]" />
                    </div>
                  </div>

                  {/* Empty side for layout balance on desktop */}
                  <div className="hidden md:block md:w-[45%]" />
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
