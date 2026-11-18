import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Sparkles, Maximize2, Grid, Radar, ArrowUpRight } from 'lucide-react';
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

function CoffeeCard({ coffee, onAddToCart, onOpenPortal }) {
  const [selectedGrind, setSelectedGrind] = useState(GRIND_OPTIONS[0]);
  const [justAdded, setJustAdded] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });
  const cardRef = useRef(null);

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
      className="group relative bg-cream/90 backdrop-blur-sm border border-espresso/12 rounded-3xl p-6 flex flex-col justify-between shadow-card hover:shadow-editorial hover:border-terracotta/40 transition-shadow duration-300 overflow-hidden"
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
              // Map body (50..100) to X (95..435), acidity (45..100) to Y (265..55)
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
              Seasonal Harvest &amp; Flavor Explorer
            </h2>
            <p className="text-umber/80 mt-3 text-base sm:text-lg">
              Roasted to order every Monday and Thursday. Click any micro-lot to enter its
              full-screen sensory &amp; roast-curve telemetry portal.
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
                {filteredCoffees.map((coffee) => (
                  <CoffeeCard
                    key={coffee.id}
                    coffee={coffee}
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
