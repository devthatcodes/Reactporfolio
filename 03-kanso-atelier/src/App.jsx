import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import PortfolioGallery from './components/PortfolioGallery';
import ProjectModal from './components/ProjectModal';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ArchitecturalShaderCanvas from './components/ArchitecturalShaderCanvas';
import Preloader from './components/Preloader';
import SpatialHud from './components/SpatialHud';
import PortalTransition from './components/PortalTransition';
import CustomCursor from './components/CustomCursor';
import {
  ScrollShutterSection,
  ScrollArchitecturalMarquee,
} from './components/ScrollArchitectureTransition';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightingMode, setLightingMode] = useState(0);
  const [telemetry, setTelemetry] = useState({
    mouseX: 0.65,
    mouseY: 0.35,
    velocity: 0,
    scroll: 0,
  });
  const [activeSectionLabel, setActiveSectionLabel] = useState('00 // HELIODON ORIGIN');
  const [transitionState, setTransitionState] = useState({
    active: false,
    title: '',
    subtitle: '',
    code: '',
  });

  // Track active scroll section without calling setState unless label actually changes
  useEffect(() => {
    let ticking = false;
    const updateSection = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        let nextLabel = '04 // COMMISSION DOSSIER';
        if (y < vh * 0.7) {
          nextLabel = '00 // HELIODON ORIGIN';
        } else if (y < vh * 2.1) {
          nextLabel = '01 // STUDIO & ETHOS';
        } else if (y < vh * 5.2) {
          nextLabel = '02 // SPLIT-SCREEN MONOGRAPHS';
        }
        setActiveSectionLabel((prev) => (prev === nextLabel ? prev : nextLabel));
        ticking = false;
      });
    };
    window.addEventListener('scroll', updateSection, { passive: true });
    return () => window.removeEventListener('scroll', updateSection);
  }, []);

  const triggerPortalTransition = useCallback((config, onMidpoint) => {
    setTransitionState({
      active: true,
      title: config.title || 'KANSO ATELIER',
      subtitle: config.subtitle || '',
      code: config.code || 'MA // SPATIAL INTERVAL',
    });

    setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, 210);

    setTimeout(() => {
      setTransitionState((prev) => ({ ...prev, active: false }));
    }, 480);
  }, []);

  const handleNavigatePortal = useCallback(
    (navItem) => {
      triggerPortalTransition(
        {
          code: `SECTOR ${navItem.index} // NAVIGATION`,
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
          code: `MONOGRAPH ${project.index} // ${project.category.toUpperCase()}`,
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
    <div className="relative min-h-screen bg-alabaster text-charcoal flex flex-col selection:bg-bronze selection:text-alabaster">
      {/* Calibration Preloader */}
      <Preloader />

      {/* Custom Magnetic Reticle Cursor */}
      <CustomCursor />

      {/* Lightweight 0.75 DPR WebGL Caustic Light & Limestone Shader */}
      <ArchitecturalShaderCanvas
        lightingMode={lightingMode}
        onTelemetryUpdate={setTelemetry}
      />

      {/* Horizontal Shoji Sliding Doors Transition (480ms GPU translateX) */}
      <PortalTransition transitionState={transitionState} />

      {/* Persistent Peripheral Spatial HUD & Shader Mode Switcher */}
      <SpatialHud
        telemetry={telemetry}
        lightingMode={lightingMode}
        onChangeLightingMode={setLightingMode}
        activeSectionLabel={activeSectionLabel}
      />

      <Header onNavigatePortal={handleNavigatePortal} />

      <main className="flex-1 relative z-10">
        {/* 00 // HERO SECTION */}
        <ScrollShutterSection
          isHero
          sectionCode="00 // HELIODON ORIGIN"
          datumLabel="SOLAR MONOLITH // ELEV +0.00M"
          coordinates="35.0116° N · 55.6761° N"
        >
          <Hero onNavigatePortal={handleNavigatePortal} />
        </ScrollShutterSection>

        {/* SCROLL-SCRUBBED KINETIC CAD DIVIDER 01 */}
        <ScrollArchitecturalMarquee
          indexTag="DATUM TRANSITION // 00 → 01"
          primaryText="KANSO ATELIER · MATERIAL HONESTY · CHOREOGRAPHED DAYLIGHT · SPATIAL STILLNESS"
          secondaryText="SECTION A–A // KYOTO TIMBER JOINERY // COPENHAGEN MASONRY // 1:100 ARCHITECTURAL DATUM"
        />

        {/* 01 & 03 // STUDIO & ARCHITECTURAL ETHOS */}
        <ScrollShutterSection
          sectionCode="01 // STUDIO & ETHOS"
          datumLabel="THREE PILLARS OF FORM // ELEV +4.20M"
          coordinates="KYOTO · COPENHAGEN"
        >
          <Philosophy />
        </ScrollShutterSection>

        {/* SCROLL-SCRUBBED KINETIC CAD DIVIDER 02 */}
        <ScrollArchitecturalMarquee
          indexTag="DATUM TRANSITION // 01 → 02"
          primaryText="SELECTED ARCHITECTURAL MONOGRAPHS · SPLIT-SCREEN ARCHIVE · BUILT & ONGOING WORKS"
          secondaryText="SOLAR HELIODON ACTIVE // HINOKI CYPRESS // KOLUMBA BRICK // YAKISUGI CEDAR // BOARD-FORMED CONCRETE"
        />

        {/* 02 // EDITORIAL SPLIT-SCREEN STICKY MONOGRAPH SHOWCASE */}
        <PortfolioGallery onSelectProject={handleSelectProject} />

        {/* SCROLL-SCRUBBED KINETIC CAD DIVIDER 03 */}
        <ScrollArchitecturalMarquee
          indexTag="DATUM TRANSITION // 02 → 04"
          primaryText="COMMISSION DOSSIER · PRIVATE RESIDENCES · CULTURAL ARCHIVES · SANCTUARIES"
          secondaryText="INQUIRIES OPEN 2025–2026 // NAKAGYO-KU KYOTO // BREDGADE COPENHAGEN // GLOBAL SITE ANALYSIS"
        />

        {/* 04 // COMMISSION DOSSIER & INQUIRIES */}
        <ScrollShutterSection
          sectionCode="04 // COMMISSION DOSSIER"
          datumLabel="INQUIRY INTAKE // ELEV +8.40M"
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
