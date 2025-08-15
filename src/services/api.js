import axios from 'axios';

// URL base do backend - temporariamente usando localhost para teste
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
