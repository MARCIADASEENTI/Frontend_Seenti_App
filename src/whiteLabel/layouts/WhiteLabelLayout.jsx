// src/whiteLabel/layouts/WhiteLabelLayout.jsx
import React, { useState, useEffect } from 'react';
import { brand } from '../config/brandConfig.js';

const WhiteLabelLayout = ({ children }) => {
  const [logoError, setLogoError] = useState(false);
  
  const layoutStyle = {
    backgroundColor: brand.primaryColor,
    background: `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.secondaryColor} 100%)`,
    minHeight: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden'
  };

  // Debug: verificar se as variáveis estão sendo aplicadas
  useEffect(() => {
    console.log('🔍 WhiteLabelLayout renderizado');
    console.log('🏷️ Marca:', brand.name);
    console.log('🎨 Cor primária:', brand.primaryColor);
    console.log('🎨 Cor secundária:', brand.secondaryColor);
    console.log('🖼️ Logo path:', brand.logo);
  }, []);

  const handleLogoError = (e) => {
    console.error('❌ Erro ao carregar logo no WhiteLabelLayout:', brand.logo);
    setLogoError(true);
  };

  const logoFallback = '/assets/logo-parceirox.png';

  return (
    <div style={layoutStyle}>
      <img 
        src={logoError ? logoFallback : brand.logo} 
        alt={`${brand.name} logo`} 
        style={{
          width: '120px',
          height: 'auto',
          marginBottom: '2rem',
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '120px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
          transition: 'transform 0.3s ease',
          zIndex: 10,
          position: 'relative'
        }}
        onError={handleLogoError}
        onLoad={() => console.log('✅ Logo carregado com sucesso:', brand.logo)}
      />

      <main style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 10,
        position: 'relative'
      }}>
        {children}
      </main>

      {/* Rodapé sempre visível com a marca Seenti */}
      <footer style={{
        marginTop: '3rem',
        fontSize: '0.8rem',
        opacity: 0.8,
        paddingTop: '1rem',
        color: 'white',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        zIndex: 10,
        position: 'relative'
      }}>
        <span>© {new Date().getFullYear()} Seenti® - Todos os direitos reservados.</span>
      </footer>
    </div>
  );
};

export default WhiteLabelLayout;
