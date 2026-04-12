import { NavLink } from 'react-router-dom';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import EmailCapture from '../components/EmailCapture';

// Import new images from assets
import norffCover from '../assets/Norffside (Final Cover).JPG';
import featuredOne from '../assets/IMG_3594.JPG';
import featuredTwo from '../assets/IMG_0684.JPG';

import './Home.css';

const Home = () => {
  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <motion.div 
            className="hero-text-col"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="hero-label">NEW RELEASE</span>
            <h1 className="hero-title">MIDNIGHT<br/>ECHOES</h1>
            <p className="hero-subtitle">
              An immersive journey through sound and silence.<br/>
              Experience the latest sonic exploration from SOLUS.
            </p>
            <div className="hero-actions">
              <NavLink to="/music" className="btn-primary">
                <Play size={16} fill="black" style={{marginRight: '8px'}} />
                LISTEN NOW
              </NavLink>
              <NavLink to="/merch" className="btn-secondary">VIEW COLLECTION</NavLink>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-img-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <img src={norffCover} alt="Midnight Echoes Final Cover" className="album-art" />
          </motion.div>
        </div>
      </section>

      {/* Featured Music / Current Projects */}
      <section className="section featured-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2>FEATURED RELEASES</h2>
            <NavLink to="/music" className="view-all">VIEW ALL</NavLink>
          </motion.div>
          
          <div className="transmission-grid-alt">
            {/* Release 1: Image Left, Text Right */}
            <div className="transmission-row">
              <motion.img 
                src={featuredOne} 
                alt="Midnight Echoes Visuals" 
                className="featured-art"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div 
                className="transmission-info"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <span className="release-year">2026</span>
                <h3>MIDNIGHT ECHOES</h3>
                <p>A full-length exploration of nocturnal soundscapes and emotional depth.</p>
              </motion.div>
            </div>
            {/* Release 2: Text Left, Image Right */}
            <div className="transmission-row reverse">
              <motion.div 
                className="transmission-info"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <span className="release-year">2025</span>
                <h3>FRAGMENTS</h3>
                <p>Scattered pieces of memory stitched together with abrasive synths.</p>
              </motion.div>
              <motion.img 
                src={featuredTwo} 
                alt="Fragments Visuals" 
                className="featured-art"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Inline Newsletter */}
      <section className="section newsletter-section">
        <motion.div 
          className="container"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <EmailCapture layout="stacked" />
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
