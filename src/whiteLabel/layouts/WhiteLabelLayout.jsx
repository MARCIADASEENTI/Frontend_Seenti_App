// src/whiteLabel/layouts/WhiteLabelLayout.jsx
import React, { useState } from 'react';
import { brand } from '../config/brandConfig.js';
import './WhiteLabelLayout.css';

const WhiteLabelLayout = ({ children }) => {
  const [logoError, setLogoError] = useState(false);
  
  const layoutStyle = {
    '--primary-color': brand.primaryColor,
    '--secondary-color': brand.secondaryColor,
  };

  const handleLogoError = (e) => {
    console.error('❌ Erro ao carregar logo no WhiteLabelLayout:', brand.logo);
    setLogoError(true);
  };

  const logoFallback = '/assets/logo-parceirox.png';

  return (
    <div className="white-label-layout" style={layoutStyle}>
      <img 
        src={logoError ? logoFallback : brand.logo} 
        alt={`${brand.name} logo`} 
        className="white-label-logo"
        onError={handleLogoError}
        onLoad={() => console.log('✅ Logo carregado com sucesso:', brand.logo)}
      />

      <main className="white-label-main">
        {children}
      </main>

      {/* Rodapé sempre visível com a marca Seenti */}
      <footer className="white-label-footer">
        <span>© {new Date().getFullYear()} Seenti® - Todos os direitos reservados.</span>
      </footer>
    </div>
  );
};

export default WhiteLabelLayout;
