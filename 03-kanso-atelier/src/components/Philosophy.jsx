import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const PILLARS = [
  {
    number: '01',
    title: 'Material Honesty',
    subtitle: 'Tactile permanence',
    datum: 'SPEC // HINOKI & RAMMED EARTH',
    description:
      'We build with unvarnished hinoki, Danish clay brick, rammed earth, and honed granite—materials that record time gracefully and invite touch without synthetic ornament.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="10" width="36" height="28" stroke="#1C1B19" strokeWidth="1" />
        <line x1="6" y1="20" x2="42" y2="20" stroke="#9A7B4F" strokeWidth="1" />
        <line x1="20" y1="20" x2="20" y2="38" stroke="#1C1B19" strokeOpacity="0.4" strokeWidth="1" />
        <line x1="32" y1="10" x2="32" y2="20" stroke="#1C1B19" strokeOpacity="0.4" strokeWidth="1" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Natural Light',
    subtitle: 'Choreographed shadow',
    datum: 'SPEC // SAWTOOTH CLERESTORY',
    description:
      'Daylight is our primary structural element. Through deep eaves, sawtooth clerestories, and calibrated apertures, we shape rooms that shift quietly from dawn to dusk.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="32" cy="14" r="6" stroke="#9A7B4F" strokeWidth="1" />
        <line x1="27" y1="19" x2="10" y2="38" stroke="#9A7B4F" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="34" y1="20" x2="22" y2="38" stroke="#1C1B19" strokeOpacity="0.35" strokeWidth="1" />
        <line x1="6" y1="38" x2="42" y2="38" stroke="#1C1B19" strokeWidth="1" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Spatial Stillness',
    subtitle: 'Measured proportion',
    datum: 'SPEC // MA NEGATIVE THRESHOLD',
    description:
      'Guided by Japanese ma (negative space) and Nordic restraint, every threshold is stripped of excess so human presence, silence, and landscape come into focus.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="8" width="32" height="32" stroke="#1C1B19" strokeWidth="1" />
        <rect x="16" y="16" width="16" height="16" stroke="#9A7B4F" strokeWidth="1" />
        <circle cx="24" cy="24" r="1.5" fill="#1C1B19" />
      </svg>
    ),
  },
];

function PillarParallaxCard({ pillar, index, scrollYProgress }) {
  // Differential column speeds & staggered 3D flip-in
  const yStart = 90 + index * 45;
  const yEnd = -35 - index * 25;

  const y = useTransform(scrollYProgress, [0, 0.48, 1], [yStart, 0, yEnd]);
  const rotateX = useTransform(scrollYProgress, [0.05, 0.42, 0.78, 1], [28, 0, 0, -16]);
  const rotateY = useTransform(
    scrollYProgress,
    [0.05, 0.42, 0.78, 1],
    [(index - 1) * -18, 0, 0, (index - 1) * 12]
  );
  const scale = useTransform(scrollYProgress, [0.05, 0.42, 0.8, 1], [0.88, 1, 1, 0.93]);
  const opacity = useTransform(scrollYProgress, [0.04, 0.3, 0.85, 0.98], [0, 1, 1, 0.25]);

  return (
    <motion.article
      style={{
        y,
        rotateX,
        rotateY,
        scale,
        opacity,
        transformPerspective: 1400,
        transformStyle: 'preserve-3d',
      }}
      className="relative bg-alabaster/95 border border-charcoal/15 p-8 sm:p-10 flex flex-col justify-between gap-8 shadow-[0_22px_50px_rgba(28,27,25,0.09)] hover:border-bronze/60 transition-colors will-change-transform"
    >
      {/* Top CAD Datum Header */}
      <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.22em] text-taupe border-b border-charcoal/10 pb-3">
        <span className="text-bronze">PILLAR // {pillar.number}</span>
        <span>{pillar.datum}</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
            {pillar.title}
          </h3>
          <p className="text-[11px] uppercase tracking-[0.2em] text-bronze font-mono mt-1.5">
            {pillar.subtitle}
          </p>
        </div>
        <div className="opacity-90 shrink-0 p-2 bg-stone border border-charcoal/10">
          {pillar.icon}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-taupe font-light">
        {pillar.description}
      </p>

      {/* Bottom Corner Structural Index */}
      <div className="pt-3 border-t border-charcoal/10 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
        <span>TOLERANCE ±0.5MM</span>
        <span className="text-charcoal">AXIS 0{index + 1}</span>
      </div>
    </motion.article>
  );
}

