import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import CaseHighlightsSection from './components/CaseHighlightsSection';
import ProcessSection from './components/ProcessSection';
import ScopeEstimatorSection from './components/ScopeEstimatorSection';
import InquiryModal from './components/InquiryModal';
import Footer from './components/Footer';
import WebGLPortalCanvas from './components/WebGLPortalCanvas';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import PortalTransition from './components/PortalTransition';
import HudOverlay from './components/HudOverlay';
import soundEngine from './utils/soundEngine';

export default function App() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [shaderPreset, setShaderPreset] = useState(0);
  const [portalBoost, setPortalBoost] = useState(0);
  const [viewMode, setViewMode] = useState('full');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    velocity: '0.00',
    mouseX: 50,
    mouseY: 50,
  });
  const [transitionState, setTransitionState] = useState({
    active: false,
    label: '',
    sublabel: '',
    accent: '#C8FF32',
  });

  useEffect(() => {
    return soundEngine.subscribe((enabled) => {
      setSoundEnabled(enabled);
    });
  }, []);

  const triggerPortal = useCallback(
    ({ label = 'PORTAL', sublabel = 'SYNCHRONIZING', accent = '#C8FF32' } = {}) => {
      setPortalBoost(1.0);
      setTransitionState({ active: true, label, sublabel, accent });
      setTimeout(() => {
        setPortalBoost(0);
      }, 520);
      setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, active: false }));
      }, 760);
    },
    []
  );

  const handleToggleViewMode = useCallback(
    (nextMode) => {
      triggerPortal({
        label: nextMode === 'stream' ? '3D WORK STREAM' : 'STUDIO FULL VIEW',
        sublabel: 'SWITCHING EXPERIENCE TOPOLOGY',
        accent: '#C8FF32',
      });
      setTimeout(() => {
        setViewMode(nextMode);
        if (nextMode === 'stream') {
          setShaderPreset(1);
          const workEl = document.querySelector('#work');
          if (workEl) workEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 240);
    },
    [triggerPortal]
  );

  const handleOpenInquiry = (prefill = null) => {
    soundEngine.playClick();
    setPrefillData(prefill);
    setInquiryOpen(true);
  };

  const handleInquireService = (serviceTitle) => {
    handleOpenInquiry({ projectType: serviceTitle });
  };

  const handleToggleSound = () => {
    soundEngine.toggle();
  };

  return (
    <div className="relative min-h-screen bg-obsidian text-ivory selection:bg-lime selection:text-obsidian overflow-x-hidden">
      {/* Initial Active Theory Calibration Preloader */}
      <Preloader />

      {/* Custom Magnetic Reticle Cursor */}
      <CustomCursor />

      {/* Multi-Blade Cybernetic Portal Wipe Overlay */}
      <PortalTransition transitionState={transitionState} />

      {/* Fixed 60fps Interactive WebGL2 GLSL Shader Background */}
      <WebGLPortalCanvas
        shaderPreset={shaderPreset}
        portalBoost={portalBoost}
        onTelemetryUpdate={setTelemetry}
      />

      {/* Peripheral Active Theory Telemetry & Shader HUD */}
      <HudOverlay
        telemetry={telemetry}
        shaderPreset={shaderPreset}
        onSelectShader={(id) => {
          setPortalBoost(0.75);
          setShaderPreset(id);
          setTimeout(() => setPortalBoost(0), 380);
        }}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <Navbar
        onOpenInquiry={() => handleOpenInquiry()}
        onTriggerPortal={triggerPortal}
        onSelectShader={setShaderPreset}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="relative z-10">
        {viewMode === 'stream' ? (
          <div className="pt-16">
            <CaseHighlightsSection
              onOpenInquiry={(data) => handleOpenInquiry(data)}
              onTriggerPortal={triggerPortal}
              onSelectShader={setShaderPreset}
              forceStreamLayout={true}
            />
          </div>
        ) : (
          <>
            <HeroSection
              onOpenInquiry={() => handleOpenInquiry()}
              onTriggerPortal={triggerPortal}
              onSelectShader={setShaderPreset}
            />
            <CaseHighlightsSection
              onOpenInquiry={(data) => handleOpenInquiry(data)}
              onTriggerPortal={triggerPortal}
              onSelectShader={setShaderPreset}
            />
            <ServicesSection onInquireService={handleInquireService} />
            <ProcessSection />
            <ScopeEstimatorSection onLockEstimate={(data) => handleOpenInquiry(data)} />
          </>
        )}
      </main>

      <div className="relative z-10">
        <Footer onOpenInquiry={() => handleOpenInquiry()} />
      </div>

      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        prefillData={prefillData}
      />
    </div>
  );
}
