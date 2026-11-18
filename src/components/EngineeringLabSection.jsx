import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Code2, Cpu, Gauge, Layers, Play } from 'lucide-react';

const STACK_PILLARS = [
  {
    title: 'Interactive Frontend & Motion',
    icon: Layers,
    accent: '#38BDF8',
    skills: [
      'React 18 / Next.js App Router',
      'TypeScript & Tokenized Design Systems',
      'Framer Motion & GPU Scroll Choreography',
      'WebGL / GLSL Shaders & SVG Physics',
    ],
  },
  {
    title: 'Full-Stack & Distributed Systems',
    icon: Cpu,
    accent: '#10B981',
    skills: [
      'Node.js, Python & Edge Workers',
      'PostgreSQL, Prisma & Redis Streams',
      'WebSockets & Real-Time Telemetry',
      'REST / GraphQL & Auth Security',
    ],
  },
  {
    title: 'Performance & Production Craft',
    icon: Gauge,
    accent: '#E05A37',
    skills: [
      '100/100 Core Web Vitals & Zero-CLS',
      'GPU Compositor Layer Optimization',
      'WCAG AA/AAA Accessible Primitives',
      'CI/CD, Playwright E2E & Observability',
    ],
  },
];

export default function EngineeringLabSection() {
  const [stiffness, setStiffness] = useState(240);
  const [damping, setDamping] = useState(18);
  const [targetPos, setTargetPos] = useState(0);

  return (
    <section
      id="engineering-lab"
      className="relative py-24 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/10"
    >
      <div className="grid lg:grid-cols-12 gap-10 items-start mb-16">
        {/* Left: Interactive Spring Physics Playground */}
        <div className="lg:col-span-6">
          <span className="text-xs font-mono uppercase tracking-[0.24em] text-emerald-400 block mb-3">
            // Interactive Engineering Playground
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white mb-4">
            Tactile physics,
            <br />
            <span className="font-serif italic font-normal text-white/75">
              tuned to the millisecond.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-8">
            Great interfaces don&apos;t rely on linear easing curves. Test the live spring-physics
            solver below—the same GPU-composited motion architecture powering the four flagship
            websites above.
          </p>

          <div className="rounded-3xl bg-[#101116] border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
                <Sliders className="w-4 h-4" />
                <span>Live Spring Solver Sandbox</span>
              </div>
              <button
                type="button"
                onClick={() => setTargetPos((prev) => (prev === 0 ? 1 : 0))}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-mono text-xs font-bold hover:bg-sky-300 transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Trigger Impulse</span>
              </button>
            </div>

            {/* Interactive Spring Track */}
            <div
              onClick={() => setTargetPos((prev) => (prev === 0 ? 1 : 0))}
              className="relative h-28 rounded-2xl bg-[#070709] border border-white/10 p-4 flex items-center cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-x-6 h-[1px] bg-white/10" />
              <motion.div
                animate={{
                  x: targetPos === 0 ? 0 : 220,
                  rotate: targetPos === 0 ? 0 : 180,
                  scale: targetPos === 0 ? 1 : 1.12,
                }}
                transition={{
                  type: 'spring',
                  stiffness,
                  damping,
                }}
                className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-black font-mono text-xs font-bold shadow-[0_0_30px_rgba(56,189,248,0.4)]"
              >
                60FPS
              </motion.div>
              <span className="ml-auto text-[11px] font-mono text-white/35">
                CLICK TRACK TO IMPULSE
              </span>
            </div>

            {/* Sliders */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-white/70 mb-1.5">
                  <span>STIFFNESS</span>
                  <span className="text-sky-400">{stiffness}</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="500"
                  value={stiffness}
                  onChange={(e) => setStiffness(Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono text-white/70 mb-1.5">
                  <span>DAMPING</span>
                  <span className="text-emerald-400">{damping}</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="45"
                  value={damping}
                  onChange={(e) => setDamping(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3 Engineering Capability Pillars */}
        <div className="lg:col-span-6 space-y-4">
          {STACK_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-3xl bg-[#101116] border border-white/10 p-6 hover:border-white/25 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-black"
                    style={{ backgroundColor: pillar.accent }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">{pillar.title}</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {pillar.skills.map((skill) => (
                    <div
                      key={skill}
                      className="rounded-xl bg-[#070709] border border-white/5 px-3.5 py-2.5 text-xs font-mono text-white/80"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
