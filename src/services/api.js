import axios from 'axios';

// URL base do backend - configurada para funcionar em todos os dispositivos
const API_BASE_URL = 'https://seenti-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
