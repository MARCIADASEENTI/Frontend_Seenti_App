import axios from 'axios';

// URL base do backend - detectar automaticamente se é local ou produção
const getApiBaseUrl = () => {
  const host = window.location.hostname;
  const port = window.location.port;
  
  // Se estiver rodando localmente (localhost ou 127.0.0.1)
  if (host === 'localhost' || host === '127.0.0.1') {
    // Se estiver usando port forwarding (porta 8080), usar backend local
    if (port === '8080') {
      return 'http://10.0.0.167:5000';
    }
    // Se estiver rodando direto na porta 5173, usar backend local
    if (port === '5173') {
      return 'http://localhost:5000';
    }
  }
  
  // Para produção, usar Render
  return 'https://backend-seenti-app.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
