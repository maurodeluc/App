import React from 'react';
import { StylizedLeaf, GrowthSymbol, SpiralGrowth, FeatherSymbol } from '../components/NewLogoOptions';

const NewLogoShowcase = () => {
  const options = [
    { 
      component: StylizedLeaf, 
      name: "FOGLIA STILIZZATA", 
      description: "Foglia realistica con nervature ben definite e visibili" 
    },
    { 
      component: GrowthSymbol, 
      name: "GERMOGLIO CRESCITA", 
      description: "Simbolo di crescita personale con stelo curvo e foglie progressive" 
    },
    { 
      component: SpiralGrowth, 
      name: "SPIRALE CRESCITA", 
      description: "Crescita astratta in spirale con elementi di leggerezza" 
    },
    { 
      component: FeatherSymbol, 
      name: "PIUMA LEGGEREZZA", 
      description: "Simbolo di trasformazione, leggerezza e libertà interiore" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Nuove Opzioni Logo LEAF
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Una foglia stilizzata con nervature ben visibili, oppure simboli di crescita personale e leggerezza
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {options.map((option, index) => {
            const LogoComponent = option.component;
            return (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{option.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
                </div>
                
                {/* Preview grande su sfondo neutro */}
                <div className="bg-gray-50 rounded-2xl p-12 mb-6 flex justify-center">
                  <LogoComponent className="w-20 h-20" color="#059669" />
                </div>
                
                {/* Preview su sfondo gradient come nell'header */}
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-8 mb-6 flex justify-center">
                  <LogoComponent className="w-16 h-16" color="white" />
                </div>
                
                {/* Preview piccoli per vedere la leggibilità */}
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-lg p-3 mb-2">
                      <LogoComponent className="w-8 h-8" color="#059669" />
                    </div>
                    <span className="text-xs text-gray-500">Small</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-500 rounded-lg p-3 mb-2">
                      <LogoComponent className="w-8 h-8" color="white" />
                    </div>
                    <span className="text-xs text-gray-500">Header</span>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-100 rounded-full p-3 mb-2">
                      <LogoComponent className="w-8 h-8" color="#059669" />
                    </div>
                    <span className="text-xs text-gray-500">Profile</span>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Significati simbolici:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Foglia:</strong> Natura, crescita, trasformazione terapeutica</p>
              <p><strong>Germoglio:</strong> Sviluppo personale, potenziale, nuovi inizi</p>
              <p><strong>Spirale:</strong> Crescita interiore, evoluzione, movimento positivo</p>
              <p><strong>Piuma:</strong> Leggerezza mentale, libertà, superamento dei pesi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLogoShowcase;