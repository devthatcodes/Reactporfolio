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
  VelocitySkewWrapper,
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

  // Keep Navbar active section indicator synced with scroll position
  useEffect(() => {
    const sectionIds = ['telemetry', 'reel', 'platform', 'sdk', 'pricing'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
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
      }, 260);
    }

    setTimeout(() => {
      setActivePortal(null);
    }, 740);
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
      title: nextView === 'reel' ? 'STREAM REEL FOCUS' : 'FULL PLATFORM OVERVIEW',
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

      {/* Multi-Slice Cybernetic Portal Transition Overlay */}
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
              {/* Section 01: Hero Telemetry wrapped in Scroll Velocity + 3D Portal Unmask */}
              <VelocitySkewWrapper>
                <ScrollPortalSection
                  sectionCode="PORTAL // 01"
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
              </VelocitySkewWrapper>

              <TrustStrip />

              {/* Scroll-Scrubbed Kinetic Divider 01 -> 02 */}
              <ScrollKineticBanner
                code="TRANSITION // 01 → 02 Z-TUNNEL"
                primaryText="3D Z-SPACE ARCHITECTURE FLIGHT // DETERMINISTIC CONSENSUS // SUB-5MS EDGE ROUTING"
                secondaryText="SCROLL TO SCRUB THROUGH 4 VERIFIED PRODUCTION AI CLUSTERS"
                accent="#22D3EE"
              />

              {/* Section 02: Sticky Scroll-Scrubbed 3D Z-Space Architecture Flight */}
              <ScrollPortalSection
                sectionCode="PORTAL // 02"
                sectionLabel="ARCHITECTURE REEL"
                accentColor="#8B5CF6"
                stickySafe
              >
                <ArchitectureReel
                  onTriggerPortal={triggerPortal}
                  onOpenModal={() => handleOpenModal('Enterprise')}
                />
              </ScrollPortalSection>

              {/* Scroll-Scrubbed Kinetic Divider 02 -> 03 */}
              <ScrollKineticBanner
                code="TRANSITION // 02 → 03 PRIMITIVES"
                primaryText="SEMANTIC VECTOR CACHE // CIRCUIT-BREAKER FAILOVER // OPENTELEMETRY WATERFALLS"
                secondaryText="MULTI-LAYER FOREGROUND PARALLAX // ZERO RUNTIME OVERHEAD"
                accent="#8B5CF6"
              />

              {/* Section 03: Bento Grid wrapped in Scroll Velocity + 3D Portal Unmask */}
              <VelocitySkewWrapper>
                <ScrollPortalSection
                  sectionCode="PORTAL // 03"
                  sectionLabel="CORE PRIMITIVES"
                  accentColor="#34D399"
                >
                  <BentoGrid />
                </ScrollPortalSection>
              </VelocitySkewWrapper>

              {/* Scroll-Scrubbed Kinetic Divider 03 -> 04 */}
              <ScrollKineticBanner
                code="TRANSITION // 03 → 04 SDK SANDBOX"
                primaryText="DROP-IN GATEWAY SDK // 100% OPENAI COMPATIBLE // ZERO VENDOR LOCK-IN"
                secondaryText="TYPESCRIPT • PYTHON • CURL • REAL-TIME EDGE VERIFICATION"
                accent="#34D399"
              />

              {/* Section 04: SDK Switcher wrapped in Scroll Velocity + 3D Portal Unmask */}
              <VelocitySkewWrapper>
                <ScrollPortalSection
                  sectionCode="PORTAL // 04"
                  sectionLabel="SDK SANDBOX"
                  accentColor="#22D3EE"
                >
                  <SdkSwitcher />
                </ScrollPortalSection>
              </VelocitySkewWrapper>

              {/* Scroll-Scrubbed Kinetic Divider 04 -> 05 */}
              <ScrollKineticBanner
                code="TRANSITION // 04 → 05 COMPUTE PRICING"
                primaryText="PREDICTABLE TOKEN SCALE // DEDICATED VPC ENCLAVES // SOC2 TYPE II & HIPAA"
                secondaryText="INSTANT SANDBOX PROVISIONING • 99.99% CONTRACTUAL SLA"
                accent="#F59E0B"
              />

              {/* Section 05: Pricing Section wrapped in Scroll Velocity + 3D Portal Unmask */}
              <VelocitySkewWrapper>
                <ScrollPortalSection
                  sectionCode="PORTAL // 05"
                  sectionLabel="COMPUTE PRICING"
                  accentColor="#8B5CF6"
                >
                  <PricingSection
                    onSelectPlan={(plan) => handleOpenModal(plan)}
                  />
                </ScrollPortalSection>
              </VelocitySkewWrapper>
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
