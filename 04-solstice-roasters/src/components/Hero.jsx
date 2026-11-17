import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Mountain, Sparkles } from 'lucide-react';

export default function Hero() {
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
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-sage-light border border-sage/25 text-sage text-xs sm:text-sm font-medium tracking-wide">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span>Autumn Harvest • Ethiopia &amp; Colombia</span>
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
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-terracotta text-cream font-medium text-sm sm:text-base hover:bg-terracotta-dark transition-all shadow-md hover:shadow-lg"
              >
                <span>Explore Single Origins</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#brew-guide"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-espresso/20 text-espresso font-medium text-sm sm:text-base hover:bg-cream-dark transition-colors"
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
                  2,150m<span className="text-sm text-umber/60 font-sans ml-0.5">+</span>
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sage mb-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Roast Cycle</span>
                </div>
                <p className="font-serif text-xl sm:text-2xl text-espresso font-medium">
                  48h <span className="text-sm text-umber/60 font-sans">Ship</span>
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-umber mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Sourcing</span>
                </div>
                <p className="font-serif text-xl sm:text-2xl text-espresso font-medium">
                  100% <span className="text-sm text-umber/60 font-sans">Direct</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Animated Botanical & Roast-Curve Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl bg-cream-dark/75 border border-espresso/10 p-6 sm:p-8 shadow-editorial overflow-hidden">
              {/* Top metadata bar */}
              <div className="flex items-center justify-between text-xs text-umber/70 uppercase tracking-widest pb-4 border-b border-espresso/10">
                <span>Batch #SR-408 • Loring S15 Falcon</span>
                <span className="text-terracotta font-semibold">Live Roast Profile</span>
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

                  {/* Grid lines for roast telemetry */}
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
                    {/* Leaves */}
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
                    {/* Coffee Cherries */}
                    <circle cx="103" cy="228" r="6.5" fill="#C85A32" />
                    <circle cx="116" cy="218" r="5.5" fill="#A84623" />
                    <circle cx="128" cy="176" r="6" fill="#C85A32" />
                    <circle cx="139" cy="134" r="5" fill="#C85A32" />
                  </motion.g>

                  {/* Roast Curve (Bean Temp) */}
                  <motion.path
                    d="M55 245 C105 292 160 282 225 225 C295 162 365 110 475 78"
                    stroke="#C85A32"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, delay: 0.3, ease: 'easeInOut' }}
                  />

                  {/* Rate of Rise (RoR) secondary curve */}
                  <motion.path
                    d="M55 155 C130 120 220 148 305 188 C380 224 435 242 475 255"
                    stroke="#3A2A22"
                    strokeWidth="1.75"
                    strokeDasharray="5 5"
                    strokeOpacity="0.55"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.8, delay: 0.5, ease: 'easeInOut' }}
                  />

                  {/* Key Roast Milestones */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                  >
                    <circle cx="132" cy="276" r="5" fill="#FBF8F3" stroke="#1E1612" strokeWidth="2.5" />
                    <text x="115" y="300" fill="#3A2A22" fontSize="11" fontFamily="DM Sans, sans-serif">
                      Turning Pt
                    </text>
                  </motion.g>

                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4, duration: 0.4 }}
                  >
                    <circle cx="342" cy="132" r="5.5" fill="#C85A32" stroke="#FBF8F3" strokeWidth="2.5" />
                    <text x="322" y="114" fill="#C85A32" fontSize="11" fontWeight="600" fontFamily="DM Sans, sans-serif">
                      First Crack (196°C)
                    </text>
                  </motion.g>

                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.7, duration: 0.4 }}
                  >
                    <circle cx="475" cy="78" r="6" fill="#1E1612" stroke="#FBF8F3" strokeWidth="2.5" />
                    <text x="415" y="60" fill="#1E1612" fontSize="11" fontWeight="600" fontFamily="DM Sans, sans-serif">
                      Drop • 204°C
                    </text>
                  </motion.g>
                </svg>
              </div>

              {/* Bottom Telemetry Strip */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-espresso/10 text-center sm:text-left">
                <div className="bg-cream/80 rounded-xl px-3.5 py-2.5 border border-espresso/5">
                  <span className="text-[11px] uppercase tracking-wider text-umber/60 block">
                    Dev Time
                  </span>
                  <span className="font-serif text-base font-medium text-espresso">14.8% (1:28)</span>
                </div>
                <div className="bg-cream/80 rounded-xl px-3.5 py-2.5 border border-espresso/5">
                  <span className="text-[11px] uppercase tracking-wider text-umber/60 block">
                    Total Roast
                  </span>
                  <span className="font-serif text-base font-medium text-espresso">09m 42s</span>
                </div>
                <div className="bg-cream/80 rounded-xl px-3.5 py-2.5 border border-espresso/5">
                  <span className="text-[11px] uppercase tracking-wider text-umber/60 block">
                    Agtron Score
                  </span>
                  <span className="font-serif text-base font-medium text-terracotta">68 Light</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
