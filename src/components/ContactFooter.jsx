import React, { useState } from 'react';
import { ArrowUpRight, Mail, Check, Github, Send } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';
import soundEngine from '../utils/soundEngine';

export default function ContactFooter({ onOpenTheater }) {
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard?.writeText('deontae@devthatcodes.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email) return;
    soundEngine.playClick();
    setSubmitted(true);
  };

  return (
    <footer
      id="contact"
      className="relative py-24 px-5 sm:px-8 max-w-7xl mx-auto border-t border-white/10"
    >
      <div className="grid lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left Column: Deontae Work Direct Contact */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DEONTAE WORK · OPEN TO FRONT END ENGINEERING ROLES</span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-[#F5F4F0] leading-[1.02]">
            Let&apos;s build interfaces that{' '}
            <span className="font-serif italic font-normal text-[#E2D9C8]">set the standard.</span>
          </h2>

          <p className="text-base text-white/65 max-w-md leading-relaxed">
            Looking for a Front End Engineer who obsesses over architectural clarity, 60fps
            choreography, and customer-facing polish? Reach out directly below.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              data-cursor="COPY EMAIL"
              onClick={handleCopyEmail}
              onMouseEnter={() => soundEngine.playHover()}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#F5F4F0] text-[#060608] font-display font-bold text-xs uppercase tracking-[0.14em] hover:bg-[#E2D9C8] transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'deontae@devthatcodes.com'}</span>
            </button>

            <a
              href="https://github.com/devthatcodes"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="GITHUB ↗"
              onMouseEnter={() => soundEngine.playHover()}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#0D0E12] border border-white/15 text-xs font-mono uppercase tracking-[0.14em] text-white hover:border-white/40 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>github.com/devthatcodes</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Column: Direct Message Form */}
        <div className="lg:col-span-6 rounded-[28px] bg-[#0D0E12] border border-white/10 p-6 sm:p-8 shadow-2xl">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-400/20 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-2xl text-white">Message Dispatched</h3>
              <p className="text-sm text-white/65">
                Thank you, {formState.name}. Deontae will respond within 24 hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormState({ name: '', email: '', message: '' });
                }}
                className="text-xs font-mono uppercase tracking-wider text-[#E2D9C8] underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-white/45 mb-2">
                // DIRECT INQUIRY TO DEONTAE WORK
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Jordan Vance"
                    className="w-full rounded-xl bg-[#060608] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E2D9C8]"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 block mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                    placeholder="jordan@company.com"
                    className="w-full rounded-xl bg-[#060608] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E2D9C8]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/60 block mb-1.5">Role or Project Brief</label>
                <textarea
                  rows={3}
                  value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  placeholder="Tell me about the front-end role, team, or product you're building..."
                  className="w-full rounded-xl bg-[#060608] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#E2D9C8]"
                />
              </div>
              <button
                type="submit"
                data-cursor="DISPATCH"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#E2D9C8] text-[#060608] font-display font-bold text-xs uppercase tracking-[0.16em] hover:bg-white transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to Deontae</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Signature & Quick-Launch Index */}
      <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-mono uppercase tracking-wider text-white/65">
            DEONTAE WORK // LIVE EXHIBITION:
          </span>
          {PORTFOLIO_PROJECTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenTheater(p);
              }}
              className="hover:text-white transition-colors font-mono"
            >
              {p.number} {p.title}
            </button>
          ))}
        </div>
        <div className="font-mono">
          © {new Date().getFullYear()} Deontae Work · Front End Engineer
        </div>
      </div>
    </footer>
  );
}
