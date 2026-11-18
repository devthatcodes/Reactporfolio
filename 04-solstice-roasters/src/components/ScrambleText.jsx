import React, { useState, useEffect, useRef, useCallback } from 'react';

const GLYPHS = '0123456789ABCDEF°%//[]•ΔΩ∑§±#SOLSTICE';

export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  duration = 520,
  scrambleOnHover = false,
  triggerKey = null,
}) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef(null);

  const runScramble = useCallback(() => {
    if (!text) return;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const startTime = performance.now();
    const length = text.length;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const revealCount = Math.floor(progress * length);

      let next = '';
      for (let i = 0; i < length; i++) {
        const char = text[i];
        if (char === ' ' || i < revealCount) {
          next += char;
        } else {
          const glyphIndex = Math.floor(
            (Math.sin(i * 19.7 + now * 0.045) * 0.5 + 0.5) * GLYPHS.length
          );
          next += GLYPHS[glyphIndex % GLYPHS.length];
        }
      }

      setDisplayed(next);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(text);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    runScramble();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [runScramble, triggerKey]);

  return (
    <Tag
      className={className}
      onMouseEnter={scrambleOnHover ? runScramble : undefined}
    >
      {displayed}
    </Tag>
  );
}
