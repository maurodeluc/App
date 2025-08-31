import React from 'react';

const FontShowcase = () => {
  const fontOptions = [
    { 
      name: "Poppins", 
      family: "Poppins", 
      description: "Moderno, geometrico, molto leggibile - perfetto per wellness",
      weight: "600"
    },
    { 
      name: "Montserrat", 
      family: "Montserrat", 
      description: "Elegante, professionale, ispirato alla tipografia urbana",
      weight: "700"
    },
    { 
      name: "Raleway", 
      family: "Raleway", 
      description: "Sottile ed elegante, trasmette sofisticazione",
      weight: "600"
    },
    { 
      name: "Nunito", 
      family: "Nunito", 
      description: "Amichevole e accogliente, perfetto per salute mentale",
      weight: "700"
    },
    { 
      name: "Source Sans 3", 
      family: "Source Sans 3", 
      description: "Pulito e neutrale, ottimo per applicazioni mediche",
      weight: "700"
    },
    { 
      name: "Outfit", 
      family: "Outfit", 
      description: "Moderno e distintivo, ideale per brand contemporanei",
      weight: "600"
    },
    { 
      name: "Inter (attuale)", 
      family: "Inter", 
      description: "Font attuale - ottimo per leggibilità digitale",
      weight: "700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Opzioni Font per "LEAF"
          </h1>
          <p className="text-gray-600">
            Scegli il font che meglio rappresenta il Dr. Mauro De Luca
          </p>
        </div>

        <div className="space-y-6">
          {fontOptions.map((font, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              
              {/* Font Name e Description */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{font.name}</h3>
                <p className="text-sm text-gray-600">{font.description}</p>
              </div>
              
              {/* Preview Header Simulato */}
              <div className="bg-gradient-to-r from-slate-50 via-white to-green-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">🍃</span>
                    </div>
                    <div>
                      <h1 
                        className="text-3xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                        style={{ 
                          fontFamily: font.family,
                          fontWeight: font.weight
                        }}
                      >
                        LEAF
                      </h1>
                      <p className="text-xs text-gray-500 -mt-1">Laboratorio di Educazione Alla Felicità</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview Sizes */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <h4 
                    className="text-4xl mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                    style={{ 
                      fontFamily: font.family,
                      fontWeight: font.weight
                    }}
                  >
                    LEAF
                  </h4>
                  <span className="text-xs text-gray-500">Grande</span>
                </div>
                <div>
                  <h4 
                    className="text-2xl mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                    style={{ 
                      fontFamily: font.family,
                      fontWeight: font.weight
                    }}
                  >
                    LEAF
                  </h4>
                  <span className="text-xs text-gray-500">Header</span>
                </div>
                <div>
                  <h4 
                    className="text-lg mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                    style={{ 
                      fontFamily: font.family,
                      fontWeight: font.weight
                    }}
                  >
                    LEAF
                  </h4>
                  <span className="text-xs text-gray-500">Piccolo</span>
                </div>
              </div>
              
              {/* Preview su sfondo scuro */}
              <div className="bg-gray-800 rounded-2xl p-4 mt-4">
                <h4 
                  className="text-2xl text-center bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
                  style={{ 
                    fontFamily: font.family,
                    fontWeight: font.weight
                  }}
                >
                  LEAF
                </h4>
              </div>
              
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Considerazioni:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Poppins/Nunito:</strong> Più amichevoli e accoglienti</p>
              <p><strong>Montserrat/Raleway:</strong> Più eleganti e professionali</p>
              <p><strong>Source Sans/Inter:</strong> Più neutri e medici</p>
              <p><strong>Outfit:</strong> Più moderno e distintivo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontShowcase;