import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Maximize2, Calendar, Layers, Sun, ArrowLeft, ArrowRight } from 'lucide-react';
import { ProjectPerspective, ProjectFloorplan } from './ProjectArtwork';
import { PROJECTS } from '../data/projects';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';

export default function ProjectModal({ project, onClose, onSelectProject }) {
  const [viewMode, setViewMode] = useState('perspective');
  const [solarHour, setSolarHour] = useState(11.5);

  useEffect(() => {
    setViewMode('perspective');
    setSolarHour(11.5);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleStepProject(1);
      if (e.key === 'ArrowLeft') handleStepProject(-1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, onClose]);

  if (!project) return null;

  const currentIndex = PROJECTS.findIndex((p) => p.id === project.id);
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  const handleStepProject = (dir) => {
    if (!onSelectProject) return;
    soundEngine.playPortalSweep();
    const target = dir > 0 ? nextProject : prevProject;
    onSelectProject(target);
  };

  const formatSolarLabel = (val) => {
    const hrs = Math.floor(val);
    const mins = Math.round((val - hrs) * 60);
    const phase = val < 9 ? 'DAWN' : val < 15.5 ? 'SOLAR ZENITH' : val < 18.2 ? 'GOLDEN HOUR' : 'TWILIGHT';
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} · ${phase}`;
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] bg-charcoal/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl bg-alabaster border border-charcoal/20 shadow-2xl overflow-hidden my-auto max-h-[93vh] flex flex-col"
          >
            {/* Top Architectural Monograph Header Bar */}
            <div className="px-6 sm:px-10 py-4 border-b border-charcoal/15 flex items-center justify-between bg-alabaster shrink-0">
              <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.22em] text-taupe">
                <span className="text-bronze font-medium">MONOGRAPH {project.index} / 06</span>
                <span>//</span>
                <span>{project.category}</span>
                <span className="hidden sm:inline text-charcoal/30">|</span>
                <span className="hidden sm:inline">{project.location}</span>
              </div>

              <button
                type="button"
                data-cursor="CLOSE PORTAL"
                onClick={() => {
                  soundEngine.playClick('stone');
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 border border-charcoal/15 text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal hover:bg-charcoal hover:text-alabaster transition-colors"
                aria-label="Close project details"
              >
                <span>[ ESC ]</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-9">
              {/* Title & Diagram Switcher */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                  <h2
                    id="modal-project-title"
                    className="font-serif text-3xl sm:text-5xl text-charcoal font-normal leading-tight"
                  >
                    <ScrambleText text={project.title} triggerKey={project.id} duration={480} />
                  </h2>
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-bronze mt-2">
                    {project.subtitle}
                  </p>
                </div>

                {/* Controls: Interactive Solar Scrubber + Elevation/Floorplan Switcher */}
                <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
                  {viewMode === 'perspective' && (
                    <div
                      data-cursor="SCRUB SOLAR ANGLE"
                      className="flex items-center gap-3 px-3.5 py-1.5 bg-stone border border-charcoal/15"
                    >
                      <Sun className="w-3.5 h-3.5 text-bronze" />
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-charcoal">
                          {formatSolarLabel(solarHour)}
                        </span>
                        <input
                          type="range"
                          min="6"
                          max="20"
                          step="0.25"
                          value={solarHour}
                          onChange={(e) => {
                            soundEngine.playHoverTick(0.85 + (Number(e.target.value) - 6) * 0.03);
                            setSolarHour(parseFloat(e.target.value));
                          }}
                          aria-label="Interactive Solar Angle Scrubber"
                          className="w-32 sm:w-40 accent-bronze cursor-pointer h-1 mt-0.5"
                        />
                      </div>
                    </div>
                  )}

                  {/* Diagram Toggle */}
                  <div className="inline-flex border border-charcoal/15 bg-stone p-1">
                    <button
                      type="button"
                      data-cursor="SOLAR ELEVATION"
                      onClick={() => {
                        soundEngine.playClick('timber');
                        setViewMode('perspective');
                      }}
                      className={`px-4 py-2 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors ${
                        viewMode === 'perspective'
                          ? 'bg-charcoal text-alabaster'
                          : 'text-taupe hover:text-charcoal'
                      }`}
                    >
                      Elevation Study
                    </button>
                    <button
                      type="button"
                      data-cursor="CAD FLOORPLAN"
                      onClick={() => {
                        soundEngine.playClick('timber');
                        setViewMode('floorplan');
                      }}
                      className={`px-4 py-2 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors ${
                        viewMode === 'floorplan'
                          ? 'bg-charcoal text-alabaster'
                          : 'text-taupe hover:text-charcoal'
                      }`}
                    >
                      CAD Floorplan 1:100
                    </button>
                  </div>
                </div>
              </div>

              {/* Artwork / Blueprint Container */}
              <div className="border border-charcoal/15 bg-stone overflow-hidden relative">
                <div className="aspect-[16/10] w-full">
                  {viewMode === 'perspective' ? (
                    <ProjectPerspective id={project.id} solarHour={solarHour} />
                  ) : (
                    <ProjectFloorplan id={project.id} />
                  )}
                </div>

                {/* Bottom CAD Caption Bar */}
                <div className="px-5 py-3 border-t border-charcoal/10 bg-alabaster/90 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-taupe">
                  <span>
                    {viewMode === 'perspective'
                      ? `FIG. ${project.index}A — Solar Incidence & Shadow Study (${formatSolarLabel(solarHour)})`
                      : `FIG. ${project.index}B — ${project.elevationNote}`}
                  </span>
                  <span>ARCHITECTS: {project.lead.toUpperCase()}</span>
                </div>
              </div>

              {/* Architectural Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-charcoal/15">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
                    <MapPin className="w-3.5 h-3.5 text-bronze" />
                    <span>Site Coordinates</span>
                  </div>
                  <p className="text-sm text-charcoal font-medium">{project.location}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
                    <Maximize2 className="w-3.5 h-3.5 text-bronze" />
                    <span>Gross Floor Area</span>
                  </div>
                  <p className="text-sm text-charcoal font-medium">{project.area}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
                    <Calendar className="w-3.5 h-3.5 text-bronze" />
                    <span>Completion</span>
                  </div>
                  <p className="text-sm text-charcoal font-medium">{project.year}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
                    <Layers className="w-3.5 h-3.5 text-bronze" />
                    <span>Material Palette</span>
                  </div>
                  <p className="text-xs text-charcoal leading-relaxed">
                    {project.materials.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Design Narrative & Spatial Datum Quote */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-[0.22em] text-bronze">
                    Architectural Narrative
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-charcoal/90 font-light">
                    {project.narrative}
                  </p>
                </div>

                <div className="md:col-span-5 bg-stone border border-charcoal/15 p-6 space-y-3 self-start">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.22em] text-taupe">
                    Spatial Datum Note
                  </h4>
                  <p className="font-serif italic text-lg leading-relaxed text-charcoal">
                    “{project.spatialNote}”
                  </p>
                </div>
              </div>

              {/* Active Theory Prev / Next Portal Morph Footer */}
              <div className="pt-6 border-t border-charcoal/15 flex items-center justify-between gap-4">
                <button
                  type="button"
                  data-cursor="PREV MONOGRAPH"
                  onClick={() => handleStepProject(-1)}
                  className="group flex items-center gap-3 text-left py-2"
                >
                  <span className="p-2 border border-charcoal/15 group-hover:border-bronze group-hover:bg-charcoal group-hover:text-alabaster transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="block text-[9px] font-mono uppercase tracking-[0.22em] text-taupe">
                      PREV // {prevProject.index}
                    </span>
                    <span className="font-serif text-lg text-charcoal group-hover:text-bronze transition-colors">
                      {prevProject.title}
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  data-cursor="NEXT MONOGRAPH"
                  onClick={() => handleStepProject(1)}
                  className="group flex items-center gap-3 text-right py-2"
                >
                  <div>
                    <span className="block text-[9px] font-mono uppercase tracking-[0.22em] text-taupe">
                      NEXT // {nextProject.index}
                    </span>
                    <span className="font-serif text-lg text-charcoal group-hover:text-bronze transition-colors">
                      {nextProject.title}
                    </span>
                  </div>
                  <span className="p-2 border border-charcoal/15 group-hover:border-bronze group-hover:bg-charcoal group-hover:text-alabaster transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
