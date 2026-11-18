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
  Layers,
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
 * FannedTastingCard
 * Individual card inside the Interactive Fanned Tasting Deck.
 * Starts fanned out like a physical hand of letterpress tasting cards
 * (rotate: -15deg, -7deg, 0deg, 7deg, 15deg, x offsets) and unfolds smoothly
 * as you scroll down or click any card in the fan.
 */
function FannedTastingCard({
  coffee,
  index,
  fanAngles,
  fanXOffsets,
  fanYOffsets,
  spreadXOffsets,
  scrollYProgress,
  isManualSpread,
  activeCardId,
  onSelectCard,
  onOpenPortal,
  onAddToCart,
}) {
  const fanRotate = fanAngles[index] ?? 0;
  const fanX = fanXOffsets[index] ?? 0;
  const fanY = fanYOffsets[index] ?? 0;
  const spreadX = spreadXOffsets[index] ?? 0;

  // Scroll-driven interpolation from Fanned Hand (0) -> Unfolded Spread (1)
  const scrollRotate = useTransform(
    scrollYProgress,
    [0.05, 0.55],
    [fanRotate, 0]
  );
  const scrollX = useTransform(
    scrollYProgress,
    [0.05, 0.55],
    [fanX, spreadX]
  );
  const scrollY = useTransform(
    scrollYProgress,
    [0.05, 0.55],
    [fanY, 0]
  );

  const isSelected = activeCardId === coffee.id;

  return (
    <motion.div
      style={{
        rotate: isManualSpread ? 0 : scrollRotate,
        x: isManualSpread ? spreadX : scrollX,
        y: isManualSpread ? (isSelected ? -14 : 0) : scrollY,
        zIndex: isSelected ? 40 : 10 + index,
        willChange: 'transform',
      }}
      whileHover={{
        y: -18,
        scale: 1.04,
        zIndex: 50,
        transition: { type: 'spring', stiffness: 260, damping: 18 },
      }}
      onClick={() => {
        soundEngine.playClick();
        onSelectCard(coffee);
      }}
      data-cursor="TASTE · UNFOLD"
      className={`cursor-pointer w-56 sm:w-64 rounded-3xl bg-cream border-2 p-5 flex flex-col justify-between transition-shadow duration-300 select-none ${
        isSelected
          ? 'border-terracotta shadow-editorial ring-2 ring-terracotta/25'
          : 'border-espresso/15 shadow-card hover:border-terracotta/60 hover:shadow-editorial'
      }`}
    >
      {/* Top Apothecary Lot Stamp */}
      <div>
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-umber/70 pb-2.5 mb-3 border-b border-espresso/10">
          <span>{coffee.lotCode}</span>
          <span className="text-terracotta font-semibold">{coffee.elevation}</span>
        </div>

        {/* Mini Bag + Botanical Ring */}
        <div className="relative bg-cream-dark rounded-2xl py-4 flex items-center justify-center mb-3 overflow-hidden border border-espresso/5">
          <div className="pointer-events-none absolute w-24 h-24 rounded-full border border-dashed border-terracotta/30" />
          <CoffeeBagSVG coffee={coffee} className="w-24 h-32 relative z-10" compact />
        </div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta font-semibold">
          {coffee.origin} · {coffee.process}
        </p>
        <h3 className="font-serif text-xl text-espresso mt-0.5 leading-snug">
          {coffee.name}
        </h3>

        {/* Tasting Note Pills */}
        <div className="flex flex-wrap gap-1 mt-2.5">
          {coffee.notes.map((note) => (
            <span
              key={note}
              className="px-2 py-0.5 rounded-full bg-sage-light text-sage text-[10px] font-medium"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Price & Quick Action */}
      <div className="pt-3 mt-4 border-t border-espresso/10 flex items-center justify-between gap-2">
        <span className="font-serif text-lg font-semibold text-espresso">
          ${coffee.price}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            data-cursor="TASTE · NOTES"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playPortalWipe();
              onOpenPortal(coffee);
            }}
            className="px-2.5 py-1 rounded-full bg-espresso/10 hover:bg-espresso hover:text-cream text-espresso text-[10px] uppercase tracking-wider font-medium transition-colors"
          >
            Notes
          </button>
          <button
            type="button"
            data-cursor="ADD · BAG"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playSuccess();
              onAddToCart(coffee, GRIND_OPTIONS[0]);
            }}
            className="px-2.5 py-1 rounded-full bg-terracotta text-cream hover:bg-terracotta-dark text-[10px] uppercase tracking-wider font-medium transition-colors"
          >
            + Bag
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * FannedTastingDeckShowcase
 * At the top of #shop, features an Interactive Fanned Tasting Deck where the
 * single-origin coffee cards start stacked and fanned out like a physical hand
 * of tasting cards (rotate: -15deg, -7deg, 0deg, 7deg, 15deg, x offsets).
 * As you scroll down (or click any card in the fan), the cards unfold and spread
 * out smoothly with tactile spring physics.
 */
