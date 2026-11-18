import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal, Zap, Compass } from 'lucide-react';
import ScrambleText from './ScrambleText';
import soundEngine from '../utils/soundEngine';

const HEADLINE_LINES = [
  'We engineer digital',
  'experiences that feel',
  'effortlessly inevitable.',
];

const MARQUEE_ITEMS = [
  'WEBGL & GLSL SHADERS',
  'ACTIVE PORTAL TRANSITIONS',
  'FULL-STACK EDGE APPS',
  'KINETIC DESIGN SYSTEMS',
  '60FPS INTERACTION ARCHITECTURE',
  'SPATIAL AUDIO UI',
  'SUB-SECOND PERFORMANCE',
  'AUTONOMOUS PRODUCT LAB',
];

export default function HeroSection({ onOpenInquiry, onTriggerPortal, onSelectShader }) {
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState(1);

  const jumpWithPortal = (selector, label, shader = 1) => {
    soundEngine.playTransition();
    if (onSelectShader) onSelectShader(shader);
    if (onTriggerPortal) {
      onTriggerPortal({
        label,
        sublabel: 'ENGAGING INTERACTIVE STREAM',
        accent: '#C8FF32',
      });
    }
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 220);
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ x: -ny * 12, y: nx * 14 });
  };

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-0 overflow-hidden"
    >
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-35 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full my-auto py-10 sm:py-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Column */}
          <div className="lg:col-span-7">
            {/* Live Availability & Shader Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface/90 border border-ivory/15 mb-8 backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-ivory/90">
                <ScrambleText text="VESPERA LAB // WEBGL2 + GLSL PIPELINE ACTIVE" duration={700} />
              </span>
            </motion.div>

            {/* Staggered Kinetic Headline */}
            <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-[68px] leading-[1.03] tracking-[-0.03em] text-ivory mb-7">
              {HEADLINE_LINES.map((line, index) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.12 * index + 0.15,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="block"
                  >
                    {index === 2 ? (
                      <>
                        effortlessly{' '}
                        <span className="text-lime italic font-semibold">
                          <ScrambleText text="inevitable." duration={900} />
                        </span>
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="text-base sm:text-lg text-ivory/75 max-w-xl leading-relaxed mb-9"
            >
              Vespera Digital is an interactive creative technology &amp; product engineering
              studio. We fuse custom GLSL shaders, choreographed portal transitions, and
              sub-second edge architecture into unforgettable web experiences.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.68 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button
                type="button"
                data-cursor="EXPLORE WORK REEL"
                onClick={() => jumpWithPortal('#work', '3D WORK STREAM', 1)}
                onMouseEnter={() => soundEngine.playHover()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-lime text-obsidian font-display font-semibold text-sm sm:text-base hover:bg-ivory transition-all shadow-[0_0_32px_rgba(200,255,50,0.28)]"
              >
                <Compass className="w-4 h-4" />
                <span>Explore 3D Work Stream</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                data-cursor="START PROJECT"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenInquiry();
                }}
                onMouseEnter={() => soundEngine.playHover()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-surface/90 border border-ivory/20 text-ivory font-medium text-sm sm:text-base hover:border-lime/60 hover:text-lime transition-colors backdrop-blur-md"
              >
                Start a Project
              </button>
            </motion.div>
          </div>

          {/* Right 3D Interactive Shader & Runtime Console Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateX: cardTilt.x,
              rotateY: cardTilt.y,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setCardTilt({ x: 0, y: 0 })}
            style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl bg-surface/85 backdrop-blur-xl border border-ivory/15 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-indigoGlow/20 blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-ivory/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-lime" />
                  <span className="text-xs font-mono uppercase tracking-wider text-ivory/70">
                    vespera.glsl.v4.8
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-lime/15 text-lime border border-lime/30">
                  60FPS SHADER LOCK
                </span>
              </div>

              {/* Interactive Node Graph SVG */}
              <div className="relative rounded-xl bg-obsidian/90 border border-ivory/10 p-4 mb-5">
                <svg
                  viewBox="0 0 360 180"
                  className="w-full h-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 45H360M0 90H360M0 135H360M90 0V180M180 0V180M270 0V180"
                    stroke="rgba(245,242,235,0.06)"
                    strokeWidth="1"
                  />
                  <motion.path
                    d="M45 135 C 110 135, 110 45, 180 45 C 250 45, 250 110, 315 60"
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.6, delay: 0.3 }}
                  />
                  <motion.path
                    d="M45 135 C 110 135, 110 45, 180 45 C 250 45, 250 110, 315 60"
                    stroke="#C8FF32"
                    strokeWidth="2.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, delay: 0.5 }}
                  />

                  {/* Interactive clickable shader preset nodes */}
                  <g
                    className="cursor-pointer"
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveNode(0);
                      if (onSelectShader) onSelectShader(0);
                    }}
                  >
                    <circle
                      cx="45"
                      cy="135"
                      r={activeNode === 0 ? '10' : '7'}
                      fill="#0A0A0C"
                      stroke={activeNode === 0 ? '#C8FF32' : '#F5F2EB'}
                      strokeWidth="2.5"
                    />
                    <text
                      x="18"
                      y="162"
                      fill={activeNode === 0 ? '#C8FF32' : '#F5F2EB'}
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      01:PLASMA
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveNode(1);
                      if (onSelectShader) onSelectShader(1);
                    }}
                  >
                    <circle
                      cx="180"
                      cy="45"
                      r={activeNode === 1 ? '11' : '8'}
                      fill="#0A0A0C"
                      stroke="#C8FF32"
                      strokeWidth="2.5"
                    />
                    <text x="142" y="24" fill="#C8FF32" fontSize="10" fontFamily="monospace">
                      02:SDF_TUNNEL
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveNode(2);
                      if (onSelectShader) onSelectShader(2);
                    }}
                  >
                    <circle
                      cx="315"
                      cy="60"
                      r={activeNode === 2 ? '10' : '7'}
                      fill="#C8FF32"
                    />
                    <text x="275" y="88" fill="#F5F2EB" fontSize="10" fontFamily="monospace">
                      03:QUANTUM
                    </text>
                  </g>
                </svg>
                <div className="text-[10px] font-mono text-ivory/45 text-center mt-1">
                  [ CLICK NODES ABOVE TO MORPH LIVE WEBGL SHADER ]
                </div>
              </div>

              {/* Studio Metrics Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-obsidian/70 border border-ivory/10 p-3">
                  <div className="flex items-center gap-1.5 text-ivory/50 text-[11px] mb-1">
                    <Zap className="w-3 h-3 text-lime" />
                    <span>Median LCP</span>
                  </div>
                  <div className="font-display font-bold text-lg text-ivory">0.38s</div>
                </div>
                <div className="rounded-xl bg-obsidian/70 border border-ivory/10 p-3">
                  <div className="flex items-center gap-1.5 text-ivory/50 text-[11px] mb-1">
                    <Sparkles className="w-3 h-3 text-indigoGlow" />
                    <span>Shader FPS</span>
                  </div>
                  <div className="font-display font-bold text-lg text-ivory">60 FPS</div>
                </div>
                <div className="rounded-xl bg-obsidian/70 border border-ivory/10 p-3">
                  <div className="text-ivory/50 text-[11px] mb-1">Uptime SLA</div>
                  <div className="font-display font-bold text-lg text-lime">99.99%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Kinetic Capability Marquee Strip */}
      <div className="relative z-10 border-y border-ivory/10 bg-surface/65 backdrop-blur-md py-3.5 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div key={`${item}-${idx}`} className="flex items-center gap-8 shrink-0">
              <span className="font-mono text-xs font-medium tracking-[0.22em] text-ivory/75">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-lime shadow-[0_0_8px_#C8FF32]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
