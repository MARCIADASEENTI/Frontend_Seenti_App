// src/whiteLabel/utils/detectBrand.js

// Função para detectar a marca baseada no hostname
export const detectBrand = () => {
  const host = window.location.hostname;
  const port = window.location.port;
  
  if (host === '127.0.0.1' || host === 'localhost') {
    // Se estiver usando port forwarding (porta 8080), usar tema padrão
    if (port === '8080') {
      return 'default';
    }
    // Se estiver rodando direto na porta 5173, usar tema padrão
    if (port === '5173') {
      return 'default';
    }
  }
  
  // Para produção, usar tema padrão
  return 'default';
};

// Função para detectar o caminho correto do logo baseado no ambiente
export const getLogoPath = (logoPath) => {
  const host = window.location.hostname;
  const port = window.location.port;
  
  // Se estiver usando port forwarding (porta 8080), usar caminho relativo
  if (port === '8080') {
    // Remover a barra inicial para usar caminho relativo
    return logoPath.startsWith('/') ? logoPath.substring(1) : logoPath;
  }
  
  // Para desenvolvimento direto (porta 5173) ou produção, usar caminho absoluto
  return logoPath;
};
