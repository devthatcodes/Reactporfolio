import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ArrowRight, Check } from 'lucide-react';

const PROJECT_TYPES = [
  {
    id: 'marketing',
    label: 'Marketing Site',
    baseMin: 22000,
    baseMax: 35000,
    baseWeeks: 5,
    desc: 'Editorial flagship, CMS & conversion-focused storytelling.',
  },
  {
    id: 'webapp',
    label: 'Web App',
    baseMin: 48000,
    baseMax: 80000,
    baseWeeks: 10,
    desc: 'Full-stack SaaS, auth, dashboards & real-time APIs.',
  },
  {
    id: 'design-system',
    label: 'Design System',
    baseMin: 30000,
    baseMax: 50000,
    baseWeeks: 7,
    desc: 'Tokenized Figma + React component library & docs.',
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    baseMin: 38000,
    baseMax: 65000,
    baseWeeks: 9,
    desc: 'Headless storefront, custom checkout & edge caching.',
  },
];

const TIMELINES = [
  { id: 'sprint', label: 'Sprint (4–6 wks)', multiplier: 1.18, weeksDelta: -2, note: 'Accelerated squad' },
  { id: 'standard', label: 'Standard (8–12 wks)', multiplier: 1.0, weeksDelta: 0, note: 'Balanced cadence' },
  { id: 'dedicated', label: 'Dedicated (16+ wks)', multiplier: 1.35, weeksDelta: 6, note: 'Embedded product team' },
];

const ADDONS = [
  { id: 'webgl', label: 'Motion & WebGL', cost: 8000 },
  { id: 'cms', label: 'Headless CMS', cost: 6000 },
  { id: 'telemetry', label: 'Perf & Telemetry', cost: 5000 },
];

function formatCurrency(num) {
  return `$${Math.round(num / 1000)}k`;
}

export default function ScopeEstimatorSection({ onLockEstimate }) {
  const [selectedType, setSelectedType] = useState('webapp');
  const [selectedTimeline, setSelectedTimeline] = useState('standard');
  const [selectedAddons, setSelectedAddons] = useState(['webgl']);

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const estimate = useMemo(() => {
    const typeObj = PROJECT_TYPES.find((t) => t.id === selectedType) || PROJECT_TYPES[0];
    const timeObj = TIMELINES.find((t) => t.id === selectedTimeline) || TIMELINES[1];
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const found = ADDONS.find((a) => a.id === id);
      return sum + (found ? found.cost : 0);
    }, 0);

    const min = (typeObj.baseMin + addonsTotal) * timeObj.multiplier;
    const max = (typeObj.baseMax + addonsTotal) * timeObj.multiplier;
    const estWeeks = Math.max(4, typeObj.baseWeeks + timeObj.weeksDelta);

    return {
      typeLabel: typeObj.label,
      timelineLabel: timeObj.label,
      rangeText: `${formatCurrency(min)} – ${formatCurrency(max)}`,
      weeksText: `~${estWeeks}–${estWeeks + 2} Weeks`,
      addonsLabels: selectedAddons
        .map((id) => ADDONS.find((a) => a.id === id)?.label)
        .filter(Boolean),
    };
  }, [selectedType, selectedTimeline, selectedAddons]);

  return (
    <section id="estimator" className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="text-xs font-mono uppercase tracking-[0.22em] text-lime block mb-3">
          // Interactive Estimator
        </span>
        <h2 className="font-display font-bold text-3xl sm:text-5xl tracking-tight text-ivory">
          Transparent scope &amp;
          <br />
          investment modeling.
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-6 items-stretch">
        {/* Controls Column */}
        <div className="lg:col-span-7 rounded-2xl bg-surface border border-ivory/10 p-6 sm:p-8 space-y-8">
          {/* Project Type */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ivory/55 block mb-3.5">
              1. Select Project Type
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {PROJECT_TYPES.map((type) => {
                const active = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`text-left p-4 rounded-xl border transition-all ${
                      active
                        ? 'bg-obsidian border-lime text-ivory shadow-[0_0_20px_rgba(200,255,50,0.1)]'
                        : 'bg-obsidian/40 border-ivory/10 text-ivory/75 hover:border-ivory/25'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-semibold text-base">{type.label}</span>
                      {active && <span className="w-2 h-2 rounded-full bg-lime" />}
                    </div>
                    <p className="text-xs text-ivory/55 leading-relaxed">{type.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ivory/55 block mb-3.5">
              2. Target Cadence
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              {TIMELINES.map((tl) => {
                const active = selectedTimeline === tl.id;
                return (
                  <button
                    key={tl.id}
                    type="button"
                    onClick={() => setSelectedTimeline(tl.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all ${
                      active
                        ? 'bg-obsidian border-lime text-ivory'
                        : 'bg-obsidian/40 border-ivory/10 text-ivory/75 hover:border-ivory/25'
                    }`}
                  >
                    <div className="font-display font-semibold text-sm">{tl.label}</div>
                    <div className="text-[11px] text-ivory/50 mt-0.5">{tl.note}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Modules */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ivory/55 block mb-3.5">
              3. Specialized Modules (Optional)
            </label>
            <div className="flex flex-wrap gap-2.5">
              {ADDONS.map((addon) => {
                const active = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-medium transition-all ${
                      active
                        ? 'bg-lime/15 border-lime text-lime'
                        : 'bg-obsidian/40 border-ivory/15 text-ivory/70 hover:border-ivory/30'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                    <span>{addon.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary Output Card */}
        <div className="lg:col-span-5 rounded-2xl bg-surface border border-ivory/15 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-lime/10 blur-[90px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ivory/55 mb-6">
              <Calculator className="w-4 h-4 text-lime" />
              <span>Estimated Investment</span>
            </div>

            <motion.div
              key={estimate.rangeText}
              initial={{ opacity: 0.5, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="font-display font-bold text-4xl sm:text-5xl text-lime tracking-tight mb-2"
            >
              {estimate.rangeText}
            </motion.div>
            <div className="text-sm text-ivory/70 mb-8">
              Estimated delivery window:{' '}
              <strong className="text-ivory font-medium">{estimate.weeksText}</strong>
            </div>

            <div className="space-y-3 border-t border-ivory/10 pt-5 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="text-ivory/55">Engagement</span>
                <span className="text-ivory font-medium">{estimate.typeLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ivory/55">Cadence</span>
                <span className="text-ivory font-medium">{estimate.timelineLabel}</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-ivory/55 shrink-0">Modules</span>
                <span className="text-ivory font-medium text-right">
                  {estimate.addonsLabels.length > 0
                    ? estimate.addonsLabels.join(', ')
                    : 'Core Scope Only'}
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <button
              type="button"
              onClick={() =>
                onLockEstimate({
                  projectType: estimate.typeLabel,
                  timeline: estimate.timelineLabel,
                  budget: estimate.rangeText,
                  modules: estimate.addonsLabels,
                })
              }
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-lime text-obsidian font-display font-semibold text-sm sm:text-base hover:bg-ivory transition-colors shadow-[0_0_28px_rgba(200,255,50,0.2)]"
            >
              Lock Estimate &amp; Start Project
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-ivory/45 text-center mt-3">
              Pre-fills your project brief. Fixed-bid proposals delivered within 48 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
