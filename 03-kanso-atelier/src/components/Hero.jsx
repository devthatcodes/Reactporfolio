import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Sun, Compass } from 'lucide-react';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';

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

export default function Hero({ onNavigatePortal }) {
  const sectionRef = useRef(null);
  const [mouseNorm, setMouseNorm] = useState({ x: 0.65, y: 0.28 });

  // Multi-layer foreground parallax driven by scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const titleParallaxY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const copyParallaxY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  const monolithParallaxY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const monolithRotateY = useTransform(scrollYProgress, [0, 1], [0, -14]);
  const monolithRotateX = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const plaqueParallaxY = useTransform(scrollYProgress, [0, 1], [0, -145]);

  const handleMonolithMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0.1, Math.min(0.9, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0.1, Math.min(0.85, (e.clientY - rect.top) / rect.height));
    setMouseNorm({ x, y });
  };

  const sunCx = Math.round(90 + mouseNorm.x * 240);
  const sunCy = Math.round(60 + mouseNorm.y * 140);
  const shadowShift = Math.round((0.5 - mouseNorm.x) * 60);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative z-10 min-h-screen pt-28 pb-16 md:pt-36 md:pb-24 flex flex-col justify-between overflow-hidden bg-architectural-grid"
    >
      <div className="max-w-[1360px] w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center my-auto">
        {/* Left Column: Editorial & Kinetic Typography with Differential Scroll Parallax */}
        <div className="lg:col-span-7 space-y-8 relative z-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.05}
            style={{ y: copyParallaxY }}
            className="flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-taupe"
          >
            <span className="inline-block w-8 h-[1px] bg-bronze" />
            <ScrambleText
              text="Architecture & Spatial Experience · Est. 2018"
              duration={720}
            />
          </motion.div>

          <motion.div style={{ y: titleParallaxY }} className="will-change-transform">
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
          </motion.div>

          <motion.div style={{ y: copyParallaxY }} className="space-y-8 will-change-transform">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.32}
              className="max-w-xl text-sm sm:text-base leading-relaxed text-taupe font-light"
            >
              Operating between Kyoto and Copenhagen, Kanso Atelier crafts residences, cultural
              pavilions, and sanctuaries rooted in material honesty, quiet proportion, and the
              choreographed passage of natural daylight.
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
                data-cursor="ENTER ARCHIVE"
                onMouseEnter={() => soundEngine.playHoverTick(1.0)}
                onClick={(e) => {
                  e.preventDefault();
                  soundEngine.playPortalSweep();
                  if (onNavigatePortal) {
                    onNavigatePortal({
                      index: '02',
                      label: 'Works',
                      href: '#works',
                      sectionTitle: 'MONOGRAPH ARCHIVE',
                    });
                  }
                }}
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-charcoal text-alabaster text-xs uppercase tracking-[0.2em] hover:bg-bronze transition-colors duration-300"
              >
                <span>Selected Monographs</span>
                <span className="text-alabaster/60 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </a>

              <a
                href="#philosophy"
                data-cursor="STUDIO ETHOS"
                onMouseEnter={() => soundEngine.playHoverTick(1.1)}
                onClick={(e) => {
                  e.preventDefault();
                  soundEngine.playPortalSweep();
                  if (onNavigatePortal) {
                    onNavigatePortal({
                      index: '03',
                      label: 'Philosophy',
                      href: '#philosophy',
                      sectionTitle: 'SPATIAL ETHOS',
                    });
                  }
                }}
                className="text-xs uppercase tracking-[0.2em] text-charcoal/80 hover:text-bronze border-b border-charcoal/20 hover:border-bronze pb-1 transition-colors"
              >
                Spatial Philosophy
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Solar Monolith & Caustic Raytracer Study with 3D Scroll Pitch */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{
            y: monolithParallaxY,
            rotateY: monolithRotateY,
            rotateX: monolithRotateX,
            transformPerspective: 1400,
            transformStyle: 'preserve-3d',
          }}
          className="lg:col-span-5 relative will-change-transform"
        >
          {/* Floating Foreground Parallax Telemetry Plaque */}
          <motion.div
            style={{ y: plaqueParallaxY }}
            className="hidden sm:flex items-center gap-3 absolute -left-8 bottom-12 z-30 px-4 py-2.5 bg-charcoal text-alabaster border border-bronze/50 shadow-xl"
          >
            <Compass className="w-4 h-4 text-bronze animate-spin [animation-duration:18s]" />
            <div className="text-[9px] font-mono uppercase tracking-[0.2em]">
              <div className="text-bronze">SOLAR DATUM // 1:100</div>
              <div>SHADOW VECTOR {shadowShift > 0 ? `+${shadowShift}` : shadowShift}MM</div>
            </div>
          </motion.div>

          <div
            onMouseMove={handleMonolithMove}
            data-cursor="STEER SOLAR AXIS"
            className="relative bg-stone/90 backdrop-blur-sm border border-charcoal/15 p-6 sm:p-10 aspect-[4/5] flex items-center justify-center overflow-hidden cursor-crosshair shadow-lg"
          >
            {/* Dynamic cursor-steered warm sunbeam gradient */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${mouseNorm.x * 100}% ${
                  mouseNorm.y * 100
                }%, rgba(154, 123, 79, 0.22) 0%, rgba(239, 236, 230, 0) 65%)`,
              }}
            />

            {/* Top Interactive Telemetry Tag */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.2em] text-taupe z-20">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3 h-3 text-bronze" />
                <span>INTERACTIVE HELIODON</span>
              </span>
              <span className="text-charcoal">
                AZ {Math.round(mouseNorm.x * 180 + 90)}° / ALT {Math.round((1 - mouseNorm.y) * 75)}°
              </span>
            </div>

            <svg
              viewBox="0 0 400 500"
              className="w-full h-full relative z-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Interactive architectural monolith and solar ray study"
            >
              {/* Outer architectural datum frame */}
              <rect
                x="24"
                y="24"
                width="352"
                height="452"
                stroke="#1C1B19"
                strokeOpacity="0.14"
                strokeWidth="0.75"
              />

              {/* Interactive Sun / Solstice Orb */}
              <circle
                cx={sunCx}
                cy={sunCy}
                r="40"
                stroke="#9A7B4F"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle cx={sunCx} cy={sunCy} r="16" fill="#9A7B4F" fillOpacity="0.18" />
              <circle cx={sunCx} cy={sunCy} r="4" fill="#9A7B4F" />

              {/* Dynamic Diagonal Light Rays */}
              <line
                x1={sunCx}
                y1={sunCy}
                x2={140 + shadowShift}
                y2="414"
                stroke="#9A7B4F"
                strokeOpacity="0.5"
                strokeWidth="0.9"
              />
              <line
                x1={sunCx + 24}
                y1={sunCy - 16}
                x2={195 + shadowShift}
                y2="414"
                stroke="#9A7B4F"
                strokeOpacity="0.28"
                strokeWidth="0.75"
                strokeDasharray="4 4"
              />

              {/* Dynamic Cast Shadow Polygon on Ground Plinth */}
              <polygon
                points={`152,414 322,414 ${322 + shadowShift},438 ${152 + shadowShift},438`}
                fill="#1C1B19"
                fillOpacity="0.12"
              />

              {/* Background Stone Volume */}
              <rect
                x="78"
                y="128"
                width="148"
                height="286"
                fill="#E5E0D7"
                stroke="#1C1B19"
                strokeWidth="1"
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
              <path
                d="M152 210 H322 V414 H152 Z"
                fill="#F7F5F0"
                stroke="#1C1B19"
                strokeWidth="1.2"
              />

              {/* Deep Eave Shadow Band (height shifts subtly with solar altitude) */}
              <rect
                x="152"
                y="210"
                width="170"
                height={Math.max(12, Math.round(mouseNorm.y * 34))}
                fill="#1C1B19"
                fillOpacity="0.1"
              />

              {/* Framed Courtyard Void */}
              <rect
                x="184"
                y="268"
                width="106"
                height="146"
                fill="#EFECE6"
                stroke="#1C1B19"
                strokeWidth="1"
              />
              <line
                x1="237"
                y1="268"
                x2="237"
                y2="414"
                stroke="#1C1B19"
                strokeOpacity="0.35"
                strokeWidth="0.75"
              />

              {/* Ground Plinth / Datum Line */}
              <line x1="48" y1="414" x2="352" y2="414" stroke="#1C1B19" strokeWidth="1.4" />
              <line
                x1="48"
                y1="422"
                x2="352"
                y2="422"
                stroke="#1C1B19"
                strokeOpacity="0.3"
                strokeWidth="0.75"
              />

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
                x="265"
                y="450"
                fill="#78736A"
                fontSize="8"
                letterSpacing="2"
                fontFamily="monospace"
              >
                FIG. 01 / HELIODON
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
        <div className="flex items-center gap-6 text-[11px] font-mono uppercase tracking-[0.2em] text-taupe">
          <span>Kyoto</span>
          <span className="text-bronze">·</span>
          <span>Copenhagen</span>
          <span className="hidden sm:inline text-charcoal/30">|</span>
          <span className="hidden sm:inline text-bronze">SCROLL TO SCRUB 3D ARCHITECTURE</span>
        </div>

        <a
          href="#works"
          data-cursor="SCROLL TO WORKS"
          onClick={(e) => {
            e.preventDefault();
            soundEngine.playPortalSweep();
            if (onNavigatePortal) {
              onNavigatePortal({
                index: '02',
                label: 'Works',
                href: '#works',
                sectionTitle: 'MONOGRAPH ARCHIVE',
              });
            }
          }}
          className="group inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-charcoal hover:text-bronze transition-colors"
        >
          <span>Explore Archive</span>
          <ArrowDown className="w-3.5 h-3.5 stroke-[1.5] group-hover:translate-y-0.5 transition-transform" />
        </a>
      </motion.div>
    </section>
  );
}
