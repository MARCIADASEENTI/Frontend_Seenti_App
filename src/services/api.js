import axios from 'axios';

// URL base do backend - usando Render para funcionar em todos os dispositivos
const API_BASE_URL = 'https://backend-seenti-app.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
