import { NavLink } from 'react-router-dom';
import EmailCapture from './EmailCapture';
import SolidBrokenHeart from './SolidBrokenHeart';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h2 className="footer-logo" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <SolidBrokenHeart className="animate-heartbeat" size={32} color="var(--accent-color)" /> SOLUS
          </h2>
          <p className="copyright">© {new Date().getFullYear()} Solus Syndicate. All Rights Reserved.</p>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/journal">Journal</NavLink>
            <NavLink to="/merch">Merch</NavLink>
          </div>
          <div className="link-group">
            <a href="#" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter/X</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Spotify</a>
          </div>
        </div>

        <div className="footer-newsletter">
          <EmailCapture layout="stacked" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
