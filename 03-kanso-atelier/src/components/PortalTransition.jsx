import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Monograph Page-Turn Transition
 * Sweeps a single warm alabaster archival book sheet from right to left
 * (x: '100%' -> '0%' -> '-100%') with a subtle italic Cormorant Garamond
 * watermark ("Kanso Atelier — Monograph"), feeling like turning a heavy
 * cotton-rag monograph page.
 */
export default function PortalTransition({ transitionState }) {
  const { active, title, subtitle, code } = transitionState || {};

  return (
    <AnimatePresence>
      {active && (
        <div
          key="monograph-page-turn"
          className="fixed inset-0 z-[80] pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Single Warm Alabaster Monograph Page Sheet (Right -> Left sweep) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: ['100%', '0%', '0%', '-100%'] }}
            transition={{
              duration: 0.72,
              times: [0, 0.42, 0.58, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full h-full bg-[#F3EFE8] border-x border-[#9A7B4F]/40 shadow-[-28px_0_60px_rgba(28,27,25,0.12),28px_0_60px_rgba(28,27,25,0.08)] relative flex flex-col justify-between p-10 sm:p-16 will-change-transform"
          >
            {/* Archival Binding Margin Rule on Left Edge */}
            <div className="absolute top-0 bottom-0 left-10 sm:left-20 w-[1px] bg-[#1C1B19]/10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-10 sm:right-20 w-[1px] bg-[#1C1B19]/10 pointer-events-none" />

            {/* Top Monograph Folio Header */}
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.28em] text-[#78736A] px-4 sm:px-12">
              <span>{code || 'FOLIO // KANSO ATELIER'}</span>
              <span>間 // MA — SPATIAL INTERVAL</span>
            </div>

            {/* Center Editorial Watermark & Chapter Title */}
            <div className="relative z-10 my-auto flex flex-col items-center text-center px-6">
              <span className="font-serif italic text-lg sm:text-2xl text-[#9A7B4F] tracking-wide mb-3">
                Kanso Atelier — Monograph
              </span>
              <div className="w-12 h-[1px] bg-[#9A7B4F]/50 mb-5" />
              <h2 className="font-serif text-3xl sm:text-5xl text-[#1C1B19] font-normal tracking-wide">
                {title || 'Architectural Monograph'}
              </h2>
              {subtitle && (
                <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#78736A] mt-3">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Bottom Folio Page Footer */}
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.26em] text-[#78736A] px-4 sm:px-12">
              <span>KYOTO 35.0116° N</span>
              <span>COPENHAGEN 55.6761° N</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
