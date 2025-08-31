import React from 'react';
import { LeafLogoV1, LeafLogoV2, LeafLogoV3, LeafLogoV4, LeafLogoV5, LeafLogoV6 } from '../components/LogoVariants';

const LogoShowcase = () => {
  const variants = [
    { 
      component: LeafLogoV1, 
      name: "Variante 1", 
      description: "Foglia minimalista con nervatura" 
    },
    { 
      component: LeafLogoV2, 
      name: "Variante 2", 
      description: "L stilizzata con foglie decorative" 
    },
    { 
      component: LeafLogoV3, 
      name: "Variante 3", 
      description: "Design geometrico con cerchi" 
    },
    { 
      component: LeafLogoV4, 
      name: "Variante 4", 
      description: "Tre foglie stilizzate" 
    },
    { 
      component: LeafLogoV5, 
      name: "Variante 5", 
      description: "Albero triangolare semplice" 
    },
    { 
      component: LeafLogoV6, 
      name: "Variante 6", 
      description: "Goccia moderna con foglia staccata" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Varianti Logo LEAF
          </h1>
          <p className="text-gray-600">Scegli il logo che preferisci per l'app del Dr. Mauro De Luca</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {variants.map((variant, index) => {
            const LogoComponent = variant.component;
            return (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center hover:shadow-lg transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{variant.name}</h3>
                  <p className="text-sm text-gray-500">{variant.description}</p>
                </div>
                
                {/* Preview su sfondo bianco */}
                <div className="bg-gray-50 rounded-2xl p-8 mb-6">
                  <LogoComponent className="w-16 h-16 mx-auto" color="#059669" />
                </div>
                
                {/* Preview su sfondo colorato come nell'header */}
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-8 mb-6">
                  <LogoComponent className="w-16 h-16 mx-auto" color="white" />
                </div>
                
                {/* Preview piccolo come apparirebbe nell'app */}
                <div className="flex justify-center gap-4">
                  <div className="bg-gray-100 rounded-lg p-2">
                    <LogoComponent className="w-8 h-8" color="#059669" />
                  </div>
                  <div className="bg-green-500 rounded-lg p-2">
                    <LogoComponent className="w-8 h-8" color="white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Ogni logo è mostrato in diverse dimensioni e colori per vedere come apparirebbe nell'app
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoShowcase;