import { motion } from 'framer-motion'

interface FloatingItem {
  id: number
  x: number
  size: number
  duration: number
  delay: number
  type: 'petal' | 'heart'
  rotate: number
}

// Deterministic aesthetic distribution to keep component pure
const STATIC_ITEMS: FloatingItem[] = [
  { id: 1, x: 5, size: 16, duration: 18, delay: 0, type: 'petal', rotate: 45 },
  { id: 2, x: 12, size: 20, duration: 22, delay: 3, type: 'heart', rotate: 120 },
  { id: 3, x: 22, size: 14, duration: 19, delay: 7, type: 'petal', rotate: 200 },
  { id: 4, x: 30, size: 18, duration: 24, delay: 1.5, type: 'petal', rotate: 80 },
  { id: 5, x: 42, size: 22, duration: 20, delay: 5, type: 'heart', rotate: 310 },
  { id: 6, x: 52, size: 15, duration: 17, delay: 2, type: 'petal', rotate: 150 },
  { id: 7, x: 62, size: 19, duration: 23, delay: 8, type: 'petal', rotate: 25 },
  { id: 8, x: 72, size: 21, duration: 21, delay: 4, type: 'heart', rotate: 190 },
  { id: 9, x: 82, size: 16, duration: 19, delay: 6, type: 'petal', rotate: 280 },
  { id: 10, x: 92, size: 18, duration: 25, delay: 2.5, type: 'petal', rotate: 95 },
  { id: 11, x: 18, size: 17, duration: 20, delay: 9, type: 'heart', rotate: 340 },
  { id: 12, x: 35, size: 15, duration: 18, delay: 4.5, type: 'petal', rotate: 60 },
  { id: 13, x: 48, size: 20, duration: 22, delay: 11, type: 'petal', rotate: 175 },
  { id: 14, x: 68, size: 16, duration: 19, delay: 6.5, type: 'heart', rotate: 225 },
  { id: 15, x: 78, size: 14, duration: 21, delay: 1.2, type: 'petal', rotate: 130 },
  { id: 16, x: 88, size: 22, duration: 24, delay: 7.8, type: 'petal', rotate: 305 },
]

export default function FloatingPetals() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {STATIC_ITEMS.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            y: '-10vh',
            x: `${item.x}vw`,
            opacity: 0,
            rotate: item.rotate
          }}
          animate={{
            y: '110vh',
            x: [`${item.x}vw`, `${(item.x + 4) % 100}vw`, `${(item.x - 4 + 100) % 100}vw`, `${item.x}vw`],
            opacity: [0, 0.45, 0.6, 0.4, 0],
            rotate: item.rotate + 360
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'linear'
          }}
          className="absolute"
        >
          {item.type === 'heart' ? (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="rgba(235, 207, 211, 0.65)"
              className="drop-shadow-xs"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg
              width={item.size}
              height={item.size * 1.3}
              viewBox="0 0 30 40"
              fill="rgba(220, 232, 229, 0.6)"
              className="drop-shadow-xs"
            >
              <path d="M15 0 C25 15, 30 25, 25 35 C20 45, 10 40, 5 35 C0 30, 5 15, 15 0 Z" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  )
}
