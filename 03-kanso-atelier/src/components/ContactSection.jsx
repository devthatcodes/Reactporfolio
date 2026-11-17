import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

const TYPOLOGIES = ['Residential', 'Cultural', 'Hospitality', 'Interior'];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    typology: 'Residential',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      location: '',
      typology: 'Residential',
      message: '',
    });
    setSubmitted(false);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-alabaster border-t border-charcoal/10">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
        {/* Left Column: Studio Info */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-taupe mb-3">
              <span className="font-mono text-bronze">04</span>
              <span>Inquiries</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal font-normal leading-tight">
              Begin a quiet conversation.
            </h2>
            <p className="text-sm text-taupe leading-relaxed mt-4 max-w-md font-light">
              We welcome private residential, cultural, and hospitality commissions worldwide.
              Please share the site context, approximate scale, and timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-charcoal/10 text-xs leading-relaxed">
            <div className="space-y-2">
              <p className="uppercase tracking-[0.2em] text-bronze">Kyoto Atelier</p>
              <p className="text-charcoal font-medium">Nakagyo-ku, Yanaginobanba</p>
              <p className="text-taupe">Kyoto 604-8006, Japan</p>
              <p className="text-taupe font-mono pt-1">+81 75 555 0148</p>
            </div>

            <div className="space-y-2">
              <p className="uppercase tracking-[0.2em] text-bronze">Copenhagen Atelier</p>
              <p className="text-charcoal font-medium">Bredgade 45, 2. sal</p>
              <p className="text-taupe">1260 København K, Denmark</p>
              <p className="text-taupe font-mono pt-1">+45 33 55 01 92</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-taupe">
            Direct correspondence:{' '}
            <a
              href="mailto:studio@kansoatelier.com"
              className="text-charcoal border-b border-charcoal/30 hover:border-bronze hover:text-bronze transition-colors pb-0.5"
            >
              studio@kansoatelier.com
            </a>
          </div>
        </div>

        {/* Right Column: Minimalist Form */}
        <div className="lg:col-span-7">
          <div className="bg-stone border border-charcoal/10 p-7 sm:p-10 md:p-12">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="py-12 space-y-6"
                >
                  <div className="w-11 h-11 border border-bronze/50 bg-alabaster flex items-center justify-center text-bronze">
                    <Check className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.22em] text-bronze">
                      Dossier Received
                    </p>
                    <h3 className="font-serif text-3xl text-charcoal">
                      Thank you, {formData.name}.
                    </h3>
                    <p className="text-sm text-taupe leading-relaxed max-w-md">
                      Our partners in Kyoto and Copenhagen review all new {formData.typology.toLowerCase()}{' '}
                      inquiries personally and will respond to{' '}
                      <span className="text-charcoal">{formData.email}</span> within three
                      business days.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs uppercase tracking-[0.2em] text-charcoal border-b border-charcoal/30 hover:border-bronze hover:text-bronze pb-1 transition-colors"
                  >
                    Submit another inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Typology Selector */}
                  <div className="space-y-3">
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-taupe">
                      Project Typology
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {TYPOLOGIES.map((type) => {
                        const active = formData.typology === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFormData({ ...formData, typology: type })}
                            className={`px-4 py-2 text-xs uppercase tracking-[0.16em] border transition-colors ${
                              active
                                ? 'bg-charcoal text-alabaster border-charcoal'
                                : 'bg-alabaster text-taupe border-charcoal/15 hover:border-charcoal/40 hover:text-charcoal'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inputs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="block text-[11px] uppercase tracking-[0.2em] text-taupe mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Kenji Takahashi"
                        className="w-full bg-transparent border-b border-charcoal/25 focus:border-bronze py-2.5 text-sm text-charcoal placeholder:text-taupe/50 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="block text-[11px] uppercase tracking-[0.2em] text-taupe mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@domain.com"
                        className="w-full bg-transparent border-b border-charcoal/25 focus:border-bronze py-2.5 text-sm text-charcoal placeholder:text-taupe/50 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-location"
                      className="block text-[11px] uppercase tracking-[0.2em] text-taupe mb-2"
                    >
                      Site Location &amp; Approximate Area
                    </label>
                    <input
                      id="inquiry-location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Aarhus, Denmark · ~300 sqm"
                      className="w-full bg-transparent border-b border-charcoal/25 focus:border-bronze py-2.5 text-sm text-charcoal placeholder:text-taupe/50 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-message"
                      className="block text-[11px] uppercase tracking-[0.2em] text-taupe mb-2"
                    >
                      Project Brief *
                    </label>
                    <textarea
                      id="inquiry-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the landscape, spatial aspirations, and desired schedule..."
                      className="w-full bg-transparent border-b border-charcoal/25 focus:border-bronze py-2.5 text-sm text-charcoal placeholder:text-taupe/50 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <span className="text-[11px] text-taupe">* Required fields</span>
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-3 px-7 py-3.5 bg-charcoal text-alabaster text-xs uppercase tracking-[0.2em] hover:bg-bronze transition-colors duration-300"
                    >
                      <span>Send Inquiry</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
