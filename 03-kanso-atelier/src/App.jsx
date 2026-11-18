import React, { useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import PortfolioGallery from './components/PortfolioGallery';
import ProjectModal from './components/ProjectModal';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import PortalTransition from './components/PortalTransition';
import CustomCursor from './components/CustomCursor';
import {
  ScrollShutterSection,
  ArchitecturalElevationDivider,
} from './components/ScrollArchitectureTransition';

/**
 * Architectural Paper Grain & Shifting Sunlight Shadow Overlay
 * Casts soft diagonal window-mullion light shafts across the warm limestone
 * (#F6F4F0) background as the reader scrolls through the monograph.
 */
function SunlightShadowOverlay() {
  const { scrollYProgress } = useScroll();
  const shadowTranslateX = useTransform(scrollYProgress, [0, 1], ['-6%', '8%']);
  const shadowTranslateY = useTransform(scrollYProgress, [0, 1], ['-3%', '5%']);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Shifting Diagonal Window-Mullion Sunlight Shafts */}
      <motion.div
        style={{ x: shadowTranslateX, y: shadowTranslateY }}
        className="absolute -inset-[15%] will-change-transform"
      >
        <div
          className="w-full h-full opacity-75"
          style={{
            background:
              'linear-gradient(122deg, rgba(28,27,25,0.03) 0%, rgba(255,252,245,0.45) 18%, rgba(28,27,25,0.025) 26%, rgba(255,252,245,0.4) 44%, rgba(154,123,79,0.04) 58%, rgba(255,252,245,0.35) 76%, rgba(28,27,25,0.03) 100%)',
          }}
        />
      </motion.div>

      {/* Subtle Cotton-Rag Archival Paper Grain */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(28, 27, 25, 0.75) 0.5px, transparent 0.5px)',
          backgroundSize: '12px 12px',
        }}
      />
    </div>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [transitionState, setTransitionState] = useState({
    active: false,
    title: '',
    subtitle: '',
    code: '',
  });

  const triggerPortalTransition = useCallback((config, onMidpoint) => {
    setTransitionState({
      active: true,
      title: config.title || 'Kanso Atelier',
      subtitle: config.subtitle || '',
      code: config.code || 'FOLIO // MONOGRAPH',
    });

    setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, 320);

    setTimeout(() => {
      setTransitionState((prev) => ({ ...prev, active: false }));
    }, 720);
  }, []);

  const handleNavigatePortal = useCallback(
    (navItem) => {
      triggerPortalTransition(
        {
          code: `CHAPTER ${navItem.index} // MONOGRAPH`,
          title: navItem.sectionTitle || navItem.label,
          subtitle: '35.0116° N · 55.6761° N',
        },
        () => {
          const el = document.querySelector(navItem.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      );
    },
    [triggerPortalTransition]
  );

  const handleSelectProject = useCallback(
    (project) => {
      if (!project) {
        setSelectedProject(null);
        return;
      }
      triggerPortalTransition(
        {
          code: `PLATE ${project.index} // ${project.category.toUpperCase()}`,
          title: project.title,
          subtitle: `${project.location} · ${project.area}`,
        },
        () => {
          setSelectedProject(project);
        }
      );
    },
    [triggerPortalTransition]
  );

  return (
    <div className="relative min-h-screen bg-[#F6F4F0] text-charcoal flex flex-col selection:bg-bronze selection:text-alabaster">
      {/* Editorial Blend-Mode Ink Lens Cursor */}
      <CustomCursor />

      {/* Serene Architectural Paper Grain & Shifting Sunlight Shadow Overlay */}
      <SunlightShadowOverlay />

      {/* Monograph Page-Turn Transition */}
      <PortalTransition transitionState={transitionState} />

      <Header onNavigatePortal={handleNavigatePortal} />

      <main className="flex-1 relative z-10">
        {/* PROLOGUE // HERO SECTION */}
        <ScrollShutterSection
          isHero
          romanNumeral="0"
          sectionCode="PROLOGUE // HELIODON ORIGIN"
          datumLabel="SOLAR MONOLITH // ELEV +0.00M"
          coordinates="35.0116° N · 55.6761° N"
        >
          <Hero onNavigatePortal={handleNavigatePortal} />
        </ScrollShutterSection>

        {/* SELF-DRAWING ARCHITECTURAL ELEVATION DIVIDER I */}
        <ArchitecturalElevationDivider
          chapter="CHAPTER I // PHILOSOPHY"
          elevation="ELEV +4.20M // KYOTO · COPENHAGEN"
          kanji="間 // MA — SPATIAL STILLNESS"
        />

        {/* CHAPTER I // STUDIO & ARCHITECTURAL ETHOS */}
        <ScrollShutterSection
          romanNumeral="I"
          sectionCode="CHAPTER I // PHILOSOPHY"
          datumLabel="THREE PILLARS OF FORM // ELEV +4.20M"
          coordinates="KYOTO · COPENHAGEN"
        >
          <Philosophy />
        </ScrollShutterSection>

        {/* SELF-DRAWING ARCHITECTURAL ELEVATION DIVIDER II */}
        <ArchitecturalElevationDivider
          chapter="CHAPTER II // MONOGRAPHS"
          elevation="PLATES I–VI // 1:100 ARCHITECTURAL ARCHIVE"
          kanji="光 // HIKARI — CHOREOGRAPHED DAYLIGHT"
        />

        {/* CHAPTER II // STAGGERED ASYMMETRIC EDITORIAL EXHIBITION */}
        <PortfolioGallery onSelectProject={handleSelectProject} />

        {/* SELF-DRAWING ARCHITECTURAL ELEVATION DIVIDER III */}
        <ArchitecturalElevationDivider
          chapter="CHAPTER III // COMMISSION"
          elevation="ELEV +8.40M // PRIVATE & CULTURAL INQUIRIES"
          kanji="静 // SEI — QUIET PROPORTION"
        />

        {/* CHAPTER III // COMMISSION DOSSIER & INQUIRIES */}
        <ScrollShutterSection
          romanNumeral="III"
          sectionCode="CHAPTER III // COMMISSION"
          datumLabel="INQUIRY DOSSIER // ELEV +8.40M"
          coordinates="35.0116° N · 135.7681° E"
        >
          <ContactSection />
        </ScrollShutterSection>
      </main>

      <Footer />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onSelectProject={handleSelectProject}
      />
    </div>
  );
}
