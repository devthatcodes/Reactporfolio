import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SolsticeCrest } from './Navbar';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const start = performance.now();
    const duration = 1150; // ~1.15s smooth initialization
    let rafId = null;

    const tick = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          if (onComplete) onComplete();
        }, 220);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  const drumTemp = (165.0 + (progress / 100) * 39.5).toFixed(1);
  const ror = (14.2 - (progress / 100) * 6.4).toFixed(1);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="solstice-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.25 } }}
          className="fixed inset-0 z-[100] pointer-events-auto flex flex-col justify-between p-6 sm:p-10 text-cream overflow-hidden"
        >
          {/* Circular Crema Iris Bloom Aperture Backdrop (NO vertical slices) */}
          <motion.div
            initial={{ scale: 2.2, opacity: 1 }}
            exit={{
              scale: 0,
              opacity: 0,
              transition: { duration: 0.48, ease: [0.65, 0, 0.35, 1] },
            }}
            style={{ willChange: 'transform, opacity' }}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vmax] h-[140vmax] rounded-full bg-espresso border-8 border-terracotta/50"
          />

          {/* Top Telemetry Bar */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-[0.2em] uppercase text-cream/70">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-ping" />
              <span>SOLSTICE SENSORY LAB // SYS.INIT v4.2</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setVisible(false);
                if (onComplete) onComplete();
              }}
              className="px-3 py-1 rounded border border-cream/20 text-cream/80 hover:text-cream hover:border-terracotta transition-colors"
            >
              [ SKIP INIT ]
            </button>
          </div>

          {/* Center Kinetic Readout */}
          <div className="relative z-10 max-w-xl mx-auto w-full text-center space-y-5">
            <div className="flex justify-center">
              <SolsticeCrest className="w-14 h-14" light />
            </div>

            <div className="font-mono text-xs uppercase tracking-[0.28em] text-terracotta">
              {progress < 40
                ? 'PHASE 01 // DRYING ENDOTHERMIC CHARGE'
                : progress < 80
                ? 'PHASE 02 // MAILLARD CARAMELIZATION'
                : 'PHASE 03 // FIRST CRACK • MAILLARD SYNCHRONIZED'}
            </div>

            <div className="font-serif text-6xl sm:text-7xl tracking-tight text-cream tabular-nums">
              {String(progress).padStart(3, '0')}
              <span className="text-2xl text-terracotta font-mono ml-1">%</span>
            </div>

            {/* Progress Track */}
            <div className="h-1 w-full bg-cream/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-terracotta"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Live Roaster Telemetry Strip */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-[11px] font-mono uppercase tracking-wider text-cream/70">
              <div className="p-2.5 rounded-lg bg-cream/5 border border-cream/10">
                <span className="block text-cream/40 text-[9px]">DRUM TEMP</span>
                <span className="text-terracotta font-semibold">{drumTemp}°C</span>
              </div>
              <div className="p-2.5 rounded-lg bg-cream/5 border border-cream/10">
                <span className="block text-cream/40 text-[9px]">RATE OF RISE</span>
                <span className="text-cream font-semibold">{ror}°C/m</span>
              </div>
              <div className="p-2.5 rounded-lg bg-cream/5 border border-cream/10">
                <span className="block text-cream/40 text-[9px]">MAILLARD PHASE</span>
                <span className="text-sage font-semibold">SYNCHRONIZED</span>
              </div>
            </div>
          </div>

          {/* Bottom Coordinates */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-cream/45">
            <span>45.5152° N, 122.6784° W // PORTLAND ROASTERY</span>
            <span>WEBGL FLUID CREMA ENGINE: READY</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
