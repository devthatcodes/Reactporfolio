import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Sparkles } from 'lucide-react';

/**
 * PortalTransition — Command-K (⌘K) Center-Out Glass Command Palette Pulse
 * When clicking nav links or switching modes, triggers a sleek 350ms
 * centered command HUD pill (`⌘ // ROUTING TO ${target}`) with an
 * expanding radial cyan shockwave ring — no full-screen shutters or slices.
 */
export default function PortalTransition({ activePortal }) {
  return (
    <AnimatePresence>
      {activePortal && (
        <motion.div
          key={activePortal.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.14 } }}
          className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center overflow-hidden"
        >
          {/* Expanding Radial Cyan/Violet Shockwave Ring */}
          <motion.div
            initial={{ scale: 0.35, opacity: 0.75 }}
            animate={{ scale: 2.35, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="absolute h-64 w-64 rounded-full border border-cyan-400/50 bg-cyan-400/5 shadow-[0_0_60px_rgba(34,211,238,0.22)] will-change-transform"
          />

          {/* Secondary Tight Pulse Ring */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0.55 }}
            animate={{ scale: 1.65, opacity: 0 }}
            transition={{ duration: 0.34, delay: 0.03, ease: 'easeOut' }}
            className="absolute h-48 w-48 rounded-full border border-violet-400/40 will-change-transform"
          />

          {/* Center-Out Glass Command Palette Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.88, 1.02, 1, 0.96],
              y: [10, 0, 0, -6],
            }}
            transition={{
              duration: 0.35,
              times: [0, 0.22, 0.78, 1],
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 flex items-center gap-3.5 rounded-2xl border border-cyan-400/40 bg-[#090D16]/90 px-5 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.75),0_0_35px_rgba(34,211,238,0.2)] backdrop-blur-xl will-change-transform"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
              <Command className="h-4 w-4" />
            </div>

            <div className="flex flex-col pr-2">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                <span className="text-cyan-400">⌘K</span>
                <span>//</span>
                <span>{activePortal.code || 'COMMAND DISPATCH'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold tracking-tight text-white">
                <span>⌘ // ROUTING TO {activePortal.title}</span>
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              </div>
            </div>

            <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
              350ms
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
