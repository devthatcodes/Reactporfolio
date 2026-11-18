import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
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
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
}

/**
 * RotaryArcBagCard
 * Positioned along a gentle 2D/GPU circular arc (translateX, translateY, rotate, scale, opacity)
 * driven purely by Framer Motion useTransform on scrollYProgress with zero React state updates during scroll!
 */
function RotaryArcBagCard({
  coffee,
  index,
  total,
  scrollYProgress,
  onOpenPortal,
  onAddToCart,
}) {
  const center = index / Math.max(1, total - 1); // 0.0 -> 1.0 across the 6 single-origin bags

  // Gentle circular tasting wheel arc: X sweeps across the wheel, Y dips down along the arc edges
  const x = useTransform(
    scrollYProgress,
    [center - 0.52, center - 0.24, center, center + 0.24, center + 0.52],
    ['105%', '52%', '0%', '-52%', '-105%']
  );

  const y = useTransform(
    scrollYProgress,
    [center - 0.45, center - 0.22, center, center + 0.22, center + 0.45],
    [130, 38, 0, 38, 130]
  );

  const rotate = useTransform(
    scrollYProgress,
    [center - 0.45, center - 0.22, center, center + 0.22, center + 0.45],
    [22, 9, 0, -9, -22]
  );

  const scale = useTransform(
    scrollYProgress,
    [center - 0.36, center - 0.16, center, center + 0.16, center + 0.36],
    [0.72, 0.88, 1.0, 0.88, 0.72]
  );

  const opacity = useTransform(
    scrollYProgress,
    [center - 0.36, center - 0.16, center, center + 0.16, center + 0.36],
    [0, 0.42, 1, 0.42, 0]
  );

  const bagFloatY = useTransform(
    scrollYProgress,
    [center - 0.25, center, center + 0.25],
    [18, -8, 18]
  );

  const bagRotate = useTransform(
    scrollYProgress,
    [center - 0.25, center, center + 0.25],
    [-8, 0, 8]
  );

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        willChange: 'transform, opacity',
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto relative w-full max-w-4xl rounded-3xl bg-cream border-2 border-espresso/15 shadow-editorial p-6 sm:p-9 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center text-espresso">
        {/* Top-Right Lot Index Telemetry */}
        <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-espresso text-cream text-[10px] font-mono uppercase tracking-[0.22em] border border-terracotta/50 shadow-md">
          ROTARY WHEEL // 0{index + 1} OF 0{total} • {coffee.lotCode}
        </div>

        {/* Left Rotary Botanical Seal Stage + Coffee Bag */}
        <div className="md:col-span-5 relative flex flex-col items-center justify-center py-6 rounded-2xl bg-cream-dark border border-espresso/10 overflow-hidden">
          {/* Concentric Botanical Seal Ring behind bag */}
          <div className="pointer-events-none absolute w-48 h-48 rounded-full border border-dashed border-terracotta/35" />
          <div className="pointer-events-none absolute w-36 h-36 rounded-full border border-sage/25" />

          <motion.div
            style={{ y: bagFloatY, rotate: bagRotate, willChange: 'transform' }}
            className="relative z-10 cursor-pointer"
            onClick={() => {
              soundEngine.playPortalWipe();
              onOpenPortal(coffee);
            }}
          >
            <CoffeeBagSVG coffee={coffee} className="w-36 h-44 sm:w-44 sm:h-52" />
          </motion.div>

          {/* Flavor Note Chips */}
          <div className="relative z-20 flex flex-wrap justify-center gap-1.5 mt-3 px-2">
            {coffee.notes.map((note) => (
              <span
                key={note}
                className="px-3 py-1 rounded-full bg-espresso text-cream text-[11px] font-mono uppercase tracking-wider border border-terracotta/40"
              >
                {note}
              </span>
            ))}
          </div>
        </div>

        {/* Right Lot Telemetry & Direct Actions */}
        <div className="md:col-span-7 space-y-4 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/15 text-terracotta text-xs font-mono uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {coffee.badge} • {coffee.roastCategory}
            </span>
            <span className="font-mono text-xs text-umber/75">
              {coffee.elevation} • {coffee.process}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl sm:text-4xl text-espresso leading-tight">
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
            <div className="p-2.5 rounded-xl bg-cream-dark border border-espresso/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-umber/60 block">
                DROP TEMP
              </span>
              <span className="font-mono text-sm font-semibold text-espresso">
                {coffee.dropTemp}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-cream-dark border border-espresso/10">
              <span className="text-[10px] font-mono uppercase tracking-wider text-umber/60 block">
                AGTRON
              </span>
              <span className="font-mono text-sm font-semibold text-terracotta">
                {coffee.agtron}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-cream-dark border border-espresso/10">
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

/**
 * RotaryArcPill
 * Pure GPU scroll-linked indicator pill (zero React state updates during scroll)
 */
function RotaryArcPill({ lot, idx, total, scrollYProgress }) {
  const center = idx / Math.max(1, total - 1);
  const opacity = useTransform(
    scrollYProgress,
    [center - 0.22, center, center + 0.22],
    [0.45, 1, 0.45]
  );
  const scale = useTransform(
    scrollYProgress,
    [center - 0.22, center, center + 0.22],
    [0.94, 1.06, 0.94]
  );

  return (
    <motion.span
      style={{ opacity, scale, willChange: 'transform, opacity' }}
      className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-cream/10 text-cream border border-terracotta/40"
    >
      0{idx + 1} // {lot.name.split(' ')[0]}
    </motion.span>
  );
}

/**
 * CurvedBotanicalArcShowcase
 * Sticky scroll-scrubbed Curved Arc / Rotary Carousel Scroll Showcase (`min-h-[210vh]` with `sticky top-20` stage)
 * where scrolling smoothly rotates the 6 single-origin coffee bags along a gentle 2D/GPU circular arc
 * with zero React state updates during scroll!
 */
function CurvedBotanicalArcShowcase({ coffees, onOpenPortal, onAddToCart }) {
  const runwayRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 36,
    stiffness: 240,
    mass: 0.38,
  });

  // Pure GPU-composited rotary wheel dial & progress bar
  const wheelRotate = useTransform(smoothProgress, [0, 1], [-75, 75]);
  const innerSealRotate = useTransform(smoothProgress, [0, 1], [0, 240]);
  const progressScaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <div ref={runwayRef} className="relative min-h-[210vh] mb-20">
      <div className="sticky top-20 h-[calc(100vh-5.5rem)] w-full overflow-hidden rounded-3xl border border-espresso/15 bg-espresso text-cream shadow-editorial flex flex-col justify-between p-5 sm:p-8">
        {/* Giant Curved Botanical Tasting Wheel Arc SVG in Background */}
        <motion.div
          style={{ rotate: wheelRotate, willChange: 'transform' }}
          className="pointer-events-none absolute left-1/2 -bottom-[420px] -translate-x-1/2 w-[920px] h-[920px] rounded-full border-2 border-dashed border-terracotta/30 flex items-center justify-center"
        >
          <div className="w-[740px] h-[740px] rounded-full border border-cream/10" />
          <div className="w-[560px] h-[560px] rounded-full border border-dashed border-sage/25" />
        </motion.div>

        {/* Top-Right Rotating Botanical Roastery Seal Watermark */}
        <motion.div
          style={{ rotate: innerSealRotate, willChange: 'transform' }}
          className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full border border-terracotta/25 border-dashed flex items-center justify-center"
        >
          <div className="w-44 h-44 rounded-full border border-cream/10" />
        </motion.div>

        {/* Top Sticky Rotary Wheel Telemetry Bar */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 border-b border-cream/15 pb-4">
          <div className="flex items-center gap-2.5">
            <motion.div style={{ rotate: innerSealRotate, willChange: 'transform' }}>
              <Compass className="w-4 h-4 text-terracotta" />
            </motion.div>
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-terracotta font-semibold">
              ROTARY TASTING WHEEL // CURVED BOTANICAL ARC ({coffees.length} SINGLE ORIGINS)
            </span>
          </div>

          {/* 6 Lot Quick-Scrub Indicator Pills (Pure GPU opacity/scale) */}
          <div className="hidden md:flex items-center gap-1.5">
            {coffees.map((lot, idx) => (
              <RotaryArcPill
                key={lot.id}
                lot={lot}
                idx={idx}
                total={coffees.length}
                scrollYProgress={smoothProgress}
              />
            ))}
          </div>
        </div>

        {/* Center 2D/GPU Circular Arc Stage */}
        <div className="relative flex-1 my-2">
          {coffees.map((coffee, index) => (
            <RotaryArcBagCard
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
          <div className="flex items-center gap-2 text-xs font-mono text-cream/75">
            <Flame className="w-3.5 h-3.5 text-terracotta" />
            <span>
              BOTANICAL TASTING WHEEL • <strong className="text-cream">6 MICRO-LOT HARVESTS</strong>
            </span>
          </div>
          <div className="w-full sm:w-64 h-1.5 rounded-full bg-cream/15 overflow-hidden">
            <motion.div
              style={{
                scaleX: progressScaleX,
                transformOrigin: '0% 50%',
                willChange: 'transform',
              }}
              className="h-full w-full bg-terracotta rounded-full"
            />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cream/60">
            SCROLL TO ROTATE TASTING ARC →
          </span>
        </div>
      </div>
    </div>
  );
}

function CoffeeCard({ coffee, onAddToCart, onOpenPortal }) {
  const [selectedGrind, setSelectedGrind] = useState(GRIND_OPTIONS[0]);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    soundEngine.playSuccess();
    onAddToCart(coffee, selectedGrind);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="h-full group relative bg-cream border border-espresso/12 rounded-3xl p-6 flex flex-col justify-between shadow-card hover:shadow-editorial hover:border-terracotta/45 transition-all duration-300 overflow-hidden"
    >
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
          className="cursor-pointer relative bg-cream-dark rounded-2xl py-6 px-4 mb-5 flex items-center justify-center border border-espresso/5 group-hover:border-terracotta/30 overflow-hidden transition-colors"
        >
          {/* Subtle Botanical Ring Seal behind Bag */}
          <div className="pointer-events-none absolute w-36 h-36 rounded-full border border-dashed border-terracotta/25 group-hover:rotate-45 transition-transform duration-700" />

          <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:scale-105">
            <CoffeeBagSVG coffee={coffee} className="w-36 h-44" />
          </div>

          <span className="absolute top-2.5 left-2.5 text-[10px] font-mono uppercase tracking-wider text-umber/70 bg-cream px-2 py-0.5 rounded-md border border-espresso/10">
            {coffee.lotCode}
          </span>

          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-cream bg-espresso px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-2.5 h-2.5 text-terracotta" />
            <span>Origin Portal</span>
          </span>

          <span className="absolute bottom-3 right-3 text-[11px] font-medium text-umber/65 bg-cream px-2.5 py-0.5 rounded-full border border-espresso/10">
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
              className="px-2.5 py-1 rounded-md bg-sage-light text-sage text-xs font-medium"
            >
              {note}
            </span>
          ))}
        </div>

        <p className="text-sm text-umber/80 leading-relaxed mb-5">{coffee.description}</p>

        {/* Animated Tasting-Note Sensory Bars */}
        <div className="space-y-2.5 p-3.5 rounded-2xl bg-cream-dark/70 border border-espresso/5 mb-5">
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
                    <circle
                      cx={x}
                      cy={y}
                      r="22"
                      fill="none"
                      stroke="#C85A32"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
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
              Rotary Tasting Wheel &amp; Harvest Grid
            </h2>
            <p className="text-umber/80 mt-3 text-base sm:text-lg">
              Scroll through our curved botanical tasting wheel arc below or filter the full
              6-origin harvest grid. Click any lot to launch its full-screen sensory &amp;
              roast-curve portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* View Mode Toggle: 01 // ROTARY WHEEL vs 02 // FLAVOR MATRIX */}
            <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-espresso text-cream text-xs font-mono uppercase tracking-wider">
              <button
                type="button"
                data-cursor="ROTARY WHEEL"
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
                <span>01 // Rotary Arc</span>
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

        {/* Sticky Scroll-Scrubbed Curved Botanical Arc / Rotary Tasting Carousel */}
        {viewMode === 'reel' && (
          <CurvedBotanicalArcShowcase
            coffees={COFFEES}
            onOpenPortal={onOpenPortal}
            onAddToCart={onAddToCart}
          />
        )}

        {/* Switch between Interactive Filterable Shop Grid and 2D Flavor Matrix */}
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
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredCoffees.map((coffee) => (
                <CoffeeCard
                  key={coffee.id}
                  coffee={coffee}
                  onAddToCart={onAddToCart}
                  onOpenPortal={onOpenPortal}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
