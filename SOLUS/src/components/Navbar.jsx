import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SolidBrokenHeart from './SolidBrokenHeart';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <NavLink to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-text" style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
            <SolidBrokenHeart className="animate-heartbeat" size={24} color="var(--accent-color)" /> SOLUS
          </span>
        </NavLink>

        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''} end onClick={() => setMobileMenuOpen(false)}>HOME</NavLink>
          <NavLink to="/music" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>MUSIC</NavLink>
          <NavLink to="/journal" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>JOURNAL</NavLink>
          <NavLink to="/merch" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>MERCH</NavLink>
        </div>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
