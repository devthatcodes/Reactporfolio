import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortalTransition({ activePortal }) {
  return (
    <AnimatePresence>
      {activePortal && (
        <motion.div
          key={activePortal.id}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center overflow-hidden"
        >
          {/* CRT Terminal Overlay: Expands from center horizontal line (scaleY: 0 -> 1 -> 0) */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0.96 }}
            animate={{
              scaleY: [0, 1, 1, 0],
              opacity: [0.96, 0.98, 0.98, 0],
            }}
            transition={{
              duration: 0.45,
              times: [0, 0.32, 0.68, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ transformOrigin: 'center center' }}
            className="absolute inset-0 border-y border-cyan-400/50 bg-[#090D16]/95 will-change-transform"
          />

          {/* Ultra-fast Top-to-Bottom Horizontal Laser Scanline Bar */}
          <motion.div
            initial={{ y: '-50vh', opacity: 0 }}
            animate={{
              y: ['-50vh', '50vh'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.42,
              times: [0, 0.2, 0.8, 1],
              ease: 'linear',
            }}
            className="pointer-events-none absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-300 to-violet-400 shadow-[0_0_24px_#22D3EE] will-change-transform"
          />

          {/* Terminal Command Execution Readout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.96, 1, 1, 0.98],
              y: [8, 0, 0, -6],
            }}
            transition={{ duration: 0.43, times: [0, 0.22, 0.78, 1] }}
            className="relative z-10 w-full max-w-2xl px-6 will-change-transform"
          >
            <div className="rounded-xl border border-cyan-400/40 bg-[#09090B]/95 p-5 shadow-[0_0_50px_rgba(34,211,238,0.18)]">
              <div className="mb-2 flex items-center justify-between border-b border-[#27272A] pb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-400">
                <span className="flex items-center gap-2 text-cyan-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  {activePortal.code || 'CRT // PHOSPHOR SWEEP'}
                </span>
                <span className="text-emerald-400">450MS // GPU LOCKED</span>
              </div>

              <div className="font-mono text-xs sm:text-sm text-cyan-300">
                <span className="text-violet-400">root@aether-edge:~$</span>{' '}
                {`> EXEC_PORTAL --target="${activePortal.title}"`}{' '}
                <span className="ml-1 inline-block rounded bg-emerald-400/20 px-1.5 py-0.5 text-[11px] font-bold text-emerald-300">
                  [OK]
                </span>
              </div>

              <div className="mt-2 text-xl font-black uppercase tracking-tight text-white sm:text-3xl">
                {activePortal.title}
              </div>

              {/* Horizontal Phosphor Progress Sweep */}
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#18181D]">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.34, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left center' }}
                  className="h-full w-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#34D399] will-change-transform"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
