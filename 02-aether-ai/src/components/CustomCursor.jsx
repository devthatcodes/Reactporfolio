import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — Ambient Radial Spotlight Follower
 * A zero-lag 420px soft radial cyan/violet spotlight glow that smoothly
 * illuminates the dark grid and card borders under the native cursor.
 * Zero crosshair reticles, zero bracket labels, zero React re-renders on mousemove.
 */
export default function CustomCursor() {
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const smoothX = useSpring(mouseX, { stiffness: 320, damping: 32, mass: 0.35 });
  const smoothY = useSpring(mouseY, { stiffness: 320, damping: 32, mass: 0.35 });

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches
    ) {
      return undefined;
    }

    const onMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] hidden overflow-hidden lg:block">
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          background:
            'radial-gradient(circle, rgba(56, 189, 248, 0.09) 0%, rgba(139, 92, 246, 0.045) 38%, transparent 70%)',
        }}
        className="fixed top-0 left-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full will-change-transform"
      />
    </div>
  );
}
