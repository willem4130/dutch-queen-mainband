'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SiteToggleProps {
  currentSite: 'fullband' | 'unplugged'
  fullbandUrl: string
  unpluggedUrl: string
  isScrolled?: boolean
}

export function SiteToggle({ currentSite, fullbandUrl, unpluggedUrl, isScrolled = false }: SiteToggleProps) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSiteSwitch = (e: React.MouseEvent<HTMLAnchorElement>, targetUrl: string) => {
    e.preventDefault()

    // Start fade out transition
    setIsTransitioning(true)

    // Navigate after fade completes
    setTimeout(() => {
      window.location.href = targetUrl
    }, 400)
  }

  return (
    <>
      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* Toggle Links */}
      <div className="flex items-center gap-2">
        <a
          href={fullbandUrl}
          onClick={(e) => currentSite !== 'fullband' && handleSiteSwitch(e, fullbandUrl)}
          className={`font-semibold uppercase tracking-wide transition-all duration-300 hover:scale-110 ${
            isScrolled ? 'text-base md:text-lg' : 'text-lg md:text-xl'
          } ${
            currentSite === 'fullband'
              ? 'text-white/90 hover:text-white'
              : 'text-white/60 hover:text-white/80 cursor-pointer'
          }`}
        >
          full show
        </a>
        <span className="text-white/40">|</span>
        <a
          href={unpluggedUrl}
          onClick={(e) => currentSite !== 'unplugged' && handleSiteSwitch(e, unpluggedUrl)}
          className={`font-semibold uppercase tracking-wide transition-all duration-300 hover:scale-110 ${
            isScrolled ? 'text-base md:text-lg' : 'text-lg md:text-xl'
          } ${
            currentSite === 'unplugged'
              ? 'text-white/90 hover:text-white'
              : 'text-white/60 hover:text-white/80 cursor-pointer'
          }`}
        >
          unplugged
        </a>
      </div>
    </>
  )
}
