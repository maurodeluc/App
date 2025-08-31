import React from 'react';

const LeafLogo = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tronco principale */}
      <path
        d="M45 65 L45 85 L55 85 L55 65"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill={color}
      />
      
      {/* Ramo centrale */}
      <path
        d="M50 65 L50 35"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Foglia superiore sinistra */}
      <path
        d="M50 35 Q35 25 30 35 Q35 45 50 35"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Foglia superiore destra */}
      <path
        d="M50 35 Q65 25 70 35 Q65 45 50 35"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Foglia media sinistra */}
      <path
        d="M48 50 Q33 40 28 50 Q33 60 48 50"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Foglia media destra */}
      <path
        d="M52 50 Q67 40 72 50 Q67 60 52 50"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Foglia inferiore sinistra */}
      <path
        d="M47 62 Q32 52 27 62 Q32 72 47 62"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Foglia inferiore destra */}
      <path
        d="M53 62 Q68 52 73 62 Q68 72 53 62"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
      
      {/* Rami collegamento */}
      <path
        d="M50 45 L48 50 M50 45 L52 50 M50 55 L47 62 M50 55 L53 62"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LeafLogo;