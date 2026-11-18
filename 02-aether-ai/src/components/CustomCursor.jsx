import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [cursorLabel, setCursorLabel] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springX = useSpring(mouseX, { stiffness: 420, damping: 28, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 420, damping: 28, mass: 0.4 });

  const outerX = useSpring(mouseX, { stiffness: 170, damping: 22, mass: 0.7 });
  const outerY = useSpring(mouseY, { stiffness: 170, damping: 22, mass: 0.7 });

  useEffect(() => {
    // Only enable on fine pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return undefined;
    }

    const onMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target?.closest?.('[data-cursor], button, a, input, select');
      if (target) {
        setIsHovered(true);
        const customLabel = target.getAttribute('data-cursor');
        setCursorLabel(customLabel || '');
      } else {
        setIsHovered(false);
        setCursorLabel('');
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden lg:block">
      {/* Outer Magnetic Reticle Ring */}
      <motion.div
        style={{ x: outerX, y: outerY }}
        animate={{
          width: cursorLabel ? 56 : isHovered ? 44 : 30,
          height: cursorLabel ? 56 : isHovered ? 44 : 30,
          scale: isPressed ? 0.84 : 1,
          rotate: isHovered ? 45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/50 bg-cyan-400/5 shadow-[0_0_20px_rgba(34,211,238,0.2)] backdrop-blur-[1px]"
      >
        {/* Reticle Crosshair Notches */}
        <span className="absolute -top-1 left-1/2 h-1.5 w-[1px] -translate-x-1/2 bg-cyan-400/80" />
        <span className="absolute -bottom-1 left-1/2 h-1.5 w-[1px] -translate-x-1/2 bg-cyan-400/80" />
        <span className="absolute top-1/2 -left-1 h-[1px] w-1.5 -translate-y-1/2 bg-cyan-400/80" />
        <span className="absolute top-1/2 -right-1 h-[1px] w-1.5 -translate-y-1/2 bg-cyan-400/80" />
      </motion.div>

      {/* Inner Precision Core + Dynamic Contextual Tag */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`h-1.5 w-1.5 rounded-full transition-transform duration-150 ${
            isHovered ? 'scale-150 bg-cyan-300 shadow-[0_0_10px_#22D3EE]' : 'bg-cyan-400'
          }`}
        />
        {cursorLabel && (
          <motion.div
            initial={{ opacity: 0, x: 14, scale: 0.9 }}
            animate={{ opacity: 1, x: 22, scale: 1 }}
            className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap rounded border border-cyan-400/50 bg-[#09090B]/95 px-2 py-0.5 font-mono text-[9px] font-semibold tracking-widest text-cyan-300 shadow-lg"
          >
            {cursorLabel}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
