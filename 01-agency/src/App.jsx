import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import CaseHighlightsSection from './components/CaseHighlightsSection';
import ProcessSection from './components/ProcessSection';
import ScopeEstimatorSection from './components/ScopeEstimatorSection';
import InquiryModal from './components/InquiryModal';
import Footer from './components/Footer';

export default function App() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  const handleOpenInquiry = (prefill = null) => {
    setPrefillData(prefill);
    setInquiryOpen(true);
  };

  const handleInquireService = (serviceTitle) => {
    handleOpenInquiry({ projectType: serviceTitle });
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory selection:bg-lime selection:text-obsidian">
      <Navbar onOpenInquiry={() => handleOpenInquiry()} />

      <main>
        <HeroSection onOpenInquiry={() => handleOpenInquiry()} />
        <ServicesSection onInquireService={handleInquireService} />
        <CaseHighlightsSection onOpenInquiry={() => handleOpenInquiry()} />
        <ProcessSection />
        <ScopeEstimatorSection onLockEstimate={(data) => handleOpenInquiry(data)} />
      </main>

      <Footer onOpenInquiry={() => handleOpenInquiry()} />

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        prefillData={prefillData}
      />
    </div>
  );
}
