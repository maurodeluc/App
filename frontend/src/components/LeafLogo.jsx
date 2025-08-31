import React from 'react';

const LeafLogo = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill={color} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tronco curvo principale */}
      <path
        d="M50 85 
           Q45 80 43 75
           Q40 65 42 55
           Q44 45 48 40
           Q50 38 50 35"
        stroke="none"
        fill={color}
        strokeWidth="8"
      />
      
      {/* Base del tronco */}
      <ellipse
        cx="50"
        cy="85"
        rx="6"
        ry="4"
        fill={color}
      />
      
      {/* Foglia superiore sinistra - forma organica */}
      <path
        d="M50 35
           Q35 25 25 30
           Q20 35 22 42
           Q25 48 35 50
           Q45 48 50 40
           Z"
        fill={color}
      />
      
      {/* Foglia superiore destra - forma organica */}
      <path
        d="M50 35
           Q65 25 75 30
           Q80 35 78 42
           Q75 48 65 50
           Q55 48 50 40
           Z"
        fill={color}
      />
      
      {/* Foglia media sinistra - più grande */}
      <path
        d="M48 50
           Q30 40 20 45
           Q15 50 17 58
           Q20 65 32 68
           Q44 65 48 55
           Z"
        fill={color}
      />
      
      {/* Foglia media destra - più grande */}
      <path
        d="M52 50
           Q70 40 80 45
           Q85 50 83 58
           Q80 65 68 68
           Q56 65 52 55
           Z"
        fill={color}
      />
      
      {/* Foglia inferiore sinistra - più ampia */}
      <path
        d="M45 65
           Q25 55 15 60
           Q10 65 12 73
           Q15 80 28 82
           Q40 78 45 70
           Z"
        fill={color}
      />
      
      {/* Foglia inferiore destra - più ampia */}
      <path
        d="M55 65
           Q75 55 85 60
           Q90 65 88 73
           Q85 80 72 82
           Q60 78 55 70
           Z"
        fill={color}
      />
    </svg>
  );
};

export default LeafLogo;