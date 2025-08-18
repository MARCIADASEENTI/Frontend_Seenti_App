import { themes } from '../themes';
import { detectBrand } from '../utils/detectBrand';

// Debug: verificar se o detectBrand está funcionando
console.log('🔍 detectBrand chamado, hostname:', window.location.hostname);
console.log('🔍 detectBrand chamado, port:', window.location.port);

const currentBrandKey = detectBrand();
console.log('🔍 Marca detectada:', currentBrandKey);

export const brand = themes[currentBrandKey] || themes['default'];
console.log('🔍 Configuração da marca:', brand);
