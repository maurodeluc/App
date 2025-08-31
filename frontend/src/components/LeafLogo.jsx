import React from 'react';

const LeafLogo = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Foglia realistica */}
      <path
        d="M50 15 
           Q65 25 70 40
           Q72 55 65 70
           Q55 80 50 85
           Q45 80 35 70
           Q28 55 30 40
           Q35 25 50 15 Z"
        fill={color}
      />
      
      {/* Nervatura centrale */}
      <line
        x1="50"
        y1="20" 
        x2="50"
        y2="80"
        stroke="white"
        strokeWidth="2"
        opacity="0.8"
      />
      
      {/* Nervature laterali sinistra */}
      <path
        d="M50 35 Q40 40 35 50"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      
      <path
        d="M50 50 Q40 55 35 65"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      
      {/* Nervature laterali destra */}
      <path
        d="M50 35 Q60 40 65 50"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
      
      <path
        d="M50 50 Q60 55 65 65"
        stroke="white"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
};

export default LeafLogo;