export default function Philosophy() {
  const studioRef = useRef(null);
  const pillarsRef = useRef(null);

  const { scrollYProgress: rawStudioProgress } = useScroll({
    target: studioRef,
    offset: ['start end', 'end start'],
  });
  const studioProgress = useSpring(rawStudioProgress, { stiffness: 160, damping: 28 });

  const leftColY = useTransform(studioProgress, [0, 0.5, 1], [65, 0, -55]);
  const rightCol1Y = useTransform(studioProgress, [0, 0.5, 1], [110, 0, -35]);
  const rightCol2Y = useTransform(studioProgress, [0, 0.5, 1], [155, 0, -75]);
  const studioRotateX = useTransform(studioProgress, [0, 0.35, 0.75, 1], [14, 0, 0, -12]);

  const { scrollYProgress: rawPillarsProgress } = useScroll({
    target: pillarsRef,
    offset: ['start end', 'end start'],
  });
  const pillarsProgress = useSpring(rawPillarsProgress, { stiffness: 160, damping: 28 });

  const headerParallaxY = useTransform(pillarsProgress, [0, 0.5, 1], [50, 0, -45]);

  return (
    <>
      {/* 01 Studio Overview Strip with Differential Column Scroll Parallax */}
      <section
        ref={studioRef}
        id="studio"
        className="relative z-10 py-20 md:py-28 border-t border-charcoal/10 bg-alabaster/85 backdrop-blur-[2px] overflow-hidden"
      >
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start [perspective:1400px]">
          <motion.div
            style={{ y: leftColY, rotateX: studioRotateX }}
            className="lg:col-span-4 will-change-transform"
          >
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-taupe mb-4">
              <span className="font-mono text-bronze">01</span>
              <span>The Studio</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal leading-tight">
              Two latitudes, one quiet discipline.
            </h2>
            <div className="mt-6 inline-flex items-center gap-3 px-3.5 py-1.5 bg-stone border border-charcoal/15 text-[10px] font-mono uppercase tracking-[0.2em] text-bronze">
              <span>KYOTO 35.01°N</span>
              <span>↔</span>
              <span>COPENHAGEN 55.67°N</span>
            </div>
          </motion.div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm leading-relaxed text-taupe font-light">
            <motion.div
              style={{ y: rightCol1Y, rotateX: studioRotateX }}
              className="p-6 bg-stone/70 border border-charcoal/10 shadow-sm will-change-transform"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-bronze mb-2">
                01.A // TIMBER &amp; MASONRY
              </div>
              <p>
                Founded in 2018 by Haruki Sato and Astrid Lindholm, Kanso Atelier bridges the
                timber joinery traditions of Kyoto with the tactile masonry and daylight rigor of
                Copenhagen.
              </p>
            </motion.div>

            <motion.div
              style={{ y: rightCol2Y, rotateX: studioRotateX }}
              className="p-6 bg-stone/70 border border-charcoal/10 shadow-sm will-change-transform"
            >
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-bronze mb-2">
                01.B // BESPOKE COMMISSIONS
              </div>
              <p>
                We take on a deliberate handful of commissions each year—private residences,
                cultural archives, and intimate sanctuaries—shepherding every project from site
                topography to custom bronze hardware.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 03 Philosophy / Ethos Strip with 3D Card Flip-In & Column Parallax */}
      <section
        ref={pillarsRef}
        id="philosophy"
        className="relative z-10 py-24 md:py-32 bg-stone/85 backdrop-blur-[2px] border-y border-charcoal/10 overflow-hidden"
      >
        <div className="max-w-[1360px] mx-auto px-6 md:px-12">
          <motion.div
            style={{ y: headerParallaxY }}
            className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-charcoal/10 gap-6 will-change-transform"
          >
            <div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-taupe mb-3">
                <span className="font-mono text-bronze">03</span>
                <span>Architectural Ethos</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-normal">
                Three Pillars of Form
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-taupe leading-relaxed">
              Every line drawn in our studio is tested against permanence, climate, and the quiet
              rituals of daily life.
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 [perspective:1600px]">
            {PILLARS.map((pillar, idx) => (
              <PillarParallaxCard
                key={pillar.number}
                pillar={pillar}
                index={idx}
                scrollYProgress={pillarsProgress}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
