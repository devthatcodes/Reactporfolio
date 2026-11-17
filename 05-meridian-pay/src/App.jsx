import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import VirtualCardShowcase from './components/VirtualCardShowcase';
import WorkflowTabs from './components/WorkflowTabs';
import SecurityGrid from './components/SecurityGrid';
import Footer from './components/Footer';
import { SignInModal, AccountDemoModal } from './components/Modals';

export default function App() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [accountModal, setAccountModal] = useState({ open: false, mode: 'account' });

  const openAccountModal = (mode = 'account') => {
    setAccountModal({ open: true, mode });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A]">
      <Navbar
        onOpenSignIn={() => setSignInOpen(true)}
        onOpenAccount={openAccountModal}
      />

      <main className="flex-1">
        <HeroSection onOpenAccount={openAccountModal} />
        <VirtualCardShowcase />
        <WorkflowTabs />
        <SecurityGrid onOpenAccount={openAccountModal} />
      </main>

      <Footer />

      <SignInModal isOpen={signInOpen} onClose={() => setSignInOpen(false)} />
      <AccountDemoModal
        isOpen={accountModal.open}
        initialMode={accountModal.mode}
        onClose={() => setAccountModal((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
