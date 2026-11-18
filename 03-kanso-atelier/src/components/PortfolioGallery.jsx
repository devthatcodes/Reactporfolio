import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Sun, Layers } from 'lucide-react';
import { CATEGORIES, PROJECTS } from '../data/projects';
import { ProjectPerspective, ProjectFloorplan } from './ProjectArtwork';
import { soundEngine } from '../utils/soundEngine';
import { ScrollShutterSection } from './ScrollArchitectureTransition';
import ScrambleText from './ScrambleText';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

/**
 * Staggered Asymmetric Monograph Plate Card
 * Features:
 * 1. Alternating 7-column and offset 5-column editorial layout
 * 2. Warm limestone Paper Curtain Overlay (bg-[#EAE6DF]) sliding off over 1.1s ease [0.16, 1, 0.3, 1]
 * 3. Simultaneous inner artwork scale-down from scale(1.16) to scale(1.0)
 * 4. Subtle vertical scroll parallax (y: ['-6%', '6%'])
 */
function MonographPlateCard({
  project,
  index,
  romanNumeral,
  globalSolarHour,
  globalCadMode,
  onSelectProject,
}) {
  const plateRef = useRef(null);
  const [localCadOverride, setLocalCadOverride] = useState(null);

  const showBlueprint = localCadOverride !== null ? localCadOverride : globalCadMode;

  // Inner image vertical scroll parallax: y: ['-6%', '6%']
  const { scrollYProgress } = useScroll({
    target: plateRef,
    offset: ['start end', 'end start'],
  });

  const innerParallaxY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const dynamicSolar = Math.min(19.5, Math.max(6.5, globalSolarHour + (index - 2) * 0.45));

  // Alternating asymmetric layout:
  // Row 0: Plate I (7 cols left), Plate II (5 cols right, offset down)
  // Row 1: Plate III (5 cols left, offset down), Plate IV (7 cols right)
  // Row 2: Plate V (7 cols left), Plate VI (5 cols right, offset down)
  const row = Math.floor(index / 2);
  const isLeftInRow = index % 2 === 0;
  const isLargePlate = row % 2 === 0 ? isLeftInRow : !isLeftInRow;

  const colSpanClass = isLargePlate
    ? 'lg:col-span-7'
    : 'lg:col-span-5 lg:mt-24';

  const aspectClass = isLargePlate ? 'aspect-[16/11]' : 'aspect-[4/5]';
  const useVerticalCurtain = index % 2 === 0;

  return (
    <motion.article
      ref={plateRef}
      id={`monograph-plate-${project.id}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => {
        soundEngine.playPortalSweep();
        onSelectProject(project);
      }}
      onMouseEnter={() => {
        soundEngine.playHoverTick(1.0);
      }}
      data-cursor="View"
      className={`${colSpanClass} group relative flex flex-col cursor-pointer select-none will-change-transform`}
    >
      {/* Top Roman Numeral Plate Header */}
      <div className="flex items-baseline justify-between pb-3 mb-3 border-b border-charcoal/15">
        <div className="flex items-baseline gap-3">
          <span className="font-serif italic text-base text-bronze">
            PLATE {romanNumeral}
          </span>
          <span className="text-charcoal/25 text-xs">—</span>
          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-charcoal">
            {project.category}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
          <span>{project.location}</span>
          <span className="text-bronze">·</span>
          <span>{project.area}</span>
        </div>
      </div>

      {/* Architectural Artwork Frame with Paper Curtain Unveil & Scale-Down (1.16 -> 1.0) */}
      <div className={`relative ${aspectClass} w-full overflow-hidden bg-stone border border-charcoal/15`}>
        {/* Warm Limestone/Alabaster Paper Curtain Overlay (bg-[#EAE6DF]) */}
        <motion.div
          initial={useVerticalCurtain ? { scaleY: 1 } : { scaleX: 1 }}
          whileInView={useVerticalCurtain ? { scaleY: 0 } : { scaleX: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transformOrigin: useVerticalCurtain ? 'top center' : 'right center',
          }}
          className="pointer-events-none absolute inset-0 z-20 bg-[#EAE6DF] border-b border-bronze/30 will-change-transform"
        />

        {/* Inner Parallax Layer (y: ['-6%', '6%']) + Scale-Down (1.16 -> 1.0) */}
        <motion.div
          style={{ y: innerParallaxY }}
          className="w-full h-full will-change-transform"
        >
          <motion.div
            initial={{ scale: 1.16 }}
            whileInView={{ scale: 1.0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] will-change-transform"
          >
            {showBlueprint ? (
              <ProjectFloorplan id={project.id} />
            ) : (
              <ProjectPerspective id={project.id} solarHour={dynamicSolar} />
            )}
          </motion.div>
        </motion.div>

        {/* Individual Plate CAD 1:100 Blueprint Toggle */}
        <button
          type="button"
          data-cursor="Plan"
          onClick={(e) => {
            e.stopPropagation();
            soundEngine.playClick('timber');
            setLocalCadOverride((prev) => (prev === null ? !globalCadMode : !prev));
          }}
          className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-alabaster/95 text-charcoal border border-charcoal/15 hover:border-bronze hover:text-bronze text-[9px] font-mono uppercase tracking-[0.2em] transition-colors"
        >
          {showBlueprint ? 'Elevation Render' : 'CAD 1:100'}
        </button>

        {/* Bottom-left Elevation Spec Note */}
        <div className="absolute bottom-4 left-4 z-10 px-3 py-1 bg-alabaster/90 backdrop-blur-sm border border-charcoal/10 text-[9px] font-mono uppercase tracking-[0.18em] text-charcoal/80">
          {project.elevationNote}
        </div>
      </div>

      {/* Editorial Monograph Plate Caption & Materiality */}
      <div className="pt-6 flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h3 className="font-serif text-3xl sm:text-4xl text-charcoal group-hover:text-bronze transition-colors duration-300 leading-tight">
              {project.title}
            </h3>
            <p className="font-serif italic text-base text-bronze mt-0.5">
              {project.subtitle}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-taupe group-hover:text-charcoal transition-colors shrink-0">
            <span>{project.year}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-bronze transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>

        <p className="text-sm text-taupe leading-relaxed font-light max-w-2xl">
          {project.narrative}
        </p>

        <div className="pt-3 mt-1 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {project.materials.map((mat) => (
              <span
                key={mat}
                className="text-[10px] font-mono uppercase tracking-[0.16em] text-taupe after:content-['·'] last:after:content-none after:ml-2 after:text-bronze"
              >
                {mat}
              </span>
            ))}
          </div>

          <span className="font-serif italic text-sm text-charcoal/80 group-hover:text-bronze transition-colors">
            Read Monograph →
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function PortfolioGallery({ onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [globalSolarHour, setGlobalSolarHour] = useState(11.0);
  const [globalCadMode, setGlobalCadMode] = useState(false);

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
    <section id="works" className="relative z-10">
      <ScrollShutterSection
        romanNumeral="II"
        sectionCode="CHAPTER II // MONOGRAPHS"
        datumLabel="ASYMMETRIC EDITORIAL EXHIBITION // 1:100"
        coordinates="KYOTO · COPENHAGEN · NAOSHIMA"
      >
        <div className="py-24 md:py-36 bg-alabaster/95 border-b border-charcoal/10">
          <div className="max-w-[1360px] mx-auto px-6 md:px-12">
            {/* Editorial Exhibition Masthead & Heliodon / CAD Controls */}
            <div className="pb-14 mb-16 md:mb-24 border-b border-charcoal/15 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-taupe">
                  <span className="font-serif italic text-sm text-bronze">II.</span>
                  <span>Selected Architectural Monographs · Plates I–VI</span>
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-charcoal font-normal leading-[1.06]">
                  <ScrambleText text="Built Works & Spatial Studies" duration={0.85} />
                </h2>
                <p className="text-sm sm:text-base text-taupe font-light leading-relaxed pt-1">
                  An asymmetric exhibition of residences, cultural archives, and sanctuaries. Use
                  the heliodon daylight study below to observe how natural sun angles transform
                  each elevation from dawn to dusk.
                </p>
              </div>

              {/* Interactive Controls: Live Heliodon Solar Time Slider (06:00-20:00) & CAD 1:100 Blueprint Toggle */}
              <div className="w-full lg:w-[420px] bg-stone/80 border border-charcoal/15 p-5 sm:p-6 space-y-5">
                {/* Heliodon Solar Time Slider */}
                <div data-cursor="Light" className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em]">
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

                {/* CAD 1:100 Blueprint Toggle & Category Filter */}
                <div className="pt-3 border-t border-charcoal/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    className="flex flex-wrap gap-1.5"
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
                          className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.18em] border transition-colors ${
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

                  <button
                    type="button"
                    data-cursor="Plan"
                    onClick={() => {
                      soundEngine.playClick('timber');
                      setGlobalCadMode((prev) => !prev);
                    }}
                    className={`px-3 py-1.5 border text-[9px] font-mono uppercase tracking-[0.2em] inline-flex items-center gap-1.5 transition-colors shrink-0 ${
                      globalCadMode
                        ? 'bg-charcoal text-alabaster border-charcoal'
                        : 'bg-alabaster text-charcoal border-charcoal/20 hover:border-bronze'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-bronze" />
                    <span>{globalCadMode ? 'CAD 1:100 ON' : 'CAD 1:100'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Staggered Asymmetric Editorial Exhibition Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-24 lg:gap-y-32 lg:gap-x-14 items-start">
              {filteredProjects.map((project, idx) => {
                const originalIdx = PROJECTS.findIndex((p) => p.id === project.id);
                const roman = ROMAN_NUMERALS[originalIdx >= 0 ? originalIdx : idx] || `${idx + 1}`;
                return (
                  <MonographPlateCard
                    key={project.id}
                    project={project}
                    index={idx}
                    romanNumeral={roman}
                    globalSolarHour={globalSolarHour}
                    globalCadMode={globalCadMode}
                    onSelectProject={onSelectProject}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </ScrollShutterSection>
    </section>
  );
}
