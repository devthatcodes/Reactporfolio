import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

const PROJECT_OPTIONS = [
  'Marketing Site',
  'Web App',
  'Design System',
  'E-Commerce',
  'Brand & Design Systems',
  'Full-Stack Web Apps',
  'Motion & WebGL Experiences',
  'Performance & Edge Architecture',
];

export default function InquiryModal({ isOpen, onClose, prefillData }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('Web App');
  const [budget, setBudget] = useState('$48k – $80k');
  const [brief, setBrief] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefillData) {
      if (prefillData.projectType) setProjectType(prefillData.projectType);
      if (prefillData.budget) setBudget(prefillData.budget);
      if (prefillData.timeline || (prefillData.modules && prefillData.modules.length > 0)) {
        const modText =
          prefillData.modules && prefillData.modules.length > 0
            ? `Modules: ${prefillData.modules.join(', ')}. `
            : '';
        const timeText = prefillData.timeline ? `Target cadence: ${prefillData.timeline}. ` : '';
        setBrief(`${timeText}${modText}`);
      }
    }
  }, [prefillData]);

  useEffect(() => {
    if (!isOpen) {
      // Reset submitted state after closing animation completes
      const t = setTimeout(() => {
        setSubmitted(false);
        setErrors({});
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const validate = () => {
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Please enter your name.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Please enter a valid work email.';
    }
    if (!brief.trim() || brief.trim().length < 10) {
      nextErrors.brief = 'Share a few sentences about your goals (min 10 chars).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-obsidian/80 backdrop-blur-md"
          />

          {/* Slide-over Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 w-full max-w-xl h-full bg-surface border-l border-ivory/15 p-6 sm:p-10 overflow-y-auto flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-ivory/10 mb-8">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-lime block">
                    // New Engagement
                  </span>
                  <h3 className="font-display font-bold text-2xl text-ivory mt-1">
                    Start a Project
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-2.5 rounded-full bg-obsidian border border-ivory/15 text-ivory/75 hover:text-lime hover:border-lime/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-lime/15 border border-lime/40 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-lime" />
                  </div>
                  <h4 className="font-display font-bold text-2xl sm:text-3xl text-ivory mb-3">
                    Brief Received, {name.split(' ')[0]}.
                  </h4>
                  <p className="text-ivory/70 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-6">
                    A principal partner at Vespera Digital will review your{' '}
                    <span className="text-ivory font-medium">{projectType}</span> scope and reply
                    to <span className="text-lime">{email}</span> within one business day.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-obsidian border border-ivory/10 text-xs font-mono text-ivory/60 mb-8">
                    <Sparkles className="w-3.5 h-3.5 text-lime" />
                    <span>Ref ID: VSP-2027-842</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-3 rounded-full bg-lime text-obsidian font-display font-semibold text-sm hover:bg-ivory transition-colors"
                    >
                      Return to Studio
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Elena Vance"
                        className="w-full px-4 py-3 rounded-xl bg-obsidian border border-ivory/15 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-lime transition-colors"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="elena@company.io"
                        className="w-full px-4 py-3 rounded-xl bg-obsidian border border-ivory/15 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-lime transition-colors"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-2">
                        Company / Team
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Labs"
                        className="w-full px-4 py-3 rounded-xl bg-obsidian border border-ivory/15 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-lime transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-2">
                        Estimated Budget
                      </label>
                      <input
                        type="text"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="$30k – $60k"
                        className="w-full px-4 py-3 rounded-xl bg-obsidian border border-ivory/15 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-lime transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-2">
                      Primary Focus
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-obsidian border border-ivory/15 text-sm text-ivory focus:outline-none focus:border-lime transition-colors"
                    >
                      {PROJECT_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-obsidian text-ivory">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-2">
                      Project Brief &amp; Goals *
                    </label>
                    <textarea
                      rows={4}
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      placeholder="Tell us what you are building, key milestones, and what success looks like..."
                      className="w-full px-4 py-3 rounded-xl bg-obsidian border border-ivory/15 text-sm text-ivory placeholder:text-ivory/30 focus:outline-none focus:border-lime transition-colors resize-none"
                    />
                    {errors.brief && (
                      <p className="text-xs text-red-400 mt-1.5">{errors.brief}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-lime text-obsidian font-display font-semibold text-sm sm:text-base hover:bg-ivory transition-colors shadow-[0_0_24px_rgba(200,255,50,0.2)]"
                  >
                    Submit Project Brief
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            <div className="pt-6 mt-8 border-t border-ivory/10 flex items-center justify-between text-xs text-ivory/45">
              <span>NDA-ready upon request</span>
              <span>hello@vespera.digital</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
