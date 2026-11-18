import React, { useState, useCallback } from 'react';
import DynamicDockNav from './components/DynamicDockNav';
import HeroPortfolio from './components/HeroPortfolio';
import WorkStageShowcase from './components/WorkStageShowcase';
import EngineeringLabSection from './components/EngineeringLabSection';
import ContactFooter from './components/ContactFooter';
import LiveSiteTheaterModal from './components/LiveSiteTheaterModal';
import ClientInquiryModal from './components/ClientInquiryModal';
import PortfolioShaderCanvas from './components/PortfolioShaderCanvas';
import { PORTFOLIO_PROJECTS } from './data/projects';
import { MessageSquarePlus } from 'lucide-react';
import soundEngine from './utils/soundEngine';

export default function App() {
  const [activeProject, setActiveProject] = useState(PORTFOLIO_PROJECTS[0]);
  const [theaterProject, setTheaterProject] = useState(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryPrefill, setInquiryPrefill] = useState(null);

  const handleScrollTo = useCallback((selector) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleOpenTheater = useCallback((proj) => {
    soundEngine.playClick();
    setTheaterProject(proj);
  }, []);

  const handleOpenInquiry = useCallback((prefill = null) => {
    soundEngine.playClick();
    setInquiryPrefill(prefill);
    setInquiryOpen(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#060608] text-[#F5F4F0] overflow-x-hidden">
      {/* Subtle 60/120fps WebGL Iridescent Silk Background */}
      <PortfolioShaderCanvas accentColor={activeProject?.accent || '#38BDF8'} />

      {/* Clean Top Navigation Dock with Prominent "Get Your Website Built" CTA */}
      <DynamicDockNav
        activeProject={activeProject}
        onSelectProject={setActiveProject}
        onOpenTheater={handleOpenTheater}
        onOpenInquiry={() => handleOpenInquiry()}
        onScrollTo={handleScrollTo}
      />

      <main className="relative z-10">
        <HeroPortfolio
          onOpenTheater={handleOpenTheater}
          onOpenInquiry={handleOpenInquiry}
          onScrollTo={handleScrollTo}
          onHoverProject={setActiveProject}
        />

        <WorkStageShowcase
          activeProject={activeProject}
          onOpenTheater={handleOpenTheater}
          onOpenInquiry={handleOpenInquiry}
          onActiveChange={setActiveProject}
        />

        <EngineeringLabSection onOpenInquiry={handleOpenInquiry} />
      </main>

      <div className="relative z-10">
        <ContactFooter onOpenTheater={handleOpenTheater} />
      </div>

      {/* Persistent Floating "Get a Website Quote" Button in Bottom-Right */}
      <button
        type="button"
        onClick={() => handleOpenInquiry()}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#E2D9C8] hover:bg-white text-[#060608] font-display font-bold text-xs uppercase tracking-wider shadow-[0_15px_40px_rgba(0,0,0,0.65)] transition-transform active:scale-95"
      >
        <MessageSquarePlus className="w-4 h-4" />
        <span>Get a Website Quote</span>
      </button>

      {/* Instant Client Inquiry & Project Scope Modal */}
      <ClientInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        prefill={inquiryPrefill}
      />

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
