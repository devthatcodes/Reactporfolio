import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CorridorReel from './components/CorridorReel';
import VirtualCardShowcase from './components/VirtualCardShowcase';
import WorkflowTabs from './components/WorkflowTabs';
import SecurityGrid from './components/SecurityGrid';
import Footer from './components/Footer';
import { SignInModal, AccountDemoModal } from './components/Modals';
import LiquidityShaderCanvas from './components/LiquidityShaderCanvas';
import Preloader from './components/Preloader';
import TelemetryHud from './components/TelemetryHud';
import PortalTransition from './components/PortalTransition';
import CustomCursor from './components/CustomCursor';
import {
  ScrollPortalSection,
  ScrollQuantumTicker,
} from './components/ScrollLiquidityTransition';

export default function App() {
  const [signInOpen, setSignInOpen] = useState(false);
  const [accountModal, setAccountModal] = useState({ open: false, mode: 'account' });
  const [networkMode, setNetworkMode] = useState(0);
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [fps, setFps] = useState(60);
  const [cursorTelemetry, setCursorTelemetry] = useState({ x: 540, y: 380, vel: '0.00' });
  const [activeSection, setActiveSection] = useState('01 // LIQUIDITY STREAM');
  const [portalState, setPortalState] = useState({ active: false, label: '', sublabel: '' });

  const triggerShaderPulse = useCallback(() => {
    setPulseTrigger((c) => c + 1);
  }, []);

  const triggerPortal = useCallback((label, sublabel = 'VAULT SEAL ENGAGED') => {
    setPortalState({ active: true, label, sublabel });
    setTimeout(() => {
      setPortalState((prev) => ({ ...prev, active: false }));
    }, 460);
  }, []);

  const handleNavigatePortal = useCallback(
    (href, sectionLabel) => {
      setActiveSection(sectionLabel);
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

  useEffect(() => {
    const sections = [
      { id: 'top', label: '01 // LIQUIDITY STREAM' },
      { id: 'corridors', label: '02 // CORRIDOR LEDGER' },
      { id: 'cards', label: '03 // HOLOGRAPHIC METAL CARD' },
      { id: 'workflows', label: '04 // WORKFLOW ENGINE' },
      { id: 'security', label: '05 // ZK-SECURITY MESH' },
    ];

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + window.innerHeight * 0.35;
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i].id);
          if (el && el.offsetTop <= scrollPos) {
            const nextLabel = sections[i].label;
            setActiveSection((prev) => (prev === nextLabel ? prev : nextLabel));
            break;
          }
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openAccountModal = (mode = 'account') => {
    triggerShaderPulse();
    setAccountModal({ open: true, mode });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-white relative selection:bg-[#10B981]/30 selection:text-[#10B981]">
      {/* Active Theory Preloader */}
      <Preloader />

      {/* Custom Magnetic Reticle Cursor */}
      <CustomCursor />

      {/* Interlocking Left/Right Titanium Vault Doors Transition */}
      <PortalTransition transitionState={portalState} />

      {/* Real-Time WebGL Global Liquidity Field & Quantum Wave Shader (DPR 0.75 Locked 60fps) */}
      <LiquidityShaderCanvas
        networkMode={networkMode}
        pulseTrigger={pulseTrigger}
        onFpsUpdate={setFps}
        onCursorTelemetry={setCursorTelemetry}
      />

      {/* Peripheral Institutional Telemetry HUD */}
      <TelemetryHud
        fps={fps}
        cursorTelemetry={cursorTelemetry}
        networkMode={networkMode}
        onSelectNetworkMode={(id) => {
          setNetworkMode(id);
          triggerShaderPulse();
        }}
        activeSection={activeSection}
      />

      <Navbar
        onOpenSignIn={() => setSignInOpen(true)}
        onOpenAccount={openAccountModal}
        onNavigatePortal={handleNavigatePortal}
      />

      <main className="flex-1 relative z-10 overflow-x-clip">
        <ScrollPortalSection
          sectionIndex="01"
          portalLabel="QUANTUM FX STREAM"
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

        <ScrollQuantumTicker
          primaryText="ATOMIC SETTLEMENT // ZERO CORRESPONDENT HOPS // 38MS FINALITY"
          secondaryText="JPY ⇄ GBP 0.005194 · USD ⇄ EUR 0.9214 · USDC ⇄ SEPA 1.0000 · T-BILL REPO 4.85% APY"
          accent="#10B981"
        />

        <ScrollPortalSection
          sectionIndex="02"
          portalLabel="SPLIT-SCREEN SETTLEMENT LEDGER"
          accentColor="#06B6D4"
        >
          <CorridorReel onTriggerPortal={triggerPortal} onShaderPulse={triggerShaderPulse} />
        </ScrollPortalSection>

        <ScrollQuantumTicker
          primaryText="PROGRAMMABLE TITANIUM // CRYPTOGRAPHIC SPEND GUARDRAILS // 0% FX MARKUP"
          secondaryText="VISA INFINITE INSTITUTIONAL · MASTERCARD WORLD ELITE · <180MS NODE ENFORCEMENT"
          accent="#06B6D4"
        />

        <ScrollPortalSection
          sectionIndex="03"
          portalLabel="HOLOGRAPHIC CARD ORBIT"
          accentColor="#3B82F6"
        >
          <VirtualCardShowcase onShaderPulse={triggerShaderPulse} />
        </ScrollPortalSection>

        <ScrollQuantumTicker
          primaryText="AUTONOMOUS TREASURY OS // OVERNIGHT T-BILL REPO // ZK-EXPENSE QUORUMS"
          secondaryText="SEPA INSTANT RT1 · BOJ ZENGIN ATOMIC · CHAPS DIRECT · FEDWIRE T+0 RECALL"
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
          portalLabel="SOVEREIGN ZK-SECURITY MESH"
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
