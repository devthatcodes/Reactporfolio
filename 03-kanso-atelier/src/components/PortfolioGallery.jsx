import React, { useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, Sun, Compass, Layers } from 'lucide-react';
import { CATEGORIES, PROJECTS } from '../data/projects';
import { ProjectPerspective, ProjectFloorplan } from './ProjectArtwork';
import { soundEngine } from '../utils/soundEngine';
import { ScrollShutterSection } from './ScrollArchitectureTransition';

/**
 * Large-format Architectural Monograph Plate in the Right Column of the Split-Screen Showcase.
 * Features:
 * 1. Smooth GPU-composited inner image vertical parallax (y: ['-8%', '8%'] inside overflow-hidden frame)
 * 2. Horizontal sliding Shoji paper curtain unveil (scaleX: 1 -> 0, origin-right) as it enters viewport
 * 3. Viewport enter callback to update the sticky left architectural dossier without per-frame React state
 */
function MonographPlateCard({
  project,
  index,
  globalSolarHour,
  globalCadMode,
  isActive,
  onActivate,
  onSelectProject,
}) {
  const plateRef = useRef(null);
  const [localCadOverride, setLocalCadOverride] = useState(null);

  const showBlueprint = localCadOverride !== null ? localCadOverride : globalCadMode;

  // Inner image vertical parallax: y: ['-8%', '8%'] using pure GPU translate3d
  const { scrollYProgress } = useScroll({
    target: plateRef,
    offset: ['start end', 'end start'],
  });

  const innerParallaxY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  // Horizontal sliding Shoji paper curtain unveil as plate enters viewport
  const { scrollYProgress: revealProgress } = useScroll({
    target: plateRef,
    offset: ['start 92%', 'start 38%'],
  });

  const curtainScaleX = useTransform(revealProgress, [0, 1], [1, 0]);
  const cardSlideY = useTransform(revealProgress, [0, 1], [32, 0]);
  const cardOpacity = useTransform(revealProgress, [0, 0.6], [0.25, 1]);

  const dynamicSolar = Math.min(19.5, Math.max(6.5, globalSolarHour + (index - 2) * 0.45));

  return (
    <motion.article
      ref={plateRef}
      id={`monograph-plate-${project.id}`}
      style={{ y: cardSlideY, opacity: cardOpacity }}
      onViewportEnter={() => onActivate(project)}
      viewport={{ amount: 0.45, margin: '-10% 0px -10% 0px' }}
      onClick={() => {
        soundEngine.playPortalSweep();
        onSelectProject(project);
      }}
      onMouseEnter={() => {
        soundEngine.playHoverTick(1.0);
        onActivate(project);
      }}
      data-cursor="OPEN MONOGRAPH"
      className={`group relative bg-alabaster border transition-colors duration-300 cursor-pointer select-none will-change-transform ${
        isActive ? 'border-bronze/80 shadow-[0_20px_50px_rgba(28,27,25,0.08)]' : 'border-charcoal/15 hover:border-bronze/60'
      }`}
    >
      {/* Top Plate Registration Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-charcoal/10 bg-stone/60 text-[10px] font-mono uppercase tracking-[0.22em]">
        <div className="flex items-center gap-2.5">
          <span className="text-bronze font-medium">PLATE {project.index}</span>
          <span className="text-charcoal/25">//</span>
          <span className="text-charcoal">{project.category.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-4 text-taupe">
          <span>{project.location}</span>
          <span className="text-bronze">{project.area}</span>
        </div>
      </div>

      {/* Large-Format Architectural Viewport with Inner Vertical Parallax & Horizontal Paper Curtain Unveil */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone">
        {/* Inner Parallax Layer (y: ['-8%', '8%'] scaled slightly to prevent edge bleed) */}
        <motion.div
          style={{ y: innerParallaxY, scale: 1.16 }}
          className="w-full h-full will-change-transform"
        >
          {showBlueprint ? (
            <ProjectFloorplan id={project.id} />
          ) : (
            <ProjectPerspective id={project.id} solarHour={dynamicSolar} />
          )}
        </motion.div>

        {/* Horizontal Sliding Paper Curtain Unveil (Slides Left -> Right via scaleX 1 -> 0) */}
        <motion.div
          style={{ scaleX: curtainScaleX, transformOrigin: 'right center' }}
          className="pointer-events-none absolute inset-0 z-20 bg-[#EAE5DC] border-l-2 border-bronze will-change-transform"
        />

        {/* Individual Plate CAD Toggle Pill */}
        <button
          type="button"
          data-cursor="SWITCH CAD LAYER"
          onClick={(e) => {
            e.stopPropagation();
            soundEngine.playClick('timber');
            setLocalCadOverride((prev) => (prev === null ? !globalCadMode : !prev));
          }}
          className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-charcoal text-alabaster hover:bg-bronze text-[9px] font-mono uppercase tracking-[0.2em] transition-colors"
        >
          {showBlueprint ? 'VIEW ELEVATION' : 'CAD SECTION 1:100'}
        </button>

        {/* Bottom-left Elevation Spec Note */}
        <div className="absolute bottom-4 left-4 z-10 px-2.5 py-1 bg-alabaster/95 border border-charcoal/15 text-[9px] font-mono uppercase tracking-[0.18em] text-charcoal">
          {project.elevationNote}
        </div>

        {/* Bottom-right Shoji Portal Trigger Pill */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3.5 py-1.5 bg-charcoal text-alabaster group-hover:bg-bronze transition-colors text-[10px] font-mono uppercase tracking-[0.2em]">
          <span>[ OPEN DOSSIER ]</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-bronze group-hover:text-alabaster transition-colors" />
        </div>
      </div>

      {/* Editorial Monograph Plate Caption & Materiality */}
      <div className="p-6 sm:p-8 flex flex-col gap-5 bg-alabaster">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h3 className="font-serif text-3xl sm:text-4xl text-charcoal group-hover:text-bronze transition-colors leading-tight">
              {project.title}
            </h3>
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-bronze mt-1">
              {project.subtitle}
            </p>
          </div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-taupe shrink-0">
            COMPLETED // {project.year}
          </span>
        </div>

        <p className="text-sm text-taupe leading-relaxed font-light">
          {project.narrative}
        </p>

        <div className="pt-4 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-taupe mr-1">
              MATERIAL PALETTE:
            </span>
            {project.materials.map((mat) => (
              <span
                key={mat}
                className="px-2.5 py-0.5 bg-stone border border-charcoal/10 text-[10px] font-mono text-charcoal"
              >
                {mat}
              </span>
            ))}
          </div>

          <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-taupe">
            ARCHITECT: <span className="text-charcoal">{project.lead}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function PortfolioGallery({ onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [globalSolarHour, setGlobalSolarHour] = useState(11.0);
  const [globalCadMode, setGlobalCadMode] = useState(false);
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeCategory);

  const currentProject =
    filteredProjects.find((p) => p.id === activeProject?.id) ||
    filteredProjects[0] ||
    PROJECTS[0];

  const formatSolarTime = (val) => {
    const hrs = Math.floor(val);
    const mins = Math.round((val - hrs) * 60);
    const label = val < 9 ? 'DAWN' : val < 15.5 ? 'ZENITH' : val < 18.2 ? 'GOLDEN' : 'DUSK';
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${label}`;
  };

  const scrollToPlate = (project) => {
    setActiveProject(project);
    const el = document.getElementById(`monograph-plate-${project.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="works" className="relative z-10">
      <ScrollShutterSection
        sectionCode="02 // MONOGRAPH SHOWCASE"
        datumLabel="SPLIT-SCREEN EDITORIAL ARCHIVE // 1:100"
        coordinates="KYOTO · COPENHAGEN · NAOSHIMA"
      >
        <div className="py-20 md:py-28 bg-alabaster/95 border-b border-charcoal/15">
          <div className="max-w-[1360px] mx-auto px-6 md:px-12">
            {/* Signature Luxury Architecture Split-Screen Sticky Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* ===============================================================
                  LEFT COLUMN (lg:col-span-5 sticky top-28 self-start):
                  Pins architectural index, live project title, coordinates,
                  solar time slider (06:00-20:00), and CAD toggle
                 =============================================================== */}
              <aside className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-6 bg-stone/90 border border-charcoal/15 p-6 sm:p-8">
                {/* Section Header */}
                <div className="border-b border-charcoal/15 pb-5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-bronze mb-2">
                    <span>02 // SELECTED MONOGRAPHS</span>
                    <span>INDEX 01—0{PROJECTS.length}</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-tight">
                    Architectural Monograph Plates
                  </h2>
                </div>

                {/* Live Pinned Project Telemetry Readout */}
                {currentProject && (
                  <div className="bg-alabaster border border-charcoal/15 p-5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-bronze">
                      <span className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        <span>ACTIVE PLATE // {currentProject.index}</span>
                      </span>
                      <span>{currentProject.year}</span>
                    </div>

                    <div className="font-serif text-2xl sm:text-3xl text-charcoal leading-snug">
                      {currentProject.title}
                    </div>

                    <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-taupe flex flex-wrap items-center gap-2">
                      <span>{currentProject.location}</span>
                      <span className="text-bronze">·</span>
                      <span className="text-charcoal">{currentProject.area}</span>
                      <span className="text-bronze">·</span>
                      <span>{currentProject.category}</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-charcoal/10">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-taupe">
                        {currentProject.elevationNote}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playPortalSweep();
                          onSelectProject(currentProject);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.2em] text-bronze hover:text-charcoal transition-colors"
                      >
                        <span>INSPECT PLATE</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Architectural Index List (Click to jump or double-click/button to open) */}
                <div className="space-y-1.5">
                  <div className="text-[9px] font-mono uppercase tracking-[0.24em] text-taupe pb-1">
                    SPATIAL INDEX // CLICK TO FOCUS PLATE
                  </div>
                  <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
                    {filteredProjects.map((proj) => {
                      const active = currentProject?.id === proj.id;
                      return (
                        <button
                          key={proj.id}
                          type="button"
                          onClick={() => {
                            soundEngine.playClick('stone');
                            scrollToPlate(proj);
                          }}
                          className={`w-full py-2.5 px-2 flex items-center justify-between text-left transition-colors ${
                            active
                              ? 'bg-charcoal text-alabaster'
                              : 'hover:bg-alabaster/70 text-charcoal'
                          }`}
                        >
                          <div className="flex items-baseline gap-3">
                            <span
                              className={`text-[10px] font-mono ${
                                active ? 'text-bronze' : 'text-bronze/80'
                              }`}
                            >
                              {proj.index}
                            </span>
                            <span className="font-serif text-base sm:text-lg">
                              {proj.title}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-mono uppercase tracking-[0.18em] ${
                              active ? 'text-alabaster/75' : 'text-taupe'
                            }`}
                          >
                            {proj.location.split(',')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interactive Controls: Solar Time Slider (06:00-20:00) & Global CAD Toggle */}
                <div className="space-y-4 pt-2">
                  {/* Solar Time Scrubber */}
                  <div
                    data-cursor="SCRUB SOLAR ANGLE"
                    className="p-4 bg-alabaster border border-charcoal/15 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.18em]">
                      <span className="flex items-center gap-1.5 text-taupe">
                        <Sun className="w-3.5 h-3.5 text-bronze" />
                        <span>HELIODON SOLAR TIME</span>
                      </span>
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
                        setGlobalSolarHour(parseFloat(e.target.value));
                      }}
                      aria-label="Global solar daylight scrubber"
                      className="w-full accent-bronze cursor-pointer h-1.5"
                    />
                    <div className="flex justify-between text-[8px] font-mono uppercase tracking-[0.2em] text-taupe">
                      <span>06:00 DAWN</span>
                      <span>13:00 ZENITH</span>
                      <span>20:00 DUSK</span>
                    </div>
                  </div>

                  {/* CAD Section vs Elevation Toggle + Typology Filter */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick('timber');
                        setGlobalCadMode((prev) => !prev);
                      }}
                      className={`w-full py-2.5 px-4 border text-[10px] font-mono uppercase tracking-[0.22em] flex items-center justify-between transition-colors ${
                        globalCadMode
                          ? 'bg-charcoal text-alabaster border-charcoal'
                          : 'bg-alabaster text-charcoal border-charcoal/20 hover:border-bronze'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-bronze" />
                        <span>DRAWING MODE</span>
                      </span>
                      <span className="text-bronze">
                        {globalCadMode ? 'CAD SECTION 1:100' : 'ELEVATION RENDER'}
                      </span>
                    </button>
                  </div>

                  {/* Category Filter Pills */}
                  <div
                    className="flex flex-wrap gap-1.5 pt-1"
                    role="tablist"
                    aria-label="Filter monographs by typology"
                  >
                    {CATEGORIES.map((category) => {
                      const isCatActive = activeCategory === category;
                      return (
                        <button
                          key={category}
                          type="button"
                          role="tab"
                          aria-selected={isCatActive}
                          onClick={() => {
                            soundEngine.playClick('stone');
                            setActiveCategory(category);
                          }}
                          className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] border transition-colors ${
                            isCatActive
                              ? 'bg-charcoal text-alabaster border-charcoal'
                              : 'bg-alabaster text-taupe border-charcoal/15 hover:text-charcoal'
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* ===============================================================
                  RIGHT COLUMN (lg:col-span-7):
                  Vertical stream of large-format architectural monograph plates
                  with inner vertical parallax & horizontal Shoji paper curtain unveil
                 =============================================================== */}
              <div className="lg:col-span-7 flex flex-col gap-14 sm:gap-20">
                {filteredProjects.map((project, idx) => (
                  <MonographPlateCard
                    key={project.id}
                    project={project}
                    index={idx}
                    globalSolarHour={globalSolarHour}
                    globalCadMode={globalCadMode}
                    isActive={currentProject?.id === project.id}
                    onActivate={setActiveProject}
                    onSelectProject={onSelectProject}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollShutterSection>
    </section>
  );
}
