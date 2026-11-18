import React from 'react';
import { motion } from 'framer-motion';

/**
 * Poetic Masked Serif Curtain Rise
 * Replaces glyph-scrambling with a serene architectural monograph text reveal:
 * An overflow-hidden mask where typography rises smoothly from y: '105%' to '0%'
 * on a slow, luxurious cubic-bezier [0.16, 1, 0.3, 1] over 0.85s.
 */
export default function ScrambleText({
  text,
  as: Tag = 'span',
  className = '',
  triggerKey = '',
  delay = 0,
  duration = 0.85,
}) {
  const MotionTag = motion[Tag] || motion.span;

  return (
    <span className={`inline-block overflow-hidden align-bottom ${className}`}>
      <MotionTag
        key={`${text}-${triggerKey}`}
        initial={{ y: '105%', opacity: 0.2 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        transition={{
          duration: duration > 10 ? 0.85 : duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="inline-block will-change-transform"
      >
        {text}
      </MotionTag>
    </span>
  );
}
