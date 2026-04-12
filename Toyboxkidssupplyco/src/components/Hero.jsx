import React from 'react';
import heroImage from '../assets/kids_hero_banner.png';

const Hero = () => {
  return (
    <section className="hero" style={{ 
      backgroundImage: `url(${heroImage})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center right' 
    }}>
      <div className="hero-container container">
        <div className="hero-content">
          <h1 className="hero-title">FIND CLOTHES<br/>THAT MATCHES<br/>YOUR STYLE</h1>
          <p className="hero-subtitle">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <button className="primary-btn">Shop Now</button>
          
          <div className="hero-stats">
            <div className="stat">
              <h3>200+</h3>
              <p>International Brands</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <h3>2,000+</h3>
              <p>High-Quality Products</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <h3>30,000+</h3>
              <p>Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
