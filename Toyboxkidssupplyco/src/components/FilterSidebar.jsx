import React from 'react';
import { SlidersHorizontal, ChevronUp, ChevronRight } from 'lucide-react';

const FilterSidebar = () => {
  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>FILTERS</h3>
        <SlidersHorizontal size={24} color="var(--black)" />
      </div>
      <hr className="filter-divider" />
      
      {/* Categories */}
      <ul className="filter-list">
        <li>T-shirts <ChevronRight size={18} /></li>
        <li>Shorts <ChevronRight size={18} /></li>
        <li>Shirts <ChevronRight size={18} /></li>
        <li>Hoodie <ChevronRight size={18} /></li>
        <li>Jeans <ChevronRight size={18} /></li>
      </ul>
      <hr className="filter-divider" />

      {/* Price */}
      <div className="filter-section">
        <div className="filter-section-header">
          <h3>PRICE</h3>
          <ChevronUp size={24} color="var(--black)" />
        </div>
        <div className="price-slider-mock">
          <div className="slider-track">
            <div className="slider-fill"></div>
            <div className="slider-thumb min-thumb"></div>
            <div className="slider-thumb max-thumb"></div>
          </div>
          <div className="price-labels">
            <span>$50</span>
            <span>$200</span>
          </div>
        </div>
      </div>
      <hr className="filter-divider" />

      {/* Colors */}
      <div className="filter-section">
        <div className="filter-section-header">
          <h3>COLORS</h3>
          <ChevronUp size={24} color="var(--black)" />
        </div>
        <div className="color-grid">
          <button className="color-swatch" style={{backgroundColor: '#00C12B'}}></button>
          <button className="color-swatch" style={{backgroundColor: '#F50606'}}></button>
          <button className="color-swatch" style={{backgroundColor: '#F5DD06'}}></button>
          <button className="color-swatch" style={{backgroundColor: '#F57906'}}></button>
          <button className="color-swatch" style={{backgroundColor: '#06CAF5'}}></button>
          <button className="color-swatch active" style={{backgroundColor: '#063AF5'}}></button>
          <button className="color-swatch" style={{backgroundColor: '#7D06F5'}}></button>
          <button className="color-swatch" style={{backgroundColor: '#F506A4'}}></button>
          <button className="color-swatch white-swatch" style={{backgroundColor: '#FFFFFF'}}></button>
          <button className="color-swatch" style={{backgroundColor: '#000000'}}></button>
        </div>
      </div>
      <hr className="filter-divider" />

      {/* Size */}
      <div className="filter-section">
        <div className="filter-section-header">
          <h3>SIZE</h3>
          <ChevronUp size={24} color="var(--black)" />
        </div>
        <div className="size-grid">
          <button className="size-pill">XX-Small</button>
          <button className="size-pill">X-Small</button>
          <button className="size-pill">Small</button>
          <button className="size-pill">Medium</button>
          <button className="size-pill active">Large</button>
          <button className="size-pill">X-Large</button>
          <button className="size-pill">XX-Large</button>
          <button className="size-pill">3X-Large</button>
          <button className="size-pill">4X-Large</button>
        </div>
      </div>
      <hr className="filter-divider" />

      {/* Dress Style */}
      <div className="filter-section">
        <div className="filter-section-header">
          <h3>PLAY STYLE</h3>
          <ChevronUp size={24} color="var(--black)" />
        </div>
        <ul className="filter-list">
          <li>Playtime <ChevronRight size={18} /></li>
          <li>Fancy <ChevronRight size={18} /></li>
          <li>Birthday <ChevronRight size={18} /></li>
          <li>Sports <ChevronRight size={18} /></li>
        </ul>
      </div>

      <button className="apply-filter-btn">APPLY FILTER</button>
    </div>
  );
};
export default FilterSidebar;
