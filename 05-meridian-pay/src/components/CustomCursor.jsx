import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — Meridian iPadOS / Stripe Magnetic Cursor Halo
 * A soft, minimal 24px translucent emerald/white ring without crosshair ticks or bracket text.
 */
export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 460, damping: 32, mass: 0.35 });
  const springY = useSpring(cursorY, { stiffness: 460, damping: 32, mass: 0.35 });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target?.closest?.('[data-cursor], button, a, input, select');
      setIsHovered(Boolean(target));
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [isVisible, cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden lg:block overflow-hidden">
      <motion.div
        style={{ x: springX, y: springY }}
        animate={{
          scale: isHovered ? 1.45 : 1,
          opacity: isHovered ? 0.95 : 0.65,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`w-6 h-6 rounded-full border transition-all duration-200 ${
            isHovered
              ? 'border-[#10B981]/80 bg-[#10B981]/15 shadow-[0_0_20px_rgba(16,185,129,0.28)]'
              : 'border-white/30 bg-white/[0.04]'
          }`}
        />
      </motion.div>
    </div>
  );
}
