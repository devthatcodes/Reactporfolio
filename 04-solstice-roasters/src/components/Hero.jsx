import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Mountain, Sparkles, Sliders } from 'lucide-react';
import ScrambleText from './ScrambleText';
import soundEngine from '../utils/soundEngine';

const ROAST_CURVE_PRESETS = [
  {
    id: 0,
    label: 'Light Floral',
    batch: 'Batch #SR-408 · Yirgacheffe Halo',
    beanPath: 'M55 245 C105 292 160 282 225 225 C295 162 365 114 475 86',
    rorPath: 'M55 155 C130 120 220 148 305 188 C380 224 435 242 475 258',
    devTime: '13.8% (1:20)',
    totalRoast: '09m 42s',
    agtron: '68.4 Light',
    dropLabel: 'Drop · 198.2°C',
  },
  {
    id: 1,
    label: 'Medium Honey',
    batch: 'Batch #SR-412 · Tarrazú Honey',
    beanPath: 'M55 245 C105 288 158 274 222 214 C290 150 365 98 475 68',
    rorPath: 'M55 148 C130 116 220 142 305 182 C380 218 435 238 475 250',
    devTime: '16.5% (1:41)',
    totalRoast: '10m 15s',
    agtron: '61.2 Med-Light',
    dropLabel: 'Drop · 204.5°C',
  },
  {
    id: 2,
    label: 'Deep Espresso',
    batch: 'Batch #SR-419 · Antigua Volcán',
    beanPath: 'M55 245 C105 284 155 266 218 202 C288 138 365 84 475 52',
    rorPath: 'M55 142 C130 110 220 136 305 176 C380 212 435 232 475 244',
    devTime: '18.4% (1:56)',
    totalRoast: '10m 30s',
    agtron: '55.8 Medium',
    dropLabel: 'Drop · 208.6°C',
  },
];

