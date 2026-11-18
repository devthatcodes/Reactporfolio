import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import { Compass, Cpu, Sparkles, Rocket, CheckCircle2 } from 'lucide-react';
import ScrambleText from './ScrambleText';
import soundEngine from '../utils/soundEngine';

const STEPS = [
  {
    id: 'discovery',
    step: '01',
    title: 'Discovery',
    duration: 'Week 1–2',
    icon: Compass,
    headline: 'Aligning product strategy, user friction, and technical constraints.',
    description:
      'We audit your existing stack, interview key stakeholders, and map critical user journeys. Before writing a single line of production code, we establish measurable KPIs and a crisp technical roadmap.',
    artifacts: [
      'Technical & UX Audit Report',
      'System Architecture Blueprint',
      'KPI & Conversion Baseline',
      'Sprint Milestone Plan',
    ],
  },
  {
    id: 'architecture',
    step: '02',
    title: 'Architecture',
    duration: 'Week 2–4',
    icon: Cpu,
    headline: 'Foundational design tokens, data schemas, and edge topology.',
    description:
      'Our engineers and designers co-author the component primitive library and API contracts in parallel. Everything is typed end-to-end, ensuring zero integration surprises as features scale.',
    artifacts: [
      'Tokenized Figma & React Kit',
      'Type-Safe API & DB Schemas',
      'CI/CD Preview Environments',
      'Accessibility & Perf Budgets',
    ],
  },
  {
    id: 'craft-motion',
    step: '03',
    title: 'Craft & Motion',
    duration: 'Week 4–9',
    icon: Sparkles,
    headline: 'High-velocity feature sprints with tactile micro-interactions.',
    description:
      'We ship weekly interactive builds to staging. Every state transition, loading skeleton, and scroll choreography is tuned to 60fps—turning complex workflows into effortless experiences.',
    artifacts: [
      'Weekly Staging Releases',
      'Choreographed Framer Motion',
      'Automated E2E & Visual Tests',
      'Responsive Edge-Case Polish',
    ],
  },
  {
    id: 'launch-scale',
    step: '04',
    title: 'Launch & Scale',
    duration: 'Week 10+',
    icon: Rocket,
    headline: 'Zero-downtime cutover, telemetry, and team enablement.',
    description:
      'We orchestrate DNS/edge cutover, verify real-user Core Web Vitals, and hand over comprehensive documentation plus recorded walkthroughs so your internal team can own the codebase with confidence.',
    artifacts: [
      'Zero-Downtime Edge Cutover',
      'Real-User Observability',
      'Codebase & Storybook Docs',
      '30-Day Post-Launch Warranty',
    ],
  },
];

export default function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

  // Scroll-scrubbed process step progression as user scrolls through #process
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 70%', 'end 30%'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const clamped = Math.max(0, Math.min(0.999, latest));
    const idx = Math.floor(clamped * STEPS.length);
    if (idx !== activeIndex && idx >= 0 && idx < STEPS.length) {
      setActiveIndex(idx);
    }
  });

  const activeStep = STEPS[activeIndex];
  const ActiveIcon = activeStep.icon;

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-20 sm:py-28 px-5 sm:px-8 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 16 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        style={{ transformPerspective: 1200 }}
        className="mb-14"
      >
        <span className="text-xs font-mono uppercase tracking-[0.22em] text-lime block mb-3">
          // Scroll-Synchronized Engineering Process
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory">
          <ScrambleText text="From ambiguity to" scrambleOnMount={false} />
          <br />
          production velocity.
        </h2>
      </motion.div>

      {/* Interactive 4-Step Timeline Selector with 3D Scroll Entry */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8" style={{ perspective: '1200px' }}>
        {STEPS.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <motion.button
              key={item.id}
              type="button"
              data-cursor={`STEP ${item.step}`}
              onClick={() => {
                soundEngine.playClick();
                setActiveIndex(idx);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              initial={{ opacity: 0, y: 36, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              className={`relative text-left p-5 rounded-2xl border transition-all focus:outline-none ${
                isActive
                  ? 'border-lime/50 bg-surface shadow-[0_0_24px_rgba(200,255,50,0.12)] scale-[1.02]'
                  : 'border-ivory/10 bg-surface/40 hover:bg-surface/80 hover:border-ivory/20'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="processActiveHighlight"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-2xl border-2 border-lime/60 pointer-events-none"
                />
              )}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`font-mono text-xs ${
                    isActive ? 'text-lime' : 'text-ivory/45'
                  }`}
                >
                  STEP {item.step}
                </span>
                <span className="text-[11px] font-mono text-ivory/45">{item.duration}</span>
              </div>
              <div className="font-display font-semibold text-base sm:text-lg text-ivory">
                {item.title}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 3D Detail Panel */}
      <div
        className="relative rounded-2xl bg-surface/90 backdrop-blur-xl border border-ivory/15 p-6 sm:p-10 overflow-hidden shadow-2xl"
        style={{ perspective: '1400px' }}
      >
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-indigoGlow/15 blur-[100px] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 24, rotateX: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, rotateX: -14, scale: 0.96 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-obsidian border border-ivory/10 mb-5">
                <ActiveIcon className="w-4 h-4 text-lime" />
                <span className="text-xs font-mono text-ivory/80">
                  Phase {activeStep.step} · {activeStep.duration}
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-ivory mb-4 leading-snug">
                <ScrambleText text={activeStep.headline} triggerKey={activeStep.id} />
              </h3>
              <p className="text-ivory/70 text-sm sm:text-base leading-relaxed">
                {activeStep.description}
              </p>
            </div>

            <div className="lg:col-span-5 bg-obsidian/75 border border-ivory/10 rounded-xl p-5 sm:p-6">
              <div className="text-xs font-mono uppercase tracking-wider text-ivory/50 mb-4">
                Phase Artifacts
              </div>
              <ul className="space-y-3">
                {activeStep.artifacts.map((artifact) => (
                  <li key={artifact} className="flex items-center gap-3 text-sm text-ivory/85">
                    <CheckCircle2 className="w-4 h-4 text-lime shrink-0" />
                    <span>{artifact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
