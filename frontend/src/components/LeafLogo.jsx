import React from 'react';

const LeafLogo = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Foglia minimalista */}
      <path
        d="M20 80 Q50 20 80 80 Q50 60 20 80 Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
      />
      
      {/* Nervatura centrale */}
      <path
        d="M20 80 Q50 50 80 80"
        stroke="white"
        strokeWidth="2"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
};

export default LeafLogo;