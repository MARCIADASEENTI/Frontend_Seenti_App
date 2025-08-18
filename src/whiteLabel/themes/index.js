import { getLogoPath } from '../utils/detectBrand';

export const themes = {
  default: {
    name: 'Seenti',
    logo: getLogoPath('/logo.png'),
    primaryColor: '#1E3A8A',
    secondaryColor: '#AC80DD',
    fontFamily: 'Arial, sans-serif',
    poweredBy: 'Seenti®',
  },
  parceiroX: {
    name: 'Marcia Alves',
    logo: getLogoPath('/assets/logo-parceirox.png'),
    primaryColor: '#FF6600',
    secondaryColor: '#f4f4f4',
    fontFamily: 'Roboto, sans-serif',
    poweredBy: 'Seenti®',
  },
};

// Debug: verificar se os temas estão sendo carregados
console.log('🔍 Temas carregados:', themes);
console.log('🔍 Tema padrão:', themes.default);
console.log('🔍 Tema parceiroX:', themes.parceiroX);
