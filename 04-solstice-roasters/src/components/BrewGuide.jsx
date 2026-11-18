import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Droplets, Flame, Play, Pause, RotateCcw, Scale, SlidersHorizontal } from 'lucide-react';
import { BREW_RECIPES } from '../data/coffees';
import ScrambleText from './ScrambleText';
import soundEngine from '../utils/soundEngine';

function formatTime(totalSec) {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function BrewDiagramSVG({ recipeId, isRunning }) {
  return (
    <svg
      viewBox="0 0 220 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-44 h-40 mx-auto"
      aria-hidden="true"
    >
      {/* Warm circular backdrop */}
      <circle cx="110" cy="100" r="82" fill="#F2ECE1" stroke="#1E1612" strokeOpacity="0.1" />

      {recipeId === 'v60' && (
        <g>
          {/* Carafe */}
          <path
            d="M78 118H142L152 162C153 168 148 172 142 172H78C72 172 67 168 68 162L78 118Z"
            fill="#FBF8F3"
            stroke="#1E1612"
            strokeWidth="2"
          />
          <path
            d="M74 146H146L150 164C151 168 147 171 142 171H78C73 171 69 168 70 164L74 146Z"
            fill="#C85A32"
            fillOpacity="0.28"
          />
          {/* V60 Cone */}
          <path d="M62 56H158L124 114H96L62 56Z" fill="#FBF8F3" stroke="#1E1612" strokeWidth="2" />
          <line x1="75" y1="68" x2="102" y2="112" stroke="#C85A32" strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1="145" y1="68" x2="118" y2="112" stroke="#C85A32" strokeOpacity="0.4" strokeWidth="1.5" />
          {/* Animated Pour Stream */}
          <motion.path
            d="M110 24V56"
            stroke="#C85A32"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 4"
            animate={isRunning ? { strokeDashoffset: [0, -16] } : { strokeDashoffset: 0 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
          />
        </g>
      )}

      {recipeId === 'aeropress' && (
        <g>
          {/* Mug */}
          <rect x="74" y="124" width="72" height="46" rx="6" fill="#FBF8F3" stroke="#1E1612" strokeWidth="2" />
          <path
            d="M146 134H156C161 134 164 138 164 144C164 150 161 154 156 154H146"
            stroke="#1E1612"
            strokeWidth="2"
          />
          {/* AeroPress Chamber */}
          <rect
            x="84"
            y="64"
            width="52"
            height="60"
            rx="3"
            fill="#3A2A22"
            fillOpacity="0.14"
            stroke="#1E1612"
            strokeWidth="2"
          />
          {/* Plunger */}
          <motion.g
            animate={isRunning ? { y: [0, 14, 0] } : { y: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <rect
              x="90"
              y="34"
              width="40"
              height="34"
              rx="2"
              fill="#5E7461"
              fillOpacity="0.35"
              stroke="#1E1612"
              strokeWidth="2"
            />
            <line x1="78" y1="34" x2="142" y2="34" stroke="#1E1612" strokeWidth="3" strokeLinecap="round" />
          </motion.g>
        </g>
      )}

      {recipeId === 'espresso' && (
        <g>
          {/* Grouphead */}
          <rect x="74" y="38" width="72" height="22" rx="4" fill="#3A2A22" />
          {/* Portafilter */}
          <rect x="84" y="60" width="52" height="16" rx="3" fill="#1E1612" />
          <line x1="136" y1="68" x2="174" y2="68" stroke="#1E1612" strokeWidth="5" strokeLinecap="round" />
          {/* Dual Espresso Stream */}
          <motion.path
            d="M104 76V122M116 76V122"
            stroke="#C85A32"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={isRunning ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.7 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          {/* Demitasse Cup */}
          <path
            d="M82 122H138L130 162C129 167 124 170 118 170H102C96 170 91 167 90 162L82 122Z"
            fill="#FBF8F3"
            stroke="#1E1612"
            strokeWidth="2"
          />
          <path d="M86 132H134" stroke="#C85A32" strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}

export default function BrewGuide() {
  const [activeTab, setActiveTab] = useState(BREW_RECIPES[0].id);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const recipe = BREW_RECIPES.find((r) => r.id === activeTab) || BREW_RECIPES[0];

  useEffect(() => {
    setIsRunning(false);
    setElapsedSeconds(0);
  }, [activeTab]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev >= recipe.totalSeconds) {
          setIsRunning(false);
          soundEngine.playSuccess();
          return recipe.totalSeconds;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, recipe.totalSeconds]);

  const activeStepIndex = recipe.steps.findIndex(
    (step, idx) =>
      (elapsedSeconds >= step.startSec && elapsedSeconds < step.endSec) ||
      (idx === recipe.steps.length - 1 && elapsedSeconds >= step.startSec)
  );

  const progressPercent = Math.min(100, Math.round((elapsedSeconds / recipe.totalSeconds) * 100));

  return (
    <section id="brew-guide" className="py-16 sm:py-24 bg-cream-dark/50 border-b border-espresso/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Method Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.22em] text-sage font-semibold block mb-2.5">
              03 // Dialed-In Extraction Lab
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-espresso font-normal tracking-tight">
              Interactive Brew Guide &amp; Timer
            </h2>
            <p className="text-umber/80 mt-3 text-base sm:text-lg">
              Follow our roastery&apos;s baseline recipes. Hit start on the brew timer to pace your
              bloom, pours, and drawdown in real time.
            </p>
          </div>

          {/* Tabs */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-cream border border-espresso/12 self-start lg:self-auto shadow-sm">
            {BREW_RECIPES.map((item) => {
              const isActive = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-cursor={`BREW // ${item.name.toUpperCase()}`}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveTab(item.id);
                  }}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'text-cream' : 'text-umber hover:text-espresso'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="brew-tab-pill"
                      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                      className="absolute inset-0 bg-terracotta rounded-full"
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Interactive Brew Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={recipe.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-cream/90 backdrop-blur-sm rounded-3xl border border-espresso/12 p-6 sm:p-10 shadow-editorial"
          >
            {/* Left Specs & Live Timer */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:border-r lg:border-espresso/10 lg:pr-8">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-terracotta">
                    Best with {recipe.recommendedCoffee}
                  </span>
                </div>
                <h3 className="font-serif text-3xl text-espresso">
                  <ScrambleText text={recipe.name} triggerKey={recipe.id} duration={360} />
                </h3>
                <p className="text-sm text-umber/75 mt-1">{recipe.subtitle}</p>

                {/* Brew Diagram */}
                <div className="my-6">
                  <BrewDiagramSVG recipeId={recipe.id} isRunning={isRunning} />
                </div>

                {/* 4 Spec Tiles */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-cream-dark/70 border border-espresso/5">
                    <div className="flex items-center gap-1.5 text-terracotta text-xs font-semibold uppercase tracking-wider mb-1">
                      <Scale className="w-3.5 h-3.5" />
                      <span>Ratio</span>
                    </div>
                    <p className="font-serif text-xl text-espresso font-medium">{recipe.ratio}</p>
                    <p className="text-xs text-umber/70">
                      {recipe.dose} → {recipe.yield}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cream-dark/70 border border-espresso/5">
                    <div className="flex items-center gap-1.5 text-terracotta text-xs font-semibold uppercase tracking-wider mb-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Water Temp</span>
                    </div>
                    <p className="font-serif text-xl text-espresso font-medium">{recipe.temp}</p>
                    <p className="text-xs text-umber/70">Filtered soft water</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cream-dark/70 border border-espresso/5">
                    <div className="flex items-center gap-1.5 text-sage text-xs font-semibold uppercase tracking-wider mb-1">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Grind Size</span>
                    </div>
                    <p className="font-serif text-lg text-espresso font-medium leading-snug">
                      {recipe.grind}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cream-dark/70 border border-espresso/5">
                    <div className="flex items-center gap-1.5 text-sage text-xs font-semibold uppercase tracking-wider mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Target Time</span>
                    </div>
                    <p className="font-serif text-xl text-espresso font-medium">
                      {formatTime(recipe.totalSeconds)}
                    </p>
                    <p className="text-xs text-umber/70">Total brew time</p>
                  </div>
                </div>
              </div>

              {/* Live Pour Timer Controls */}
              <div className="p-5 rounded-2xl bg-espresso text-cream space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-cream/60 block">
                      Live Brew Telemetry
                    </span>
                    <span className="font-serif text-3xl font-medium tabular-nums">
                      {formatTime(elapsedSeconds)}{' '}
                      <span className="text-sm font-sans text-cream/50">
                        / {formatTime(recipe.totalSeconds)}
                      </span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-cursor="BREW TIMER"
                      onClick={() => {
                        soundEngine.playClick();
                        if (elapsedSeconds >= recipe.totalSeconds) setElapsedSeconds(0);
                        setIsRunning((prev) => !prev);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors"
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>{elapsedSeconds > 0 ? 'Resume' : 'Start'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      data-cursor="RESET TIMER"
                      onClick={() => {
                        soundEngine.playClick();
                        setIsRunning(false);
                        setElapsedSeconds(0);
                      }}
                      className="p-2.5 rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
                      aria-label="Reset timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full rounded-full bg-cream/15 overflow-hidden">
                  <motion.div
                    className="h-full bg-terracotta rounded-full"
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>

            {/* Right Step-by-Step Timeline */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-serif text-xl text-espresso">Step-by-Step Pour Timeline</h4>
                <span className="text-xs font-mono text-umber/65">CLICK ANY PHASE TO SCRUB</span>
              </div>

              <div className="space-y-3.5">
                {recipe.steps.map((step, index) => {
                  const isCurrent = index === activeStepIndex;
                  const isCompleted = elapsedSeconds >= step.endSec;

                  return (
                    <motion.button
                      key={step.id}
                      type="button"
                      data-cursor={`SCRUB // ${step.title.toUpperCase()}`}
                      onClick={() => {
                        soundEngine.playClick();
                        setElapsedSeconds(step.startSec);
                      }}
                      whileHover={{ x: 3 }}
                      className={`w-full text-left p-5 rounded-2xl border transition-all flex gap-4 items-start ${
                        isCurrent
                          ? 'bg-cream-dark border-terracotta shadow-sm'
                          : isCompleted
                          ? 'bg-sage-light/40 border-sage/30'
                          : 'bg-cream border-espresso/10 hover:border-espresso/25'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-serif text-sm font-semibold ${
                          isCurrent
                            ? 'bg-terracotta text-cream'
                            : isCompleted
                            ? 'bg-sage text-cream'
                            : 'bg-cream-dark text-umber'
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-serif text-lg font-medium text-espresso">
                            {step.title}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-espresso/5 text-umber">
                              <Droplets className="w-3 h-3 text-terracotta" />
                              {step.waterTarget}
                            </span>
                            <span className="text-xs font-semibold text-terracotta tabular-nums">
                              {step.timeRange}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-umber/80 leading-relaxed">{step.instruction}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
