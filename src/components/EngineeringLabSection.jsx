import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sliders, Cpu, Gauge, Layers, Play, Sparkles, Terminal } from 'lucide-react';
import soundEngine from '../utils/soundEngine';

const CRAFT_PILLARS = [
  {
    number: '01',
    title: 'UI Architecture & Design Systems',
    icon: Layers,
    accent: '#E2D9C8',
    description:
      'Architecting composable, accessible React & TypeScript component primitives with strict design-token contracts and zero visual drift.',
    skills: [
      'React 18 / Next.js App Router',
      'TypeScript & Tokenized Primitives',
      'Tailwind CSS & CSS Custom Properties',
      'WCAG AA/AAA Keyboard & Screen Reader UX',
    ],
  },
  {
    number: '02',
    title: 'Choreographed Motion & Shaders',
    icon: Sparkles,
    accent: '#38BDF8',
    description:
      'Replacing abrupt state jumps with spring-physics gestures, scroll-linked GPU choreography, and lightweight custom GLSL fragment shaders.',
    skills: [
      'Framer Motion & Spring Physics',
      'WebGL / GLSL Fragment Shaders',
      'Scroll-Linked GPU Transform Pipelines',
      'Procedural Web Audio Micro-Interactions',
    ],
  },
  {
    number: '03',
    title: 'Performance & Production Polish',
    icon: Gauge,
    accent: '#10B981',
    description:
      'Obsessing over frame budgets, sub-second Largest Contentful Paint, and resilient state management under real-world network conditions.',
    skills: [
      '100/100 Core Web Vitals & Zero-CLS',
      'Compositor-Only Layer Optimization',
      'REST / GraphQL / WebSocket Streaming',
      'Playwright E2E & CI/CD Workflows',
    ],
  },
];

export default function EngineeringLabSection() {
  const [stiffness, setStiffness] = useState(260);
  const [damping, setDamping] = useState(20);
  const [targetPos, setTargetPos] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineScaleX = useTransform(scrollYProgress, [0.05, 0.35], [0, 1]);
  const sectionY = useTransform(scrollYProgress, [0, 0.22], [48, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.18], [0.15, 1]);

  return (
    <section
      id="engineering-lab"
      ref={sectionRef}
      className="relative py-28 px-5 sm:px-8 max-w-7xl mx-auto"
    >
      {/* Scroll-Driven Self-Drawing Architectural Hairline */}
      <div className="w-full h-[1px] bg-white/10 mb-16 overflow-hidden">
        <motion.div
          style={{ scaleX: lineScaleX, transformOrigin: 'left' }}
          className="w-full h-full bg-[#E2D9C8] will-change-transform"
        />
      </div>

      <motion.div
        style={{ y: sectionY, opacity: sectionOpacity }}
        className="will-change-transform"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.24em] text-[#E2D9C8] block mb-3">
              // DEONTAE WORK · FRONT END ENGINEERING CRAFT
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#F5F4F0]">
              Precision code meets{' '}
              <span className="font-serif italic font-normal text-[#E2D9C8]">
                tactile physics.
              </span>
            </h2>
          </div>
          <p className="text-sm text-white/55 max-w-md leading-relaxed">
            Every interface in my portfolio is engineered from first principles—combining clean
            component architecture with 60/120fps GPU compositor discipline.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left 5 Cols: Interactive Spring Physics Sandbox */}
          <div className="lg:col-span-5 rounded-[28px] bg-[#0D0E12] border border-white/10 p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E2D9C8]">
                  <Sliders className="w-4 h-4" />
                  <span>Interactive Spring Solver</span>
                </div>
                <button
                  type="button"
                  data-cursor="IMPULSE"
                  onClick={() => {
                    soundEngine.playClick();
                    setTargetPos((prev) => (prev === 0 ? 1 : 0));
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5F4F0] text-[#060608] font-mono text-[11px] font-bold hover:bg-[#E2D9C8] transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Impulse</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-white/65 leading-relaxed mb-6">
                Click the track or adjust the spring parameters below to test the exact physical
                motion model used across my UI systems.
              </p>

              {/* Interactive Spring Track */}
              <div
                data-cursor="CLICK TO IMPULSE"
                onClick={() => {
                  soundEngine.playClick();
                  setTargetPos((prev) => (prev === 0 ? 1 : 0));
                }}
                className="relative h-32 rounded-2xl bg-[#060608] border border-white/10 p-5 flex items-center cursor-pointer overflow-hidden mb-6"
              >
                <div className="absolute inset-x-6 h-[1px] bg-white/10" />
                <motion.div
                  animate={{
                    x: targetPos === 0 ? 0 : 190,
                    rotate: targetPos === 0 ? 0 : 180,
                    scale: targetPos === 0 ? 1 : 1.08,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness,
                    damping,
                  }}
                  className="relative z-10 w-16 h-16 rounded-2xl bg-[#E2D9C8] text-[#060608] flex flex-col items-center justify-center font-display font-extrabold text-xs shadow-2xl"
                >
                  <span>DW</span>
                  <span className="font-mono text-[9px] opacity-70">60FPS</span>
                </motion.div>
                <span className="ml-auto text-[10px] font-mono uppercase tracking-widest text-white/35">
                  [ CLICK STAGE ]
                </span>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <div className="flex justify-between text-xs font-mono text-white/70 mb-1.5">
                  <span>SPRING STIFFNESS</span>
                  <span className="text-[#E2D9C8]">{stiffness} N/m</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="500"
                  value={stiffness}
                  onChange={(e) => setStiffness(Number(e.target.value))}
                  className="w-full accent-[#E2D9C8] cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-white/70 mb-1.5">
                  <span>DAMPING RATIO</span>
                  <span className="text-sky-400">{damping} Ns/m</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="45"
                  value={damping}
                  onChange={(e) => setDamping(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right 7 Cols: Deontae Work's 3 Front-End Engineering Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            {CRAFT_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: idx * 0.08 }}
                  className="rounded-[24px] bg-[#0D0E12] border border-white/10 p-6 hover:border-white/25 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-xs font-bold px-2.5 py-1 rounded-md text-[#060608]"
                        style={{ backgroundColor: pillar.accent }}
                      >
                        {pillar.number}
                      </span>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-[#F5F4F0]">
                        {pillar.title}
                      </h3>
                    </div>
                    <Icon className="w-5 h-5 shrink-0" style={{ color: pillar.accent }} />
                  </div>

                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed mb-4">
                    {pillar.description}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-2">
                    {pillar.skills.map((skill) => (
                      <div
                        key={skill}
                        className="rounded-xl bg-[#060608] border border-white/5 px-3 py-2 text-[11px] font-mono text-white/75"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
