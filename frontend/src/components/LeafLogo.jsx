import React from 'react';

const LeafLogo = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Contorno foglia stilizzata */}
      <path
        d="M50 10 
           Q30 20 25 35
           Q20 50 25 65
           Q35 80 50 85
           Q65 80 75 65
           Q80 50 75 35
           Q70 20 50 10 Z"
        fill={color}
        opacity="0.9"
      />
      
      {/* Nervatura centrale prominente */}
      <line
        x1="50" y1="15"
        x2="50" y2="80"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Nervature laterali sinistre - ben visibili */}
      <path
        d="M50 25 Q38 30 32 40"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 35 Q38 40 32 50"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 45 Q38 50 32 60"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 55 Q40 60 35 70"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Nervature laterali destre - ben visibili */}
      <path
        d="M50 25 Q62 30 68 40"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 35 Q62 40 68 50"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 45 Q62 50 68 60"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 55 Q60 60 65 70"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export default LeafLogo;