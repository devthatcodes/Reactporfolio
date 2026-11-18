import React from 'react';
import { motion } from 'framer-motion';

const PILLARS = [
  {
    number: '01',
    title: 'Material Honesty',
    subtitle: 'Tactile permanence',
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

export default function Philosophy() {
  return (
    <>
      {/* 01 Studio Overview Strip */}
      <section id="studio" className="relative z-10 py-20 md:py-28 border-t border-charcoal/10 bg-alabaster/80 backdrop-blur-[2px]">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-taupe mb-4">
              <span className="font-mono text-bronze">01</span>
              <span>The Studio</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal leading-tight">
              Two latitudes, one quiet discipline.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm leading-relaxed text-taupe font-light"
          >
            <p>
              Founded in 2018 by Haruki Sato and Astrid Lindholm, Kanso Atelier bridges the
              timber joinery traditions of Kyoto with the tactile masonry and daylight rigor of
              Copenhagen.
            </p>
            <p>
              We take on a deliberate handful of commissions each year—private residences,
              cultural archives, and intimate sanctuaries—shepherding every project from site
              topography to custom bronze hardware.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 03 Philosophy / Ethos Strip */}
      <section id="philosophy" className="relative z-10 py-20 md:py-28 bg-stone/85 backdrop-blur-[2px] border-y border-charcoal/10">
        <div className="max-w-[1360px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row md:items-end justify-between pb-12 border-b border-charcoal/10 gap-6"
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

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-charcoal/10">
            {PILLARS.map((pillar, idx) => (
              <motion.article
                key={pillar.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: idx * 0.12 }}
                className="pt-10 pb-8 md:py-12 md:px-10 first:md:pl-0 last:md:pr-0 flex flex-col justify-between gap-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono text-bronze tracking-[0.2em]">
                      {pillar.number}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-charcoal mt-2">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-taupe mt-1">
                      {pillar.subtitle}
                    </p>
                  </div>
                  <div className="opacity-85">{pillar.icon}</div>
                </div>

                <p className="text-sm leading-relaxed text-taupe font-light">
                  {pillar.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
