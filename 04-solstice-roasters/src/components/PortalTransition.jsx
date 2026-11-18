import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrambleText from './ScrambleText';

export default function PortalTransition({ activePortal }) {
  return (
    <AnimatePresence>
      {activePortal && (
        <motion.div
          key={activePortal.id}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          className="fixed inset-0 z-[85] pointer-events-none overflow-hidden flex items-center justify-center"
        >
          {/* Layer 1: Terracotta Chromatic Leading Curtain */}
          <motion.div
            initial={{ x: '-105%', skewX: '-8deg' }}
            animate={{ x: ['-105%', '0%', '105%'] }}
            transition={{ duration: 0.78, times: [0, 0.45, 1], ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-y-0 -inset-x-16 bg-terracotta"
          />

          {/* Layer 2: Deep Espresso Main Portal Curtain */}
          <motion.div
            initial={{ x: '-105%', skewX: '-8deg' }}
            animate={{ x: ['-105%', '0%', '105%'] }}
            transition={{
              duration: 0.78,
              delay: 0.05,
              times: [0, 0.48, 1],
              ease: [0.76, 0, 0.24, 1],
            }}
            className="absolute inset-y-0 -inset-x-16 bg-espresso border-x-2 border-terracotta/60"
          />

          {/* Center Portal Telemetry Readout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.94, 1, 1, 1.04] }}
            transition={{ duration: 0.72, times: [0, 0.25, 0.72, 1] }}
            className="relative z-10 text-center px-6"
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-terracotta mb-2">
              {activePortal.code || 'PORTAL // TRANSIT'}
            </div>
            <div className="font-serif text-3xl sm:text-5xl text-cream tracking-tight">
              <ScrambleText
                text={activePortal.title || 'SENSORY PORTAL'}
                duration={360}
                triggerKey={activePortal.id}
              />
            </div>
            {activePortal.subtitle && (
              <div className="mt-2 text-xs font-mono uppercase tracking-[0.2em] text-cream/60">
                {activePortal.subtitle}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
