import React from 'react';

const LeafLogo = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Foglia centrale */}
      <path
        d="M50 20 Q35 40 50 80 Q65 40 50 20 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Nervatura centrale */}
      <line 
        x1="50" 
        y1="25" 
        x2="50" 
        y2="75" 
        stroke="white" 
        strokeWidth="2" 
        opacity="0.7"
      />
      
      {/* Foglia sinistra */}
      <path
        d="M30 35 Q15 50 30 75 Q40 55 30 35 Z"
        fill={color}
        opacity="0.7"
      />
      {/* Nervatura sinistra */}
      <line 
        x1="30" 
        y1="40" 
        x2="30" 
        y2="70" 
        stroke="white" 
        strokeWidth="1.5" 
        opacity="0.6"
      />
      
      {/* Foglia destra */}
      <path
        d="M70 35 Q85 50 70 75 Q60 55 70 35 Z"
        fill={color}
        opacity="0.7"
      />
      {/* Nervatura destra */}
      <line 
        x1="70" 
        y1="40" 
        x2="70" 
        y2="70" 
        stroke="white" 
        strokeWidth="1.5" 
        opacity="0.6"
      />
    </svg>
  );
};

export default LeafLogo;