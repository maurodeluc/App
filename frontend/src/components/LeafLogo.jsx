import React from 'react';

const LeafLogo = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stelo principale curvo che cresce */}
      <path
        d="M50 85 Q45 70 48 55 Q52 40 50 25 Q48 15 50 10"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Prima foglia piccola - simbolo di inizio crescita */}
      <ellipse
        cx="45" cy="60"
        rx="8" ry="12"
        transform="rotate(-30 45 60)"
        fill={color}
        opacity="0.8"
      />
      
      {/* Seconda foglia più grande - crescita in atto */}
      <ellipse
        cx="55" cy="40"
        rx="12" ry="18"
        transform="rotate(20 55 40)"
        fill={color}
        opacity="0.9"
      />
      
      {/* Gemma in cima - potenziale di crescita */}
      <circle
        cx="50" cy="10"
        r="4"
        fill={color}
      />
      
      {/* Linee di movimento/leggerezza */}
      <g opacity="0.4">
        <path
          d="M65 25 Q70 20 75 25"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M70 35 Q75 30 80 35"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M25 45 Q30 40 35 45"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};

export default LeafLogo;