import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import PortfolioGallery from './components/PortfolioGallery';
import ProjectModal from './components/ProjectModal';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="min-h-screen bg-alabaster text-charcoal flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <Philosophy />
        <PortfolioGallery onSelectProject={setSelectedProject} />
        <ContactSection />
      </main>

      <Footer />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
