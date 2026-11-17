import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES, PROJECTS } from '../data/projects';
import { ProjectPerspective } from './ProjectArtwork';

export default function PortfolioGallery({ onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeCategory);

  return (
    <section id="works" className="py-24 md:py-32 bg-alabaster">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Header & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-charcoal/10">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-taupe mb-3">
              <span className="font-mono text-bronze">02</span>
              <span>Selected Works</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal font-normal">
              Built &amp; Ongoing Projects
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div
            className="flex flex-wrap items-center gap-6 sm:gap-8"
            role="tablist"
            aria-label="Filter projects by typology"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`relative pb-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                    isActive ? 'text-charcoal font-medium' : 'text-taupe hover:text-charcoal'
                  }`}
                >
                  <span>{category}</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeFilterUnderline"
                      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-bronze"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        <motion.div
          layout
          className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => onSelectProject(project)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Architectural SVG Canvas */}
                <div className="relative overflow-hidden bg-stone border border-charcoal/10 aspect-[4/3]">
                  <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                    <ProjectPerspective id={project.id} />
                  </div>

                  {/* Subtle top-left index badge */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-alabaster/90 backdrop-blur-sm border border-charcoal/10 text-[10px] font-mono tracking-[0.18em] text-charcoal">
                    {project.index}
                  </div>

                  {/* Hover inspect pill */}
                  <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 bg-charcoal text-alabaster text-[10px] uppercase tracking-[0.2em]">
                    <span>View Dossier</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-5 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-taupe">
                    <span>{project.category}</span>
                    <span>
                      {project.location} · {project.year}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-2xl sm:text-[1.7rem] text-charcoal group-hover:text-bronze transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs font-mono text-taupe shrink-0">{project.area}</span>
                  </div>

                  <p className="text-xs text-taupe font-light">{project.subtitle}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
