import React from 'react';

const SolidBrokenHeart = ({ className, size = 24, color = "var(--accent-color)" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill={color}
    style={{ overflow: 'visible' }}
  >
    <defs>
      <mask id="crackMask">
        {/* White reveals the heart */}
        <rect width="100%" height="100%" fill="white" />
        {/* Black cuts the crack out of the heart */}
        <path 
          d="M13 2 L9 9 L14 14 L11 22" 
          fill="none" 
          stroke="black" 
          strokeWidth="2.5" 
          strokeLinecap="round"
          strokeLinejoin="round" 
        />
      </mask>
    </defs>
    
    <path 
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
      mask="url(#crackMask)"
    />
  </svg>
);

export default SolidBrokenHeart;
