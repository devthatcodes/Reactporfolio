import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ArrowRight, Lock } from 'lucide-react';

export function SignInModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-card-elevated p-6 sm:p-7 z-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Sign In"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">Magic Link Dispatched</h3>
                <p className="text-sm text-slate-600">
                  We sent a hardware-verified sign-in link to{' '}
                  <span className="font-mono font-semibold text-[#0F172A]">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-[#0F172A] flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">Sign in to Meridian</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function AccountDemoModal({ isOpen, initialMode = 'account', onClose }) {
  const [mode, setMode] = useState(initialMode);
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [volume, setVolume] = useState('$1M – $10M / yr');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    if (!isOpen) {
      setSubmitted(false);
    }
  }, [initialMode, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company || !email) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-card-elevated p-6 sm:p-8 z-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Modal"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="py-6 text-center space-y-3.5">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A]">
                  {mode === 'account' ? 'Application Initialized' : 'Demo Request Confirmed'}
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-[#0F172A]">{company}</span>. Your
                  dedicated Meridian onboarding link has been sent to{' '}
                  <span className="font-mono text-[#2563EB]">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-[#0F172A] text-white text-sm font-semibold"
                >
                  Return to Meridian
                </button>
              </div>
            ) : (
              <>
                {/* Mode Toggle */}
                <div className="inline-flex p-1 rounded-xl bg-[#F8FAFC] border border-slate-200 mb-5">
                  <button
                    type="button"
                    onClick={() => setMode('account')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      mode === 'account'
                        ? 'bg-[#0F172A] text-white'
                        : 'text-slate-600 hover:text-[#0F172A]'
                    }`}
                  >
                    Open Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('demo')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      mode === 'demo'
                        ? 'bg-[#0F172A] text-white'
                        : 'text-slate-600 hover:text-[#0F172A]'
                    }`}
                  >
                    Book a Demo
                  </button>
                </div>

                <h3 className="text-xl font-bold text-[#0F172A]">
                  {mode === 'account'
                    ? 'Open your Meridian Treasury Account'
                    : 'Schedule a 1-on-1 Treasury Walkthrough'}
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-5">
                  {mode === 'account'
                    ? 'Get multi-currency IBANs, 4.85% USD yield, and instant virtual cards.'
                    : 'See custom FX routing, ERP sync, and multi-entity controls in action.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Company Legal Name
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Global Holdings Inc."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Work Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="treasury@acmeglobal.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Estimated Annual FX &amp; Spend Volume
                    </label>
                    <select
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-[#2563EB]"
                    >
                      <option>$250K – $1M / yr</option>
                      <option>$1M – $10M / yr</option>
                      <option>$10M – $50M / yr</option>
                      <option>$50M+ / yr</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>
                      {mode === 'account' ? 'Continue Application' : 'Request Live Demo'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
