import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrambleText from './ScrambleText';

export default function PortalTransition({ transitionState }) {
  const { active, label, sublabel } = transitionState || {
    active: false,
    label: '',
    sublabel: '',
  };

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="portal-curtain"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.22 } }}
          className="fixed inset-0 z-[85] pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* 5-Slice Diagonal Cybernetic Shutter Wipe */}
          <div className="absolute inset-0 grid grid-cols-5">
            {[0, 1, 2, 3, 4].map((idx) => (
              <motion.div
                key={idx}
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 0.68,
                  times: [0, 0.38, 0.65, 1],
                  delay: idx * 0.035,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{ transformOrigin: idx % 2 === 0 ? 'top' : 'bottom' }}
                className="h-full bg-[#030712]/95 border-r border-[#10B981]/20 backdrop-blur-xl"
              />
            ))}
          </div>

          {/* Center Portal HUD Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.94, 1, 1, 1.04], y: [8, 0, 0, -8] }}
            transition={{ duration: 0.62, times: [0, 0.3, 0.7, 1] }}
            className="relative z-10 px-8 py-6 rounded-2xl bg-[#070D19]/90 border border-[#10B981]/40 shadow-[0_0_50px_rgba(16,185,129,0.25)] text-center"
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#10B981] mb-1.5">
              {sublabel || 'QUANTUM PORTAL VECTOR // ROUTING'}
            </div>
            <div className="font-mono text-2xl sm:text-4xl font-bold tracking-tight text-white">
              <ScrambleText text={label || '01 // LIQUIDITY STREAM'} speed={16} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
