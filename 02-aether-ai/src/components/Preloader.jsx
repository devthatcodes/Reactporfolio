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
    const duration = 1150;

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
        }, 280);
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
          exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.35 } }}
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-[#09090B] p-6 sm:p-12"
        >
          {/* Multi-slice curtain panels that slide away on exit */}
          <div className="pointer-events-none absolute inset-0 flex">
            {[0, 1, 2, 3, 4].map((slice) => (
              <motion.div
                key={slice}
                initial={{ scaleY: 1 }}
                exit={{
                  scaleY: 0,
                  transition: {
                    duration: 0.55,
                    delay: slice * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                style={{ originY: slice % 2 === 0 ? 0 : 1 }}
                className="h-full flex-1 border-r border-zinc-800/40 bg-[#09090B]"
              />
            ))}
          </div>

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
              <span className="text-cyan-400">AETHER // OS v2.4</span>
            </div>
            <span>BOOT SEQUENCE // ACTIVE THEORY CALIBRATION</span>
          </div>

          {/* Center Counter & Diagnostics */}
          <div className="relative z-10 my-auto mx-auto w-full max-w-2xl">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                NEURAL SHADER & TELEMETRY ALLOCATION
              </span>
              <span className="font-mono text-5xl font-black tracking-tighter text-[#FAFAFA] sm:text-7xl">
                {String(progress).padStart(3, '0')}
                <span className="text-cyan-400">%</span>
              </span>
            </div>

            {/* Progress Track */}
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
              <motion.div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#34D399] shadow-[0_0_20px_#22D3EE]"
              />
            </div>

            {/* Diagnostic Log Feed */}
            <div className="mt-6 space-y-1.5 rounded-xl border border-zinc-800/80 bg-[#111115]/90 p-4 font-mono text-[11px]">
              {BOOT_LOGS.slice(0, activeLogCount).map((line) => (
                <div key={line} className="flex items-center justify-between text-zinc-300">
                  <span className="truncate">{line}</span>
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
