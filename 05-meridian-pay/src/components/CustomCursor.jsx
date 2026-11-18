import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [label, setLabel] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 420, damping: 28, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 420, damping: 28, mass: 0.4 });

  useEffect(() => {
    // Only show custom reticle on fine pointer devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target?.closest?.('[data-cursor], button, a, input, select');
      if (target) {
        setIsHovered(true);
        const customText = target.getAttribute('data-cursor');
        setLabel(customText || '');
      } else {
        setIsHovered(false);
        setLabel('');
      }
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isVisible, cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden lg:block overflow-hidden">
      {/* Center precision dot */}
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]"
      />

      {/* Outer magnetic reticle ring + contextual telemetry tag */}
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{
          scale: isHovered ? 1.35 : 1,
        }}
        transition={{ duration: 0.18 }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center"
      >
        <div
          className={`w-9 h-9 rounded-full border transition-colors duration-200 flex items-center justify-center ${
            isHovered
              ? 'border-[#10B981] bg-[#10B981]/10 shadow-[0_0_24px_rgba(16,185,129,0.3)]'
              : 'border-cyan-400/40 bg-transparent'
          }`}
        >
          {/* Reticle crosshair ticks */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-px h-1.5 bg-[#10B981]/70" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-px h-1.5 bg-[#10B981]/70" />
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-px w-1.5 bg-[#10B981]/70" />
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-px w-1.5 bg-[#10B981]/70" />
        </div>

        {label && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 14 }}
            className="whitespace-nowrap px-2.5 py-1 rounded bg-[#030712]/90 border border-[#10B981]/50 text-[10px] font-mono font-semibold tracking-widest text-[#10B981] uppercase shadow-lg backdrop-blur-md"
          >
            [ {label} ]
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
