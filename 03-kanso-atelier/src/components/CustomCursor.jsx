import React, { useEffect, useRef, useState } from 'react';

/**
 * Editorial Blend-Mode Ink Lens Cursor
 * Inspired by Kengo Kuma, Cereal Magazine, and Kinfolk monographs:
 * A serene mix-blend-difference soft ink circle that smoothly expands into a warm
 * circular editorial badge reading "View" in italic Cormorant Garamond serif
 * when hovering over architectural plates.
 */
export default function CustomCursor() {
  const lensRef = useRef(null);
  const [cursorMode, setCursorMode] = useState('default'); // 'default' | 'plate' | 'link'
  const [cursorWord, setCursorWord] = useState('View');
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smooth = { x: pos.x, y: pos.y };
    let rafId;

    const onMouseMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      const customTarget = e.target?.closest?.('[data-cursor]');
      if (customTarget) {
        const raw = customTarget.getAttribute('data-cursor') || 'View';
        // Normalize any legacy uppercase labels into poetic editorial words
        let editorialText = 'View';
        if (/sun|solar|heliodon|light/i.test(raw)) editorialText = 'Light';
        else if (/cad|plan|section|layer/i.test(raw)) editorialText = 'Plan';
        else if (/archive|works|explore/i.test(raw)) editorialText = 'Archive';
        else if (/ethos|philosophy|studio/i.test(raw)) editorialText = 'Ethos';
        else if (/view|open|monograph|plate/i.test(raw)) editorialText = 'View';
        else if (raw.length <= 10) {
          editorialText = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
        }
        setCursorWord(editorialText);
        setCursorMode('plate');
      } else {
        const clickable = e.target?.closest?.('a, button, input, textarea, [role="button"]');
        setCursorMode(clickable ? 'link' : 'default');
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);

    const render = () => {
      smooth.x += (pos.x - smooth.x) * 0.16;
      smooth.y += (pos.y - smooth.y) * 0.16;

      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${smooth.x}px, ${smooth.y}px, 0)`;
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

  const isPlate = cursorMode === 'plate';
  const isLink = cursorMode === 'link';

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[90] hidden lg:block overflow-hidden ${
        isPlate ? '' : 'mix-blend-difference'
      }`}
    >
      <div
        ref={lensRef}
        className="fixed top-0 left-0 will-change-transform flex items-center justify-center"
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isPlate
              ? `w-20 h-20 bg-[#1C1B19]/92 text-[#F6F4F0] border border-[#9A7B4F]/50 shadow-[0_12px_32px_rgba(28,27,25,0.18)] ${
                  isPressed ? 'scale-90' : 'scale-100'
                }`
              : isLink
              ? `w-9 h-9 bg-[#F6F4F0]/90 ${isPressed ? 'scale-75' : 'scale-100'}`
              : `w-3.5 h-3.5 bg-[#F6F4F0]/90 ${isPressed ? 'scale-75' : 'scale-100'}`
          }`}
        >
          {isPlate && (
            <span className="font-serif italic text-lg tracking-wide text-[#F6F4F0] select-none">
              {cursorWord}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
