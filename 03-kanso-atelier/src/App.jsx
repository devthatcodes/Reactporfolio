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

  // Track active scroll section for Spatial HUD telemetry
  useEffect(() => {
    const updateSection = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y < vh * 0.6) {
        setActiveSectionLabel('00 // HELIODON ORIGIN');
      } else if (y < vh * 1.9) {
        setActiveSectionLabel('01 // STUDIO & ETHOS');
      } else if (y < vh * 3.2) {
        setActiveSectionLabel('02 // MONOGRAPH ARCHIVE');
      } else {
        setActiveSectionLabel('04 // COMMISSION DOSSIER');
      }
    };
    window.addEventListener('scroll', updateSection, { passive: true });
    return () => window.removeEventListener('scroll', updateSection);
  }, []);

  const triggerPortalTransition = useCallback((config, onMidpoint) => {
    setTransitionState({
      active: true,
      title: config.title || 'KANSO ATELIER',
      subtitle: config.subtitle || '',
      code: config.code || 'PORTAL // TRANSITION',
    });

    setTimeout(() => {
      if (onMidpoint) onMidpoint();
    }, 300);

    setTimeout(() => {
      setTransitionState((prev) => ({ ...prev, active: false }));
    }, 760);
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
      {/* Active Theory Calibration Preloader */}
      <Preloader />

      {/* Custom Magnetic Reticle Cursor */}
      <CustomCursor />

      {/* Real-Time WebGL Caustic Light & Liquid Stone Shader */}
      <ArchitecturalShaderCanvas
        lightingMode={lightingMode}
        onTelemetryUpdate={setTelemetry}
      />

      {/* Multi-Blade Architectural Portal Shutter Transition */}
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
        <Hero onNavigatePortal={handleNavigatePortal} />
        <Philosophy />
        <PortfolioGallery onSelectProject={handleSelectProject} />
        <ContactSection />
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
