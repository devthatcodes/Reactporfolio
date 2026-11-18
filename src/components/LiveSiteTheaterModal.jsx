import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data/projects';

const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', width: '100%', icon: Monitor },
  { id: 'tablet', label: 'Tablet', width: '768px', icon: Tablet },
  { id: 'mobile', label: 'Mobile', width: '390px', icon: Smartphone },
];

export default function LiveSiteTheaterModal({
  project,
  onClose,
  onSelectProject,
}) {
  const [viewport, setViewport] = useState('desktop');

  if (!project) return null;

  const currentIdx = PORTFOLIO_PROJECTS.findIndex((p) => p.id === project.id);

  const handleStep = (dir) => {
    const nextIdx = (currentIdx + dir + PORTFOLIO_PROJECTS.length) % PORTFOLIO_PROJECTS.length;
    onSelectProject(PORTFOLIO_PROJECTS[nextIdx]);
  };

  const activeVp = VIEWPORTS.find((v) => v.id === viewport) || VIEWPORTS[0];

  return (
    <AnimatePresence>
      <motion.div
        key="live-theater-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-[#070709]/95 flex flex-col justify-between p-3 sm:p-5"
      >
        {/* Top Studio Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#101116] border border-white/10 rounded-2xl px-4 py-3 mb-3">
          {/* Left: Project Switcher */}
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-lg font-mono text-xs font-bold text-black"
              style={{ backgroundColor: project.accent }}
            >
              {project.number}
            </span>
            <div>
              <div className="font-display font-bold text-sm sm:text-base text-white leading-none">
                {project.title}
              </div>
              <div className="text-[11px] font-mono text-white/50 mt-0.5">
                {project.motionIdentity}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-white/10">
              {PORTFOLIO_PROJECTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectProject(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    p.id === project.id
                      ? 'bg-white text-black font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {p.number} {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Responsive Viewport Resizer */}
          <div className="hidden sm:flex items-center gap-1 bg-[#070709] border border-white/10 rounded-xl p-1">
            {VIEWPORTS.map((vp) => {
              const Icon = vp.icon;
              const active = viewport === vp.id;
              return (
                <button
                  key={vp.id}
                  type="button"
                  onClick={() => setViewport(vp.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                    active ? 'bg-white text-black font-semibold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{vp.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Open New Tab & Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStep(-1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors"
              title="Previous Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleStep(1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors"
              title="Next Site"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-black"
              style={{ backgroundColor: project.accent }}
            >
              <span>Open Standalone</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-500 hover:text-white text-white/80 transition-colors"
              title="Close Theater"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Responsive Live Iframe Container */}
        <div className="flex-1 flex items-center justify-center overflow-hidden bg-[#0B0C10] border border-white/10 rounded-2xl p-2">
          <motion.div
            layout
            style={{ width: activeVp.width }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="h-full max-w-full rounded-xl overflow-hidden border border-white/15 bg-black shadow-2xl"
          >
            <iframe
              key={project.liveUrl}
              src={project.liveUrl}
              title={`Live Preview — ${project.title}`}
              className="w-full h-full border-0"
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
