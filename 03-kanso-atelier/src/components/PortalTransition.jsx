import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrambleText from './ScrambleText';

/**
 * Active Theory–inspired 5-blade vertical architectural shutter & portal transition.
 * Briefly sweeps across the viewport when navigating or opening a monograph portal.
 */
export default function PortalTransition({ transitionState }) {
  const { active, title, subtitle, code } = transitionState || {};

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="portal-shutter"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[80] pointer-events-none flex overflow-hidden"
        >
          {/* 5 Architectural Louver Blades */}
          {[0, 1, 2, 3, 4].map((idx) => (
            <motion.div
              key={idx}
              initial={{ scaleY: 0, transformOrigin: 'bottom' }}
              animate={{
                scaleY: [0, 1, 1, 0],
                transformOrigin: ['bottom', 'bottom', 'top', 'top'],
              }}
              transition={{
                duration: 0.72,
                times: [0, 0.38, 0.62, 1],
                delay: idx * 0.035,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="flex-1 h-full bg-charcoal border-r border-alabaster/10"
            />
          ))}

          {/* Center Kinetic Coordinate Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
            transition={{ duration: 0.68, times: [0, 0.25, 0.75, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center text-alabaster px-6 text-center"
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-bronze mb-2">
              {code || 'PORTAL // TRANSITION'}
            </div>
            <ScrambleText
              as="div"
              text={title || 'KANSO ATELIER'}
              className="font-serif text-3xl sm:text-5xl tracking-[0.08em] uppercase text-alabaster"
              duration={420}
            />
            {subtitle && (
              <div className="text-xs font-mono uppercase tracking-[0.22em] text-alabaster/60 mt-2">
                {subtitle}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
