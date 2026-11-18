import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ScrambleText (Linear / Vercel Metallic Shimmer & Staggered Word Slide-Up Reveal)
 * Replaces hacker glyph scrambling with a crisp staggered word-by-word
 * vertical slide-up + subtle metallic cyan/violet highlight sweep.
 */
export default function ScrambleText({
  text = '',
  as: Tag = 'span',
  className = '',
  scrambleOnHover = true,
}) {
  const [hovered, setHovered] = useState(false);
  const words = String(text).split(' ');

  return (
    <Tag
      className={`relative inline-block ${className}`}
      onMouseEnter={scrambleOnHover ? () => setHovered(true) : undefined}
      onMouseLeave={scrambleOnHover ? () => setHovered(false) : undefined}
    >
      <span className="inline">
        {words.map((word, idx) => (
          <React.Fragment key={`${word}-${idx}`}>
            <motion.span
              initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{
                duration: 0.42,
                delay: Math.min(idx * 0.038, 0.32),
                ease: [0.16, 1, 0.3, 1],
              }}
              animate={
                hovered
                  ? {
                      y: -1.5,
                      textShadow: '0 0 18px rgba(56, 189, 248, 0.45)',
                    }
                  : {
                      y: 0,
                      textShadow: '0 0 0px rgba(56, 189, 248, 0)',
                    }
              }
              className="inline-block will-change-transform"
            >
              {word}
            </motion.span>
            {idx < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  );
}
