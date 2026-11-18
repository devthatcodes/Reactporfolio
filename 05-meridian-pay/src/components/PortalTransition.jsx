import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import ScrambleText from './ScrambleText';

/**
 * PortalTransition — Meridian Institutional "Precision Ledger Sweep"
 * Interlocking obsidian & brushed-titanium horizontal ledger panes glide inward,
 * verify the institutional settlement route with a clean seal, and part smoothly
 * in 460ms using 100% GPU-composited transforms.
 */
export default function PortalTransition({ transitionState }) {
  const { active, label, sublabel } = transitionState || {
    active: false,
    label: '',
    sublabel: '',
  };

  return (
    <AnimatePresence>
      {active && (
        <div
          key="meridian-ledger-sweep"
          className="fixed inset-0 z-[85] pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* LEFT PRECISION LEDGER PANE */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '0%', '-100%'] }}
            transition={{
              duration: 0.46,
              times: [0, 0.34, 0.68, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: 'transform' }}
            className="absolute inset-y-0 left-0 w-1/2 bg-[#040915]/95 border-r border-[#10B981]/60 flex items-center justify-end overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />
          </motion.div>

          {/* RIGHT PRECISION LEDGER PANE */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: ['100%', '0%', '0%', '100%'] }}
            transition={{
              duration: 0.46,
              times: [0, 0.34, 0.68, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: 'transform' }}
            className="absolute inset-y-0 right-0 w-1/2 bg-[#040915]/95 border-l border-cyan-400/60 flex items-center justify-start overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />
          </motion.div>

          {/* CENTER INSTITUTIONAL CLEARING BADGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.92, 1, 1, 0.95],
            }}
            transition={{
              duration: 0.46,
              times: [0, 0.28, 0.72, 1],
              ease: 'easeOut',
            }}
            style={{ willChange: 'transform, opacity' }}
            className="relative z-20 flex flex-col items-center"
          >
            <div className="px-7 py-4 rounded-2xl bg-[#070D19] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.75)] text-center">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/35 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[#10B981] mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{sublabel || 'INSTITUTIONAL LEDGER CLEARING'}</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white">
                <ScrambleText text={label || '01 // LIQUIDITY STREAM'} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
