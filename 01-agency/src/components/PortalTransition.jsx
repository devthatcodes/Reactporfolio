import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrambleText from './ScrambleText';

const SLICES = [0, 1, 2, 3, 4];

export default function PortalTransition({ transitionState }) {
  const { active, label, sublabel, accent = '#C8FF32' } = transitionState || {};

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[85] pointer-events-none overflow-hidden flex">
          {/* 5 Multi-Blade Cybernetic Wipe Columns */}
          {SLICES.map((idx) => (
            <motion.div
              key={idx}
              initial={{ scaleY: 0, transformOrigin: 'bottom' }}
              animate={{
                scaleY: [0, 1, 1, 0],
                transformOrigin: ['bottom', 'bottom', 'top', 'top'],
              }}
              exit={{ scaleY: 0 }}
              transition={{
                duration: 0.72,
                times: [0, 0.38, 0.62, 1],
                delay: idx * 0.035,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="flex-1 h-full bg-obsidian border-r border-ivory/10 relative"
            >
              <div
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ backgroundColor: accent }}
              />
              <div
                className="absolute inset-x-0 bottom-0 h-1.5"
                style={{ backgroundColor: accent }}
              />
            </motion.div>
          ))}

          {/* Center Kinetic Portal Readout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.92, 1, 1.04, 1.08] }}
            transition={{ duration: 0.68, times: [0, 0.3, 0.7, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-lime/40 text-[10px] font-mono uppercase tracking-[0.28em] text-lime mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
              <span>{sublabel || 'SYNCHRONIZING PORTAL'}</span>
            </div>
            <div className="font-display font-bold text-3xl sm:text-6xl tracking-tight text-ivory uppercase">
              <ScrambleText
                text={label || 'TRANSITIONING'}
                duration={380}
                scrambleOnHover={false}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
