import React from 'react';

const LeafLogo = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tronco dell'albero - semplice e pulito */}
      <rect
        x="47"
        y="60"
        width="6"
        height="25"
        rx="3"
        fill={color}
      />
      
      {/* Chioma dell'albero - forma circolare stilizzata */}
      <circle
        cx="50"
        cy="45"
        r="25"
        fill={color}
        opacity="0.9"
      />
      
      {/* Dettagli della chioma - cerchi sovrapposti per texture */}
      <circle
        cx="40"
        cy="40"
        r="12"
        fill={color}
        opacity="0.7"
      />
      
      <circle
        cx="60"
        cy="40"
        r="12"
        fill={color}
        opacity="0.7"
      />
      
      <circle
        cx="50"
        cy="30"
        r="10"
        fill={color}
        opacity="0.8"
      />
      
      {/* Foglia che si stacca - elemento chiave del design */}
      <g transform="translate(75, 25) rotate(15)">
        {/* Corpo della foglia */}
        <path
          d="M0 0 
             Q8 -2 12 4
             Q14 8 12 12
             Q8 16 4 14
             Q-2 12 -4 8
             Q-2 4 0 0 Z"
          fill={color}
          opacity="0.9"
        />
        
        {/* Nervatura centrale della foglia */}
        <line
          x1="0"
          y1="0"
          x2="6"
          y2="10"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.6"
        />
      </g>
      
      {/* Foglia che si stacca - seconda foglia per movimento */}
      <g transform="translate(80, 35) rotate(-10)">
        {/* Corpo della foglia più piccola */}
        <path
          d="M0 0 
             Q6 -1 8 3
             Q9 6 8 8
             Q6 11 3 10
             Q-1 8 -2 6
             Q-1 3 0 0 Z"
          fill={color}
          opacity="0.7"
        />
      </g>
      
      {/* Linee di movimento - per indicare che le foglie si staccano */}
      <g opacity="0.3">
        <path
          d="M70 30 Q72 28 74 26"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M73 38 Q75 36 77 34"
          stroke={color}
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};

export default LeafLogo;