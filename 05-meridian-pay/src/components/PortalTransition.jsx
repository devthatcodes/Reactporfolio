import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import ScrambleText from './ScrambleText';

/**
 * PortalTransition — Meridian Exclusive "Interlocking Left/Right Titanium Vault Doors"
 * When triggered, two heavy obsidian & emerald Vault Doors slide horizontally inward
 * (x: '-100%' -> '0%' and x: '100%' -> '0%'), lock together at the center seam with a
 * rotating hexagonal Zero-Knowledge Vault Seal ("ZK-PROOF VERIFIED"), and slide open
 * in 460ms using 100% GPU-composited transforms (translateX, rotate, scale, opacity).
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
          key="meridian-vault-doors"
          className="fixed inset-0 z-[85] pointer-events-none flex items-center justify-center overflow-hidden"
        >
          {/* LEFT TITANIUM VAULT DOOR */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: ['-100%', '0%', '0%', '-100%'] }}
            transition={{
              duration: 0.46,
              times: [0, 0.34, 0.68, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: 'transform' }}
            className="absolute inset-y-0 left-0 w-1/2 bg-[#040915] border-r-2 border-[#10B981] flex items-center justify-end overflow-hidden"
          >
            {/* Precision Titanium Vault Ribbing & Telemetry Grid (Pure CSS gradients, zero blur) */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(16,185,129,0.08) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            {/* Interlocking Mechanical Locking Bolts along Right Seam */}
            <div className="relative z-10 flex flex-col justify-between h-3/5 pr-3">
              {[0, 1, 2, 3].map((bolt) => (
                <div key={bolt} className="flex items-center gap-2">
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#10B981]/60 uppercase hidden sm:inline">
                    HSM-BOLT-L0{bolt + 1}
                  </span>
                  <div className="w-8 h-2.5 rounded-l-sm bg-[#10B981]/80 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT TITANIUM VAULT DOOR */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: ['100%', '0%', '0%', '100%'] }}
            transition={{
              duration: 0.46,
              times: [0, 0.34, 0.68, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: 'transform' }}
            className="absolute inset-y-0 right-0 w-1/2 bg-[#040915] border-l-2 border-[#06B6D4] flex items-center justify-start overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(6,182,212,0.08) 1px, transparent 1px), linear-gradient(0deg, rgba(6,182,212,0.08) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />

            {/* Interlocking Mechanical Locking Bolts along Left Seam */}
            <div className="relative z-10 flex flex-col justify-between h-3/5 pl-3">
              {[0, 1, 2, 3].map((bolt) => (
                <div key={bolt} className="flex items-center gap-2">
                  <div className="w-8 h-2.5 rounded-r-sm bg-[#06B6D4]/80 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#06B6D4]/60 uppercase hidden sm:inline">
                    HSM-BOLT-R0{bolt + 1}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CENTER ROTATING HEXAGONAL ZERO-KNOWLEDGE VAULT SEAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.78 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.78, 1, 1, 0.88],
            }}
            transition={{
              duration: 0.46,
              times: [0, 0.28, 0.72, 1],
              ease: 'easeOut',
            }}
            style={{ willChange: 'transform, opacity' }}
            className="relative z-20 flex flex-col items-center"
          >
            {/* Rotating Hexagonal Cryptographic Lock Ring */}
            <div className="relative w-24 h-24 flex items-center justify-center mb-4">
              <motion.svg
                viewBox="0 0 120 120"
                className="w-full h-full"
                initial={{ rotate: -90 }}
                animate={{ rotate: [-90, 0, 60, 120] }}
                transition={{ duration: 0.46, times: [0, 0.35, 0.7, 1], ease: 'easeInOut' }}
                style={{ willChange: 'transform' }}
              >
                <polygon
                  points="60,6 108,33 108,87 60,114 12,87 12,33"
                  fill="#030712"
                  stroke="#10B981"
                  strokeWidth="3"
                />
                <polygon
                  points="60,16 98,38 98,82 60,104 22,82 22,38"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
              </motion.svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-[#10B981]" />
                <span className="font-mono text-[8px] font-bold tracking-widest text-cyan-300 mt-0.5">
                  LOCKED
                </span>
              </div>
            </div>

            {/* Cryptographic Vault Seal Banner */}
            <div className="px-7 py-4 rounded-2xl bg-[#070D19] border border-[#10B981]/60 shadow-[0_0_40px_rgba(16,185,129,0.3)] text-center">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#10B981] mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>ZK-PROOF VERIFIED // {sublabel || 'VAULT SEAL ENGAGED'}</span>
              </div>
              <div className="font-mono text-xl sm:text-3xl font-bold tracking-tight text-white">
                <ScrambleText text={label || '01 // LIQUIDITY STREAM'} speed={12} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
