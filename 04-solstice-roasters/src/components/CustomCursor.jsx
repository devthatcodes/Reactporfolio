import React, { useEffect, useRef, useState } from 'react';

/**
 * CustomCursor — Rewritten as "Warm Circular Roastery Wax-Seal Stamp Cursor"
 * Zero sci-fi crosshair reticles and zero [BRACKET] tags!
 * Features a warm espresso & terracotta wax-seal stamp ring that gently rotates
 * and expands into an artisanal circular badge ("TASTE · EXPLORE") when hovering
 * over coffee bags, buttons, or interactive elements.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const sealRef = useRef(null);
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
    const seal = { x: pos.x, y: pos.y, angle: 0 };
    let rafId = null;

    const handleMouseMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;

      const target = e.target?.closest?.(
        '[data-cursor], a, button, input, select, textarea, [role="button"]'
      );
      if (target) {
        const rawLabel = target.getAttribute('data-cursor') || 'TASTE · EXPLORE';
        const cleanLabel = rawLabel.replace(/\/\//g, '·').replace(/[\[\]]/g, '').trim();
        setIsHovered(true);
        setLabel(cleanLabel);
      } else {
        setIsHovered(false);
        setLabel('');
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const render = () => {
      seal.x += (pos.x - seal.x) * 0.16;
      seal.y += (pos.y - seal.y) * 0.16;
      seal.angle = (seal.angle + 0.35) % 360;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      if (sealRef.current) {
        sealRef.current.style.transform = `translate3d(${seal.x}px, ${seal.y}px, 0)`;
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
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden select-none">
      {/* Warm Espresso Bean Inner Point */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-terracotta transition-transform duration-75"
      />

      {/* Warm Circular Roastery Wax-Seal Stamp Cursor */}
      <div ref={sealRef} className="fixed top-0 left-0">
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 flex items-center justify-center ${
            isPressed
              ? 'w-11 h-11 bg-terracotta/90 text-cream scale-90 shadow-md'
              : isHovered
              ? 'w-20 h-20 bg-espresso/95 text-cream border-2 border-terracotta shadow-editorial scale-100'
              : 'w-9 h-9 border border-dashed border-espresso/45 bg-cream/30'
          }`}
        >
          {/* Rotating Wax-Seal SVG Ring */}
          <svg
            viewBox="0 0 80 80"
            className={`w-full h-full transition-transform duration-500 ${
              isHovered ? 'animate-[spin_12s_linear_infinite] opacity-100' : 'opacity-45'
            }`}
          >
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 3"
              className="text-terracotta"
            />
            {isHovered && (
              <>
                <defs>
                  <path
                    id="wax-seal-cursor-path"
                    d="M 40, 40 m -27, 0 a 27,27 0 1,1 54,0 a 27,27 0 1,1 -54,0"
                  />
                </defs>
                <text
                  fill="#FBF8F3"
                  fontSize="6.3"
                  fontWeight="600"
                  letterSpacing="2.1"
                  className="uppercase font-sans"
                >
                  <textPath href="#wax-seal-cursor-path" startOffset="0%">
                    SOLSTICE ROASTERS · TASTE · EXPLORE ·
                  </textPath>
                </text>
              </>
            )}
          </svg>

          {/* Center Stamp Emblem */}
          {isHovered && (
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-serif italic tracking-wider text-terracotta px-2 text-center leading-tight">
              {label.split('·')[0].slice(0, 10)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
