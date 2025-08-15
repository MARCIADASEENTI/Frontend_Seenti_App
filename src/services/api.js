import axios from 'axios';

// URL base do backend - usando IP da rede local para funcionar em todos os dispositivos
const API_BASE_URL = 'http://10.0.0.167:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
