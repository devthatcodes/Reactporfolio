import React from 'react';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <div className="newsletter-wrapper container">
      <div className="newsletter-container">
        <h2 className="newsletter-title" style={{textAlign: "left", marginBottom: 0}}>STAY UPTO DATE ABOUT<br/>OUR LATEST OFFERS</h2>
        <div className="newsletter-form">
          <div className="input-wrapper">
             <Mail size={20} color="#00000066" className="mail-icon" />
             <input type="email" placeholder="Enter your email address" />
          </div>
          <button className="subscribe-btn">Subscribe to Newsletter</button>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
