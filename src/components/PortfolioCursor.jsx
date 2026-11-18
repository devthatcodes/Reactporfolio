import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function PortfolioCursor({ accentColor = '#E2D9C8' }) {
  const [label, setLabel] = useState('');
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  const spring = { damping: 28, stiffness: 340, mass: 0.35 };
  const x = useSpring(-100, spring);
  const y = useSpring(-100, spring);

  useEffect(() => {
    const onMove = (e) => {
      if (!visible) setVisible(true);
      x.set(e.clientX);
      y.set(e.clientY);

      const el = e.target?.closest('[data-cursor], button, a');
      if (el) {
        setHovered(true);
        setLabel(el.getAttribute('data-cursor') || '');
      } else {
        setHovered(false);
        setLabel('');
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [visible, x, y]);

  if (!visible) return null;

  return (
    <div className="hidden lg:block fixed inset-0 pointer-events-none z-[95] overflow-hidden">
      <motion.div
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: label ? 'auto' : hovered ? 44 : 14,
          height: label ? 32 : hovered ? 44 : 14,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className={`rounded-full flex items-center justify-center transition-colors ${
          label
            ? 'px-3.5 bg-[#F5F4F0] text-[#060608] shadow-xl'
            : hovered
            ? 'border border-[#E2D9C8]/70 bg-white/5'
            : 'bg-[#E2D9C8]'
        }`}
      >
        {label && (
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] whitespace-nowrap">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
