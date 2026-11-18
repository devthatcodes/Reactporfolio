import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * ScrambleText (Meridian Institutional Edition)
 * Crisp Vertical Slot-Machine / Odometer Slide-Up Reveal.
 * Zero random hacker glyphs — words and currency figures roll smoothly upward
 * into lock position with spring precision inside an overflow-hidden mask.
 */
export default function ScrambleText({
  text = '',
  className = '',
  as: Component = 'span',
  scrambleOnHover = false,
  triggerKey = null,
}) {
  const [rollCycle, setRollCycle] = useState(0);

  useEffect(() => {
    setRollCycle((c) => c + 1);
  }, [text, triggerKey]);

  const rawText = String(text);
  const tokens = rawText.split(' ');
  const isNumericMetric = /[$€£¥%0-9]/.test(rawText) && tokens.length <= 2;

  return (
    <Component
      className={`inline-flex flex-wrap items-baseline ${className}`}
      onMouseEnter={scrambleOnHover ? () => setRollCycle((c) => c + 1) : undefined}
    >
      {isNumericMetric
        ? rawText.split('').map((char, idx) => (
            <span
              key={`${rollCycle}-char-${idx}`}
              className="inline-block overflow-hidden align-bottom leading-[1.12]"
            >
              <motion.span
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 30,
                  mass: 0.6,
                  delay: idx * 0.022,
                }}
                className="inline-block will-change-transform"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            </span>
          ))
        : tokens.map((word, idx) => (
            <span
              key={`${rollCycle}-word-${idx}`}
              className="inline-block overflow-hidden align-bottom leading-[1.14] mr-[0.26em] last:mr-0"
            >
              <motion.span
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 340,
                  damping: 32,
                  mass: 0.7,
                  delay: idx * 0.038,
                }}
                className="inline-block will-change-transform"
              >
                {word}
              </motion.span>
            </span>
          ))}
    </Component>
  );
}
