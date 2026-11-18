import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import soundEngine from '../utils/soundEngine';

const BOOT_LOGS = [
  'INITIALIZING WEBGL2 SHADER PIPELINE // VESPERA_GLSL_4.8',
  'MOUNTING SIMPLEX FBM DISPLACEMENT & SDF TUNNEL RINGS',
  'CALIBRATING PROCEDURAL WEB AUDIO SYNTHESIZER',
  'ESTABLISHING 60FPS INERTIA & MAGNETIC RETICLE TELEMETRY',
  'PORTAL READY // ENTERING INTERACTIVE WORK STREAM',
];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const p = Math.min(100, Math.floor(((now - start) / duration) * 100));
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setDone(true);
          if (onComplete) onComplete();
        }, 180);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  const handleSkip = () => {
    soundEngine.playTransition();
    setProgress(100);
    setDone(true);
    if (onComplete) onComplete();
  };

  const logIndex = Math.min(
    BOOT_LOGS.length - 1,
    Math.floor((progress / 100) * BOOT_LOGS.length)
  );

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="vespera-preloader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
          }}
          style={{
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          }}
          onClick={handleSkip}
          className="fixed inset-0 z-[100] bg-obsidian flex flex-col justify-between p-6 sm:p-12 select-none cursor-pointer overflow-hidden"
        >
          {/* Subtle grid & scanning laser line */}
          <div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-40 pointer-events-none" />
          <motion.div
            animate={{ y: ['0vh', '100vh'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-lime/60 to-transparent pointer-events-none"
          />

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.25em] text-ivory/50">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
              <span>VESPERA DIGITAL // INTERACTIVE EXPERIENCE LAB</span>
            </div>
            <span>[ CLICK ANYWHERE TO BYPASS ]</span>
          </div>

          {/* Center Counter & Shader Bar */}
          <div className="relative z-10 max-w-3xl mx-auto w-full my-auto">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-[0.28em] text-lime">
                // SYSTEM CALIBRATION
              </span>
              <span className="font-display font-bold text-5xl sm:text-8xl tracking-tighter text-ivory tabular-nums">
                {String(progress).padStart(3, '0')}
                <span className="text-lime text-3xl sm:text-5xl">%</span>
              </span>
            </div>

            <div className="w-full h-1 bg-ivory/10 rounded-full overflow-hidden mb-5">
              <motion.div
                className="h-full bg-gradient-to-r from-indigoGlow via-lime to-lime shadow-[0_0_20px_#C8FF32]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-ivory/60">
              <span className="truncate">{BOOT_LOGS[logIndex]}</span>
              <span className="text-lime ml-4 shrink-0">GLSL // OK</span>
            </div>
          </div>

          {/* Bottom Coordinates */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-ivory/40">
            <span>34.0522° N // 118.2437° W</span>
            <span>WEBGL2 SHADER ENGINE + WEB AUDIO SYNTH</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
