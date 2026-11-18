import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  Flame,
  Compass,
  Mountain,
  Sparkles,
  Activity,
} from 'lucide-react';
import { GRIND_OPTIONS } from '../data/coffees';
import CoffeeBagSVG from './CoffeeBagSVG';
import ScrambleText from './ScrambleText';
import soundEngine from '../utils/soundEngine';

const RADAR_AXES = [
  { key: 'acidity', label: 'ACIDITY', angle: -90 },
  { key: 'floral', label: 'FLORAL', angle: -30 },
  { key: 'clarity', label: 'CLARITY', angle: 30 },
  { key: 'sweetness', label: 'SWEETNESS', angle: 90 },
  { key: 'body', label: 'BODY', angle: 150 },
  { key: 'cocoa', label: 'COCOA', angle: 210 },
];

function SensoryRadarSVG({ sensory, accentColor = '#C85A32' }) {
  const cx = 140;
  const cy = 140;
  const maxR = 88;

  const getPoint = (angleDeg, pct) => {
    const rad = (angleDeg * Math.PI) / 180;
    const r = (pct / 100) * maxR;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const polygonPoints = RADAR_AXES.map((axis) => {
    const val = sensory[axis.key] || 70;
    const pt = getPoint(axis.angle, val);
    return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg
      viewBox="0 0 280 280"
      className="w-full max-w-[270px] h-auto mx-auto"
      aria-label="6-Axis Sensory Flavor Radar"
    >
      {/* Concentric web rings */}
      {[25, 50, 75, 100].map((ring) => (
        <polygon
          key={ring}
          points={RADAR_AXES.map((a) => {
            const p = getPoint(a.angle, ring);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          }).join(' ')}
          fill="none"
          stroke="#FBF8F3"
          strokeOpacity={ring === 100 ? 0.25 : 0.1}
          strokeDasharray={ring === 100 ? 'none' : '2 2'}
        />
      ))}

      {/* Axis spokes & labels */}
      {RADAR_AXES.map((axis) => {
        const end = getPoint(axis.angle, 100);
        const labelPt = getPoint(axis.angle, 124);
        const val = sensory[axis.key] || 70;
        const valPt = getPoint(axis.angle, val);

        return (
          <g key={axis.key}>
            <line
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="#FBF8F3"
              strokeOpacity="0.16"
            />
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FBF8F3"
              fillOpacity="0.8"
              fontSize="8.5"
              fontFamily="monospace"
              letterSpacing="1"
            >
              {axis.label} ({val})
            </text>
            <circle
              cx={valPt.x}
              cy={valPt.y}
              r="4"
              fill={accentColor}
              stroke="#FBF8F3"
              strokeWidth="1.5"
            />
          </g>
        );
      })}

      {/* Filled sensory polygon */}
      <motion.polygon
        key={polygonPoints}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        points={polygonPoints}
        fill={accentColor}
        fillOpacity="0.32"
        stroke={accentColor}
        strokeWidth="2.2"
      />
    </svg>
  );
}

export default function OriginPortalModal({
  coffee,
  coffees = [],
  onClose,
  onSelectCoffee,
  onAddToCart,
}) {
  const [selectedGrind, setSelectedGrind] = useState(GRIND_OPTIONS[0]);
  const [phaseIdx, setPhaseIdx] = useState(4); // Default to First Crack
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    setPhaseIdx(4);
    setJustAdded(false);
  }, [coffee?.id]);

  useEffect(() => {
    if (!coffee) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [coffee, onClose]);

  if (!coffee) return null;

  const currentIdx = coffees.findIndex((c) => c.id === coffee.id);
  const prevCoffee = coffees[(currentIdx - 1 + coffees.length) % coffees.length];
  const nextCoffee = coffees[(currentIdx + 1) % coffees.length];

  const roastSteps = coffee.roastCurve || [];
  const activeRoastStep = roastSteps[phaseIdx] || roastSteps[0] || {
    sec: 510,
    phase: 'First Crack',
    temp: 196.4,
    ror: 6.2,
    volatile: 'Peak floral & citrus ester release',
  };

  const handleAdd = () => {
    soundEngine.playSuccess();
    onAddToCart(coffee, selectedGrind);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="origin-portal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[75] bg-espresso/95 backdrop-blur-xl text-cream overflow-y-auto"
      >
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-between">
          {/* Top Portal Telemetry Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-cream/15">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-terracotta/20 border border-terracotta/50 text-terracotta text-xs font-mono uppercase tracking-widest">
                {coffee.lotCode || 'ORIGIN PORTAL'}
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-cream/60">
                GPS // {coffee.coordinates || '6.1667° N, 38.2000° E'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-cursor="PREV LOT"
                onClick={() => {
                  soundEngine.playPortalWipe();
                  onSelectCoffee(prevCoffee);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cream/10 hover:bg-cream/20 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev Lot</span>
              </button>
              <button
                type="button"
                data-cursor="NEXT LOT"
                onClick={() => {
                  soundEngine.playPortalWipe();
                  onSelectCoffee(nextCoffee);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-cream/10 hover:bg-cream/20 text-xs font-mono uppercase tracking-wider transition-colors"
              >
                <span>Next Lot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                data-cursor="CLOSE PORTAL"
                onClick={() => {
                  soundEngine.playClick();
                  onClose();
                }}
                className="ml-2 p-2.5 rounded-full bg-terracotta text-cream hover:bg-terracotta-dark transition-colors"
                aria-label="Close Origin Portal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center 3-Column Sensory Takeover */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-center">
            {/* Left Column: Lot Provenance + Bag Showcase + Direct Add */}
            <div className="lg:col-span-4 space-y-5">
              <div className="relative rounded-3xl bg-cream/5 border border-cream/15 p-6 flex flex-col items-center text-center overflow-hidden">
                <div className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-cream/60 mb-3">
                  <span>{coffee.badge}</span>
                  <span className="text-terracotta">{coffee.agtron || '66.0 Agtron'}</span>
                </div>

                <motion.div
                  key={coffee.id}
                  initial={{ scale: 0.88, rotate: -4, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="my-2"
                >
                  <CoffeeBagSVG coffee={coffee} className="w-40 h-48" />
                </motion.div>

                <h2 className="font-serif text-3xl sm:text-4xl text-cream mt-2">
                  <ScrambleText text={coffee.name} triggerKey={coffee.id} duration={420} />
                </h2>
                <p className="text-xs font-mono uppercase tracking-widest text-terracotta mt-1">
                  {coffee.origin} • {coffee.elevation} • {coffee.process}
                </p>
                <p className="text-sm text-cream/75 mt-3 leading-relaxed">
                  {coffee.description}
                </p>

                {/* Tasting Notes */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {coffee.notes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1 rounded-full bg-terracotta/20 border border-terracotta/40 text-cream text-xs font-medium"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Grind & Add to Bag */}
              <div className="rounded-3xl bg-cream/5 border border-cream/15 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-cream/60">
                    SELECT GRIND CALIBRATION
                  </span>
                  <span className="font-serif text-2xl text-cream">${coffee.price}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {GRIND_OPTIONS.map((grind) => (
                    <button
                      key={grind}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedGrind(grind);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedGrind === grind
                          ? 'bg-terracotta text-cream border-terracotta'
                          : 'bg-cream/5 text-cream/70 border-cream/15 hover:border-cream/40'
                      }`}
                    >
                      {grind}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  data-cursor="ADD MICRO-LOT"
                  onClick={handleAdd}
                  className={`w-full py-3.5 px-6 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    justAdded
                      ? 'bg-sage text-cream'
                      : 'bg-terracotta text-cream hover:bg-terracotta-dark'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Roastery Bag</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>
                        Add {coffee.name} ({selectedGrind}) — ${coffee.price}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Middle Column: 6-Axis Sensory Radar Wheel & Provenance Metrics */}
            <div className="lg:col-span-4 space-y-5">
              <div className="rounded-3xl bg-cream/5 border border-cream/15 p-6 text-center">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-cream/60 mb-2">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                    6-AXIS FLAVOR SPECTROGRAPHY
                  </span>
                  <span>{coffee.targetTds || '1.40% TDS'}</span>
                </div>

                <SensoryRadarSVG
                  sensory={coffee.sensory}
                  accentColor={coffee.palette?.accent || '#C85A32'}
                />

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-cream/10 text-left">
                  <div className="p-2.5 rounded-xl bg-cream/5">
                    <span className="text-[10px] font-mono uppercase text-cream/45 block">
                      PRODUCER
                    </span>
                    <span className="text-xs text-cream font-medium line-clamp-1">
                      {coffee.producer || 'Direct Smallholder'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cream/5">
                    <span className="text-[10px] font-mono uppercase text-cream/45 block">
                      VARIETAL
                    </span>
                    <span className="text-xs text-cream font-medium">{coffee.varietal}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-cream/5">
                    <span className="text-[10px] font-mono uppercase text-cream/45 block">
                      HARVEST
                    </span>
                    <span className="text-xs text-cream font-medium line-clamp-1">
                      {coffee.harvestWindow || 'Peak Crop'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Roast Curve Temperature Scrubber */}
            <div className="lg:col-span-4 space-y-5">
              <div className="rounded-3xl bg-cream/5 border border-cream/15 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-terracotta inline-flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    INTERACTIVE ROAST CURVE SCRUBBER
                  </span>
                  <span className="text-xs font-mono text-cream/60">
                    DEV: {coffee.devRatio || '14.8%'}
                  </span>
                </div>

                {/* Live Telemetry Readout Box */}
                <div className="p-4 rounded-2xl bg-espresso border border-terracotta/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-terracotta">
                      PHASE // {activeRoastStep.phase}
                    </span>
                    <span className="text-xs font-mono text-cream/60 tabular-nums">
                      T+{activeRoastStep.sec}s
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cream/45 block">
                        BEAN PROBE TEMP
                      </span>
                      <span className="font-serif text-3xl text-cream tabular-nums">
                        {activeRoastStep.temp}°C
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cream/45 block">
                        RATE OF RISE (RoR)
                      </span>
                      <span className="font-serif text-3xl text-sage tabular-nums">
                        {activeRoastStep.ror}°C/m
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-cream/10">
                    <span className="text-[10px] font-mono uppercase text-cream/45 block">
                      ACTIVE VOLATILE AROMATICS
                    </span>
                    <span className="text-xs text-cream/90 font-medium">
                      {activeRoastStep.volatile}
                    </span>
                  </div>
                </div>

                {/* Interactive Range Scrubber */}
                <div className="space-y-2">
                  <label
                    htmlFor="roast-phase-scrubber"
                    className="flex justify-between text-[11px] font-mono uppercase text-cream/65"
                  >
                    <span>Scrub Drum Timeline</span>
                    <span>
                      Step {phaseIdx + 1} / {roastSteps.length}
                    </span>
                  </label>
                  <input
                    id="roast-phase-scrubber"
                    type="range"
                    min={0}
                    max={Math.max(0, roastSteps.length - 1)}
                    value={phaseIdx}
                    onChange={(e) => {
                      soundEngine.playHover(Number(e.target.value));
                      setPhaseIdx(Number(e.target.value));
                    }}
                    className="w-full accent-terracotta cursor-pointer"
                  />
                </div>

                {/* Milestone Phase Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {roastSteps.map((step, idx) => (
                    <button
                      key={step.phase}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setPhaseIdx(idx);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        phaseIdx === idx
                          ? 'bg-terracotta/25 border-terracotta text-cream'
                          : 'bg-cream/5 border-cream/10 text-cream/65 hover:border-cream/30'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span>0{idx + 1}</span>
                        <span>{step.temp}°C</span>
                      </div>
                      <div className="text-xs font-medium truncate mt-0.5">{step.phase}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Footer */}
          <div className="pt-4 border-t border-cream/15 flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono uppercase tracking-widest text-cream/50">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-terracotta" />
                ELEVATION: {coffee.elevation}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sage" />
                PROCESS: {coffee.process}
              </span>
            </div>
            <span>PRESS [ESC] OR CLICK X TO EXIT ORIGIN PORTAL</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
