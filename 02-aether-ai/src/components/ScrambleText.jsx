import React, { useState, useEffect, useRef, useCallback } from 'react';

const GLYPHS = '01▓▒░/<>[]#ΔΛΩ∑⊗⊕⚡';

export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  scrambleOnMount = true,
  scrambleOnHover = true,
  speed = 24,
  step = 0.45,
}) {
  const [displayed, setDisplayed] = useState(text);
  const frameRef = useRef(null);

  const triggerScramble = useCallback(() => {
    if (!text) return;
    let iteration = 0;
    if (frameRef.current) clearInterval(frameRef.current);

    frameRef.current = setInterval(() => {
      setDisplayed(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      iteration += step;
      if (iteration >= text.length) {
        clearInterval(frameRef.current);
        setDisplayed(text);
      }
    }, speed);
  }, [text, speed, step]);

  useEffect(() => {
    setDisplayed(text);
    if (scrambleOnMount) {
      triggerScramble();
    }
    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
    };
  }, [text, scrambleOnMount, triggerScramble]);

  return (
    <Tag
      className={className}
      onMouseEnter={scrambleOnHover ? triggerScramble : undefined}
    >
      {displayed}
    </Tag>
  );
}
