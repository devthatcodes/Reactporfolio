import React, { useState, useCallback, useEffect } from 'react';
import DynamicDockNav from './components/DynamicDockNav';
import HeroPortfolio from './components/HeroPortfolio';
import WorkStageShowcase from './components/WorkStageShowcase';
import EngineeringLabSection from './components/EngineeringLabSection';
import ContactFooter from './components/ContactFooter';
import LiveSiteTheaterModal from './components/LiveSiteTheaterModal';
import PortfolioShaderCanvas from './components/PortfolioShaderCanvas';
import PortfolioCursor from './components/PortfolioCursor';
import PortfolioCurtainTransition from './components/PortfolioCurtainTransition';
import { PORTFOLIO_PROJECTS } from './data/projects';
import soundEngine from './utils/soundEngine';

export default function App() {
  const [activeProject, setActiveProject] = useState(PORTFOLIO_PROJECTS[0]);
  const [theaterProject, setTheaterProject] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [transitionState, setTransitionState] = useState({
    active: false,
    title: '',
    subtitle: '',
    accent: '#E2D9C8',
  });

  useEffect(() => {
    return soundEngine.subscribe((enabled) => {
      setSoundEnabled(enabled);
    });
  }, []);

  const handleNavigate = useCallback(
    (selector, title = 'Selected Works', subtitle = 'DEONTAE WORK · FRONT END ENGINEER') => {
      soundEngine.playTransition();
      setTransitionState({
        active: true,
        title,
        subtitle,
        accent: activeProject?.accent || '#E2D9C8',
      });

      setTimeout(() => {
        const el = document.querySelector(selector);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 220);

      setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, active: false }));
      }, 640);
    },
    [activeProject]
  );

  const handleOpenTheater = useCallback((proj) => {
    soundEngine.playTransition();
    setTheaterProject(proj);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#060608] text-[#F5F4F0] overflow-x-hidden">
      {/* Custom Spring-Physics Lens Cursor */}
      <PortfolioCursor accentColor={activeProject?.accent} />

      {/* Diagonal Silk & DW Monogram Curtain Transition */}
      <PortfolioCurtainTransition transitionState={transitionState} />

      {/* Real-Time 60/120fps WebGL Iridescent Silk Canvas (Morphs Accent Color on Scroll) */}
      <PortfolioShaderCanvas accentColor={activeProject?.accent || '#38BDF8'} />

      {/* Top Architectural Identity & Floating Dock */}
      <DynamicDockNav
        activeProject={activeProject}
        onSelectProject={setActiveProject}
        onOpenTheater={handleOpenTheater}
        onNavigate={handleNavigate}
        soundEnabled={soundEnabled}
        onToggleSound={() => soundEngine.toggle()}
      />

      <main className="relative z-10">
        <HeroPortfolio
          onOpenTheater={handleOpenTheater}
          onNavigate={handleNavigate}
          onHoverProject={setActiveProject}
        />

        <WorkStageShowcase
          activeProject={activeProject}
          onOpenTheater={handleOpenTheater}
          onActiveChange={setActiveProject}
        />

        <EngineeringLabSection />
      </main>

      <div className="relative z-10">
        <ContactFooter onOpenTheater={handleOpenTheater} />
      </div>

      {/* Fullscreen Interactive Live Site Theater Modal */}
      {theaterProject && (
        <LiveSiteTheaterModal
          project={theaterProject}
          onClose={() => setTheaterProject(null)}
          onSelectProject={(proj) => setTheaterProject(proj)}
        />
      )}
    </div>
  );
}
