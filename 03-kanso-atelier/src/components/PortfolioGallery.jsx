import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import { ArrowUpRight, Layers, Grid, Sun, Compass, MoveHorizontal } from 'lucide-react';
import { CATEGORIES, PROJECTS } from '../data/projects';
import { ProjectPerspective, ProjectFloorplan } from './ProjectArtwork';
import ScrambleText from './ScrambleText';
import { soundEngine } from '../utils/soundEngine';
import {
  ScrollShutterSection,
  VelocitySkewWrapper,
} from './ScrollArchitectureTransition';

/**
 * Individual Monograph Slide in the Sticky Scroll-Scrubbed 3D Architectural Runway.
 * Driven continuously by parent runway scrollYProgress [0 -> 1].
 */
function RunwayMonographCard({
  project,
  index,
  total,
  scrollYProgress,
  globalSolarHour,
  onSelectProject,
}) {
  const [showBlueprint, setShowBlueprint] = useState(false);

  // Center point in normalized scroll [0.08 .. 0.92] for each card
  const step = 0.82 / Math.max(1, total - 1);
  const center = 0.09 + index * step;
  const span = step * 1.35;

  const start = center - span;
  const end = center + span;

  // Horizontal flight across the 3D stage
  const x = useTransform(
    scrollYProgress,
    [start, center, end],
    ['115%', '0%', '-115%']
  );

  // 3D Perspective Rotation as it enters from right, squares up at center, and banks left
  const rotateY = useTransform(
    scrollYProgress,
    [start, center - span * 0.35, center, center + span * 0.35, end],
    [-38, -14, 0, 14, 38]
  );

  const rotateX = useTransform(
    scrollYProgress,
    [start, center, end],
    [10, 0, -8]
  );

  const scale = useTransform(
    scrollYProgress,
    [start, center - span * 0.25, center, center + span * 0.25, end],
    [0.76, 0.96, 1.02, 0.96, 0.76]
  );

  const opacity = useTransform(
    scrollYProgress,
    [start, center - span * 0.45, center, center + span * 0.45, end],
    [0, 0.92, 1, 0.92, 0]
  );

  // Foreground multi-depth parallax plaques (move faster/differently than the main card)
  const plaqueX = useTransform(
    scrollYProgress,
    [start, center, end],
    ['160px', '0px', '-160px']
  );
  const plaqueY = useTransform(
    scrollYProgress,
    [start, center, end],
    ['45px', '0px', '-45px']
  );
  const materialPlaqueX = useTransform(
    scrollYProgress,
    [start, center, end],
    ['-120px', '0px', '120px']
  );

  // Dynamic solar hour modulated by scroll position for live caustic shadow movement
  const dynamicSolar = Math.min(19.5, Math.max(6.5, globalSolarHour + (index - 2.5) * 0.8));

  return (
    <motion.article
      style={{
        x,
        rotateY,
        rotateX,
        scale,
        opacity,
        transformPerspective: 1800,
        transformStyle: 'preserve-3d',
      }}
      onClick={() => {
        soundEngine.playPortalSweep();
        onSelectProject(project);
      }}
      onMouseEnter={() => soundEngine.playHoverTick(1.0)}
      data-cursor="OPEN 3D MONOGRAPH"
      className="absolute inset-x-0 mx-auto w-[92%] max-w-[980px] cursor-pointer select-none will-change-transform"
    >
      {/* Floating Foreground Parallax Plaque 1: GPS Coordinates & Typology (Z +70px) */}
      <motion.div
        style={{
          x: plaqueX,
          y: plaqueY,
          translateZ: 70,
        }}
        className="hidden md:flex items-center gap-3 absolute -top-6 left-8 z-30 px-4 py-2 bg-charcoal text-alabaster border border-bronze/60 shadow-2xl"
      >
        <Compass className="w-3.5 h-3.5 text-bronze" />
        <div className="text-[10px] font-mono uppercase tracking-[0.22em]">
          <span className="text-bronze">MONOGRAPH {project.index}</span>
          <span className="mx-2 text-alabaster/30">//</span>
          <span>{project.location.toUpperCase()}</span>
          <span className="mx-2 text-alabaster/30">·</span>
          <span className="text-bronze">{project.area}</span>
        </div>
      </motion.div>

      {/* Main Architectural Stage Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-alabaster/95 backdrop-blur-md border border-charcoal/20 shadow-[0_30px_90px_rgba(28,27,25,0.16)] overflow-hidden">
        {/* Left 7 Cols: 3D Architectural Elevation / Blueprint Viewport */}
        <div className="lg:col-span-7 relative aspect-[16/10] bg-stone border-b lg:border-b-0 lg:border-r border-charcoal/15 overflow-hidden group">
          <div className="w-full h-full transition-transform duration-700 group-hover:scale-[1.03]">
            {showBlueprint ? (
              <ProjectFloorplan id={project.id} />
            ) : (
              <ProjectPerspective id={project.id} solarHour={dynamicSolar} />
            )}
          </div>

          {/* CAD Blueprint Switcher Pill */}
          <button
            type="button"
            data-cursor="SWITCH CAD LAYER"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick('timber');
              setShowBlueprint((prev) => !prev);
            }}
            className="absolute top-4 right-4 z-20 px-3 py-1 bg-charcoal/90 text-alabaster hover:bg-bronze text-[9px] font-mono uppercase tracking-[0.2em] transition-colors"
          >
            {showBlueprint ? 'ELEVATION RENDER' : 'CAD SECTION 1:100'}
          </button>

          {/* Bottom-left Elevation Spec Note */}
          <div className="absolute bottom-3.5 left-4 px-2.5 py-1 bg-alabaster/90 backdrop-blur-sm border border-charcoal/15 text-[9px] font-mono uppercase tracking-[0.18em] text-charcoal">
            {project.elevationNote}
          </div>
        </div>

        {/* Right 5 Cols: Spatial Dossier & Portal Trigger */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-alabaster">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-taupe">
              <span>{project.category}</span>
              <span>YEAR // {project.year}</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-charcoal leading-tight">
              {project.title}
            </h3>

            <p className="text-xs font-mono uppercase tracking-[0.18em] text-bronze">
              {project.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-taupe leading-relaxed font-light pt-1">
              {project.narrative}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-charcoal/10 flex items-center justify-between">
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-taupe">
              LEAD: <span className="text-charcoal">{project.lead}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-charcoal text-alabaster hover:bg-bronze transition-colors text-[10px] font-mono uppercase tracking-[0.2em]">
              <span>OPEN PORTAL</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-bronze" />
            </span>
          </div>
        </div>
      </div>

      {/* Floating Foreground Parallax Plaque 2: Materiality & Solar Telemetry (Z +95px) */}
      <motion.div
        style={{
          x: materialPlaqueX,
          translateZ: 95,
        }}
        className="hidden sm:flex items-center justify-between gap-6 absolute -bottom-5 right-6 z-30 px-5 py-2.5 bg-stone/95 backdrop-blur-md border border-charcoal/25 shadow-xl"
      >
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-bronze">
            MATERIALS:
          </span>
          <div className="flex items-center gap-1.5">
            {project.materials.slice(0, 3).map((mat) => (
              <span
                key={mat}
                className="px-2 py-0.5 bg-alabaster border border-charcoal/15 text-[9px] font-mono text-charcoal"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>
        <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-charcoal border-l border-charcoal/15 pl-4">
          SOLAR ALT {Math.round(32 + index * 7)}°
        </div>
      </motion.div>
    </motion.article>
  );
}

/**
 * 3D Velocity & Scroll-Parallax Reactive Architectural Card for the Archive Grid
 */
function ArchitecturalWorkCard({
  project,
  index,
  displayMode,
  globalSolarHour,
  onSelectProject,
}) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [showBlueprint, setShowBlueprint] = useState(false);

  // Individual card scroll parallax & 3D entrance
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const columnOffset = (index % 3) * 18 - 18;
  const scrollYShift = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [45 + columnOffset, 0, -35 - columnOffset]
  );
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [14, 0, 0, -10]);
  const scrollScale = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0.92, 1, 1, 0.94]);

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
        style={{
          y: scrollYShift,
          rotateX: scrollRotateX,
          scale: scrollScale,
          transformPerspective: 1200,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => soundEngine.playHoverTick(0.95)}
        onClick={() => {
          soundEngine.playPortalSweep();
          onSelectProject(project);
        }}
        data-cursor="ENTER MONOGRAPH"
        className="group cursor-pointer bg-alabaster/90 backdrop-blur-sm border border-charcoal/15 hover:border-bronze/70 transition-colors duration-300 p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm will-change-transform"
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

  // Editorial 3-Column Grid Card with differential column scroll parallax + 3D tilt
  return (
    <motion.article
      ref={cardRef}
      layout
      style={{
        y: scrollYShift,
        rotateX: scrollRotateX,
        scale: scrollScale,
        transformPerspective: 1100,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => soundEngine.playHoverTick(1.0)}
      onClick={() => {
        soundEngine.playPortalSweep();
        onSelectProject(project);
      }}
      data-cursor="ENTER MONOGRAPH"
      className="group cursor-pointer flex flex-col will-change-transform"
    >
      {/* Architectural SVG Canvas */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX * 0.7}deg) rotateY(${tilt.rotateY * 0.7}deg)`,
        }}
        className="relative overflow-hidden bg-stone border border-charcoal/15 aspect-[4/3] transition-shadow duration-300 group-hover:shadow-xl"
      >
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

  // Sticky Scroll-Driven 3D Architectural Runway Ref & Scroll Progress
  const runwayRef = useRef(null);
  const { scrollYProgress: rawRunwayProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  const runwayProgress = useSpring(rawRunwayProgress, {
    stiffness: 160,
    damping: 30,
    mass: 0.35,
  });

  // Runway aperture clip-path & 3D stage perspective on entry/exit
  const stageInset = useTransform(
    runwayProgress,
    [0, 0.08, 0.92, 1],
    [6, 0, 0, 6]
  );
  const stageRadius = useTransform(
    runwayProgress,
    [0, 0.08, 0.92, 1],
    [16, 0, 0, 16]
  );
  const stageClipPath = useMotionTemplate`inset(${stageInset}% ${stageInset}% ${stageInset}% ${stageInset}% round ${stageRadius}px)`;

  // Background architectural grid parallax inside the sticky stage
  const bgGridX = useTransform(runwayProgress, [0, 1], ['0%', '-18%']);
  const progressBarScaleX = useTransform(runwayProgress, [0, 1], [0, 1]);

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
      {/* =====================================================================
          PART 1: STICKY SCROLL-SCRUBBED 3D ARCHITECTURAL MONOGRAPH RUNWAY
          min-h-[280vh] with sticky top-16 h-[calc(100vh-4rem)] 3D stage
         ===================================================================== */}
      <div ref={runwayRef} className="relative min-h-[280vh] bg-stone/75 border-b border-charcoal/15">
        <div className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-hidden flex flex-col justify-between">
          <motion.div
            style={{ clipPath: stageClipPath }}
            className="relative w-full h-full flex flex-col justify-between py-6 sm:py-10 px-6 md:px-12 bg-alabaster/85 backdrop-blur-[3px]"
          >
            {/* Moving Architectural Blueprint Grid Plane in Stage Background */}
            <motion.div
              style={{ x: bgGridX }}
              className="pointer-events-none absolute inset-y-0 -left-1/4 w-[150%] bg-architectural-grid opacity-55"
            />

            {/* Top Stage Telemetry Header */}
            <div className="relative z-20 max-w-[1360px] w-full mx-auto flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/15 pb-4">
              <div>
                <div className="flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-[0.24em] text-bronze">
                  <MoveHorizontal className="w-3.5 h-3.5" />
                  <span>02A // SCROLL-SCRUBBED 3D SPATIAL RUNWAY</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mt-1">
                  Monograph Flight Sequence (01 — 06)
                </h2>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end text-[10px] font-mono uppercase tracking-[0.2em] text-taupe">
                  <span>SCROLL TO FLY THROUGH 3D PERSPECTIVE</span>
                  <span className="text-bronze">CLICK ANY MONOGRAPH TO LAUNCH PORTAL</span>
                </div>
                <a
                  href="#archive-index"
                  className="px-3 py-1.5 border border-charcoal/20 hover:border-bronze text-[10px] font-mono uppercase tracking-[0.2em] text-charcoal hover:text-bronze transition-colors bg-alabaster/80"
                >
                  SKIP TO INDEX ↓
                </a>
              </div>
            </div>

            {/* Center 3D Perspective Stage where 6 Monographs Fly Through */}
            <VelocitySkewWrapper
              intensity={0.85}
              className="relative z-20 flex-1 flex items-center justify-center my-auto [perspective:1800px]"
            >
              {PROJECTS.map((project, index) => (
                <RunwayMonographCard
                  key={project.id}
                  project={project}
                  index={index}
                  total={PROJECTS.length}
                  scrollYProgress={runwayProgress}
                  globalSolarHour={globalSolarHour}
                  onSelectProject={onSelectProject}
                />
              ))}
            </VelocitySkewWrapper>

            {/* Bottom Scroll-Scrubbed Progress Ruler & Monograph Station Ticks */}
            <div className="relative z-20 max-w-[1360px] w-full mx-auto pt-4 border-t border-charcoal/15">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-taupe mb-2">
                {PROJECTS.map((proj) => (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => onSelectProject(proj)}
                    className="hover:text-bronze transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-bronze">{proj.index}</span>
                    <span className="hidden md:inline">{proj.title.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
              <div className="relative h-1 w-full bg-charcoal/10 overflow-hidden">
                <motion.div
                  style={{ scaleX: progressBarScaleX, transformOrigin: 'left center' }}
                  className="absolute inset-0 bg-bronze"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* =====================================================================
          PART 2: FILTERABLE ARCHITECTURAL ARCHIVE GRID & 3D STREAM REEL
         ===================================================================== */}
      <ScrollShutterSection
        sectionCode="02B // ARCHIVE MATRIX"
        datumLabel="FILTERABLE TYPOLOGY ARCHIVE // 1:100"
        coordinates="KYOTO · COPENHAGEN · NAOSHIMA"
      >
        <VelocitySkewWrapper intensity={0.75}>
          <div
            id="archive-index"
            className="py-24 md:py-32 bg-alabaster/80 backdrop-blur-[2px]"
          >
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
                        setGlobalSolarHour(parseFloat(e.target.value));
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
                {filteredProjects.map((project, idx) => (
                  <ArchitecturalWorkCard
                    key={project.id}
                    project={project}
                    index={idx}
                    displayMode={displayMode}
                    globalSolarHour={globalSolarHour}
                    onSelectProject={onSelectProject}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
        </VelocitySkewWrapper>
      </ScrollShutterSection>
    </section>
  );
}
