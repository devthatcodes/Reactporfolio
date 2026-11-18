import React, { useState, useEffect, useRef } from 'react';

const GLYPHS = '01X#/_∆◊Ξ§$€¥£94728∑Ω≈';

export default function ScrambleText({
  text = '',
  className = '',
  as: Component = 'span',
  speed = 24,
  scrambleOnHover = false,
  triggerKey = null,
}) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef(null);

  const runScramble = (targetText) => {
    if (frameRef.current) clearInterval(frameRef.current);
    let iteration = 0;
    const length = targetText.length;

    frameRef.current = setInterval(() => {
      const next = targetText
        .split('')
        .map((char, idx) => {
          if (char === ' ') return ' ';
          if (idx < iteration) return targetText[idx];
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');

      setDisplayed(next);
      iteration += Math.max(0.45, length / 18);

      if (iteration >= length) {
        clearInterval(frameRef.current);
        setDisplayed(targetText);
      }
    }, speed);
  };

  useEffect(() => {
    runScramble(String(text));
    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [text, triggerKey]);

  return (
    <Component
      className={className}
      onMouseEnter={scrambleOnHover ? () => runScramble(String(text)) : undefined}
    >
      {displayed}
    </Component>
  );
}
