import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import {
  Check,
  Plus,
  Sparkles,
  Maximize2,
  Grid,
  Radar,
  ArrowUpRight,
  Compass,
  Flame,
} from 'lucide-react';
import { COFFEES, GRIND_OPTIONS } from '../data/coffees';
import CoffeeBagSVG from './CoffeeBagSVG';
import ScrambleText from './ScrambleText';
import soundEngine from '../utils/soundEngine';

const ROAST_FILTERS = ['All', 'Light', 'Medium-Light', 'Medium'];

function TastingBar({ label, value, colorClass }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] uppercase tracking-wider font-medium text-umber/75">
        <span>{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-espresso/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
}

/**
 * ScrollLotFlightStage
 * Sticky scroll-scrubbed 3D micro-lot flight runway (250vh) where scrolling continuously
 * rotates, translates, and scales the 4 micro-lot coffee bags and floating flavor notes
 * through 3D space.
 */
function ScrollLotFlightCard({
  coffee,
  index,
  total,
  scrollYProgress,
  onOpenPortal,
  onAddToCart,
}) {
  const center = index / (total - 1); // 0, 0.333, 0.666, 1

  const x = useTransform(
    scrollYProgress,
    [center - 0.55, center - 0.25, center, center + 0.25, center + 0.55],
    ['115%', '52%', '0%', '-52%', '-115%']
  );

  const y = useTransform(
    scrollYProgress,
    [center - 0.4, center, center + 0.4],
    [70, 0, -70]
  );

  const scale = useTransform(
    scrollYProgress,
    [center - 0.38, center - 0.16, center, center + 0.16, center + 0.38],
    [0.68, 0.86, 1.04, 0.86, 0.68]
  );

  const rotateY = useTransform(
    scrollYProgress,
    [center - 0.45, center, center + 0.45],
    [-46, 0, 46]
  );

  const rotateX = useTransform(
    scrollYProgress,
    [center - 0.45, center, center + 0.45],
    [18, 0, -18]
  );

  const rotateZ = useTransform(
    scrollYProgress,
    [center - 0.45, center, center + 0.45],
    [8, 0, -8]
  );

  const opacity = useTransform(
    scrollYProgress,
    [center - 0.42, center - 0.18, center, center + 0.18, center + 0.42],
    [0, 0.72, 1, 0.72, 0]
  );

  // Differential foreground parallax for floating flavor pills & bag
  const bagFloatY = useTransform(
    scrollYProgress,
    [center - 0.3, center, center + 0.3],
    [45, -14, -55]
  );
  const notesParallaxY = useTransform(
    scrollYProgress,
    [center - 0.3, center, center + 0.3],
    [85, -18, -95]
  );
  const notesParallaxX = useTransform(
    scrollYProgress,
    [center - 0.3, center, center + 0.3],
    [60, 0, -60]
  );

  return (
    <motion.div
      style={{
        x,
        y,
        scale,
        rotateY,
        rotateX,
        rotateZ,
        opacity,
        transformStyle: 'preserve-3d',
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto relative w-full max-w-4xl rounded-3xl bg-cream/95 backdrop-blur-md border-2 border-espresso/15 shadow-editorial p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Top-Right Lot Index Telemetry */}
        <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-espresso text-cream text-[10px] font-mono uppercase tracking-[0.22em] border border-terracotta/40 shadow-md">
          3D FLIGHT // 0{index + 1} OF 0{total} • {coffee.lotCode}
        </div>

        {/* Left 3D Floating Bag + Differential Parallax Flavor Orbit */}
        <div className="md:col-span-5 relative flex flex-col items-center justify-center py-6 rounded-2xl bg-cream-dark/80 border border-espresso/10 overflow-visible">
          {/* Glowing thermal ring behind bag */}
          <div
            className="w-40 h-40 rounded-full blur-2xl opacity-35 pointer-events-none absolute"
            style={{ background: coffee.palette.accent }}
          />

          <motion.div
            style={{ y: bagFloatY, translateZ: '60px' }}
            className="relative z-10 cursor-pointer"
            onClick={() => {
              soundEngine.playPortalWipe();
              onOpenPortal(coffee);
            }}
          >
            <CoffeeBagSVG coffee={coffee} className="w-40 h-48 sm:w-48 sm:h-56 drop-shadow-2xl" />
          </motion.div>

          {/* Differential Foreground Flavor Note Chips */}
          <motion.div
            style={{ y: notesParallaxY, x: notesParallaxX }}
            className="relative z-20 flex flex-wrap justify-center gap-1.5 mt-3 px-2"
          >
            {coffee.notes.map((note) => (
              <span
                key={note}
                className="px-3 py-1 rounded-full bg-espresso text-cream text-[11px] font-mono uppercase tracking-wider shadow-md border border-terracotta/40"
              >
                {note}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right Lot Telemetry & Direct Actions */}
        <div className="md:col-span-7 space-y-4 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/15 text-terracotta text-xs font-mono uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {coffee.badge} • {coffee.roastCategory}
            </span>
            <span className="font-mono text-xs text-umber/70">
              {coffee.elevation} • {coffee.process}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="font-serif text-3xl sm:text-4xl text-espresso leading-tight">
                {coffee.name}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-umber/75 mt-1">
                {coffee.origin} • {coffee.producer}
              </p>
            </div>
            <span className="font-serif text-3xl sm:text-4xl font-semibold text-terracotta shrink-0">
              ${coffee.price}
            </span>
          </div>

          <p className="text-sm sm:text-base text-umber/85 leading-relaxed">
            {coffee.description}
          </p>

          {/* Live Sensory Telemetry Strip */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-cream-dark/70 border border-espresso/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-umber/60 block">
                DROP TEMP
              </span>
              <span className="font-mono text-sm font-semibold text-espresso">
                {coffee.dropTemp}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-cream-dark/70 border border-espresso/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-umber/60 block">
                AGTRON
              </span>
              <span className="font-mono text-sm font-semibold text-terracotta">
                {coffee.agtron}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-cream-dark/70 border border-espresso/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-umber/60 block">
                CLARITY / SWEET
              </span>
              <span className="font-mono text-sm font-semibold text-sage">
                {coffee.sensory.clarity}% / {coffee.sensory.sweetness}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              data-cursor="ADD MICRO-LOT"
              onClick={() => {
                soundEngine.playSuccess();
                onAddToCart(coffee, GRIND_OPTIONS[0]);
              }}
              className="flex-1 py-3.5 px-5 rounded-full bg-terracotta text-cream font-medium text-sm hover:bg-terracotta-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Whole Bean — ${coffee.price}</span>
            </button>
            <button
              type="button"
              data-cursor="EXPLORE ORIGIN"
              onClick={() => {
                soundEngine.playPortalWipe();
                onOpenPortal(coffee);
              }}
              className="py-3.5 px-5 rounded-full bg-espresso text-cream font-mono text-xs uppercase tracking-wider hover:bg-umber transition-colors flex items-center gap-2"
            >
              <Maximize2 className="w-3.5 h-3.5 text-terracotta" />
              <span>Origin Portal</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScrollLotFlightRunway({ coffees, onOpenPortal, onAddToCart }) {
  const runwayRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 32,
    stiffness: 220,
    mass: 0.45,
  });

  useMotionValueEvent(smoothProgress, 'change', (v) => {
    const idx = Math.min(
      coffees.length - 1,
      Math.max(0, Math.round(v * (coffees.length - 1)))
    );
    if (idx !== activeIndex) {
      setActiveIndex(idx);
    }
  });

  const bgRingRotate = useTransform(smoothProgress, [0, 1], [0, 180]);
  const altitudeReadoutY = useTransform(smoothProgress, [0, 1], ['15%', '-15%']);
  const progressWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={runwayRef} className="relative min-h-[250vh] mb-20">
      <div
        className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-hidden rounded-3xl border border-espresso/15 bg-espresso/95 text-cream shadow-editorial flex flex-col justify-between p-5 sm:p-8"
        style={{ perspective: '1600px' }}
      >
        {/* Giant Foreground-Parallax Kinetic Background Ring & Telemetry Watermark */}
        <motion.div
          style={{ rotate: bgRingRotate }}
          className="pointer-events-none absolute -right-28 -bottom-28 w-[460px] h-[460px] rounded-full border border-terracotta/25 border-dashed"
        />
        <motion.div
          style={{ y: altitudeReadoutY }}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center select-none opacity-10 font-serif text-[72px] sm:text-[130px] leading-none tracking-tighter text-cream whitespace-nowrap"
        >
          {coffees[activeIndex]?.origin.toUpperCase()} • {coffees[activeIndex]?.elevation}
        </motion.div>

        {/* Top Sticky Runway Telemetry Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-cream/15 pb-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-terracotta animate-spin" style={{ animationDuration: '10s' }} />
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-terracotta font-semibold">
              SCROLL-SCRUBBED 3D MICRO-LOT FLIGHT RUNWAY
            </span>
          </div>

          {/* Lot Quick-Scrub Indicator Pills */}
          <div className="flex items-center gap-1.5">
            {coffees.map((lot, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <span
                  key={lot.id}
                  className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all ${
                    isCurrent
                      ? 'bg-terracotta text-cream font-semibold scale-105'
                      : 'bg-cream/10 text-cream/55'
                  }`}
                >
                  0{idx + 1} // {lot.name.split(' ')[0]}
                </span>
              );
            })}
          </div>
        </div>

        {/* Center 3D Perspective Stage */}
        <div
          className="relative flex-1 my-2"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {coffees.map((coffee, index) => (
            <ScrollLotFlightCard
              key={coffee.id}
              coffee={coffee}
              index={index}
              total={coffees.length}
              scrollYProgress={smoothProgress}
              onOpenPortal={onOpenPortal}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Bottom Scroll Progress Scrubber Bar */}
        <div className="relative z-20 pt-3 border-t border-cream/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cream/70">
            <Flame className="w-3.5 h-3.5 text-terracotta" />
            <span>
              ACTIVE LOT: <strong className="text-cream">{coffees[activeIndex]?.name}</strong> (
              {coffees[activeIndex]?.targetTds})
            </span>
          </div>
          <div className="w-full sm:w-64 h-1.5 rounded-full bg-cream/15 overflow-hidden">
            <motion.div
              style={{ width: progressWidth }}
              className="h-full bg-terracotta rounded-full"
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cream/60">
            KEEP SCROLLING TO FLY LOTS →
          </span>
        </div>
      </div>
    </div>
  );
}

function CoffeeCard({ coffee, index, onAddToCart, onOpenPortal }) {
  const [selectedGrind, setSelectedGrind] = useState(GRIND_OPTIONS[0]);
  const [justAdded, setJustAdded] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const cardRef = useRef(null);

  // Per-card scroll-linked 3D parallax
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const cardScrollY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [45 + (index % 2) * 28, 0, -35 - (index % 2) * 20]
  );
  const cardScrollRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [12, 0, -10]);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const ry = (x - 0.5) * 11;
    const rx = (0.5 - y) * 11;
    setTilt({ rx, ry, gx: Math.round(x * 100), gy: Math.round(y * 100) });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  const handleAdd = () => {
    soundEngine.playSuccess();
    onAddToCart(coffee, selectedGrind);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <motion.div
      style={{
        y: cardScrollY,
        rotateX: cardScrollRotateX,
        transformPerspective: 1100,
      }}
    >
      <motion.article
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: 'transform 140ms ease-out',
        }}
        className="h-full group relative bg-cream/90 backdrop-blur-sm border border-espresso/12 rounded-3xl p-6 flex flex-col justify-between shadow-card hover:shadow-editorial hover:border-terracotta/40 transition-shadow duration-300 overflow-hidden"
      >
        {/* Specular 3D Light Sheen Overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(360px circle at ${tilt.gx}% ${tilt.gy}%, rgba(200, 90, 50, 0.11), transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          {/* Top Row: Badge & Roast Level */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-dark text-umber text-xs font-medium border border-espresso/10">
              <Sparkles className="w-3 h-3 text-terracotta" />
              {coffee.badge}
            </span>

            {/* Roast Level Dots (1-5) */}
            <div className="flex items-center gap-1.5" title={`Roast: ${coffee.roastCategory}`}>
              <span className="text-[11px] uppercase tracking-wider text-umber/65 font-medium">
                {coffee.roastCategory}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span
                    key={dot}
                    className={`w-2 h-2 rounded-full ${
                      dot <= coffee.roastLevel ? 'bg-terracotta' : 'bg-espresso/15'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bag Illustration Stage — Clickable to launch Origin Portal Takeover */}
          <div
            role="button"
            tabIndex={0}
            data-cursor="EXPLORE ORIGIN"
            onClick={() => {
              soundEngine.playPortalWipe();
              onOpenPortal(coffee);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                soundEngine.playPortalWipe();
                onOpenPortal(coffee);
              }
            }}
            className="cursor-pointer relative bg-cream-dark/60 rounded-2xl py-6 px-4 mb-5 flex items-center justify-center border border-espresso/5 group-hover:border-terracotta/30 overflow-hidden transition-colors"
          >
            {/* Rising Botanical Aroma Particles on Hover */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {[0, 1, 2, 3].map((p) => (
                <motion.span
                  key={p}
                  animate={{
                    y: [20, -65],
                    x: [0, p % 2 === 0 ? 12 : -12],
                    opacity: [0, 0.55, 0],
                    scale: [0.6, 1.25],
                  }}
                  transition={{
                    duration: 2.2 + p * 0.35,
                    repeat: Infinity,
                    delay: p * 0.4,
                    ease: 'easeOut',
                  }}
                  style={{ left: `${28 + p * 15}%`, bottom: '18%' }}
                  className="absolute w-3 h-3 rounded-full bg-terracotta/30 blur-[2px]"
                />
              ))}
            </div>

            <motion.div
              whileHover={{ y: -6, rotate: -2, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <CoffeeBagSVG coffee={coffee} className="w-36 h-44" />
            </motion.div>

            <span className="absolute top-2.5 left-2.5 text-[10px] font-mono uppercase tracking-wider text-umber/65 bg-cream/90 px-2 py-0.5 rounded-md border border-espresso/10">
              {coffee.lotCode}
            </span>

            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-terracotta bg-espresso text-cream px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-2.5 h-2.5 text-terracotta" />
              <span>Origin Portal</span>
            </span>

            <span className="absolute bottom-3 right-3 text-[11px] font-medium text-umber/60 bg-cream/90 px-2.5 py-0.5 rounded-full border border-espresso/10">
              {coffee.weight}
            </span>
          </div>

          {/* Title & Origin Metadata */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <button
                type="button"
                data-cursor="EXPLORE ORIGIN"
                onClick={() => {
                  soundEngine.playPortalWipe();
                  onOpenPortal(coffee);
                }}
                className="text-left group/title"
              >
                <h3 className="font-serif text-2xl font-medium text-espresso group-hover/title:text-terracotta transition-colors leading-tight inline-flex items-center gap-1">
                  <span>{coffee.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover/title:opacity-100 text-terracotta transition-opacity" />
                </h3>
              </button>
              <p className="text-xs text-umber/75 mt-1 font-medium">
                {coffee.origin} • {coffee.elevation} • {coffee.process}
              </p>
            </div>
            <span className="font-serif text-2xl font-semibold text-espresso">
              ${coffee.price}
            </span>
          </div>

          {/* Tasting Notes Pills */}
          <div className="flex flex-wrap gap-1.5 my-3.5">
            {coffee.notes.map((note) => (
              <span
                key={note}
                className="px-2.5 py-1 rounded-md bg-sage-light/80 text-sage text-xs font-medium"
              >
                {note}
              </span>
            ))}
          </div>

          <p className="text-sm text-umber/80 leading-relaxed mb-5">{coffee.description}</p>

          {/* Animated Tasting-Note Sensory Bars */}
          <div className="space-y-2.5 p-3.5 rounded-2xl bg-cream-dark/50 border border-espresso/5 mb-5">
            <TastingBar label="Acidity" value={coffee.sensory.acidity} colorClass="bg-terracotta" />
            <TastingBar label="Body" value={coffee.sensory.body} colorClass="bg-umber" />
            <TastingBar label="Sweetness" value={coffee.sensory.sweetness} colorClass="bg-sage" />
          </div>
        </div>

        {/* Grind Selector + Add to Bag + Portal Trigger */}
        <div className="relative z-10 space-y-3 pt-2 border-t border-espresso/10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-umber/70 font-semibold block mb-2">
              Grind Preference
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {GRIND_OPTIONS.map((grind) => {
                const active = selectedGrind === grind;
                return (
                  <button
                    key={grind}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedGrind(grind);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-medium transition-all border ${
                      active
                        ? 'bg-espresso text-cream border-espresso shadow-sm'
                        : 'bg-cream text-umber border-espresso/15 hover:border-espresso/40'
                    }`}
                  >
                    {grind}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              data-cursor="ADD MICRO-LOT"
              onClick={handleAdd}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-3.5 px-4 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm ${
                justAdded
                  ? 'bg-sage text-cream'
                  : 'bg-terracotta text-cream hover:bg-terracotta-dark'
              }`}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Added to Bag
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Bag — ${coffee.price}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              type="button"
              data-cursor="EXPLORE ORIGIN"
              onClick={() => {
                soundEngine.playPortalWipe();
                onOpenPortal(coffee);
              }}
              className="p-3.5 rounded-full border border-espresso/20 text-espresso hover:bg-espresso hover:text-cream transition-colors"
              title="Launch Full-Screen Origin & Sensory Portal"
              aria-label={`Open ${coffee.name} sensory portal`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

// 02 // SENSORY FLAVOR MATRIX (Interactive 2D Terroir & Flavor Coordinate Explorer)
function SensoryFlavorMatrix({ coffees, onOpenPortal, onAddToCart }) {
  const [selectedLot, setSelectedLot] = useState(coffees[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-espresso text-cream rounded-3xl p-6 sm:p-10 border border-espresso/20 shadow-editorial"
    >
      {/* Left 2D Coordinate Plane: Acidity (Y) vs Body/Sweetness (X) */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.24em] text-terracotta block">
              02 // SENSORY FLAVOR MATRIX
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-cream mt-0.5">
              Terroir &amp; Extraction Coordinate Plane
            </h3>
          </div>
          <span className="text-xs font-mono text-cream/55">
            CLICK ANY NODE TO INSPECT LOT
          </span>
        </div>

        {/* Coordinate SVG Plot */}
        <div className="relative rounded-2xl bg-cream/5 border border-cream/15 p-4 sm:p-6">
          <svg
            viewBox="0 0 520 340"
            className="w-full h-auto"
            role="img"
            aria-label="Sensory flavor matrix coordinate plane"
          >
            {/* Grid Lines */}
            {[60, 130, 200, 270].map((y) => (
              <line
                key={`h-${y}`}
                x1="50"
                y1={y}
                x2="480"
                y2={y}
                stroke="#FBF8F3"
                strokeOpacity="0.1"
                strokeDasharray="3 3"
              />
            ))}
            {[120, 220, 320, 420].map((x) => (
              <line
                key={`v-${x}`}
                x1={x}
                y1="30"
                x2={x}
                y2="295"
                stroke="#FBF8F3"
                strokeOpacity="0.1"
                strokeDasharray="3 3"
              />
            ))}

            {/* Axes */}
            <line x1="50" y1="295" x2="485" y2="295" stroke="#FBF8F3" strokeOpacity="0.35" />
            <line x1="50" y1="25" x2="50" y2="295" stroke="#FBF8F3" strokeOpacity="0.35" />

            {/* Quadrant Labels */}
            <text x="65" y="48" fill="#C85A32" fontSize="10" fontFamily="monospace">
              HIGH FLORAL CLARITY // BRIGHT CITRUS
            </text>
            <text x="295" y="48" fill="#5E7461" fontSize="10" fontFamily="monospace">
              TROPICAL SWEETNESS // COMPLEX STRUCTURE
            </text>
            <text x="295" y="282" fill="#FBF8F3" fillOpacity="0.55" fontSize="10" fontFamily="monospace">
              SYRUPY CACAO // VELVETY ESPRESSO BODY
            </text>
            <text x="220" y="325" fill="#FBF8F3" fillOpacity="0.65" fontSize="10" fontFamily="monospace">
              BODY &amp; CARAMELIZATION DENSITY →
            </text>

            {/* Plotted Micro-Lot Nodes */}
            {coffees.map((lot) => {
              const x = 85 + ((lot.sensory.body - 50) / 50) * 355;
              const y = 270 - ((lot.sensory.acidity - 45) / 55) * 205;
              const isSelected = selectedLot?.id === lot.id;

              return (
                <g
                  key={lot.id}
                  className="cursor-pointer"
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedLot(lot);
                  }}
                >
                  {isSelected && (
                    <motion.circle
                      cx={x}
                      cy={y}
                      r="24"
                      fill="none"
                      stroke="#C85A32"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 12 : 9}
                    fill={isSelected ? '#C85A32' : '#5E7461'}
                    stroke="#FBF8F3"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y - 16}
                    textAnchor="middle"
                    fill="#FBF8F3"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Fraunces, Georgia, serif"
                  >
                    {lot.name}
                  </text>
                  <text
                    x={x}
                    y={y + 24}
                    textAnchor="middle"
                    fill="#FBF8F3"
                    fillOpacity="0.65"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {lot.elevation} • {lot.process}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Right Selected Lot Telemetry & Portal Launch */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-cream/5 border border-cream/15 p-6 space-y-5">
        {selectedLot && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-terracotta">
                <span>{selectedLot.lotCode}</span>
                <span>{selectedLot.targetTds}</span>
              </div>

              <div className="flex items-center gap-4">
                <CoffeeBagSVG coffee={selectedLot} className="w-24 h-28 shrink-0" compact />
                <div>
                  <h4 className="font-serif text-2xl text-cream">
                    <ScrambleText text={selectedLot.name} triggerKey={selectedLot.id} />
                  </h4>
                  <p className="text-xs font-mono text-cream/65 mt-0.5">
                    {selectedLot.origin} • {selectedLot.elevation}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedLot.notes.map((n) => (
                      <span
                        key={n}
                        className="px-2 py-0.5 rounded bg-terracotta/25 text-cream text-[11px]"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-sm text-cream/75 leading-relaxed pt-1">
                {selectedLot.description}
              </p>

              {/* 6-Axis Mini Readouts */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { k: 'ACIDITY', v: selectedLot.sensory.acidity },
                  { k: 'SWEETNESS', v: selectedLot.sensory.sweetness },
                  { k: 'BODY', v: selectedLot.sensory.body },
                  { k: 'FLORAL', v: selectedLot.sensory.floral },
                  { k: 'COCOA', v: selectedLot.sensory.cocoa },
                  { k: 'CLARITY', v: selectedLot.sensory.clarity },
                ].map((m) => (
                  <div key={m.k} className="p-2.5 rounded-xl bg-cream/5 border border-cream/10">
                    <span className="text-[9px] font-mono text-cream/45 block">{m.k}</span>
                    <span className="font-mono text-sm font-semibold text-terracotta">
                      {m.v} / 100
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-cream/10">
              <button
                type="button"
                data-cursor="OPEN PORTAL"
                onClick={() => {
                  soundEngine.playPortalWipe();
                  onOpenPortal(selectedLot);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-terracotta text-cream text-xs font-mono uppercase tracking-wider hover:bg-terracotta-dark transition-colors flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Full Origin Portal</span>
              </button>
              <button
                type="button"
                data-cursor="ADD MICRO-LOT"
                onClick={() => {
                  soundEngine.playSuccess();
                  onAddToCart(selectedLot, GRIND_OPTIONS[0]);
                }}
                className="py-3 px-4 rounded-full bg-cream/10 hover:bg-cream/20 text-cream text-xs font-mono uppercase tracking-wider transition-colors"
              >
                + Bag (${selectedLot.price})
              </button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function CoffeeShop({
  onAddToCart,
  onOpenPortal,
  viewMode = 'reel',
  onViewModeChange,
}) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCoffees =
    activeFilter === 'All'
      ? COFFEES
      : COFFEES.filter((c) => c.roastCategory === activeFilter);

  return (
    <section id="origins" className="py-16 sm:py-24 border-b border-espresso/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Mode Switcher + Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-[0.22em] text-terracotta font-semibold block mb-2.5">
              01 // Single-Origin Micro-Lots
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-espresso font-normal tracking-tight">
              Seasonal Harvest &amp; 3D Flight Explorer
            </h2>
            <p className="text-umber/80 mt-3 text-base sm:text-lg">
              Scroll through our sticky 3D micro-lot flight runway below or filter the full harvest
              grid. Click any micro-lot to launch its full-screen sensory &amp; roast-curve portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* View Mode Toggle: 01 // 3D REEL vs 02 // FLAVOR MATRIX */}
            <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-espresso text-cream text-xs font-mono uppercase tracking-wider">
              <button
                type="button"
                data-cursor="3D REEL MODE"
                onClick={() => {
                  soundEngine.playClick();
                  onViewModeChange && onViewModeChange('reel');
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-colors ${
                  viewMode === 'reel'
                    ? 'bg-terracotta text-cream'
                    : 'text-cream/70 hover:text-cream'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>01 // 3D Reel</span>
              </button>
              <button
                type="button"
                data-cursor="FLAVOR MATRIX"
                onClick={() => {
                  soundEngine.playClick();
                  onViewModeChange && onViewModeChange('matrix');
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-colors ${
                  viewMode === 'matrix'
                    ? 'bg-terracotta text-cream'
                    : 'text-cream/70 hover:text-cream'
                }`}
              >
                <Radar className="w-3.5 h-3.5" />
                <span>02 // Flavor Matrix</span>
              </button>
            </div>

            {/* Roast Profile Filter */}
            {viewMode === 'reel' && (
              <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-cream-dark border border-espresso/10">
                {ROAST_FILTERS.map((filter) => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setActiveFilter(filter);
                      }}
                      className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                        isActive ? 'text-cream' : 'text-umber hover:text-espresso'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="roast-filter-pill"
                          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                          className="absolute inset-0 bg-espresso rounded-full"
                        />
                      )}
                      <span className="relative z-10">{filter}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Scroll-Scrubbed 3D Micro-Lot Flight Runway (shown in 3D Reel mode) */}
        {viewMode === 'reel' && (
          <ScrollLotFlightRunway
            coffees={COFFEES}
            onOpenPortal={onOpenPortal}
            onAddToCart={onAddToCart}
          />
        )}

        {/* Switch between 3D Micro-Lot Cards and Interactive 2D Flavor Matrix */}
        <AnimatePresence mode="wait">
          {viewMode === 'matrix' ? (
            <SensoryFlavorMatrix
              key="sensory-matrix"
              coffees={COFFEES}
              onOpenPortal={onOpenPortal}
              onAddToCart={onAddToCart}
            />
          ) : (
            <motion.div
              key="coffee-grid"
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredCoffees.map((coffee, idx) => (
                  <CoffeeCard
                    key={coffee.id}
                    coffee={coffee}
                    index={idx}
                    onAddToCart={onAddToCart}
                    onOpenPortal={onOpenPortal}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
