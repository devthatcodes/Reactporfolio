import React, { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CorridorReel from './components/CorridorReel';
import VirtualCardShowcase from './components/VirtualCardShowcase';
import WorkflowTabs from './components/WorkflowTabs';
import SecurityGrid from './components/SecurityGrid';
import Footer from './components/Footer';
import { SignInModal, AccountDemoModal } from './components/Modals';
import LiquidityShaderCanvas from './components/LiquidityShaderCanvas';
import PortalTransition from './components/PortalTransition';
import CustomCursor from './components/CustomCursor';
import {
  ScrollPortalSection,
  ScrollLiquidityBridge,
} from './components/ScrollLiquidityTransition';

export default function App() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [accountModal, setAccountModal] = useState({ open: false, mode: 'account' });
  const [networkMode, setNetworkMode] = useState(0);
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [portalState, setPortalState] = useState({ active: false, label: '', sublabel: '' });

  const triggerShaderPulse = useCallback(() => {
    setPulseTrigger((c) => c + 1);
  }, []);

  const triggerPortal = useCallback((label, sublabel = 'INSTITUTIONAL LEDGER CLEARING') => {
    setPortalState({ active: true, label, sublabel });
    setTimeout(() => {
      setPortalState((prev) => ({ ...prev, active: false }));
    }, 460);
  }, []);

  const handleNavigatePortal = useCallback(
    (href, sectionLabel) => {
      triggerShaderPulse();
      triggerPortal(sectionLabel, `ROUTING TO ${href.toUpperCase()}`);
      setTimeout(() => {
        if (href === '#top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 160);
    },
    [triggerPortal, triggerShaderPulse]
  );

  const openAccountModal = (mode = 'account') => {
    triggerShaderPulse();
    setAccountModal({ open: true, mode });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-white relative selection:bg-[#10B981]/30 selection:text-[#10B981]">
      {/* iPadOS / Stripe Magnetic Cursor Halo */}
      <CustomCursor />

      {/* Precision Ledger Sweep Transition */}
      <PortalTransition transitionState={portalState} />

      {/* Real-Time WebGL Global Liquidity Field Shader (DPR 0.75 Locked 60fps) */}
      <LiquidityShaderCanvas
        networkMode={networkMode}
        pulseTrigger={pulseTrigger}
      />

      <Navbar
        onOpenSignIn={() => setSignInOpen(true)}
        onOpenAccount={openAccountModal}
        onNavigatePortal={handleNavigatePortal}
      />

      <main className="flex-1 relative z-10 overflow-x-clip">
        <ScrollPortalSection
          sectionIndex="01"
          portalLabel="INSTITUTIONAL FX STREAM"
          accentColor="#10B981"
          isFirst
        >
          <HeroSection
            onOpenAccount={openAccountModal}
            networkMode={networkMode}
            onSelectNetworkMode={(id) => {
              setNetworkMode(id);
              triggerShaderPulse();
            }}
            onShaderPulse={triggerShaderPulse}
          />
        </ScrollPortalSection>

        <ScrollLiquidityBridge
          corridorTag="MULTI-CURRENCY RTGS SETTLEMENT BRIDGE // USD → EUR → GBP → JPY → SGD"
          volumeLabel="38MS FINALITY · 0 CORRESPONDENT HOPS"
          accent="#10B981"
        />

        <ScrollPortalSection
          sectionIndex="02"
          portalLabel="SPLIT-SCREEN SETTLEMENT LEDGER"
          accentColor="#06B6D4"
        >
          <CorridorReel onTriggerPortal={triggerPortal} onShaderPulse={triggerShaderPulse} />
        </ScrollPortalSection>

        <ScrollLiquidityBridge
          corridorTag="PROGRAMMABLE TITANIUM ISSUING // CRYPTOGRAPHIC SPEND GUARDRAILS"
          volumeLabel="0% FX MARKUP · <180MS NODE ENFORCEMENT"
          accent="#06B6D4"
        />

        <ScrollPortalSection
          sectionIndex="03"
          portalLabel="TITANIUM HARDWARE SHOWCASE"
          accentColor="#3B82F6"
        >
          <VirtualCardShowcase onShaderPulse={triggerShaderPulse} />
        </ScrollPortalSection>

        <ScrollLiquidityBridge
          corridorTag="AUTONOMOUS TREASURY REPO // OVERNIGHT U.S. T-BILL SWEEP"
          volumeLabel="4.85% APY · INSTANT T+0 RECALL"
          accent="#10B981"
        />

        <ScrollPortalSection
          sectionIndex="04"
          portalLabel="AUTONOMOUS WORKFLOW ENGINE"
          accentColor="#10B981"
        >
          <WorkflowTabs onShaderPulse={triggerShaderPulse} />
        </ScrollPortalSection>

        <ScrollPortalSection
          sectionIndex="05"
          portalLabel="SOVEREIGN CUSTODY MESH"
          accentColor="#06B6D4"
        >
          <SecurityGrid onOpenAccount={openAccountModal} />
        </ScrollPortalSection>
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
