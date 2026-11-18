import React, { useEffect, useRef, useState } from 'react';

/**
 * Active Theory–caliber Custom Magnetic Architectural Reticle Cursor
 * Detects `[data-cursor="..."]` attributes on hovered elements and displays
 * dynamic spatial readouts (`[ ENTER MONOGRAPH ]`, `[ SCRUB SOLAR ANGLE ]`, `[ COMMISSION ]`)
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [cursorLabel, setCursorLabel] = useState('');
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer devices
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pos.x, y: pos.y };
    let rafId;

    const onMouseMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target?.closest?.('[data-cursor]');
      if (target) {
        setCursorLabel(target.getAttribute('data-cursor') || '');
      } else {
        const clickable = e.target?.closest?.('a, button, input, textarea, [role="button"]');
        setCursorLabel(clickable ? 'SELECT' : '');
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);

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

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const hasLabel = Boolean(cursorLabel);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden lg:block overflow-hidden">
      {/* Precision Center Crosshair Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1.5 -mt-1.5 w-3 h-3 flex items-center justify-center will-change-transform"
      >
        <span className="w-1 h-1 bg-bronze rounded-full" />
      </div>

      {/* Smooth-Lerped Outer Architectural Reticle */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 will-change-transform flex items-center"
      >
        <div
          className={`relative -ml-5 -mt-5 w-10 h-10 border transition-all duration-300 flex items-center justify-center ${
            isPressed
              ? 'scale-75 border-bronze bg-bronze/15'
              : hasLabel
              ? 'scale-125 border-bronze bg-charcoal/5'
              : 'scale-100 border-charcoal/35'
          }`}
        >
          {/* Corner architectural ticks */}
          <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-bronze" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-bronze" />
          <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-bronze" />
          <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-bronze" />
        </div>

        {/* Contextual Spatial Readout Pill */}
        {hasLabel && (
          <div
            ref={labelRef}
            className="ml-3 -mt-5 px-2.5 py-1 bg-charcoal text-alabaster border border-bronze/40 text-[9px] font-mono uppercase tracking-[0.22em] whitespace-nowrap shadow-lg"
          >
            [ {cursorLabel} ]
          </div>
        )}
      </div>
    </div>
  );
}
