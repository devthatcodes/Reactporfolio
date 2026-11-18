import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Terminal, Zap, Compass, ChevronsDown } from 'lucide-react';
import ScrambleText from './ScrambleText';
import soundEngine from '../utils/soundEngine';

const HEADLINE_LINES = [
  'We engineer digital',
  'experiences that feel',
  'effortlessly inevitable.',
];

const MARQUEE_ITEMS = [
  'WEBGL & GLSL SHADERS',
  'WIDESCREEN CINEMA REELS',
  'FULL-STACK EDGE APPS',
  'KINETIC DESIGN SYSTEMS',
  '60FPS INTERACTION ARCHITECTURE',
  'SPATIAL AUDIO UI',
  'SUB-SECOND PERFORMANCE',
  'AUTONOMOUS PRODUCT LAB',
];

export default function HeroSection({ onOpenInquiry, onTriggerPortal, onSelectShader }) {
  const sectionRef = useRef(null);
  const [activeNode, setActiveNode] = useState(1);

  // Direct 120fps GPU transforms on scroll (no spring delay, no backdrop-blur repaints)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const line0X = useTransform(scrollYProgress, [0, 1], [0, -75]);
  const line1X = useTransform(scrollYProgress, [0, 1], [0, 65]);
  const line2X = useTransform(scrollYProgress, [0, 1], [0, -45]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);

  const consoleY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const consoleScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.06, 0.94]);

  const jumpWithPortal = (selector, label, shader = 1) => {
    soundEngine.playTransition();
    if (onSelectShader) onSelectShader(shader);
    if (onTriggerPortal) {
      onTriggerPortal({
        label,
        sublabel: 'CINEMA SHUTTER // LOCK',
        accent: '#C8FF32',
      });
    }
    setTimeout(() => {
      const el = document.querySelector(selector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const lineTransforms = [line0X, line1X, line2X];

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-36 pb-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full my-auto py-10 sm:py-16">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Column with GPU Horizontal Split */}
          <motion.div
            style={{ opacity: leftOpacity }}
            className="lg:col-span-7 will-change-transform"
          >
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#131318] border border-ivory/15 mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-ivory/90">
                <ScrambleText text="VESPERA LAB // 120FPS GPU FILMSTRIP ACTIVE" duration={600} />
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-6xl lg:text-[68px] leading-[1.03] tracking-[-0.03em] text-ivory mb-7">
              {HEADLINE_LINES.map((line, index) => (
                <motion.span
                  key={line}
                  style={{ x: lineTransforms[index] }}
                  className="block overflow-hidden will-change-transform"
                >
                  <span className="block">
                    {index === 2 ? (
                      <>
                        effortlessly{' '}
                        <span className="text-lime italic font-semibold">
                          <ScrambleText text="inevitable." duration={800} />
                        </span>
                      </>
                    ) : (
                      line
                    )}
                  </span>
                </motion.span>
              ))}
            </h1>

            <p className="text-base sm:text-lg text-ivory/75 max-w-xl leading-relaxed mb-9">
              Vespera Digital is an interactive creative technology &amp; product engineering
              studio. Scroll down to glide across our widescreen horizontal cinema reel—engineered
              for zero-latency 60/120fps GPU execution.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                data-cursor="EXPLORE CINEMA REEL"
                onClick={() => jumpWithPortal('#work', 'CINEMA REEL', 1)}
                onMouseEnter={() => soundEngine.playHover()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-lime text-obsidian font-display font-semibold text-sm sm:text-base hover:bg-ivory transition-colors shadow-[0_0_28px_rgba(200,255,50,0.25)]"
              >
                <Compass className="w-4 h-4" />
                <span>Glide Cinema Work Reel</span>
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
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#131318] border border-ivory/20 text-ivory font-medium text-sm sm:text-base hover:border-lime/60 hover:text-lime transition-colors"
              >
                Start a Project
              </button>
            </div>
          </motion.div>

          {/* Right Runtime Console Card with GPU Scroll Parallax */}
          <motion.div
            style={{ y: consoleY, scale: consoleScale }}
            className="lg:col-span-5 will-change-transform"
          >
            <div className="relative rounded-2xl bg-[#131318] border border-ivory/15 p-6 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-ivory/10 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-lime" />
                  <span className="text-xs font-mono uppercase tracking-wider text-ivory/70">
                    vespera.gpu.v5
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-lime/15 text-lime border border-lime/30">
                  LOCKED 60/120FPS
                </span>
              </div>

              <div className="relative rounded-xl bg-obsidian border border-ivory/10 p-4 mb-5">
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
                  <path
                    d="M45 135 C 110 135, 110 45, 180 45 C 250 45, 250 110, 315 60"
                    stroke="#C8FF32"
                    strokeWidth="2.5"
                  />

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
                  [ CLICK NODES TO SWITCH SHADER · SCROLL FOR HORIZONTAL REEL ]
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-obsidian border border-ivory/10 p-3">
                  <div className="flex items-center gap-1.5 text-ivory/50 text-[11px] mb-1">
                    <Zap className="w-3 h-3 text-lime" />
                    <span>Median LCP</span>
                  </div>
                  <div className="font-display font-bold text-lg text-ivory">0.38s</div>
                </div>
                <div className="rounded-xl bg-obsidian border border-ivory/10 p-3">
                  <div className="flex items-center gap-1.5 text-ivory/50 text-[11px] mb-1">
                    <Sparkles className="w-3 h-3 text-indigoGlow" />
                    <span>Frame Time</span>
                  </div>
                  <div className="font-display font-bold text-lg text-ivory">0.7ms</div>
                </div>
                <div className="rounded-xl bg-obsidian border border-ivory/10 p-3">
                  <div className="text-ivory/50 text-[11px] mb-1">Uptime SLA</div>
                  <div className="font-display font-bold text-lg text-lime">99.99%</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-[0.26em] text-lime/80">
          <ChevronsDown className="w-4 h-4" />
          <span>SCROLL TO GLIDE HORIZONTAL CINEMA REEL</span>
          <ChevronsDown className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10 border-y border-ivory/10 bg-[#131318] py-3.5 overflow-hidden">
        <div className="animate-marquee flex items-center gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => (
            <div key={`${item}-${idx}`} className="flex items-center gap-8 shrink-0">
              <span className="font-mono text-xs font-medium tracking-[0.22em] text-ivory/75">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-lime" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
