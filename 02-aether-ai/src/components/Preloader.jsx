import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LOGS = [
  'INIT WEBGL_2.0 // GLSL FRAGMENT TENSOR FIELD... OK',
  'MOUNTING EDGE VECTOR ROUTER [32 GLOBAL POPS]... OK',
  'CALIBRATING SUB-10MS SEMANTIC CACHE PIPELINE... OK',
  'SYNCHRONIZING NEURAL TELEMETRY STREAM... READY',
];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          if (onComplete) onComplete();
        }, 200);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  const activeLogCount = Math.min(
    BOOT_LOGS.length,
    Math.floor((progress / 100) * BOOT_LOGS.length) + 1
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="aether-preloader"
          initial={{ scaleY: 1, opacity: 1 }}
          exit={{
            scaleY: 0,
            opacity: 0,
            transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
          }}
          style={{ transformOrigin: 'center center' }}
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden border-y border-cyan-400/50 bg-[#09090B] p-6 sm:p-12 will-change-transform"
        >
          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-cyan-400">AETHER // OS v2.4</span>
            </div>
            <span>BOOT SEQUENCE // CRT SCANLINE SYNC</span>
          </div>

          {/* Center Counter & Diagnostics */}
          <div className="relative z-10 my-auto mx-auto w-full max-w-2xl">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                NEURAL SHADER &amp; TELEMETRY ALLOCATION
              </span>
              <span className="font-mono text-5xl font-black tracking-tighter text-[#FAFAFA] sm:text-7xl">
                {String(progress).padStart(3, '0')}
                <span className="text-cyan-400">%</span>
              </span>
            </div>

            {/* Progress Track (GPU scaleX) */}
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
              <div
                style={{
                  transform: `scaleX(${progress / 100})`,
                  transformOrigin: 'left center',
                }}
                className="h-full w-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#34D399] will-change-transform"
              />
            </div>

            {/* Diagnostic Log Feed */}
            <div className="mt-6 space-y-1.5 rounded-xl border border-zinc-800/80 bg-[#090D16]/95 p-4 font-mono text-[11px]">
              {BOOT_LOGS.slice(0, activeLogCount).map((line) => (
                <div key={line} className="flex items-center justify-between text-zinc-300">
                  <span className="truncate">&gt; {line}</span>
                  <span className="ml-3 text-emerald-400">[OK]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Coordinates */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[10px] tracking-widest text-zinc-500">
            <span>KERNEL: GLSL_TENSOR_V4</span>
            <span>LATENCY TARGET: &lt;10MS GLOBAL</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
