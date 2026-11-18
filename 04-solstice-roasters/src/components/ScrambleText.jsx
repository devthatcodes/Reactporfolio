import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ScrambleText — Rewritten as "Warm Tactile Spring Wave / Ink-Press Reveal"
 * Zero cyber glyphs or random characters! Words and characters rise gently
 * with an organic analog spring bounce (stiffness: 200, damping: 16) like
 * freshly stamped letterpress type on warm cotton paper.
 */
export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  scrambleOnHover = false,
  triggerKey = null,
}) {
  const [hoverTick, setHoverTick] = useState(0);
  const words = String(text).split(' ');

  return (
    <Tag
      className={`inline-block ${className}`}
      onMouseEnter={
        scrambleOnHover ? () => setHoverTick((prev) => prev + 1) : undefined
      }
    >
      <motion.span
        key={`${triggerKey ?? text}-${hoverTick}`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.032,
            },
          },
        }}
        className="inline"
      >
        {words.map((word, idx) => (
          <React.Fragment key={`${word}-${idx}`}>
            <motion.span
              variants={{
                hidden: {
                  y: '0.32em',
                  opacity: 0,
                  rotate: 1.5,
                  scale: 0.96,
                },
                visible: {
                  y: '0em',
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                  transition: {
                    type: 'spring',
                    stiffness: 200,
                    damping: 16,
                    mass: 0.65,
                  },
                },
              }}
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
            {idx < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}
