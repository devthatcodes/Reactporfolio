import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Layers, Grid, Sun } from 'lucide-react';
import { CATEGORIES, PROJECTS } from '../data/projects';
import { ProjectPerspective, ProjectFloorplan } from './ProjectArtwork';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';

/**
 * 3D Velocity & Tilt Reactive Architectural Card
 */
function ArchitecturalWorkCard({ project, displayMode, globalSolarHour, onSelectProject }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [showBlueprint, setShowBlueprint] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 9;
    const rotateX = (0.5 - y) * 9;
    setTilt({ rotateX, rotateY, glareX: x * 100, glareY: y * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  if (displayMode === 'stream') {
    return (
      <motion.article
        ref={cardRef}
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => soundEngine.playHoverTick(0.95)}
        onClick={() => {
          soundEngine.playPortalSweep();
          onSelectProject(project);
        }}
        data-cursor="ENTER MONOGRAPH"
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
          transformStyle: 'preserve-3d',
        }}
        className="group cursor-pointer bg-alabaster/90 backdrop-blur-sm border border-charcoal/15 hover:border-bronze/70 transition-colors duration-300 p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm"
      >
        {/* Left: 3D Perspective Artwork Canvas */}
        <div className="lg:col-span-7 relative overflow-hidden bg-stone border border-charcoal/10 aspect-[16/10]">
          <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
            {showBlueprint ? (
              <ProjectFloorplan id={project.id} />
            ) : (
              <ProjectPerspective id={project.id} solarHour={globalSolarHour} />
            )}
          </div>

          {/* Dynamic Specular Caustic Glare Overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(154,123,79,0.16), transparent 60%)`,
            }}
          />

          {/* Top-left coordinate badge */}
          <div className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-alabaster/90 backdrop-blur-sm border border-charcoal/15 text-[10px] font-mono tracking-[0.2em] text-charcoal flex items-center gap-2">
            <span className="text-bronze">{project.index}</span>
            <span>//</span>
            <span>{project.category.toUpperCase()}</span>
          </div>

          {/* Quick Blueprint Layer Toggle Button */}
          <button
            type="button"
            data-cursor="TOGGLE CAD PLAN"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick('timber');
              setShowBlueprint((prev) => !prev);
            }}
            className="absolute top-3.5 right-3.5 px-2.5 py-1 bg-charcoal/85 text-alabaster hover:bg-bronze text-[9px] font-mono uppercase tracking-[0.2em] transition-colors"
          >
            {showBlueprint ? 'VIEW ELEVATION' : 'CAD 1:100'}
          </button>

          {/* Bottom-right Launch Portal Pill */}
          <div className="absolute bottom-3.5 right-3.5 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 bg-charcoal text-alabaster text-[10px] font-mono uppercase tracking-[0.2em]">
            <span>[ LAUNCH PORTAL ]</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-bronze" />
          </div>
        </div>

        {/* Right: Architectural Dossier Readout */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-taupe">
              <span>{project.location}</span>
              <span>
                {project.area} · {project.year}
              </span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-charcoal group-hover:text-bronze transition-colors leading-tight">
              <ScrambleText text={project.title} scrambleOnHover duration={380} />
            </h3>

            <p className="text-xs uppercase tracking-[0.18em] text-bronze font-mono">
              {project.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-taupe leading-relaxed font-light pt-2">
              {project.narrative}
            </p>
          </div>

          <div className="pt-4 border-t border-charcoal/10 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {project.materials.map((mat) => (
                <span
                  key={mat}
                  className="px-2 py-0.5 bg-stone border border-charcoal/10 text-[10px] font-mono text-charcoal/80"
                >
                  {mat}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-taupe pt-1">
              <span>{project.elevationNote}</span>
              <span className="text-charcoal group-hover:text-bronze transition-colors">
                ENTER →
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Editorial 3-Column Grid Card with 3D micro-tilt
  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => soundEngine.playHoverTick(1.0)}
      onClick={() => {
        soundEngine.playPortalSweep();
        onSelectProject(project);
      }}
      data-cursor="ENTER MONOGRAPH"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX * 0.7}deg) rotateY(${tilt.rotateY * 0.7}deg)`,
      }}
      className="group cursor-pointer flex flex-col"
    >
      {/* Architectural SVG Canvas */}
      <div className="relative overflow-hidden bg-stone border border-charcoal/15 aspect-[4/3]">
        <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          {showBlueprint ? (
            <ProjectFloorplan id={project.id} />
          ) : (
            <ProjectPerspective id={project.id} solarHour={globalSolarHour} />
          )}
        </div>

        {/* Dynamic Glare */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(154,123,79,0.16), transparent 60%)`,
          }}
        />

        {/* Top-left index badge */}
        <div className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-alabaster/90 backdrop-blur-sm border border-charcoal/10 text-[10px] font-mono tracking-[0.18em] text-charcoal">
          {project.index}
        </div>

        {/* Blueprint Quick Toggle */}
        <button
          type="button"
          data-cursor="TOGGLE CAD PLAN"
          onClick={(e) => {
            e.stopPropagation();
            soundEngine.playClick('timber');
            setShowBlueprint((prev) => !prev);
          }}
          className="absolute top-3.5 right-3.5 px-2 py-0.5 bg-alabaster/90 hover:bg-charcoal hover:text-alabaster border border-charcoal/15 text-[9px] font-mono uppercase tracking-[0.18em] text-charcoal transition-colors"
        >
          {showBlueprint ? 'ELEV' : 'PLAN'}
        </button>

        {/* Hover inspect pill */}
        <div className="absolute bottom-3.5 right-3.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 bg-charcoal text-alabaster text-[10px] font-mono uppercase tracking-[0.2em]">
          <span>[ MONOGRAPH ]</span>
          <ArrowUpRight className="w-3 h-3 text-bronze" />
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
            <ScrambleText text={project.title} scrambleOnHover duration={360} />
          </h3>
          <span className="text-xs font-mono text-taupe shrink-0">{project.area}</span>
        </div>

        <p className="text-xs text-taupe font-light">{project.subtitle}</p>
      </div>
    </motion.article>
  );
}