function FannedTastingDeckShowcase({ coffees, onOpenPortal, onAddToCart }) {
  const deckRef = useRef(null);
  const deckCoffees = coffees.slice(0, 5); // 5-card physical tasting hand (-15, -7, 0, 7, 15 deg)
  const [isManualSpread, setIsManualSpread] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(deckCoffees[2] || coffees[0]);

  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ['start 85%', 'end 25%'],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 20,
    mass: 0.45,
  });

  // Exact fan angles requested: -15deg, -7deg, 0deg, 7deg, 15deg
  const fanAngles = [-15, -7, 0, 7, 15];
  // Stacked hand X offsets
  const fanXOffsets = [-115, -58, 0, 58, 115];
  // Gentle arc Y offsets when fanned
  const fanYOffsets = [28, 8, 0, 8, 28];
  // Unfolded spread X offsets across the desktop stage
  const spreadXOffsets = [-450, -225, 0, 225, 450];

  const handleCardSelect = (coffee) => {
    setSelectedCoffee(coffee);
    setIsManualSpread(true);
  };

  return (
    <div
      ref={deckRef}
      className="relative mb-16 rounded-3xl bg-cream-dark/80 border border-espresso/12 p-6 sm:p-10 shadow-editorial overflow-hidden"
    >
      {/* Top Bar: Fanned Deck Description & Interactive Unfold Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-espresso/10">
        <div>
          <span className="text-xs font-serif italic text-terracotta tracking-wider block">
            Tactile Apothecary · Interactive Fanned Tasting Deck
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-espresso mt-0.5">
            Pull a Tasting Card from the Roaster&apos;s Hand
          </h3>
          <p className="text-xs sm:text-sm text-umber/75 mt-1">
            Scroll down or click any card in the fan to unfold our single-origin harvest deck.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-cursor="TASTE · DECK"
            onClick={() => {
              soundEngine.playClick();
              setIsManualSpread((prev) => !prev);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-espresso text-cream text-xs uppercase tracking-wider font-medium hover:bg-umber transition-colors shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-terracotta" />
            <span>{isManualSpread ? 'Gather Tasting Fan' : 'Unfold Tasting Deck'}</span>
          </button>
        </div>
      </div>

      {/* Desktop Interactive Fanned Card Stage */}
      <div className="hidden lg:flex relative h-[430px] items-center justify-center my-4">
        {/* Subtle Table Mat Arc Guide */}
        <svg
          viewBox="0 0 1000 320"
          fill="none"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-30"
          aria-hidden="true"
        >
          <path
            d="M 80 280 Q 500 80 920 280"
            stroke="#C85A32"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        </svg>

        {deckCoffees.map((coffee, index) => (
          <div
            key={coffee.id}
            className="absolute flex items-center justify-center"
          >
            <FannedTastingCard
              coffee={coffee}
              index={index}
              fanAngles={fanAngles}
              fanXOffsets={fanXOffsets}
              fanYOffsets={fanYOffsets}
              spreadXOffsets={spreadXOffsets}
              scrollYProgress={smoothScroll}
              isManualSpread={isManualSpread}
              activeCardId={selectedCoffee?.id}
              onSelectCard={handleCardSelect}
              onOpenPortal={onOpenPortal}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>

      {/* Mobile / Tablet Responsive Fanned Deck Scroller */}
      <div className="flex lg:hidden gap-4 overflow-x-auto py-4 px-1 snap-x">
        {deckCoffees.map((coffee, idx) => (
          <motion.div
            key={coffee.id}
            initial={{ rotate: fanAngles[idx] * 0.35, y: 12, opacity: 0 }}
            whileInView={{ rotate: 0, y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: idx * 0.06 }}
            onClick={() => handleCardSelect(coffee)}
            className="snap-center shrink-0 w-64 rounded-2xl bg-cream border border-espresso/15 p-4 shadow-card"
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-umber/70 mb-2">
              <span>{coffee.lotCode}</span>
              <span className="text-terracotta">{coffee.elevation}</span>
            </div>
            <div className="bg-cream-dark rounded-xl py-3 flex justify-center mb-3">
              <CoffeeBagSVG coffee={coffee} className="w-24 h-28" compact />
            </div>
            <h4 className="font-serif text-lg text-espresso">{coffee.name}</h4>
            <p className="text-xs text-umber/75">{coffee.origin}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Selected Tasting Card Detail Bar */}
      {selectedCoffee && (
        <motion.div
          key={selectedCoffee.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="mt-4 pt-5 border-t border-espresso/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-cream/80 rounded-2xl p-4 sm:p-5 border border-espresso/10"
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-terracotta/15 text-terracotta text-xs font-medium">
                Selected Card · {selectedCoffee.name}
              </span>
              <span className="text-xs text-umber/70">
                {selectedCoffee.origin} · {selectedCoffee.producer} · Drop {selectedCoffee.dropTemp}
              </span>
            </div>
            <p className="text-sm text-umber/85 max-w-2xl">
              {selectedCoffee.description}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              data-cursor="TASTE · EXPLORE"
              onClick={() => {
                soundEngine.playPortalWipe();
                onOpenPortal(selectedCoffee);
              }}
              className="px-4 py-2.5 rounded-full border border-espresso/20 text-espresso hover:bg-espresso hover:text-cream text-xs uppercase tracking-wider font-medium transition-colors"
            >
              Read Full Tasting Sheet
            </button>
            <button
              type="button"
              data-cursor="TASTE · ADD"
              onClick={() => {
                soundEngine.playSuccess();
                onAddToCart(selectedCoffee, GRIND_OPTIONS[0]);
              }}
              className="px-5 py-2.5 rounded-full bg-terracotta text-cream hover:bg-terracotta-dark text-xs uppercase tracking-wider font-medium transition-colors shadow-sm"
            >
              Add Whole Bean — ${selectedCoffee.price}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * CoffeeCard — Filterable Tasting Grid Card
 * Hovering a card lifts the coffee bag in 3D and releases rising aroma notes!
 */
function CoffeeCard({ coffee, onAddToCart, onOpenPortal }) {
  const [selectedGrind, setSelectedGrind] = useState(GRIND_OPTIONS[0]);
  const [justAdded, setJustAdded] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

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
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
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

        {/* Bag Illustration Stage — 3D Lift + Rising Aroma Notes on Hover */}
        <div
          role="button"
          tabIndex={0}
          data-cursor="TASTE · EXPLORE"
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
          style={{ perspective: '900px' }}
          className="cursor-pointer relative bg-cream-dark rounded-2xl py-7 px-4 mb-5 flex items-center justify-center border border-espresso/5 group-hover:border-terracotta/30 overflow-hidden transition-colors"
        >
          {/* Subtle Botanical Ring Seal behind Bag */}
          <div className="pointer-events-none absolute w-36 h-36 rounded-full border border-dashed border-terracotta/25 group-hover:rotate-45 transition-transform duration-700" />

          {/* Rising Aroma Steam & Floating Flavor Notes on Hover */}
          <AnimatePresence>
            {isCardHovered && (
              <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
                {/* Rising SVG Steam Wisps */}
                <motion.svg
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 0.55, y: -12 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  viewBox="0 0 120 80"
                  fill="none"
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-20 text-terracotta"
                >
                  <path
                    d="M38 72 C30 50, 48 34, 36 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                  />
                  <path
                    d="M62 76 C52 52, 72 30, 58 6"
                    stroke="#5E7461"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                  />
                  <path
                    d="M84 72 C76 52, 92 36, 80 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 4"
                  />
                </motion.svg>

                {/* Floating Aroma Note Badges Rising from the Bag */}
                {coffee.notes.map((note, idx) => {
                  const xPositions = ['14%', '50%', '78%'];
                  return (
                    <motion.span
                      key={note}
                      initial={{ opacity: 0, y: 28, scale: 0.82 }}
                      animate={{
                        opacity: [0, 1, 0.92],
                        y: -6 - idx * 8,
                        scale: 1,
                      }}
                      exit={{ opacity: 0, y: -18, scale: 0.85 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 16,
                        delay: idx * 0.07,
                      }}
                      style={{ left: xPositions[idx % xPositions.length] }}
                      className="absolute top-5 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-espresso/90 text-cream text-[10px] font-serif italic tracking-wide shadow-md border border-terracotta/50 whitespace-nowrap"
                    >
                      ✦ {note}
                    </motion.span>
                  );
                })}
              </div>
            )}
          </AnimatePresence>

          {/* 3D Tilted & Lifted Coffee Bag */}
          <motion.div
            animate={
              isCardHovered
                ? {
                    y: -10,
                    rotateX: 8,
                    rotateY: -10,
                    rotateZ: -2,
                    scale: 1.07,
                  }
                : {
                    y: 0,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                  }
            }
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative z-10"
          >
            <CoffeeBagSVG coffee={coffee} className="w-36 h-44" />
          </motion.div>

          <span className="absolute top-2.5 left-2.5 text-[10px] font-mono uppercase tracking-wider text-umber/70 bg-cream px-2 py-0.5 rounded-md border border-espresso/10">
            {coffee.lotCode}
          </span>

          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-cream bg-espresso px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-2.5 h-2.5 text-terracotta" />
            <span>Tasting Notes</span>
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
              data-cursor="TASTE · EXPLORE"
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
              {coffee.origin} · {coffee.elevation} · {coffee.process}
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

      {/* Grind Selector + Add to Bag + Tasting Sheet Trigger */}
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
            data-cursor="TASTE · ADD"
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
            data-cursor="TASTE · EXPLORE"
            onClick={() => {
              soundEngine.playPortalWipe();
              onOpenPortal(coffee);
            }}
            className="p-3.5 rounded-full border border-espresso/20 text-espresso hover:bg-espresso hover:text-cream transition-colors"
            title="Open Full-Screen Origin Tasting Sheet"
            aria-label={`Open ${coffee.name} tasting sheet`}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// Interactive 2D Terroir & Flavor Compass
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
            <span className="text-xs font-serif italic tracking-wider text-terracotta block">
              Cupping Table · Sensory Flavor Compass
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-cream mt-0.5">
              Terroir &amp; Extraction Coordinate Map
            </h3>
          </div>
          <span className="text-xs text-cream/55">
            Select any origin seal to inspect tasting notes
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

            <line x1="50" y1="295" x2="485" y2="295" stroke="#FBF8F3" strokeOpacity="0.35" />
            <line x1="50" y1="25" x2="50" y2="295" stroke="#FBF8F3" strokeOpacity="0.35" />

            <text x="65" y="48" fill="#C85A32" fontSize="10" fontFamily="Georgia, serif">
              Bright Bergamot &amp; Floral Clarity
            </text>
            <text x="295" y="48" fill="#5E7461" fontSize="10" fontFamily="Georgia, serif">
              Stone Fruit Sweetness &amp; Honeyed Structure
            </text>
            <text x="295" y="282" fill="#FBF8F3" fillOpacity="0.55" fontSize="10" fontFamily="Georgia, serif">
              Velvety Cacao &amp; Roasted Hazelnut Body
            </text>
            <text x="200" y="325" fill="#FBF8F3" fillOpacity="0.65" fontSize="10" fontFamily="sans-serif">
              BODY &amp; CARAMELIZATION DEPTH →
            </text>

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
                    fontFamily="sans-serif"
                  >
                    {lot.elevation} · {lot.process}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Right Selected Lot Card */}
      <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-cream/5 border border-cream/15 p-6 space-y-5">
        {selectedLot && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-terracotta">
                <span>{selectedLot.lotCode}</span>
                <span>{selectedLot.targetTds}</span>
              </div>

              <div className="flex items-center gap-4">
                <CoffeeBagSVG coffee={selectedLot} className="w-24 h-28 shrink-0" compact />
                <div>
                  <h4 className="font-serif text-2xl text-cream">
                    <ScrambleText text={selectedLot.name} triggerKey={selectedLot.id} />
                  </h4>
                  <p className="text-xs text-cream/65 mt-0.5">
                    {selectedLot.origin} · {selectedLot.elevation}
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
                    <span className="text-[9px] text-cream/45 block">{m.k}</span>
                    <span className="text-sm font-semibold text-terracotta">
                      {m.v} / 100
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t border-cream/10">
              <button
                type="button"
                data-cursor="TASTE · EXPLORE"
                onClick={() => {
                  soundEngine.playPortalWipe();
                  onOpenPortal(selectedLot);
                }}
                className="flex-1 py-3 px-4 rounded-full bg-terracotta text-cream text-xs uppercase tracking-wider hover:bg-terracotta-dark transition-colors flex items-center justify-center gap-2"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open Tasting Sheet</span>
              </button>
              <button
                type="button"
                data-cursor="TASTE · ADD"
                onClick={() => {
                  soundEngine.playSuccess();
                  onAddToCart(selectedLot, GRIND_OPTIONS[0]);
                }}
                className="py-3 px-4 rounded-full bg-cream/10 hover:bg-cream/20 text-cream text-xs uppercase tracking-wider transition-colors"
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
      <div id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Mode Switcher + Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-serif italic tracking-[0.18em] text-terracotta font-medium block mb-2">
              Single-Origin Micro-Lot Apothecary
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-espresso font-normal tracking-tight">
              Fanned Tasting Deck &amp; Harvest Collection
            </h2>
            <p className="text-umber/80 mt-3 text-base sm:text-lg">
              Unfold our physical hand of single-origin tasting cards as you scroll, or hover any
              bag in the apothecary grid below to lift the pouch in 3D and release its aroma notes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {/* View Mode Toggle */}
            <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-espresso text-cream text-xs uppercase tracking-wider">
              <button
                type="button"
                data-cursor="TASTE · DECK"
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
                <span>Tasting Deck &amp; Grid</span>
              </button>
              <button
                type="button"
                data-cursor="TASTE · COMPASS"
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
                <span>Flavor Compass</span>
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

        {/* Interactive Fanned Tasting Deck at the top of #shop */}
        {viewMode === 'reel' && (
          <FannedTastingDeckShowcase
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
