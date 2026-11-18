import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Pure GPU-composited Section Reveal for 01-agency (Vespera Digital):
 * Uses ONLY translate3d (y), scale, and opacity + scaleX laser bar.
 * Zero clip-path, zero blur, zero full-page wrapper — locked 60/120fps.
 */
export function ScrollSectionPortal({
  children,
  sectionNumber = '01',
  sectionTag = 'PORTAL SECTOR',
  accent = '#C8FF32',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Direct GPU transforms without nested spring lag or clip-path repaints
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [56, 0, 0, -48]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0.15, 1, 1, 0.2]);
  const beamScaleX = useTransform(scrollYProgress, [0.05, 0.45], [0, 1]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        style={{ y, scale, opacity }}
        className="relative will-change-transform"
      >
        {/* Scroll-Scrubbed Section Gate Header */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.26em] text-ivory/45 mb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <span>
                SECTOR {sectionNumber} // {sectionTag}
              </span>
            </div>
            <span>GPU COMPOSITOR // 60FPS</span>
          </div>
          <div className="w-full h-[1px] bg-ivory/10 relative overflow-hidden">
            <motion.div
              style={{
                scaleX: beamScaleX,
                transformOrigin: 'left',
                backgroundColor: accent,
              }}
              className="w-full h-full will-change-transform"
            />
          </div>
        </div>

        {children}
      </motion.div>
    </div>
  );
}

/**
 * Pure GPU-accelerated horizontal cinema ticker between sections.
 */
export function ScrollKineticRibbon({
  topText = 'ACTIVE PORTAL STREAM // WIDESCREEN HORIZONTAL REEL //',
  bottomText = 'VESPERA DIGITAL LAB // SUB-SECOND EDGE ARCHITECTURE //',
  accent = '#C8FF32',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const xLeft = useTransform(scrollYProgress, [0, 1], ['4%', '-14%']);
  const xRight = useTransform(scrollYProgress, [0, 1], ['-14%', '4%']);

  return (
    <div
      ref={ref}
      className="relative py-8 sm:py-10 overflow-hidden select-none border-y border-ivory/10 bg-[#0A0A0C]/90"
    >
      <motion.div
        style={{ x: xLeft }}
        className="flex items-center gap-8 whitespace-nowrap will-change-transform mb-2"
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl tracking-tighter uppercase text-ivory/15">
              {topText}
            </span>
            <span
              style={{ borderColor: accent }}
              className="w-4 h-4 border rotate-45 inline-block shrink-0"
            />
          </div>
        ))}
      </motion.div>

      <motion.div
        style={{ x: xRight }}
        className="flex items-center gap-8 whitespace-nowrap will-change-transform"
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-8">
            <span
              className="font-mono text-xs uppercase tracking-[0.32em]"
              style={{ color: accent }}
            >
              {bottomText}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-ivory/30 inline-block" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
