import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, Mail, MapPin, Sparkles } from 'lucide-react';

export default function TastingRoomAndSub() {
  // Tasting Room Cupping Reservation state
  const [cuppingSlot, setCuppingSlot] = useState('Fri • 10:00 AM');
  const [reservedSlot, setReservedSlot] = useState(null);

  // Subscription state
  const [frequency, setFrequency] = useState('biweekly');
  const [bags, setBags] = useState(2);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const tastingRef = useRef(null);
  const subRef = useRef(null);

  const { scrollYProgress: tastingScroll } = useScroll({
    target: tastingRef,
    offset: ['start end', 'end start'],
  });
  const smoothTasting = useSpring(tastingScroll, { damping: 32, stiffness: 220 });

  const archCardY = useTransform(smoothTasting, [0, 0.5, 1], [40, 0, -35]);
  const sunParallaxY = useTransform(smoothTasting, [0, 1], [24, -24]);
  const infoColY = useTransform(smoothTasting, [0, 0.5, 1], [60, 0, -45]);

  const { scrollYProgress: subScroll } = useScroll({
    target: subRef,
    offset: ['start end', 'end start'],
  });
  const smoothSub = useSpring(subScroll, { damping: 32, stiffness: 220 });
  const subScale = useTransform(smoothSub, [0, 0.45, 1], [0.95, 1, 0.98]);
  const ringRotate = useTransform(smoothSub, [0, 1], [0, 160]);

  const basePricePerBag = 21;
  const discountedPerBag = (basePricePerBag * 0.85).toFixed(2);
  const totalSubPrice = (discountedPerBag * bags).toFixed(2);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  };

  return (
    <>
      {/* Tasting Room Section */}
      <section
        ref={tastingRef}
        id="tasting-room"
        className="py-16 sm:py-24 border-b border-espresso/10 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Architectural Tasting Bar SVG with GPU Scroll Parallax */}
            <motion.div
              style={{
                y: archCardY,
                willChange: 'transform',
              }}
              className="lg:col-span-6"
            >
              <div className="rounded-3xl bg-cream-dark border border-espresso/12 p-6 sm:p-8 shadow-editorial">
                <svg
                  viewBox="0 0 480 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-auto"
                  aria-label="Solstice Roasters architectural tasting room illustration"
                >
                  {/* Warm Arch Window */}
                  <path
                    d="M140 250V115C140 60 185 30 240 30C295 30 340 60 340 115V250H140Z"
                    fill="#FBF8F3"
                    stroke="#1E1612"
                    strokeOpacity="0.16"
                    strokeWidth="2"
                  />
                  {/* Scroll-Parallax Sunburst through window */}
                  <motion.g style={{ y: sunParallaxY }}>
                    <circle cx="240" cy="118" r="36" fill="#C85A32" fillOpacity="0.18" />
                    <circle cx="240" cy="118" r="20" fill="#C85A32" fillOpacity="0.34" />
                  </motion.g>
                  {/* Hanging pendant lights */}
                  <line x1="185" y1="30" x2="185" y2="92" stroke="#1E1612" strokeWidth="1.5" />
                  <path d="M172 92H198L192 104H178L172 92Z" fill="#3A2A22" />
                  <line x1="295" y1="30" x2="295" y2="92" stroke="#1E1612" strokeWidth="1.5" />
                  <path d="M282 92H308L302 104H288L282 92Z" fill="#3A2A22" />

                  {/* Tasting Bar Counter */}
                  <rect x="48" y="210" width="384" height="16" rx="4" fill="#3A2A22" />
                  <rect x="58" y="226" width="364" height="58" fill="#E8DFD3" stroke="#1E1612" strokeOpacity="0.12" />

                  {/* Pour-over Stand & Cupping Bowls on Counter */}
                  <rect x="112" y="172" width="44" height="38" fill="none" stroke="#1E1612" strokeWidth="2" />
                  <path d="M122 172H146L140 188H128L122 172Z" fill="#C85A32" />
                  <rect x="126" y="196" width="16" height="14" rx="2" fill="#FBF8F3" stroke="#1E1612" strokeWidth="1.5" />

                  {/* Cupping Bowls */}
                  {[215, 255, 295].map((x) => (
                    <g key={x}>
                      <path
                        d={`M${x} 198H${x + 28}L${x + 23} 210H${x + 5}L${x} 198Z`}
                        fill="#FBF8F3"
                        stroke="#1E1612"
                        strokeWidth="1.5"
                      />
                    </g>
                  ))}

                  {/* Potted Olive / Coffee Plant */}
                  <path d="M352 184H380L376 210H356L352 184Z" fill="#C85A32" />
                  <path d="M366 184C366 165 360 150 352 138" stroke="#5E7461" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M366 184C368 164 378 148 386 140" stroke="#5E7461" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="352" cy="138" r="8" fill="#5E7461" fillOpacity="0.8" />
                  <circle cx="386" cy="140" r="9" fill="#5E7461" fillOpacity="0.65" />
                  <circle cx="368" cy="148" r="7" fill="#5E7461" fillOpacity="0.9" />
                </svg>
              </div>
            </motion.div>

            {/* Right Info & Cupping Reservation with Differential Parallax */}
            <motion.div
              style={{ y: infoColY }}
              className="lg:col-span-6 space-y-6"
            >
              <span className="text-xs uppercase tracking-[0.22em] text-terracotta font-semibold block">
                Portland Roastery &amp; Tasting Room
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-espresso font-normal tracking-tight">
                Pull up a stool at the slow bar.
              </h2>
              <p className="text-umber/85 text-base sm:text-lg leading-relaxed">
                Every Friday and Saturday morning we host guided single-origin cuppings right next
                to our Loring roaster. Taste four seasonal lots side by side and chat harvest
                data with our head roaster.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-dark/60 border border-espresso/10">
                  <MapPin className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-base font-medium text-espresso">
                      SE Division Roastery
                    </h4>
                    <p className="text-xs text-umber/75 mt-0.5">
                      1420 SE Alder St, Portland, OR 97214
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-cream-dark/60 border border-espresso/10">
                  <Clock className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-serif text-base font-medium text-espresso">Bar Hours</h4>
                    <p className="text-xs text-umber/75 mt-0.5">
                      Daily 7:00 AM – 4:00 PM • Cuppings Fri/Sat
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Cupping Slot Picker */}
              <div className="p-5 rounded-2xl bg-cream-dark/70 border border-espresso/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-umber flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-terracotta" />
                    Reserve a Complimentary Cupping Seat
                  </span>
                </div>

                {reservedSlot ? (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-sage-light border border-sage/30 text-sage">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Seat reserved for {reservedSlot}. See you at the bar!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReservedSlot(null)}
                      className="text-xs underline font-semibold"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      {['Fri • 10:00 AM', 'Sat • 10:30 AM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setCuppingSlot(slot)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors ${
                            cuppingSlot === slot
                              ? 'bg-espresso text-cream border-espresso'
                              : 'bg-cream text-umber border-espresso/15 hover:border-espresso/40'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setReservedSlot(cuppingSlot)}
                      className="px-6 py-2.5 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors shrink-0"
                    >
                      Reserve Seat
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Subscription Banner with GPU Scroll Scale */}
      <section
        ref={subRef}
        id="subscribe"
        className="py-16 sm:py-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            style={{
              scale: subScale,
              willChange: 'transform',
            }}
            className="relative rounded-3xl bg-espresso text-cream p-8 sm:p-12 lg:p-14 overflow-hidden shadow-editorial"
          >
            {/* Scroll-rotated decorative sun ring */}
            <motion.div
              style={{ rotate: ringRotate }}
              className="absolute -right-24 -top-24 w-72 h-72 rounded-full border border-terracotta/35 border-dashed pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-terracotta/10 pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-terracotta/20 text-terracotta text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Roaster&apos;s Choice Subscription • Save 15%</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
                  Never run out of fresh-roasted mornings.
                </h2>
                <p className="text-cream/75 text-base sm:text-lg max-w-xl">
                  Receive our newest micro-lot harvests roasted to order and shipped free within 48
                  hours. Pause, skip, or swap origins anytime.
                </p>

                {/* Interactive Plan Configurator */}
                <div className="pt-3 flex flex-wrap gap-4 items-center">
                  <div className="inline-flex rounded-full bg-cream/10 p-1">
                    {[
                      { id: 'biweekly', label: 'Every 2 Weeks' },
                      { id: 'monthly', label: 'Monthly' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFrequency(opt.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          frequency === opt.id
                            ? 'bg-terracotta text-cream'
                            : 'text-cream/75 hover:text-cream'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="inline-flex rounded-full bg-cream/10 p-1">
                    {[1, 2].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setBags(count)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          bags === count
                            ? 'bg-cream text-espresso'
                            : 'text-cream/75 hover:text-cream'
                        }`}
                      >
                        {count} {count === 1 ? 'Bag' : 'Bags'}
                      </button>
                    ))}
                  </div>

                  <span className="font-serif text-xl text-cream">
                    ${totalSubPrice}
                    <span className="text-xs font-sans text-cream/60 ml-1">
                      / {frequency === 'biweekly' ? '2 wks' : 'mo'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Right Email Form */}
              <div className="lg:col-span-5">
                {subscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-cream/10 border border-sage/40 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-sage font-semibold">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Welcome to the Roaster&apos;s Dispatch</span>
                    </div>
                    <p className="text-sm text-cream/80">
                      We sent your 15% subscriber invite ({bags}{' '}
                      {bags === 1 ? 'bag' : 'bags'},{' '}
                      {frequency === 'biweekly' ? 'every 2 weeks' : 'monthly'}) to{' '}
                      <strong className="text-cream">{email}</strong>.
                    </p>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={handleSubscribe}
                    className="p-6 rounded-2xl bg-cream/10 border border-cream/15 space-y-3"
                  >
                    <label htmlFor="sub-email" className="block text-xs uppercase tracking-wider text-cream/75 font-semibold">
                      Start Your {bags}-Bag {frequency === 'biweekly' ? 'Biweekly' : 'Monthly'} Plan
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-cream/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="sub-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@domain.com"
                          className="w-full pl-10 pr-4 py-3 rounded-full bg-cream text-espresso placeholder:text-umber/50 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-full bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-dark transition-colors shrink-0"
                      >
                        Subscribe
                      </button>
                    </div>
                    <p className="text-[11px] text-cream/55">
                      Free shipping included. Cancel or adjust grind anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
