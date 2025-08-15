// src/whiteLabel/utils/detectBrand.js
export function detectBrand() {
  const host = window.location.hostname;
  const path = window.location.pathname;
  
  // Para desenvolvimento local, usar tema default (Seenti) para ter as cores corretas
  if (host === '127.0.0.1' || host === 'localhost') {
    console.log('🔍 Desenvolvimento local detectado - usando tema Seenti (default)');
    return 'default';
  }
  
  // Para produção, detectar por subdomain
  const subdomain = host.split('.')[0];
  const knownBrands = ['seenti', 'parceiroX'];
  return knownBrands.includes(subdomain) ? subdomain : 'seenti';
}
