import React, { useState, useEffect, useRef } from 'react';

const GLYPHS = '▓▒░█/<>[]01X*#+=_~:;';

export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  scrambleOnHover = true,
  scrambleOnMount = true,
  duration = 520,
  triggerKey = null,
}) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef(null);

  const runScramble = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    const start = performance.now();
    const chars = text.split('');

    const step = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const revealCount = Math.floor(progress * chars.length);

      const next = chars
        .map((ch, idx) => {
          if (ch === ' ') return ' ';
          if (idx < revealCount || progress >= 1) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      setDisplay(next);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
      }
    };

    frameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    setDisplay(text);
    if (scrambleOnMount) {
      runScramble();
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
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
