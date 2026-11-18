import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrambleText from './ScrambleText';

/**
 * PortalTransition — "Circular Crema Iris Bloom"
 * When triggered, a warm terracotta & dark espresso Circular Iris Aperture
 * (`rounded-full` centered on screen) blooms outward like a pour-over coffee bloom
 * with a rotating botanical seal ring in the center (480ms total, 100% GPU scale/rotate/opacity).
 */
export default function PortalTransition({ activePortal }) {
  return (
    <AnimatePresence>
      {activePortal && (
        <motion.div
          key={activePortal.id}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.14 } }}
          className="fixed inset-0 z-[85] pointer-events-none overflow-hidden flex items-center justify-center"
        >
          {/* Outer Terracotta Pour-Over Crema Iris Ring (scale: 0 -> 2.8 -> 0) */}
          <motion.div
            initial={{ scale: 0, opacity: 0.95 }}
            animate={{ scale: [0, 2.8, 0], opacity: [0.95, 1, 0] }}
            transition={{
              duration: 0.48,
              times: [0, 0.5, 1],
              ease: [0.65, 0, 0.35, 1],
            }}
            style={{ willChange: 'transform, opacity' }}
            className="absolute w-[100vmax] h-[100vmax] rounded-full bg-terracotta"
          />

          {/* Inner Dark Espresso Core Iris Aperture (scale: 0 -> 2.8 -> 0) */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 2.8, 0], opacity: [1, 1, 0] }}
            transition={{
              duration: 0.48,
              delay: 0.015,
              times: [0, 0.5, 1],
              ease: [0.65, 0, 0.35, 1],
            }}
            style={{ willChange: 'transform, opacity' }}
            className="absolute w-[92vmax] h-[92vmax] rounded-full bg-espresso border-4 border-cream/25"
          />

          {/* Rotating Botanical Seal Ring & Center Telemetry Readout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.72, 1, 1, 0.84],
            }}
            transition={{
              duration: 0.48,
              times: [0, 0.22, 0.78, 1],
              ease: 'easeInOut',
            }}
            style={{ willChange: 'transform, opacity' }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-6"
          >
            {/* Rotating Botanical Seal Ring */}
            <motion.div
              initial={{ rotate: 0, scale: 0.85 }}
              animate={{ rotate: 180, scale: [0.85, 1.05, 0.9] }}
              transition={{ duration: 0.48, ease: 'easeInOut' }}
              style={{ willChange: 'transform' }}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-terracotta/80 flex items-center justify-center mb-5"
            >
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-cream/30 flex items-center justify-center">
                <svg
                  viewBox="0 0 64 64"
                  fill="none"
                  className="w-16 h-16 text-terracotta"
                  aria-hidden="true"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  {/* Botanical Leaf & Sun Seal */}
                  <circle cx="32" cy="24" r="6" fill="#C85A32" />
                  <path
                    d="M20 38C25 32 29 33 32 36C35 39 39 37 44 33"
                    stroke="#FBF8F3"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M32 46C32 36 35 28 42 22"
                    stroke="#5E7461"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </motion.div>

            <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-terracotta mb-1.5">
              {activePortal.code || 'IRIS BLOOM // TRANSIT'}
            </div>
            <div className="font-serif text-3xl sm:text-5xl text-cream tracking-tight">
              <ScrambleText
                text={activePortal.title || 'CREMA BLOOM'}
                duration={240}
                triggerKey={activePortal.id}
              />
            </div>
            {activePortal.subtitle && (
              <div className="mt-2 text-xs font-mono uppercase tracking-[0.2em] text-cream/70">
                {activePortal.subtitle}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
