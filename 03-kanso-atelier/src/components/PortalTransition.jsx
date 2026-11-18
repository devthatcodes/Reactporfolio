import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Horizontal Shoji Screen Sliding Doors Transition (480ms total, pure GPU translateX).
 * Two warm architectural Washi/Limestone panels slide inward from Left and Right
 * to meet at a center vertical brass hairline seam with minimalist kanji/datum typography
 * (間 // MA — SPATIAL INTERVAL), then part open cleanly.
 */
export default function PortalTransition({ transitionState }) {
  const { active, title, subtitle, code } = transitionState || {};

  return (
    <AnimatePresence>
      {active && (
        <div
          key="shoji-portal"
          className="fixed inset-0 z-[80] pointer-events-none overflow-hidden flex"
          aria-hidden="true"
        >
          {/* Left Shoji Sliding Panel (Warm Washi Paper / Stone with Cedar Kumiko Grid Lines) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '0%', '-100%'] }}
            transition={{
              duration: 0.48,
              times: [0, 0.38, 0.62, 1],
              ease: [0.65, 0, 0.35, 1],
            }}
            className="w-1/2 h-full bg-[#F3EFE8] border-r border-bronze/80 relative flex items-center justify-end pr-6 sm:pr-12 will-change-transform"
          >
            {/* Subtle Kumiko Horizontal Timber Lattice Rules */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-16 opacity-25">
              <div className="w-full h-[1px] bg-charcoal/30" />
              <div className="w-full h-[1px] bg-charcoal/20" />
              <div className="w-full h-[1px] bg-charcoal/30" />
            </div>
            {/* Vertical Cedar Mullion */}
            <div className="absolute top-0 bottom-0 left-12 sm:left-24 w-[1px] bg-charcoal/10 pointer-events-none" />

            <div className="relative z-10 text-right">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-bronze">
                間 // MA
              </div>
              <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-taupe mt-1">
                {code || 'SPATIAL THRESHOLD'}
              </div>
            </div>
          </motion.div>

          {/* Right Shoji Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: ['100%', '0%', '0%', '100%'] }}
            transition={{
              duration: 0.48,
              times: [0, 0.38, 0.62, 1],
              ease: [0.65, 0, 0.35, 1],
            }}
            className="w-1/2 h-full bg-[#F3EFE8] border-l border-bronze/80 relative flex items-center justify-start pl-6 sm:pl-12 will-change-transform"
          >
            {/* Subtle Kumiko Horizontal Timber Lattice Rules */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-16 opacity-25">
              <div className="w-full h-[1px] bg-charcoal/30" />
              <div className="w-full h-[1px] bg-charcoal/20" />
              <div className="w-full h-[1px] bg-charcoal/30" />
            </div>
            {/* Vertical Cedar Mullion */}
            <div className="absolute top-0 bottom-0 right-12 sm:right-24 w-[1px] bg-charcoal/10 pointer-events-none" />

            <div className="relative z-10 text-left">
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-charcoal">
                SPATIAL INTERVAL
              </div>
              <div className="text-[9px] font-mono uppercase tracking-[0.22em] text-taupe mt-1">
                {subtitle || '35.0116° N · 55.6761° N'}
              </div>
            </div>
          </motion.div>

          {/* Center Brass Seam Medallion & Monograph Title Stamp */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.96, 1, 1, 0.98],
            }}
            transition={{
              duration: 0.48,
              times: [0, 0.3, 0.7, 1],
              ease: 'easeOut',
            }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none will-change-transform"
          >
            <div className="px-6 py-3 bg-charcoal text-alabaster border border-bronze shadow-lg flex flex-col items-center">
              <span className="text-[9px] font-mono uppercase tracking-[0.32em] text-bronze mb-1">
                間 // MA — SPATIAL INTERVAL
              </span>
              <span className="font-serif text-xl sm:text-3xl tracking-[0.1em] uppercase text-alabaster">
                {title || 'KANSO ATELIER'}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
