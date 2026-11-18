import React, { useEffect, useRef, useState } from 'react';

export default function CustomCursor({ onVelocityChange }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mql.matches);
    const onChange = (e) => setIsFinePointer(e.matches);
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    const prev = { x: pos.x, y: pos.y, t: performance.now() };
    let rafId = null;
    let lastVelUpdate = 0;

    const handleMouseMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      const now = performance.now();
      const dt = Math.max(16, now - prev.t);
      const dx = pos.x - prev.x;
      const dy = pos.y - prev.y;
      const speed = Math.min(2400, Math.round((Math.hypot(dx, dy) / dt) * 1000));

      prev.x = pos.x;
      prev.y = pos.y;
      prev.t = now;

      if (onVelocityChange && now - lastVelUpdate > 90) {
        lastVelUpdate = now;
        onVelocityChange(speed);
      }

      const target = e.target?.closest?.(
        '[data-cursor], a, button, input, select, textarea, [role="button"]'
      );
      if (target) {
        setIsHovered(true);
        const customLabel = target.getAttribute('data-cursor') || '';
        setLabel(customLabel);
      } else {
        setIsHovered(false);
        setLabel('');
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const render = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isFinePointer, onVelocityChange]);

  if (!isFinePointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden select-none">
      {/* Precision Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-terracotta transition-transform duration-75"
      />

      {/* Magnetic Outer Reticle Ring + Contextual Telemetry Badge */}
      <div ref={ringRef} className="fixed top-0 left-0">
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 flex items-center justify-center ${
            isPressed
              ? 'w-8 h-8 border-terracotta bg-terracotta/15 scale-90'
              : isHovered
              ? 'w-14 h-14 border-terracotta/90 bg-terracotta/10'
              : 'w-9 h-9 border-espresso/35 bg-transparent'
          }`}
        >
          {/* Reticle crosshair ticks */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-terracotta/70" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[1px] h-1.5 bg-terracotta/70" />
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-[1px] bg-terracotta/70" />
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-[1px] bg-terracotta/70" />
        </div>

        {label && (
          <div className="absolute left-7 -top-3 whitespace-nowrap px-2.5 py-1 rounded-md bg-espresso/95 text-cream border border-terracotta/50 text-[10px] font-mono tracking-[0.16em] uppercase shadow-lg">
            [ {label} ]
          </div>
        )}
      </div>
    </div>
  );
}
