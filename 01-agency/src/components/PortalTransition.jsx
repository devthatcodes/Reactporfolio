import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrambleText from './ScrambleText';

/**
 * Unique to 01-agency (Vespera Digital):
 * Widescreen Top/Bottom Cinema Letterbox Shutter + Expanding Vector Diamond Portal
 * 100% GPU-composited scaleY / scale / rotate / opacity (zero lag).
 */
export default function PortalTransition({ transitionState }) {
  const { active, label, sublabel, accent = '#C8FF32' } = transitionState || {};

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[85] pointer-events-none overflow-hidden flex flex-col justify-between">
          {/* Top Cinema Letterbox Shutter */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 1, 0] }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.56, times: [0, 0.35, 0.65, 1], ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: 'top' }}
            className="w-full h-1/2 bg-obsidian border-b border-lime/40 will-change-transform"
          />

          {/* Bottom Cinema Letterbox Shutter */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 1, 0] }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.56, times: [0, 0.35, 0.65, 1], ease: [0.76, 0, 0.24, 1] }}
            style={{ transformOrigin: 'bottom' }}
            className="w-full h-1/2 bg-obsidian border-t border-lime/40 will-change-transform"
          />

          {/* Center Expanding Diamond Aperture & Kinetic Readout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.82, 1, 1.04, 1.12] }}
            transition={{ duration: 0.54, times: [0, 0.28, 0.72, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center will-change-transform"
          >
            {/* Rotating Geometric Diamond Ring */}
            <motion.div
              initial={{ rotate: 0, scale: 0.5 }}
              animate={{ rotate: 45, scale: [0.5, 1.1, 1.4] }}
              transition={{ duration: 0.54, ease: 'easeOut' }}
              style={{ borderColor: accent }}
              className="w-28 h-28 border border-dashed rounded-xl absolute pointer-events-none opacity-45"
            />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-lime/40 text-[10px] font-mono uppercase tracking-[0.28em] text-lime mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lime" />
              <span>{sublabel || 'CINEMA SHUTTER // LOCK'}</span>
            </div>
            <div className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory uppercase">
              <ScrambleText
                text={label || 'TRANSITIONING'}
                duration={300}
                scrambleOnHover={false}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