export default function PortfolioGallery({ onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayMode, setDisplayMode] = useState('grid'); // 'grid' | 'stream'
  const [globalSolarHour, setGlobalSolarHour] = useState(11.0);

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeCategory);

  const formatSolarTime = (val) => {
    const hrs = Math.floor(val);
    const mins = Math.round((val - hrs) * 60);
    const label = val < 9 ? 'DAWN' : val < 15.5 ? 'ZENITH' : val < 18.2 ? 'GOLDEN' : 'DUSK';
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${label}`;
  };

  return (
    <section id="works" className="relative z-10 py-24 md:py-32 bg-alabaster/75 backdrop-blur-[2px]">
      <div className="max-w-[1360px] mx-auto px-6 md:px-12">
        {/* Header & Interactive Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-charcoal/15">
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-taupe mb-3">
              <span className="font-mono text-bronze">02 // ARCHIVE</span>
              <span>Selected Architectural Monographs</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal font-normal">
              Built &amp; Ongoing Spatial Works
            </h2>
          </div>

          {/* Right Controls: Global Daylight Scrubber + View Mode Switcher */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Global Solar Path Scrubber */}
            <div
              data-cursor="SCRUB SOLAR ANGLE"
              className="flex items-center gap-3 px-3.5 py-2 bg-stone border border-charcoal/15"
            >
              <Sun className="w-3.5 h-3.5 text-bronze shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-3 text-[9px] font-mono uppercase tracking-[0.18em] text-taupe">
                  <span>SOLAR STUDY</span>
                  <span className="text-charcoal font-medium">
                    {formatSolarTime(globalSolarHour)}
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="20"
                  step="0.25"
                  value={globalSolarHour}
                  onChange={(e) => {
                    soundEngine.playHoverTick(0.8 + (Number(e.target.value) - 6) * 0.03);
                    setGlobalSolarHour( parseFloat(e.target.value) );
                  }}
                  aria-label="Global solar daylight scrubber"
                  className="w-28 sm:w-36 accent-bronze cursor-pointer h-1 mt-1"
                />
              </div>
            </div>

            {/* Stream vs Grid Switcher */}
            <div className="inline-flex border border-charcoal/15 bg-stone p-1">
              <button
                type="button"
                data-cursor="EDITORIAL GRID"
                onClick={() => {
                  soundEngine.playClick('stone');
                  setDisplayMode('grid');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors ${
                  displayMode === 'grid'
                    ? 'bg-charcoal text-alabaster'
                    : 'text-taupe hover:text-charcoal'
                }`}
              >
                <Grid className="w-3 h-3" />
                <span>GRID</span>
              </button>
              <button
                type="button"
                data-cursor="3D STREAM REEL"
                onClick={() => {
                  soundEngine.playClick('stone');
                  setDisplayMode('stream');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] transition-colors ${
                  displayMode === 'stream'
                    ? 'bg-charcoal text-alabaster'
                    : 'text-taupe hover:text-charcoal'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>3D REEL</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4">
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
                  data-cursor={`FILTER: ${category.toUpperCase()}`}
                  onMouseEnter={() => soundEngine.playHoverTick(1.05)}
                  onClick={() => {
                    soundEngine.playClick('stone');
                    setActiveCategory(category);
                  }}
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

          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
            SHOWING 0{filteredProjects.length} / 0{PROJECTS.length} MONOGRAPHS
          </div>
        </div>

        {/* Project Stream or Grid */}
        <motion.div
          layout
          className={
            displayMode === 'stream'
              ? 'mt-12 flex flex-col gap-10'
              : 'mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14'
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ArchitecturalWorkCard
                key={project.id}
                project={project}
                displayMode={displayMode}
                globalSolarHour={globalSolarHour}
                onSelectProject={onSelectProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
