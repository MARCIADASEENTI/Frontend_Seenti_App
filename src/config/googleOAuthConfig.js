// src/config/googleOAuthConfig.js

// Configuração do Google OAuth
export const GOOGLE_OAUTH_CONFIG = {
  // Client ID do Google OAuth (REAL - configurado no Google Cloud Console)
  CLIENT_ID: "768273235594-t9kch0mocin6m5gkcp984hp2f1crqii2.apps.googleusercontent.com",
  
  // Configurações do botão de login
  BUTTON_CONFIG: {
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    locale: "pt-BR",
    useOneTap: true
  },
  
  // Escopos solicitados
  SCOPES: [
    "email",
    "profile",
    "openid"
  ],
  
  // URLs de redirecionamento
  REDIRECT_URIS: {
    development: "http://localhost:5173",
    production: "https://frontend-seenti-app.vercel.app"
  },
  
  // Configurações de validação
  VALIDATION: {
    // Tempo máximo para validação de token (em segundos)
    TOKEN_TIMEOUT: 300,
    
    // Campos obrigatórios no token
    REQUIRED_FIELDS: ["email", "name", "picture"]
  }
};

// Função para obter o Client ID baseado no ambiente
export const getGoogleClientId = () => {
  // Em produção, você pode usar variáveis de ambiente
  if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return import.meta.env.VITE_GOOGLE_CLIENT_ID;
  }
  
  return GOOGLE_OAUTH_CONFIG.CLIENT_ID;
};

// Função para obter configurações do botão
export const getButtonConfig = () => {
  return {
    ...GOOGLE_OAUTH_CONFIG.BUTTON_CONFIG,
    clientId: getGoogleClientId()
  };
};

// Função para validar resposta do Google
export const validateGoogleResponse = (credentialResponse) => {
  if (!credentialResponse || !credentialResponse.credential) {
    throw new Error("Resposta inválida do Google");
  }
  
  return true;
};

export default GOOGLE_OAUTH_CONFIG;
