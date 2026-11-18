import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroTelemetry from './components/HeroTelemetry';
import TrustStrip from './components/TrustStrip';
import ArchitectureReel from './components/ArchitectureReel';
import BentoGrid from './components/BentoGrid';
import SdkSwitcher from './components/SdkSwitcher';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import SandboxModal from './components/SandboxModal';
import NeuralShaderCanvas from './components/NeuralShaderCanvas';
import PortalTransition from './components/PortalTransition';
import CustomCursor from './components/CustomCursor';
import {
  ScrollPortalSection,
  NeuralCircuitConduit,
} from './components/ScrollSectionTransition';
import { playTransition } from './utils/soundEngine';

const SHADER_MODES = [
  { id: 0, name: 'TENSOR FIELD', badge: 'GLSL // 01' },
  { id: 1, name: 'QUANTUM FLUX', badge: 'GLSL // 02' },
  { id: 2, name: 'SYNAPTIC GRID', badge: 'GLSL // 03' },
];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [shaderMode, setShaderMode] = useState(0);
  const [activePortal, setActivePortal] = useState(null);
  const [activeSection, setActiveSection] = useState('telemetry');

  // Keep Navbar active section indicator synced with scroll position (rAF throttled)
  useEffect(() => {
    const sectionIds = ['telemetry', 'reel', 'platform', 'sdk', 'pricing'];
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY + window.innerHeight * 0.35;
        let nextSection = sectionIds[0];
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i]);
          if (el && el.offsetTop <= scrollPos) {
            nextSection = sectionIds[i];
            break;
          }
        }
        setActiveSection((prev) => (prev !== nextSection ? nextSection : prev));
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerPortal = useCallback(({ code, title, targetId }) => {
    playTransition();
    setActivePortal({
      id: `${Date.now()}-${Math.random()}`,
      code,
      title,
    });

    if (targetId) {
      setActiveSection(targetId);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 110);
    }

    setTimeout(() => {
      setActivePortal(null);
    }, 350);
  }, []);

  const handleOpenModal = (plan = 'Pro') => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const handleCycleShader = () => {
    const nextMode = (shaderMode + 1) % SHADER_MODES.length;
    setShaderMode(nextMode);
    triggerPortal({
      code: SHADER_MODES[nextMode].badge,
      title: SHADER_MODES[nextMode].name,
    });
  };

  const handleNavigatePortal = (link) => {
    triggerPortal({
      code: `NODE // ${link.code}`,
      title: link.label,
      targetId: link.id,
    });
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-[#FAFAFA] selection:bg-cyan-400/20 selection:text-cyan-300">
      {/* Ambient Radial Spotlight Follower */}
      <CustomCursor />

      {/* Real-time WebGL GLSL Neural Tensor Field Background */}
      <NeuralShaderCanvas shaderMode={shaderMode} />

      {/* Command-K (⌘K) Center-Out Glass Command Palette Pulse */}
      <PortalTransition activePortal={activePortal} />

      {/* Main Content Layer */}
      <div className="relative z-10">
        <Navbar
          onOpenModal={() => handleOpenModal('Pro')}
          onNavigatePortal={handleNavigatePortal}
          activeSection={activeSection}
          shaderName={SHADER_MODES[shaderMode].name}
          onCycleShader={handleCycleShader}
        />

        <main>
          {/* Section 01: Hero Telemetry */}
          <ScrollPortalSection
            sectionCode="NODE // 01"
            sectionLabel="NEURAL TELEMETRY"
            accentColor="#22D3EE"
            isFirst
          >
            <HeroTelemetry
              onOpenModal={() => handleOpenModal('Pro')}
              onNavigateReel={() =>
                handleNavigatePortal({
                  id: 'reel',
                  code: '02',
                  label: 'TOPOLOGY DECK',
                })
              }
            />
          </ScrollPortalSection>

          <TrustStrip />

          {/* Animated SVG Neural Circuit Connector 01 -> 02 */}
          <NeuralCircuitConduit
            code="CIRCUIT // 01 → 02"
            label="LIVE TOPOLOGY & CLUSTER INSPECTOR"
            accent="#22D3EE"
            secondary="#8B5CF6"
          />

          {/* Section 02: Split-Screen Scroll-Synced Neural Command Deck */}
          <ScrollPortalSection
            sectionCode="NODE // 02"
            sectionLabel="TOPOLOGY COMMAND DECK"
            accentColor="#8B5CF6"
            stickySafe
          >
            <ArchitectureReel
              onTriggerPortal={triggerPortal}
              onOpenModal={() => handleOpenModal('Enterprise')}
            />
          </ScrollPortalSection>

          {/* Animated SVG Neural Circuit Connector 02 -> 03 */}
          <NeuralCircuitConduit
            code="CIRCUIT // 02 → 03"
            label="SEMANTIC CACHE & CIRCUIT FAILOVER"
            accent="#8B5CF6"
            secondary="#34D399"
          />

          {/* Section 03: Bento Grid */}
          <ScrollPortalSection
            sectionCode="NODE // 03"
            sectionLabel="CORE PRIMITIVES"
            accentColor="#34D399"
          >
            <BentoGrid />
          </ScrollPortalSection>

          {/* Animated SVG Neural Circuit Connector 03 -> 04 */}
          <NeuralCircuitConduit
            code="CIRCUIT // 03 → 04"
            label="DROP-IN GATEWAY SDK SANDBOX"
            accent="#34D399"
            secondary="#22D3EE"
          />

          {/* Section 04: SDK Switcher */}
          <ScrollPortalSection
            sectionCode="NODE // 04"
            sectionLabel="SDK SANDBOX"
            accentColor="#22D3EE"
          >
            <SdkSwitcher />
          </ScrollPortalSection>

          {/* Animated SVG Neural Circuit Connector 04 -> 05 */}
          <NeuralCircuitConduit
            code="CIRCUIT // 04 → 05"
            label="PREDICTABLE COMPUTE & VPC TIERS"
            accent="#22D3EE"
            secondary="#8B5CF6"
          />

          {/* Section 05: Pricing Section */}
          <ScrollPortalSection
            sectionCode="NODE // 05"
            sectionLabel="COMPUTE PRICING"
            accentColor="#8B5CF6"
          >
            <PricingSection
              onSelectPlan={(plan) => handleOpenModal(plan)}
            />
          </ScrollPortalSection>
        </main>

        <Footer
          onOpenModal={() => handleOpenModal('Pro')}
          onNavigatePortal={handleNavigatePortal}
        />
      </div>

      <SandboxModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPlan={selectedPlan}
      />
    </div>
  );
}
