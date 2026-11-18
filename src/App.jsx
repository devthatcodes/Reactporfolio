import React, { useState } from 'react';
import DynamicDockNav from './components/DynamicDockNav';
import HeroPortfolio from './components/HeroPortfolio';
import WorkStageShowcase from './components/WorkStageShowcase';
import EngineeringLabSection from './components/EngineeringLabSection';
import ContactFooter from './components/ContactFooter';
import LiveSiteTheaterModal from './components/LiveSiteTheaterModal';
import { PORTFOLIO_PROJECTS } from './data/projects';

export default function App() {
  const [activeProject, setActiveProject] = useState(PORTFOLIO_PROJECTS[0]);
  const [theaterProject, setTheaterProject] = useState(null);

  const handleScrollTo = (selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#F4F3EF] overflow-x-hidden">
      {/* Dynamic Scroll-Morphing Ambient Stage Lighting */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 75% 22%, ${
            activeProject?.bgGlow || 'rgba(56, 189, 248, 0.14)'
          } 0%, transparent 55%), radial-gradient(circle at 20% 80%, ${
            activeProject?.bgGlow || 'rgba(56, 189, 248, 0.10)'
          } 0%, transparent 55%)`,
        }}
      />

      {/* Dynamic Island Spring Navigation Dock */}
      <DynamicDockNav
        activeProject={activeProject}
        onSelectProject={setActiveProject}
        onOpenTheater={(proj) => setTheaterProject(proj)}
        onScrollTo={handleScrollTo}
      />

      <main className="relative z-10">
        <HeroPortfolio
          onOpenTheater={(proj) => setTheaterProject(proj)}
          onScrollTo={handleScrollTo}
          onHoverProject={setActiveProject}
        />

        <WorkStageShowcase
          onOpenTheater={(proj) => setTheaterProject(proj)}
          onActiveChange={setActiveProject}
        />

        <EngineeringLabSection />
      </main>

      <div className="relative z-10">
        <ContactFooter onOpenTheater={(proj) => setTheaterProject(proj)} />
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
