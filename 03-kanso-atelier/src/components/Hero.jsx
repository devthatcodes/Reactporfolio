import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      delay,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col justify-between overflow-hidden bg-architectural-grid"
    >
      <div className="max-w-[1360px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* Left Column: Editorial Typography */}
        <div className="lg:col-span-7 space-y-8 relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.05}
            className="flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-taupe"
          >
            <span className="inline-block w-8 h-[1px] bg-bronze" />
            <span>Architecture &amp; Spatial Design · Est. 2018</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.18}
            className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-[5.25rem] font-normal leading-[1.03] tracking-[-0.015em] text-charcoal"
          >
            Quiet spaces shaped by{' '}
            <span className="italic text-bronze font-normal">light</span>, timber, and stone.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.32}
            className="max-w-xl text-sm sm:text-base leading-relaxed text-taupe font-light"
          >
            Operating between Kyoto and Copenhagen, Kanso Atelier crafts residences, cultural
            pavilions, and sanctuaries rooted in material honesty, quiet proportion, and the
            passage of natural daylight.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.44}
            className="pt-2 flex flex-wrap items-center gap-8"
          >
            <a
              href="#works"
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-charcoal text-alabaster text-xs uppercase tracking-[0.2em] hover:bg-bronze transition-colors duration-300"
            >
              <span>Selected Works</span>
              <span className="text-alabaster/60 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>

            <a
              href="#philosophy"
              className="text-xs uppercase tracking-[0.2em] text-charcoal/80 hover:text-bronze border-b border-charcoal/20 hover:border-bronze pb-1 transition-colors"
            >
              Studio Ethos
            </a>
          </motion.div>
        </div>

        {/* Right Column: Bespoke Architectural Monolith & Line-Art Composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="relative bg-stone border border-charcoal/10 p-6 sm:p-10 aspect-[4/5] flex items-center justify-center overflow-hidden">
            {/* Subtle warm sunbeam gradient */}
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                background:
                  'radial-gradient(circle at 78% 18%, rgba(154, 123, 79, 0.16) 0%, rgba(239, 236, 230, 0) 62%)',
              }}
            />

            <svg
              viewBox="0 0 400 500"
              className="w-full h-full relative z-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Minimalist architectural monolith and light study"
            >
              {/* Outer architectural datum frame */}
              <rect x="24" y="24" width="352" height="452" stroke="#1C1B19" strokeOpacity="0.14" strokeWidth="0.75" />

              {/* Sun / Solstice Circle */}
              <motion.circle
                cx="292"
                cy="112"
                r="42"
                stroke="#9A7B4F"
                strokeWidth="1"
                strokeDasharray="3 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.6, delay: 0.5 }}
              />
              <circle cx="292" cy="112" r="18" fill="#9A7B4F" fillOpacity="0.14" />

              {/* Diagonal Light Ray */}
              <motion.line
                x1="334"
                y1="70"
                x2="90"
                y2="395"
                stroke="#9A7B4F"
                strokeOpacity="0.45"
                strokeWidth="0.85"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 0.6 }}
              />
              <line
                x1="292"
                y1="112"
                x2="132"
                y2="415"
                stroke="#9A7B4F"
                strokeOpacity="0.22"
                strokeWidth="0.75"
              />

              {/* Background Stone Volume */}
              <motion.rect
                x="78"
                y="128"
                width="148"
                height="286"
                fill="#E5E0D7"
                stroke="#1C1B19"
                strokeWidth="1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35 }}
              />

              {/* Timber Louver Rhythm inside Volume */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <line
                  key={i}
                  x1={94 + i * 16}
                  y1="148"
                  x2={94 + i * 16}
                  y2="290"
                  stroke="#9A7B4F"
                  strokeWidth="1"
                  strokeOpacity="0.75"
                />
              ))}

              {/* Foreground Cantilevered Monolith */}
              <motion.path
                d="M152 210 H322 V414 H152 Z"
                fill="#F7F5F0"
                stroke="#1C1B19"
                strokeWidth="1.2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.5 }}
              />

              {/* Deep Eave Shadow Band */}
              <rect x="152" y="210" width="170" height="22" fill="#1C1B19" fillOpacity="0.08" />

              {/* Framed Courtyard Void */}
              <rect x="184" y="268" width="106" height="146" fill="#EFECE6" stroke="#1C1B19" strokeWidth="1" />
              <line x1="237" y1="268" x2="237" y2="414" stroke="#1C1B19" strokeOpacity="0.35" strokeWidth="0.75" />

              {/* Ground Plinth / Datum Line */}
              <line x1="48" y1="414" x2="352" y2="414" stroke="#1C1B19" strokeWidth="1.4" />
              <line x1="48" y1="422" x2="352" y2="422" stroke="#1C1B19" strokeOpacity="0.3" strokeWidth="0.75" />

              {/* Architectural Dimension Marks */}
              <line x1="60" y1="128" x2="60" y2="414" stroke="#78736A" strokeWidth="0.6" />
              <line x1="55" y1="128" x2="65" y2="128" stroke="#78736A" strokeWidth="0.6" />
              <line x1="55" y1="414" x2="65" y2="414" stroke="#78736A" strokeWidth="0.6" />

              <text
                x="52"
                y="275"
                transform="rotate(-90 52 275)"
                fill="#78736A"
                fontSize="8"
                letterSpacing="2.5"
                fontFamily="monospace"
              >
                EL +4.20M
              </text>

              <text
                x="280"
                y="444"
                fill="#78736A"
                fontSize="8"
                letterSpacing="2"
                fontFamily="monospace"
              >
                FIG. 01 / STUDY
              </text>
            </svg>

            {/* Corner Studio Coordinate Tag */}
            <div className="absolute bottom-4 left-6 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
              35.0116° N · 55.6761° N
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="max-w-[1360px] w-full mx-auto px-6 md:px-12 pt-10 flex items-center justify-between border-t border-charcoal/10 mt-12"
      >
        <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] text-taupe">
          <span>Kyoto</span>
          <span className="text-bronze">·</span>
          <span>Copenhagen</span>
        </div>

        <a
          href="#works"
          className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-charcoal hover:text-bronze transition-colors"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="w-3.5 h-3.5 stroke-[1.5] group-hover:translate-y-0.5 transition-transform" />
        </a>
      </motion.div>
    </section>
  );
}
