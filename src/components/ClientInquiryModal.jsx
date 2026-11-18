import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Sparkles, ArrowRight, Calendar, ShieldCheck } from 'lucide-react';
import soundEngine from '../utils/soundEngine';

const PROJECT_TYPES = [
  'Custom Business / Brand Website',
  'Web App / SaaS Platform',
  'E-Commerce Storefront',
  'Website Redesign & Speed Overhaul',
  'High-Converting Landing Page',
];

const BUDGET_RANGES = [
  '$1,500 – $3,000',
  '$3,000 – $6,000',
  '$6,000 – $12,000',
  '$12,000+',
];

const TIMELINES = [
  'ASAP (2–3 Weeks)',
  'Standard (4–6 Weeks)',
  'Flexible / Planning Ahead',
];

export default function ClientInquiryModal({ isOpen, onClose, prefill = null }) {
  const [selectedType, setSelectedType] = useState(PROJECT_TYPES[0]);
  const [selectedBudget, setSelectedBudget] = useState(BUDGET_RANGES[1]);
  const [selectedTimeline, setSelectedTimeline] = useState(TIMELINES[1]);
  const [inspiration, setInspiration] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefill) {
      if (prefill.type) setSelectedType(prefill.type);
      if (prefill.budget) setSelectedBudget(prefill.budget);
      if (prefill.inspiration) setInspiration(prefill.inspiration);
      setSubmitted(false);
    }
  }, [prefill, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    soundEngine.playClick();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="client-inquiry-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-[#0D0E12] border border-white/15 p-6 sm:p-9 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative my-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Inquiry Modal"
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-400/15 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                  Project Inquiry Received!
                </h3>
                <p className="text-sm sm:text-base text-white/70 max-w-md mx-auto leading-relaxed">
                  Thanks <strong className="text-white">{form.name}</strong>! Deontae has received
                  your brief for a <strong className="text-[#E2D9C8]">{selectedType}</strong>
                  {inspiration ? ` (inspired by ${inspiration})` : ''} and will reply to{' '}
                  <strong className="text-white">{form.email}</strong> within 24 hours with next
                  steps and a clear proposal.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-full bg-[#E2D9C8] text-[#060608] font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
                  >
                    Back to Portfolio
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>WORK WITH DEONTAE · FAST 24HR PROPOSAL</span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    Let&apos;s get your website built.
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">
                    Tell me what you need below and I&apos;ll send over a clear scope, timeline, and
                    quote.
                  </p>
                </div>

                {inspiration && (
                  <div className="flex items-center justify-between rounded-xl bg-white/[0.04] border border-[#E2D9C8]/30 px-4 py-2.5 text-xs">
                    <span className="text-white/75">
                      Selected Style Inspiration:{' '}
                      <strong className="text-[#E2D9C8]">{inspiration}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setInspiration('')}
                      className="text-white/45 hover:text-white underline ml-3"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* 1. What do you need built? */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-white/55 block mb-2.5">
                    1. What do you need built?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_TYPES.map((type) => {
                      const active = selectedType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSelectedType(type)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                            active
                              ? 'bg-[#E2D9C8] text-[#060608] border-[#E2D9C8] font-bold'
                              : 'bg-[#060608] text-white/70 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Budget & Timeline */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-white/55 block mb-2">
                      2. Estimated Budget
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {BUDGET_RANGES.map((b) => {
                        const active = selectedBudget === b;
                        return (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setSelectedBudget(b)}
                            className={`px-2.5 py-2 rounded-xl text-xs font-mono border transition-colors ${
                              active
                                ? 'bg-white text-[#060608] border-white font-bold'
                                : 'bg-[#060608] text-white/65 border-white/10 hover:border-white/25'
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-white/55 block mb-2">
                      3. Target Timeline
                    </label>
                    <div className="space-y-1.5">
                      {TIMELINES.map((tl) => {
                        const active = selectedTimeline === tl;
                        return (
                          <button
                            key={tl}
                            type="button"
                            onClick={() => setSelectedTimeline(tl)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                              active
                                ? 'bg-white/10 text-white border-[#E2D9C8] font-semibold'
                                : 'bg-[#060608] text-white/60 border-white/10 hover:border-white/25'
                            }`}
                          >
                            {tl}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Contact Info */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs text-white/65 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Jordan Taylor"
                      className="w-full rounded-xl bg-[#060608] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E2D9C8]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/65 block mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                      placeholder="jordan@business.com"
                      className="w-full rounded-xl bg-[#060608] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E2D9C8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/65 block mb-1">
                    Tell me about your business or website goals
                  </label>
                  <textarea
                    rows={3}
                    value={form.details}
                    onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
                    placeholder="What does your business do, and what would make this new website a huge win for you?"
                    className="w-full rounded-xl bg-[#060608] border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E2D9C8]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No obligation · Direct response within 24 hours</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E2D9C8] text-[#060608] font-display font-bold text-xs uppercase tracking-[0.14em] hover:bg-white transition-colors shadow-lg"
                  >
                    <span>Send Website Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
