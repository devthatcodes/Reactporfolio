import React from 'react';
import Newsletter from './Newsletter';

const Footer = () => {
  return (
    <footer className="footer-envelope">
      <Newsletter />
      <div className="container footer-content-wrapper">
        <div className="footer-columns">
          <div className="footer-col brand-col">
            <h2 className="brand-logo footer-logo">TOYBOX</h2>
            <p className="footer-description">We have clothes that suits your style and which you're proud to wear. From kids to teens.</p>
            <div className="social-icons">
               <span className="social-icon">t</span>
               <span className="social-icon active">f</span>
               <span className="social-icon">i</span>
               <span className="social-icon">g</span>
            </div>
          </div>
          <div className="footer-col links-col">
            <h3>COMPANY</h3>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Works</a></li>
              <li><a href="#">Career</a></li>
            </ul>
          </div>
          <div className="footer-col links-col">
            <h3>HELP</h3>
            <ul>
              <li><a href="#">Customer Support</a></li>
              <li><a href="#">Delivery Details</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-col links-col">
            <h3>FAQ</h3>
            <ul>
              <li><a href="#">Account</a></li>
              <li><a href="#">Manage Deliveries</a></li>
              <li><a href="#">Orders</a></li>
              <li><a href="#">Payments</a></li>
            </ul>
          </div>
          <div className="footer-col links-col">
            <h3>RESOURCES</h3>
            <ul>
              <li><a href="#">Free eBooks</a></li>
              <li><a href="#">Development Tutorial</a></li>
              <li><a href="#">How to - Blog</a></li>
              <li><a href="#">Youtube Playlist</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <hr className="footer-divider" />
          <div className="footer-bottom-content">
            <p className="copyright">Toybox © 2000-2023, All Rights Reserved</p>
            <div className="payment-methods">
               <span className="payment-badge">VISA</span>
               <span className="payment-badge">Mastercard</span>
               <span className="payment-badge">PayPal</span>
               <span className="payment-badge">Pay</span>
               <span className="payment-badge">GPay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
