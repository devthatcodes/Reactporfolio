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
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.28 } }}
          className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center overflow-hidden"
        >
          {/* 5 Cybernetic Diagonal Curtain Slices */}
          <div className="absolute inset-0 flex">
            {[0, 1, 2, 3, 4].map((idx) => (
              <motion.div
                key={idx}
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 0.72,
                  times: [0, 0.38, 0.62, 1],
                  delay: idx * 0.035,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ originY: idx % 2 === 0 ? 0 : 1 }}
                className="h-full flex-1 border-x border-cyan-400/20 bg-[#09090B]/95 backdrop-blur-md"
              />
            ))}
          </div>

          {/* Center Chromatic Portal Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.94, 1, 1.03, 1.08],
              filter: ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(8px)'],
            }}
            transition={{ duration: 0.68, times: [0, 0.3, 0.7, 1] }}
            className="relative z-10 text-center px-6"
          >
            <div className="mb-2 font-mono text-xs uppercase tracking-[0.35em] text-cyan-400">
              {activePortal.code || 'PORTAL // WARP'}
            </div>
            <div className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
              <ScrambleText text={activePortal.title} speed={16} step={0.8} />
            </div>
            <div className="mx-auto mt-4 h-[2px] w-40 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
