import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Active Theory–caliber Architectural Spatial Calibration Preloader
 * Auto-completes smoothly in ~1.25s with multi-panel geometric shutter reveal.
 */
export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 1150;

    const update = (now) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(update);
      } else {
        setTimeout(() => {
          setDone(true);
          if (onComplete) onComplete();
        }, 180);
      }
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="kanso-preloader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] pointer-events-auto flex flex-col justify-between p-6 sm:p-12 bg-charcoal text-alabaster overflow-hidden"
        >
          {/* Architectural Grid Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(247,245,240,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(247,245,240,0.16) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />

          {/* Top Calibration Telemetry */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.26em] text-alabaster/60">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-bronze animate-pulse" />
              <span>KANSO ATELIER // SPATIAL ENGINE v4.2</span>
            </div>
            <div className="hidden sm:block">
              <span>35.0116° N, 135.7681° E · 55.6761° N, 12.5683° E</span>
            </div>
          </div>

          {/* Center Geometric Calibration Monolith */}
          <div className="relative z-10 my-auto max-w-xl mx-auto w-full space-y-6">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-bronze">
                [ CALIBRATING LIGHT &amp; CAUSTIC FIELD ]
              </span>
              <span className="font-mono text-3xl sm:text-5xl text-alabaster tracking-tight">
                {String(progress).padStart(3, '0')}%
              </span>
            </div>

            {/* Precision Hairline Progress Bar */}
            <div className="relative h-[2px] w-full bg-alabaster/15 overflow-hidden">
              <motion.div
                className="h-full bg-bronze"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 text-[10px] font-mono uppercase tracking-[0.2em] text-alabaster/50">
              <div>
                <span className="block text-alabaster/30">SHADER</span>
                <span>GLSL CAUSTICS OK</span>
              </div>
              <div>
                <span className="block text-alabaster/30">DATUM SCALE</span>
                <span>1 : 100 METRIC</span>
              </div>
              <div className="text-right">
                <span className="block text-alabaster/30">SOLAR AXIS</span>
                <span>AZIMUTH LOCKED</span>
              </div>
            </div>
          </div>

          {/* Bottom Architectural Scale Bar */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-alabaster/50 border-t border-alabaster/15 pt-4">
            <span>KYOTO · COPENHAGEN</span>
            <span>MONOGRAPH ARCHIVE // 2018—2025</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
