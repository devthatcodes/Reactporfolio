import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../utils/soundEngine';

const BOOT_LOGS = [
  'INIT QUANTUM LIQUIDITY KERNEL v4.9.2...',
  'FIX ENGINE: CONNECTED [TOKYO · LONDON · ZURICH · NYC]',
  'LIQUIDITY POOL: $48.2B VERIFIED ON-CHAIN & TIER-1 CUSTODY',
  'SHADER PIPELINE: GLSL QUANTUM WAVE FIELD READY',
];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1150; // ~1.15s ultra-crisp institutional boot

    let raf;
    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          soundEngine.playPortal();
          setDone(true);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 550);
        }, 120);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  const padded = String(progress).padStart(3, '0');

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="meridian-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.25 } }}
          className="fixed inset-0 z-[100] pointer-events-auto flex flex-col justify-between p-6 sm:p-10 bg-[#030712] text-white overflow-hidden select-none"
        >
          {/* Multi-blade cybernetic background slices that wipe on exit */}
          <div className="absolute inset-0 grid grid-cols-5 pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 1 }}
                exit={{
                  scaleY: 0,
                  transition: { duration: 0.48, delay: i * 0.045, ease: [0.76, 0, 0.24, 1] },
                }}
                style={{ transformOrigin: i % 2 === 0 ? 'top' : 'bottom' }}
                className="h-full border-r border-white/5 bg-[#030712]"
              />
            ))}
          </div>

          {/* Top Telemetry Header */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-widest uppercase text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-white font-semibold">MERIDIAN // QUANTUM TREASURY OS</span>
            </div>
            <div className="hidden sm:flex items-center gap-6">
              <span>FIX ENGINE: CONNECTED</span>
              <span className="text-[#10B981]">LIQUIDITY POOL: $48.2B</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setDone(true);
                if (onComplete) onComplete();
              }}
              className="text-[10px] font-mono text-slate-400 hover:text-white border border-white/10 px-2.5 py-1 rounded"
            >
              [ SKIP BOOT ]
            </button>
          </div>

          {/* Center Giant Counter & Matrix Bar */}
          <div className="relative z-10 my-auto max-w-3xl">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#10B981] mb-2">
              SYNCHRONIZING GLOBAL SETTLEMENT CORRIDORS
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-6xl sm:text-8xl font-bold tracking-tighter text-white tabular-nums">
                {padded}%
              </span>
              <span className="font-mono text-xs sm:text-sm text-cyan-400 uppercase tracking-widest">
                // ISO-20022 QUORUM LOCK
              </span>
            </div>

            {/* Progress Track */}
            <div className="mt-6 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#10B981] via-cyan-400 to-[#2563EB]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Boot Log Feed */}
            <div className="mt-5 space-y-1 font-mono text-[11px] text-slate-400">
              {BOOT_LOGS.map((line, idx) => {
                const visible = progress >= idx * 24;
                return (
                  <div
                    key={line}
                    className={`transition-opacity duration-150 flex items-center gap-2 ${
                      visible ? 'opacity-100' : 'opacity-20'
                    }`}
                  >
                    <span className="text-[#10B981]">&gt;</span>
                    <span>{line}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Corner Coordinates */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase tracking-widest">
            <span>LATENCY: 0.38ms // ZERO-SLIPPAGE</span>
            <span>NODE: TYO-LDN-NYC-ZRH</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
