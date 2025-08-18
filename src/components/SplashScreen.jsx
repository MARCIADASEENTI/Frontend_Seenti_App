// src/components/SplashScreen.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simular tempo de carregamento
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Navegar para login após fade out
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center">
        {/* Logo Seenti */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-4xl font-bold">❤️</span>
            </div>
          </div>
        </div>

        {/* Nome da marca */}
        <h1 className="text-6xl font-bold text-white mb-4 tracking-wider">
          Seenti
        </h1>

        {/* Subtítulo */}
        <p className="text-xl text-white/80 mb-8">
          Plataforma de Terapia Integrativa
        </p>

        {/* Animação de carregamento */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>

        {/* Texto de carregamento */}
        <p className="text-white/60 mt-6 text-sm">
          Carregando...
        </p>
      </div>
    </div>
  );
}

