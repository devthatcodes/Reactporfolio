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
import Preloader from './components/Preloader';
import HudOverlay, { SHADER_MODES } from './components/HudOverlay';
import PortalTransition from './components/PortalTransition';
import CustomCursor from './components/CustomCursor';
import {
  ScrollPortalSection,
  ScrollKineticBanner,
} from './components/ScrollSectionTransition';
import { playTransition } from './utils/soundEngine';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [shaderMode, setShaderMode] = useState(0);
  const [fps, setFps] = useState(60);
  const [activePortal, setActivePortal] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'reel'
  const [activeSection, setActiveSection] = useState('telemetry');

  // Keep Navbar active section indicator synced with scroll position (rAF throttled, zero redundant setState)
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
      }, 150);
    }

    setTimeout(() => {
      setActivePortal(null);
    }, 450);
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
      title: `SHADER // ${SHADER_MODES[nextMode].name}`,
    });
  };

  const handleToggleViewMode = () => {
    const nextView = viewMode === 'overview' ? 'reel' : 'overview';
    setViewMode(nextView);
    triggerPortal({
      code: 'VIEW MODE // SWITCH',
      title: nextView === 'reel' ? 'BLADE RACK FOCUS' : 'FULL PLATFORM OVERVIEW',
      targetId: nextView === 'reel' ? 'reel' : 'telemetry',
    });
  };

  const handleNavigatePortal = (link) => {
    if (viewMode === 'reel' && link.id !== 'reel') {
      setViewMode('overview');
    }
    triggerPortal({
      code: `PORTAL // ${link.code}`,
      title: link.label,
      targetId: link.id,
    });
  };

  return (
    <div className="relative min-h-screen bg-[#09090B] text-[#FAFAFA] selection:bg-cyan-400/20 selection:text-cyan-300">
      {/* Boot Sequence Preloader */}
      <Preloader />

      {/* Custom Magnetic Reticle Cursor */}
      <CustomCursor />

      {/* Real-time WebGL GLSL Neural Tensor Field Background */}
      <NeuralShaderCanvas shaderMode={shaderMode} onFpsUpdate={setFps} />

      {/* CRT Terminal Scanline & Phosphor Sweep Transition Overlay */}
      <PortalTransition activePortal={activePortal} />

      {/* Persistent Peripheral HUD & Shader Switcher */}
      <HudOverlay
        fps={fps}
        shaderMode={shaderMode}
        onCycleShader={handleCycleShader}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
      />

      {/* Main Content Layer */}
      <div className="relative z-10">
        <Navbar
          onOpenModal={() => handleOpenModal('Pro')}
          onNavigatePortal={handleNavigatePortal}
          activeSection={activeSection}
        />

        <main>
          {viewMode === 'reel' ? (
            <ArchitectureReel
              onTriggerPortal={triggerPortal}
              onOpenModal={() => handleOpenModal('Enterprise')}
            />
          ) : (
            <>
              {/* Section 01: Hero Telemetry */}
              <ScrollPortalSection
                sectionCode="BLADE // 01"
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
                      label: 'ARCHITECTURE REEL',
                    })
                  }
                />
              </ScrollPortalSection>

              <TrustStrip />

              {/* Horizontal Neural Data Stream Divider 01 -> 02 */}
              <ScrollKineticBanner
                code="STREAM // 01 → 02 BLADE STACK"
                primaryText="ISOMETRIC HARDWARE BLADE DECK // DETERMINISTIC CONSENSUS // SUB-5MS EDGE ROUTING"
                secondaryText="SCROLL TO STACK 4 VERIFIED PRODUCTION AI CLUSTERS"
                accent="#22D3EE"
              />

              {/* Section 02: Sticky Isometric Hardware Blade Deck Stack */}
              <ScrollPortalSection
                sectionCode="BLADE // 02"
                sectionLabel="ARCHITECTURE REEL"
                accentColor="#8B5CF6"
                stickySafe
              >
                <ArchitectureReel
                  onTriggerPortal={triggerPortal}
                  onOpenModal={() => handleOpenModal('Enterprise')}
                />
              </ScrollPortalSection>

              {/* Horizontal Neural Data Stream Divider 02 -> 03 */}
              <ScrollKineticBanner
                code="STREAM // 02 → 03 PRIMITIVES"
                primaryText="SEMANTIC VECTOR CACHE // CIRCUIT-BREAKER FAILOVER // OPENTELEMETRY WATERFALLS"
                secondaryText="MULTI-LAYER FOREGROUND PARALLAX // ZERO RUNTIME OVERHEAD"
                accent="#8B5CF6"
              />

              {/* Section 03: Bento Grid */}
              <ScrollPortalSection
                sectionCode="BLADE // 03"
                sectionLabel="CORE PRIMITIVES"
                accentColor="#34D399"
              >
                <BentoGrid />
              </ScrollPortalSection>

              {/* Horizontal Neural Data Stream Divider 03 -> 04 */}
              <ScrollKineticBanner
                code="STREAM // 03 → 04 SDK SANDBOX"
                primaryText="DROP-IN GATEWAY SDK // 100% OPENAI COMPATIBLE // ZERO VENDOR LOCK-IN"
                secondaryText="TYPESCRIPT • PYTHON • CURL • REAL-TIME EDGE VERIFICATION"
                accent="#34D399"
              />

              {/* Section 04: SDK Switcher */}
              <ScrollPortalSection
                sectionCode="BLADE // 04"
                sectionLabel="SDK SANDBOX"
                accentColor="#22D3EE"
              >
                <SdkSwitcher />
              </ScrollPortalSection>

              {/* Horizontal Neural Data Stream Divider 04 -> 05 */}
              <ScrollKineticBanner
                code="STREAM // 04 → 05 COMPUTE PRICING"
                primaryText="PREDICTABLE TOKEN SCALE // DEDICATED VPC ENCLAVES // SOC2 TYPE II & HIPAA"
                secondaryText="INSTANT SANDBOX PROVISIONING • 99.99% CONTRACTUAL SLA"
                accent="#F59E0B"
              />

              {/* Section 05: Pricing Section */}
              <ScrollPortalSection
                sectionCode="BLADE // 05"
                sectionLabel="COMPUTE PRICING"
                accentColor="#8B5CF6"
              >
                <PricingSection
                  onSelectPlan={(plan) => handleOpenModal(plan)}
                />
              </ScrollPortalSection>
            </>
          )}
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
