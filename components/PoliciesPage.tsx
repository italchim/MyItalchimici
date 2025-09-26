import React from 'react';

export const PoliciesPage: React.FC = () => {
  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Politiche e Procedure</h1>
      <p className="text-gray-500 mb-8">Una raccolta centralizzata di tutte le politiche e procedure aziendali.</p>
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-700">Contenuto in Arrivo</h2>
        <p className="text-gray-500 mt-2">Questa sezione è in costruzione. A breve qui troverai tutte le politiche e le procedure aziendali.</p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};