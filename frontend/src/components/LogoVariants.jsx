import React from 'react';

// Variante 1: Logo minimalista con foglia singola
export const LeafLogoV1 = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 80 Q50 20 80 80 Q50 60 20 80 Z"
        fill={color}
        stroke={color}
        strokeWidth="2"
      />
      <path
        d="M20 80 Q50 50 80 80"
        stroke={color}
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
};

// Variante 2: Logo con L stilizzata e foglie
export const LeafLogoV2 = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* L di LEAF */}
      <path
        d="M30 20 L30 70 L60 70"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Foglie che decorano la L */}
      <ellipse cx="65" cy="35" rx="8" ry="15" transform="rotate(45 65 35)" fill={color} opacity="0.8"/>
      <ellipse cx="75" cy="25" rx="6" ry="12" transform="rotate(30 75 25)" fill={color} opacity="0.6"/>
    </svg>
  );
};

// Variante 3: Logo geometrico con cerchi
export const LeafLogoV3 = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill={color} opacity="0.3"/>
      <circle cx="40" cy="40" r="20" fill={color} opacity="0.6"/>
      <circle cx="60" cy="35" r="15" fill={color} opacity="0.8"/>
      <circle cx="65" cy="60" r="12" fill={color}/>
    </svg>
  );
};

// Variante 4: Logo con tre foglie stilizzate
export const LeafLogoV4 = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Foglia centrale */}
      <path
        d="M50 20 Q35 40 50 80 Q65 40 50 20 Z"
        fill={color}
        opacity="0.9"
      />
      {/* Nervatura */}
      <line x1="50" y1="25" x2="50" y2="75" stroke="white" strokeWidth="2" opacity="0.7"/>
      
      {/* Foglia sinistra */}
      <path
        d="M30 35 Q15 50 30 75 Q40 55 30 35 Z"
        fill={color}
        opacity="0.7"
      />
      
      {/* Foglia destra */}
      <path
        d="M70 35 Q85 50 70 75 Q60 55 70 35 Z"
        fill={color}
        opacity="0.7"
      />
    </svg>
  );
};

// Variante 5: Logo con albero stilizzato semplice
export const LeafLogoV5 = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tronco */}
      <rect x="46" y="60" width="8" height="20" rx="4" fill={color}/>
      
      {/* Chioma triangolare */}
      <path
        d="M50 25 L70 55 L30 55 Z"
        fill={color}
        opacity="0.8"
      />
      
      {/* Secondo triangolo sovrapposto */}
      <path
        d="M50 35 L65 60 L35 60 Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
  );
};

// Variante 6: Logo con goccia/foglia moderna
export const LeafLogoV6 = ({ className = "w-10 h-10", color = "currentColor" }) => {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Forma a goccia moderna */}
      <path
        d="M50 20 Q70 40 60 70 Q50 80 40 70 Q30 40 50 20 Z"
        fill={color}
        opacity="0.9"
      />
      
      {/* Nervatura centrale */}
      <path
        d="M50 25 Q55 50 45 65"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      
      {/* Piccola foglia che si stacca */}
      <ellipse 
        cx="75" 
        cy="35" 
        rx="4" 
        ry="8" 
        transform="rotate(30 75 35)" 
        fill={color} 
        opacity="0.7"
      />
    </svg>
  );
};