import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Signature Transition for Deontae Work's Portfolio:
 * Asymmetric Diagonal Silk Curtain Sweep with the "DW // DEONTAE WORK" Monogram Crest.
 * 100% GPU-composited translate3d + opacity.
 */
export default function PortfolioCurtainTransition({ transitionState }) {
  const { active, title, subtitle, accent = '#E2D9C8' } = transitionState || {};

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[88] pointer-events-none overflow-hidden">
          {/* Primary Diagonal Silk Sheet */}
          <motion.div
            initial={{ x: '110%' }}
            animate={{ x: ['110%', '0%', '0%', '-110%'] }}
            exit={{ x: '-110%' }}
            transition={{
              duration: 0.62,
              times: [0, 0.36, 0.64, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute inset-y-0 -inset-x-16 bg-[#0B0C10] border-x border-white/15 flex items-center justify-center will-change-transform"
          >
            <div className="text-center px-6">
              <div className="inline-flex items-center gap-2.5 mb-3">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-display font-bold text-xs text-black"
                  style={{ backgroundColor: accent }}
                >
                  DW
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/55">
                  {subtitle || 'DEONTAE WORK · FRONT END ENGINEER'}
                </span>
              </div>
              <div className="font-serif italic text-4xl sm:text-6xl text-[#F5F4F0] tracking-tight">
                {title || 'Selected Works'}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
