// src/layouts/PerfilClienteLayout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { brand } from '../whiteLabel/config/brandConfig';

export default function PerfilClienteLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Debug: verificar se o layout está sendo renderizado
  useEffect(() => {
    console.log('🔍 PerfilClienteLayout renderizado');
    console.log('📍 Rota atual:', location.pathname);
    console.log('🏷️ Marca detectada:', brand);
    console.log('🖼️ Logo path:', brand?.logo);
    console.log('🎨 Cor primária:', brand?.primaryColor);
    console.log('🎨 Cor secundária:', brand?.secondaryColor);
  }, [location.pathname]);

  const menuItems = [
    {
      label: 'Meu Perfil',
      icon: '👤',
      path: '/perfil',
      description: 'Dados pessoais e informações'
    },
    {
      label: 'Agendamentos',
      icon: '📅',
      path: '/agendamentos',
      description: 'Minhas consultas agendadas'
    },
    {
      label: 'Anamnese',
      icon: '📋',
      path: '/anamnese',
      description: 'Histórico de saúde'
    },
    {
      label: 'Histórico',
      icon: '📊',
      path: '/historico',
      description: 'Sessões realizadas'
    },
    {
      label: 'Configurações',
      icon: '⚙️',
      path: '/configuracoes',
      description: 'Preferências da conta'
    }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Cores padrão caso o WhiteLabel falhe
  const primaryColor = brand?.primaryColor || '#1E3A8A';
  const secondaryColor = brand?.secondaryColor || '#AC80DD';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - sempre visível no desktop, overlay no mobile */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ backgroundColor: primaryColor }}
      >
        {/* Header da sidebar */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <img 
              src={brand?.logo || '/assets/logo-parceirox.png'} 
              alt={`Logo ${brand?.name || 'Seenti'}`}
              className="w-12 h-12 rounded-lg object-contain bg-white p-1"
            />
            <div>
              <h2 className="text-lg font-semibold text-white">{brand?.name || 'Seenti'}</h2>
              <p className="text-sm text-white/80">Área do Cliente</p>
            </div>
          </div>
        </div>

        {/* Menu de navegação */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    isActivePath(item.path) 
                      ? 'bg-white/20 text-white border-l-4' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{ 
                    borderLeftColor: isActivePath(item.path) ? secondaryColor : 'transparent' 
                  }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer da sidebar */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-200 hover:bg-red-500/20 hover:text-red-100 rounded-lg transition-all duration-200"
          >
            <span className="text-xl">🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header mobile */}
        <header className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-xl">☰</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <img 
                src={brand?.logo || '/assets/logo-parceirox.png'} 
                alt={`Logo ${brand?.name || 'Seenti'}`}
                className="w-8 h-8 rounded-lg object-contain bg-white p-1"
              />
              <span className="font-semibold text-gray-800">{brand?.name || 'Seenti'}</span>
            </div>
            
            <div className="w-10"></div>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
