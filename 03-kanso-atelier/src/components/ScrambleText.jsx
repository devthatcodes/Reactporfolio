import React, { useState, useEffect, useRef } from 'react';

const GLYPHS = '┼┤├┴┬─│╱╲▭▯0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Active Theory–inspired kinetic scramble typography decoder.
 * Decodes text using architectural drafting box-drawing and coordinate glyphs.
 */
export default function ScrambleText({
  text,
  as: Tag = 'span',
  className = '',
  triggerKey = '',
  scrambleOnHover = false,
  duration = 520,
}) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(null);

  const runScramble = () => {
    cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    const length = text.length;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const revealedCount = Math.floor(progress * length);

      let out = '';
      for (let i = 0; i < length; i++) {
        const ch = text[i];
        if (ch === ' ' || ch === '·' || ch === '/') {
          out += ch;
        } else if (i < revealedCount) {
          out += ch;
        } else {
          out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }

      setDisplay(out);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    runScramble();
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, triggerKey]);

  return (
    <Tag
      className={className}
      onMouseEnter={scrambleOnHover ? runScramble : undefined}
    >
      {display}
    </Tag>
  );
}