export default function Hero({
  roastMode = 0,
  onSelectRoastMode,
  onPortalNavigate,
}) {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const preset = ROAST_CURVE_PRESETS[roastMode % ROAST_CURVE_PRESETS.length];

  return (
    <section className="relative overflow-hidden border-b border-espresso/10 paper-grain">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Editorial Column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 space-y-7"
          >
            {/* Seasonal Harvest Badge */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-4 py-1.5 rounded-full bg-sage-light border border-sage/25 text-sage text-xs sm:text-sm font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span>Autumn Harvest · Ethiopia &amp; Colombia</span>
              <span className="text-[11px] font-serif italic px-2.5 py-0.5 rounded-full bg-espresso text-cream">
                <ScrambleText
                  text={`Roast Profile · ${preset.label}`}
                  triggerKey={roastMode}
                />
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-espresso leading-[1.06]">
              Small-batch,{' '}
              <span className="italic text-terracotta font-light">high-altitude</span>{' '}
              single-origin coffee.
            </h1>

            <p className="text-base sm:text-lg text-umber/85 max-w-xl leading-relaxed">
              We source micro-lots grown above 1,650 meters and roast in 12kg cast-iron drums to
              preserve terroir—bright florals, stone fruit clarity, and natural caramelized
              sweetness.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#origins"
                data-cursor="TASTE · ORIGINS"
                onMouseEnter={() => soundEngine.playHover(1)}
                onClick={(e) => {
                  if (onPortalNavigate) {
                    e.preventDefault();
                    soundEngine.playPortalWipe();
                    onPortalNavigate({
                      id: 'origins',
                      code: 'Chapter I · Solstice Roastery',
                      title: 'Single-Origin Tasting Deck',
                      subtitle: 'Fanned Apothecary Cards · Seasonal Micro-Lots',
                      viewMode: 'reel',
                    });
                  }
                }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-terracotta text-cream font-medium text-sm sm:text-base hover:bg-terracotta-dark transition-all shadow-md hover:shadow-lg"
              >
                <span>Explore Single Origins</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#brew-guide"
                data-cursor="POUR · RITUAL"
                onMouseEnter={() => soundEngine.playHover(2)}
                onClick={(e) => {
                  if (onPortalNavigate) {
                    e.preventDefault();
                    soundEngine.playPortalWipe();
                    onPortalNavigate({
                      id: 'brew-guide',
                      code: 'Chapter III · Slow Bar',
                      title: 'Pour-Over Extraction Guide',
                      subtitle: 'Dialed-In Water Ratios & Carafe Percolation',
                    });
                  }
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-espresso/20 bg-cream text-espresso font-medium text-sm sm:text-base hover:bg-cream-dark transition-colors"
              >
                <span>Brewing Ratios</span>
              </a>
            </div>

            {/* Provenance Metrics */}
            <div className="pt-6 border-t border-espresso/10 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <div className="flex items-center gap-1.5 text-terracotta mb-1">
                  <Mountain className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Elevation</span>
                </div>
                <p className="font-serif text-xl sm:text-2xl text-espresso font-medium">
                  <ScrambleText text="2,150m" scrambleOnHover />
                  <span className="text-sm text-umber/60 font-sans ml-0.5">+</span>
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sage mb-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Roast Cycle</span>
                </div>
                <p className="font-serif text-xl sm:text-2xl text-espresso font-medium">
                  <ScrambleText text="48h" scrambleOnHover />{' '}
                  <span className="text-sm text-umber/60 font-sans">Ship</span>
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-umber mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Sourcing</span>
                </div>
                <p className="font-serif text-xl sm:text-2xl text-espresso font-medium">
                  <ScrambleText text="100%" scrambleOnHover />{' '}
                  <span className="text-sm text-umber/60 font-sans">Direct</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Animated Botanical & Interactive Roast-Curve Ledger Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl bg-cream-dark border border-espresso/12 p-6 sm:p-8 shadow-editorial overflow-hidden">
              {/* Top metadata bar + Roast Profile Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-umber/75 pb-4 border-b border-espresso/10">
                <span className="font-serif italic text-sm text-espresso">
                  <ScrambleText text={preset.batch} triggerKey={roastMode} />
                </span>
                <div className="inline-flex items-center gap-1 p-1 rounded-full bg-cream border border-espresso/10">
                  <Sliders className="w-3 h-3 text-terracotta ml-1.5 mr-0.5" />
                  {ROAST_CURVE_PRESETS.map((mode) => {
                    const active = roastMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        data-cursor={`ROAST · ${mode.label.toUpperCase()}`}
                        onClick={() => {
                          soundEngine.playRoastShift(mode.id);
                          if (onSelectRoastMode) onSelectRoastMode(mode.id);
                        }}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          active
                            ? 'bg-espresso text-cream'
                            : 'text-umber/70 hover:text-espresso'
                        }`}
                      >
                        {mode.label.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bespoke Botanical + Roast Curve SVG */}
              <div className="relative my-4">
                <svg
                  viewBox="0 0 540 360"
                  className="w-full h-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Animated coffee botanical and roast temperature curve illustration"
                >
                  {/* Warm Sun Backdrop */}
                  <motion.circle
                    cx="390"
                    cy="115"
                    r="72"
                    fill="#C85A32"
                    fillOpacity="0.12"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <circle cx="390" cy="115" r="44" fill="#C85A32" fillOpacity="0.18" />

                  {/* Grid lines for roast ledger */}
                  {[70, 130, 190, 250, 310].map((y) => (
                    <line
                      key={y}
                      x1="40"
                      y1={y}
                      x2="500"
                      y2={y}
                      stroke="#3A2A22"
                      strokeOpacity="0.09"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Mountain elevation silhouette */}
                  <path
                    d="M40 310 L135 215 L205 265 L310 165 L405 240 L500 185 L500 310 Z"
                    fill="#5E7461"
                    fillOpacity="0.12"
                  />

                  {/* Botanical Coffee Branch on left */}
                  <motion.g
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                  >
                    <path
                      d="M78 305 C88 245 106 185 142 125"
                      stroke="#5E7461"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M95 250 C70 238 64 214 82 204 C98 214 102 234 95 250 Z"
                      fill="#5E7461"
                      fillOpacity="0.85"
                    />
                    <path
                      d="M110 202 C136 190 152 170 134 156 C118 164 110 184 110 202 Z"
                      fill="#5E7461"
                      fillOpacity="0.72"
                    />
                    <path
                      d="M126 154 C104 140 100 116 118 106 C132 118 134 138 126 154 Z"
                      fill="#5E7461"
                      fillOpacity="0.9"
                    />
                    <circle cx="103" cy="228" r="6.5" fill="#C85A32" />
                    <circle cx="116" cy="218" r="5.5" fill="#A84623" />
                    <circle cx="128" cy="176" r="6" fill="#C85A32" />
                    <circle cx="139" cy="134" r="5" fill="#C85A32" />
                  </motion.g>

                  {/* Roast Curve (Bean Temp) */}
                  <motion.path
                    key={`bean-${roastMode}`}
                    d={preset.beanPath}
                    stroke="#C85A32"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, ease: 'easeInOut' }}
                  />

                  {/* Rate of Rise (RoR) secondary curve */}
                  <motion.path
                    key={`ror-${roastMode}`}
                    d={preset.rorPath}
                    stroke="#3A2A22"
                    strokeWidth="1.75"
                    strokeDasharray="5 5"
                    strokeOpacity="0.55"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, delay: 0.1, ease: 'easeInOut' }}
                  />

                  {/* Key Interactive Roast Milestones */}
                  <g
                    className="cursor-pointer"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedMilestone('Turning Point · 94°C · Drying Phase');
                    }}
                  >
                    <circle cx="132" cy="276" r="6" fill="#FBF8F3" stroke="#1E1612" strokeWidth="2.5" />
                    <text x="115" y="300" fill="#3A2A22" fontSize="11" fontFamily="DM Sans, sans-serif">
                      Turning Pt
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedMilestone('First Crack · 196°C · Floral Ester Bloom');
                    }}
                  >
                    <circle cx="342" cy="132" r="6.5" fill="#C85A32" stroke="#FBF8F3" strokeWidth="2.5" />
                    <text
                      x="315"
                      y="112"
                      fill="#C85A32"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="DM Sans, sans-serif"
                    >
                      First Crack (196°C)
                    </text>
                  </g>

                  <g
                    className="cursor-pointer"
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedMilestone(`${preset.dropLabel} · Cooling Tray Release`);
                    }}
                  >
                    <circle cx="475" cy="74" r="6.5" fill="#1E1612" stroke="#FBF8F3" strokeWidth="2.5" />
                    <text
                      x="402"
                      y="54"
                      fill="#1E1612"
                      fontSize="11"
                      fontWeight="600"
                      fontFamily="DM Sans, sans-serif"
                    >
                      {preset.dropLabel}
                    </text>
                  </g>
                </svg>

                {selectedMilestone && (
                  <div className="mt-2 px-3.5 py-2 rounded-xl bg-espresso text-cream text-xs font-serif italic flex items-center justify-between">
                    <span>Roaster&apos;s Note · {selectedMilestone}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedMilestone(null)}
                      className="text-terracotta hover:underline ml-2 not-italic font-sans text-[11px]"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Ledger Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-espresso/10 text-center sm:text-left">
                <div className="bg-cream/85 rounded-xl px-3.5 py-2.5 border border-espresso/5">
                  <span className="text-[11px] uppercase tracking-wider text-umber/60 block">
                    Development
                  </span>
                  <span className="font-serif text-base font-medium text-espresso">
                    <ScrambleText text={preset.devTime} triggerKey={roastMode} />
                  </span>
                </div>
                <div className="bg-cream/85 rounded-xl px-3.5 py-2.5 border border-espresso/5">
                  <span className="text-[11px] uppercase tracking-wider text-umber/60 block">
                    Total Roast
                  </span>
                  <span className="font-serif text-base font-medium text-espresso">
                    <ScrambleText text={preset.totalRoast} triggerKey={roastMode} />
                  </span>
                </div>
                <div className="bg-cream/85 rounded-xl px-3.5 py-2.5 border border-espresso/5">
                  <span className="text-[11px] uppercase tracking-wider text-umber/60 block">
                    Agtron Color
                  </span>
                  <span className="font-serif text-base font-medium text-terracotta">
                    <ScrambleText text={preset.agtron} triggerKey={roastMode} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
