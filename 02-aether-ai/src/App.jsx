import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroTelemetry from './components/HeroTelemetry';
import TrustStrip from './components/TrustStrip';
import BentoGrid from './components/BentoGrid';
import SdkSwitcher from './components/SdkSwitcher';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import SandboxModal from './components/SandboxModal';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro');

  const handleOpenModal = (plan = 'Pro') => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] selection:bg-cyan-400/20 selection:text-cyan-300">
      <Navbar onOpenModal={() => handleOpenModal('Pro')} />
      <main>
        <HeroTelemetry onOpenModal={() => handleOpenModal('Pro')} />
        <TrustStrip />
        <BentoGrid />
        <SdkSwitcher />
        <PricingSection onSelectPlan={(plan) => handleOpenModal(plan)} />
      </main>
      <Footer onOpenModal={() => handleOpenModal('Pro')} />
      <SandboxModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPlan={selectedPlan}
      />
    </div>
  );
}
