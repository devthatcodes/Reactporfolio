import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Sparkles } from 'lucide-react';
import { COFFEES, GRIND_OPTIONS } from '../data/coffees';
import CoffeeBagSVG from './CoffeeBagSVG';

const ROAST_FILTERS = ['All', 'Light', 'Medium-Light', 'Medium'];

function TastingBar({ label, value, colorClass }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] uppercase tracking-wider font-medium text-umber/75">
        <span>{label}</span>
        <span>{value}%</span>
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

function CoffeeCard({ coffee, onAddToCart }) {
  const [selectedGrind, setSelectedGrind] = useState(GRIND_OPTIONS[0]);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(coffee, selectedGrind);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
      className="group bg-cream border border-espresso/12 rounded-3xl p-6 flex flex-col justify-between shadow-card hover:shadow-editorial transition-shadow duration-300"
    >
      <div>
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

        {/* Bag Illustration Stage */}
        <div className="relative bg-cream-dark/60 rounded-2xl py-6 px-4 mb-5 flex items-center justify-center border border-espresso/5 overflow-hidden">
          <motion.div
            whileHover={{ y: -4, rotate: -1.5 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <CoffeeBagSVG coffee={coffee} className="w-36 h-44" />
          </motion.div>
          <span className="absolute bottom-3 right-3 text-[11px] font-medium text-umber/60 bg-cream/90 px-2.5 py-0.5 rounded-full border border-espresso/10">
            {coffee.weight}
          </span>
        </div>

        {/* Title & Origin Metadata */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-serif text-2xl font-medium text-espresso leading-tight">
              {coffee.name}
            </h3>
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

      {/* Grind Selector + Add to Bag */}
      <div className="space-y-3 pt-2 border-t border-espresso/10">
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
                  onClick={() => setSelectedGrind(grind)}
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

        <motion.button
          type="button"
          onClick={handleAdd}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3.5 px-5 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm ${
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
      </div>
    </motion.article>
  );
}

export default function CoffeeShop({ onAddToCart }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredCoffees =
    activeFilter === 'All'
      ? COFFEES
      : COFFEES.filter((c) => c.roastCategory === activeFilter);

  return (
    <section id="origins" className="py-16 sm:py-24 border-b border-espresso/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.22em] text-terracotta font-semibold block mb-2.5">
              Single-Origin Roasts
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-espresso font-normal tracking-tight">
              Seasonal Harvest &amp; Flavor Explorer
            </h2>
            <p className="text-umber/80 mt-3 text-base sm:text-lg">
              Roasted to order every Monday and Thursday. Select your preferred grind and explore
              each lot&apos;s sensory balance.
            </p>
          </div>

          {/* Roast Profile Filter */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-cream-dark border border-espresso/10 self-start md:self-auto">
            {ROAST_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
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
        </div>

        {/* Coffee Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCoffees.map((coffee) => (
              <CoffeeCard key={coffee.id} coffee={coffee} onAddToCart={onAddToCart} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
