import React from 'react';

// OPZIONE A: Foglia stilizzata con nervature ben definite
export const StylizedLeaf = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
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

// OPZIONE B: Simbolo crescita e leggerezza - Germoglio che cresce
export const GrowthSymbol = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
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

// OPZIONE C: Simbolo astratto - Crescita in spirale
export const SpiralGrowth = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Spirale di crescita */}
      <path
        d="M50 80
           Q30 70 35 50
           Q40 30 50 35
           Q60 40 55 50
           Q50 60 50 50
           Q50 45 52 45
           Q54 45 54 47"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Elementi di leggerezza - cerchi che si dissolvono */}
      <circle cx="65" cy="25" r="3" fill={color} opacity="0.8"/>
      <circle cx="70" cy="15" r="2" fill={color} opacity="0.6"/>
      <circle cx="75" cy="8" r="1.5" fill={color} opacity="0.4"/>
      
      <circle cx="30" cy="30" r="2.5" fill={color} opacity="0.7"/>
      <circle cx="25" cy="22" r="1.5" fill={color} opacity="0.5"/>
      
      {/* Base solida */}
      <ellipse cx="50" cy="85" rx="8" ry="3" fill={color} opacity="0.6"/>
    </svg>
  );
};

// OPZIONE D: Piuma stilizzata - Simbolo di leggerezza e trasformazione
export const FeatherSymbol = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rachide centrale della piuma */}
      <line
        x1="50" y1="15"
        x2="50" y2="85"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Barbe della piuma - lato sinistro */}
      <path d="M50 25 Q35 20 30 30 Q35 35 50 30" fill={color} opacity="0.7"/>
      <path d="M50 35 Q30 30 25 40 Q30 45 50 40" fill={color} opacity="0.8"/>
      <path d="M50 45 Q28 40 23 50 Q28 55 50 50" fill={color} opacity="0.8"/>
      <path d="M50 55 Q30 50 25 60 Q30 65 50 60" fill={color} opacity="0.7"/>
      <path d="M50 65 Q35 60 30 70 Q35 75 50 70" fill={color} opacity="0.6"/>
      
      {/* Barbe della piuma - lato destro */}
      <path d="M50 25 Q65 20 70 30 Q65 35 50 30" fill={color} opacity="0.7"/>
      <path d="M50 35 Q70 30 75 40 Q70 45 50 40" fill={color} opacity="0.8"/>
      <path d="M50 45 Q72 40 77 50 Q72 55 50 50" fill={color} opacity="0.8"/>
      <path d="M50 55 Q70 50 75 60 Q70 65 50 60" fill={color} opacity="0.7"/>
      <path d="M50 65 Q65 60 70 70 Q65 75 50 70" fill={color} opacity="0.6"/>
      
      {/* Punta della piuma */}
      <circle cx="50" cy="15" r="2" fill={color}/>
    </svg>
  );
};