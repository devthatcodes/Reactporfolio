import React, { useState, useCallback } from 'react';
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
import { playTransition } from './utils/soundEngine';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [shaderMode, setShaderMode] = useState(0);
  const [fps, setFps] = useState(60);
  const [activePortal, setActivePortal] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'reel'
  const [activeSection, setActiveSection] = useState('telemetry');

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
              <TrustStrip />
              <ArchitectureReel
                onTriggerPortal={triggerPortal}
                onOpenModal={() => handleOpenModal('Enterprise')}
              />
              <BentoGrid />
              <SdkSwitcher />
              <PricingSection onSelectPlan={(plan) => handleOpenModal(plan)} />
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
