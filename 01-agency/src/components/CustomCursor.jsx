import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [cursorLabel, setCursorLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const springConfig = { damping: 26, stiffness: 360, mass: 0.4 };
  const outerConfig = { damping: 20, stiffness: 180, mass: 0.7 };

  const x = useSpring(-100, springConfig);
  const y = useSpring(-100, springConfig);
  const outerX = useSpring(-100, outerConfig);
  const outerY = useSpring(-100, outerConfig);

  useEffect(() => {
    const onMove = (e) => {
      if (!visible) setVisible(true);
      x.set(e.clientX);
      y.set(e.clientY);
      outerX.set(e.clientX);
      outerY.set(e.clientY);

      const target = e.target?.closest('[data-cursor], button, a');
      if (target) {
        setIsHovering(true);
        const customText = target.getAttribute('data-cursor') || 'INTERACT';
        setCursorLabel(customText);
      } else {
        setIsHovering(false);
        setCursorLabel('');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [visible, x, y, outerX, outerY]);

  if (!visible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {/* Inner Precision Dot */}
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        className="w-2 h-2 rounded-full bg-lime shadow-[0_0_12px_#C8FF32]"
      />

      {/* Outer Active Theory Reticle Ring */}
      <motion.div
        style={{ x: outerX, y: outerY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isHovering ? 76 : 36,
          height: isHovering ? 76 : 36,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={`rounded-full border flex items-center justify-center transition-colors ${
          isHovering
            ? 'border-lime/90 bg-lime/10 backdrop-blur-[2px]'
            : 'border-ivory/30 bg-transparent'
        }`}
      >
        {/* Crosshair ticks */}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-lime/70" />
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-lime/70" />
        <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-[1px] w-1.5 bg-lime/70" />
        <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-[1px] w-1.5 bg-lime/70" />
      </motion.div>

      {/* Contextual Target Telemetry Label */}
      {isHovering && cursorLabel && (
        <motion.div
          style={{ x: outerX, y: outerY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-12 -mt-3 px-2 py-0.5 rounded bg-obsidian/90 border border-lime/50 text-[9px] font-mono uppercase tracking-[0.2em] text-lime whitespace-nowrap shadow-lg"
        >
          [{cursorLabel}]
        </motion.div>
      )}
    </div>
  );
}
