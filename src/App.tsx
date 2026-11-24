import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import AccessGate from './components/AccessGate'
import AuthModal from './components/AuthModal'
import OpeningPage from './components/OpeningPage'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Memories from './components/Memories'
import Journey from './components/Journey'
import Letters from './components/Letters'
import SpecialDates from './components/SpecialDates'
import Footer from './components/Footer'
import FloatingPetals from './components/FloatingPetals'

export default function App() {
  const [showOpening, setShowOpening] = useState(true)

  return (
    <AuthProvider>
      <AccessGate>
        <div className="min-h-screen bg-[#F8F2EA] text-[#765B62] font-sans relative selection:bg-[#EBCFD3] selection:text-[#533E43]">
          {/* Gentle floating petals and hearts background */}
          <FloatingPetals />

          {/* Authentication Modal for Navy & Ifa */}
          <AuthModal />

          {/* Opening Envelope Transition Page */}
          <AnimatePresence mode="wait">
            {showOpening && (
              <OpeningPage onOpen={() => setShowOpening(false)} />
            )}
          </AnimatePresence>

          {/* Main Website Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 flex flex-col min-h-screen"
          >
            <Navbar onReopenIntro={() => setShowOpening(true)} />

            <main className="flex-1">
              <Hero />
              <Memories />
              <Journey />
              <Letters />
              <SpecialDates />
            </main>

            <Footer />
          </motion.div>
        </div>
      </AccessGate>
    </AuthProvider>
  )
}
