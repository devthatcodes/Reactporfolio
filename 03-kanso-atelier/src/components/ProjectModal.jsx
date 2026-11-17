import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Maximize2, Calendar, Layers } from 'lucide-react';
import { ProjectPerspective, ProjectFloorplan } from './ProjectArtwork';

export default function ProjectModal({ project, onClose }) {
  const [viewMode, setViewMode] = useState('perspective');

  useEffect(() => {
    setViewMode('perspective');
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-charcoal/55 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl bg-alabaster border border-charcoal/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
          >
            {/* Top Bar */}
            <div className="px-6 sm:px-10 py-5 border-b border-charcoal/10 flex items-center justify-between bg-alabaster shrink-0">
              <div className="flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-taupe">
                <span className="font-mono text-bronze">PROJECT {project.index}</span>
                <span>·</span>
                <span>{project.category}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 -mr-2 text-charcoal hover:text-bronze transition-colors"
                aria-label="Close project details"
              >
                <X className="w-5 h-5 stroke-[1.25]" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-10 space-y-10">
              {/* Title & View Switcher */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2
                    id="modal-project-title"
                    className="font-serif text-3xl sm:text-5xl text-charcoal font-normal leading-tight"
                  >
                    {project.title}
                  </h2>
                  <p className="text-sm text-taupe mt-1">{project.subtitle}</p>
                </div>

                {/* Diagram Toggle */}
                <div className="inline-flex border border-charcoal/15 bg-stone p-1 self-start">
                  <button
                    type="button"
                    onClick={() => setViewMode('perspective')}
                    className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      viewMode === 'perspective'
                        ? 'bg-charcoal text-alabaster'
                        : 'text-taupe hover:text-charcoal'
                    }`}
                  >
                    Elevation
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('floorplan')}
                    className={`px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      viewMode === 'floorplan'
                        ? 'bg-charcoal text-alabaster'
                        : 'text-taupe hover:text-charcoal'
                    }`}
                  >
                    Floorplan
                  </button>
                </div>
              </div>

              {/* Artwork / Blueprint Container */}
              <div className="border border-charcoal/10 bg-stone overflow-hidden">
                <div className="aspect-[16/10] w-full">
                  {viewMode === 'perspective' ? (
                    <ProjectPerspective id={project.id} />
                  ) : (
                    <ProjectFloorplan id={project.id} />
                  )}
                </div>
                <div className="px-5 py-3 border-t border-charcoal/10 bg-alabaster/70 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-taupe">
                  <span>
                    {viewMode === 'perspective'
                      ? `FIG. ${project.index}A — Architectural Study`
                      : `FIG. ${project.index}B — ${project.elevationNote}`}
                  </span>
                  <span>Lead: {project.lead}</span>
                </div>
              </div>

              {/* Architectural Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-charcoal/10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-taupe">
                    <MapPin className="w-3.5 h-3.5 text-bronze" />
                    <span>Location</span>
                  </div>
                  <p className="text-sm text-charcoal font-medium">{project.location}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-taupe">
                    <Maximize2 className="w-3.5 h-3.5 text-bronze" />
                    <span>Area</span>
                  </div>
                  <p className="text-sm text-charcoal font-medium">{project.area}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-taupe">
                    <Calendar className="w-3.5 h-3.5 text-bronze" />
                    <span>Year</span>
                  </div>
                  <p className="text-sm text-charcoal font-medium">{project.year}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-taupe">
                    <Layers className="w-3.5 h-3.5 text-bronze" />
                    <span>Palette</span>
                  </div>
                  <p className="text-xs text-charcoal leading-relaxed">
                    {project.materials.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Design Narrative */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 space-y-3">
                  <h3 className="text-xs uppercase tracking-[0.22em] text-bronze">
                    Design Narrative
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-charcoal/90 font-light">
                    {project.narrative}
                  </p>
                </div>

                <div className="md:col-span-5 bg-stone border border-charcoal/10 p-6 space-y-3 self-start">
                  <h4 className="text-[11px] uppercase tracking-[0.2em] text-taupe">
                    Spatial Note
                  </h4>
                  <p className="font-serif italic text-lg leading-relaxed text-charcoal">
                    “{project.spatialNote}”
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
