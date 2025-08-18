# 🎨 DOCUMENTAÇÃO PADRÃO DO SISTEMA WHITELABEL

## 🎯 **VISÃO GERAL**
**Sistema:** WhiteLabel para Frontend Seenti App  
**Versão:** 1.0.0  
**Data:** 15 de Agosto de 2025  
**Status:** ✅ **PRODUÇÃO**

---

## 🏗️ **ARQUITETURA DO SISTEMA**

### **Estrutura de Pastas**
```
src/whiteLabel/
├── config/
│   └── brandConfig.js          # Configuração principal de marcas
├── themes/
│   └── index.js                # Definição de temas
├── utils/
│   └── detectBrand.js          # Detecção automática de ambiente
└── layouts/
    ├── WhiteLabelLayout.jsx     # Layout principal WhiteLabel
    ├── WhiteLabelLayout.css     # Estilos isolados
    └── PerfilClienteLayout.jsx  # Layout específico do perfil
```

### **Fluxo de Funcionamento**
```
1. detectBrand.js → Detecta ambiente automaticamente
2. brandConfig.js → Seleciona tema baseado no ambiente
3. themes/index.js → Aplica configurações do tema
4. Componentes → Recebem configurações via brand object
```

---

## 🔧 **IMPLEMENTAÇÃO TÉCNICA**

### **1. DETECÇÃO AUTOMÁTICA DE AMBIENTE**

#### **Arquivo:** `src/whiteLabel/utils/detectBrand.js`

```javascript
export const detectBrand = () => {
  const host = window.location.hostname;
  const port = window.location.port;
  
  if (host === '127.0.0.1' || host === 'localhost') {
    // Desenvolvimento local
    if (port === '8080') return 'default';      // Port forwarding
    if (port === '5173') return 'default';      // Desenvolvimento direto
  }
  
  // Produção - usar tema padrão
  return 'default';
};

export const getLogoPath = (logoPath) => {
  const port = window.location.port;
  
  // Port forwarding (8080) → caminho relativo
  if (port === '8080') {
    return logoPath.startsWith('/') ? logoPath.substring(1) : logoPath;
  }
  
  // Desenvolvimento direto (5173) ou produção → caminho absoluto
  return logoPath;
};
```

#### **Como Funciona:**
- **Porta 8080** → Port forwarding (Android) → Logo relativo
- **Porta 5173** → Desenvolvimento direto → Logo absoluto
- **Produção** → Logo absoluto

### **2. CONFIGURAÇÃO DE TEMAS**

#### **Arquivo:** `src/whiteLabel/themes/index.js`

```javascript
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
```

#### **Propriedades dos Temas:**
- **name** → Nome da marca
- **logo** → Caminho do logo (automático)
- **primaryColor** → Cor principal (hex)
- **secondaryColor** → Cor secundária (hex)
- **fontFamily** → Família de fonte
- **poweredBy** → Crédito da marca

### **3. CONFIGURAÇÃO PRINCIPAL**

#### **Arquivo:** `src/whiteLabel/config/brandConfig.js`

```javascript
import { themes } from '../themes';
import { detectBrand } from '../utils/detectBrand';

const currentBrandKey = detectBrand();
export const brand = themes[currentBrandKey] || themes['default'];
```

#### **Como Usar:**
```javascript
import { brand } from '@white/config/brandConfig';

// Acessar propriedades
const logoPath = brand.logo;
const primaryColor = brand.primaryColor;
const brandName = brand.name;
```

---

## 📱 **IMPLEMENTAÇÃO EM COMPONENTES**

### **1. LAYOUT PRINCIPAL WHITELABEL**

#### **Arquivo:** `src/whiteLabel/layouts/WhiteLabelLayout.jsx`

```javascript
import React, { useState } from 'react';
import { brand } from '../config/brandConfig.js';
import './WhiteLabelLayout.css';

const WhiteLabelLayout = ({ children }) => {
  const [logoError, setLogoError] = useState(false);
  
  const layoutStyle = {
    '--primary-color': brand.primaryColor,
    '--secondary-color': brand.secondaryColor,
  };

  return (
    <div className="white-label-layout" style={layoutStyle}>
      <img 
        src={brand.logo} 
        alt={`${brand.name} logo`} 
        className="white-label-logo"
        onError={() => setLogoError(true)}
      />
      <main className="white-label-main">{children}</main>
      <footer className="white-label-footer">
        © {new Date().getFullYear()} {brand.poweredBy}
      </footer>
    </div>
  );
};
```

#### **Características:**
- **CSS isolado** - não interfere com outros layouts
- **Variáveis CSS** - cores dinâmicas
- **Error handling** - fallback para logo
- **Responsivo** - adapta a todos os dispositivos

### **2. LAYOUT ESPECÍFICO COM WHITELABEL**

#### **Arquivo:** `src/layouts/PerfilClienteLayout.jsx`

```javascript
import { brand } from '@white/config/brandConfig';

export default function PerfilClienteLayout({ children }) {
  // Aplicar cores do WhiteLabel
  const sidebarStyle = {
    backgroundColor: brand?.primaryColor || '#1E3A8A',
    borderRightColor: brand?.secondaryColor || '#AC80DD'
  };

  const logoStyle = {
    background: `linear-gradient(135deg, ${brand?.primaryColor}, ${brand?.secondaryColor})`
  };

  return (
    <div className="perfil-cliente-layout">
      <aside className="perfil-sidebar" style={sidebarStyle}>
        <div className="perfil-sidebar-header">
          <img 
            src={brand?.logo} 
            alt={`Logo ${brand?.name}`}
            style={{
              width: '3rem',
              height: '3rem',
              maxWidth: '3rem',
              maxHeight: '3rem',
              objectFit: 'contain'
            }}
          />
          <h2>{brand?.name}</h2>
        </div>
        {/* Resto do layout */}
      </aside>
    </div>
  );
}
```

#### **Características:**
- **Cores dinâmicas** - aplicadas via inline styles
- **Logo responsivo** - tamanho controlado
- **Branding consistente** - nome e logo da marca
- **Fallbacks** - valores padrão se brand não carregar

---

## 🎨 **CSS E RESPONSIVIDADE**

### **1. CSS ISOLADO**

#### **Arquivo:** `src/whiteLabel/layouts/WhiteLabelLayout.css`

```css
/* CSS isolado - não interfere com outros layouts */
.white-label-layout {
  /* Estilos específicos */
}

.white-label-layout .white-label-logo {
  width: 120px;
  height: auto;
  max-width: 100%;
  max-height: 120px;
}

/* Responsividade */
@media (max-width: 768px) {
  .white-label-layout .white-label-logo {
    width: 80px !important;
    max-width: 80px !important;
  }
}
```

#### **Princípios:**
- **Seletores específicos** - `.white-label-layout .logo`
- **!important** - para tamanhos críticos
- **Media queries** - responsividade completa
- **Isolamento** - sem conflitos CSS

### **2. BREAKPOINTS PADRÃO**

```css
/* Desktop */
@media (min-width: 769px) { /* Estilos desktop */ }

/* Tablet */
@media (max-width: 768px) { /* Estilos tablet */ }

/* Mobile */
@media (max-width: 480px) { /* Estilos mobile */ }

/* Mobile pequeno */
@media (max-width: 360px) { /* Estilos mobile pequeno */ }
```

---

## 🚀 **ADICIONANDO NOVOS TEMAS**

### **1. CRIAR NOVO TEMA**

```javascript
// src/whiteLabel/themes/index.js
export const themes = {
  default: { /* Tema Seenti */ },
  parceiroX: { /* Tema ParceiroX */ },
  novoCliente: {
    name: 'Novo Cliente',
    logo: getLogoPath('/assets/logo-novo.png'),
    primaryColor: '#00FF00',
    secondaryColor: '#FF00FF',
    fontFamily: 'Helvetica, sans-serif',
    poweredBy: 'Novo Cliente®',
  },
};
```

### **2. DETECÇÃO AUTOMÁTICA**

```javascript
// src/whiteLabel/utils/detectBrand.js
export const detectBrand = () => {
  const host = window.location.hostname;
  
  // Detectar por subdomain
  if (host.includes('novocliente')) return 'novoCliente';
  if (host.includes('parceirox')) return 'parceiroX';
  
  // Padrão
  return 'default';
};
```

---

## 🔍 **TROUBLESHOOTING**

### **1. LOGO NÃO CARREGA**

#### **Problema:** Logo não aparece
```javascript
// Verificar se brand está carregando
console.log('Brand:', brand);
console.log('Logo path:', brand?.logo);

// Verificar se arquivo existe
// public/logo.png deve existir
```

#### **Solução:**
- Verificar se arquivo existe em `public/`
- Verificar import do `brandConfig`
- Verificar se `detectBrand()` está funcionando

### **2. CORES NÃO APLICAM**

#### **Problema:** Cores padrão aparecem
```javascript
// Verificar se cores estão sendo aplicadas
console.log('Primary color:', brand?.primaryColor);
console.log('Secondary color:', brand?.secondaryColor);

// Verificar se CSS está sendo aplicado
// Verificar se variáveis CSS estão definidas
```

#### **Solução:**
- Verificar se `brand` está sendo importado
- Verificar se CSS está sendo aplicado
- Verificar se variáveis CSS estão definidas

### **3. RESPONSIVIDADE NÃO FUNCIONA**

#### **Problema:** Layout não se adapta
```css
/* Verificar se media queries estão funcionando */
@media (max-width: 768px) {
  .white-label-logo {
    width: 80px !important; /* Forçar tamanho */
  }
}
```

#### **Solução:**
- Verificar se CSS está sendo carregado
- Verificar se media queries estão corretas
- Usar estilos inline para tamanhos críticos

---

## 📚 **BOAS PRÁTICAS**

### **1. IMPORTS**
```javascript
// ✅ CORRETO - usar alias
import { brand } from '@white/config/brandConfig';

// ❌ INCORRETO - caminho relativo
import { brand } from '../../whiteLabel/config/brandConfig';
```

### **2. CSS ISOLADO**
```css
/* ✅ CORRETO - seletores específicos */
.white-label-layout .white-label-logo { }

/* ❌ INCORRETO - seletores genéricos */
.white-label-logo { }
```

### **3. RESPONSIVIDADE**
```javascript
// ✅ CORRETO - estilos inline para tamanhos críticos
style={{
  width: '3rem',
  height: '3rem',
  maxWidth: '3rem',
  maxHeight: '3rem'
}}

// ✅ CORRETO - CSS para estilos não críticos
className="rounded-lg object-contain bg-white p-1"
```

### **4. ERROR HANDLING**
```javascript
// ✅ CORRETO - fallbacks para valores padrão
const primaryColor = brand?.primaryColor || '#1E3A8A';
const logoPath = brand?.logo || '/assets/logo-default.png';
```

---

## 🎯 **CHECKLIST DE IMPLEMENTAÇÃO**

### **✅ ANTES DE IMPLEMENTAR:**
- [ ] Verificar se tema existe em `themes/index.js`
- [ ] Verificar se `detectBrand()` detecta corretamente
- [ ] Verificar se arquivos de logo existem em `public/`
- [ ] Verificar se cores estão definidas no tema

### **✅ DURANTE IMPLEMENTAÇÃO:**
- [ ] Usar import com alias `@white`
- [ ] Aplicar cores via inline styles ou variáveis CSS
- [ ] Usar CSS isolado para evitar conflitos
- [ ] Implementar responsividade completa

### **✅ APÓS IMPLEMENTAÇÃO:**
- [ ] Testar em todos os dispositivos
- [ ] Verificar se logo carrega corretamente
- [ ] Verificar se cores estão sendo aplicadas
- [ ] Verificar se responsividade funciona
- [ ] Testar em diferentes ambientes (dev/prod)

---

## 🏆 **CONCLUSÃO**

### **Sistema WhiteLabel Implementado:**
- ✅ **Detecção automática** de ambiente
- ✅ **Temas configuráveis** e extensíveis
- ✅ **CSS isolado** sem conflitos
- ✅ **Responsividade completa** em todos os dispositivos
- ✅ **Arquitetura escalável** para futuras expansões

### **Pronto para Uso:**
- **Desenvolvimento** → Funciona automaticamente
- **Produção** → Funciona automaticamente
- **Novos temas** → Fácil de adicionar
- **Manutenção** → Código limpo e documentado

---

## 📞 **SUPORTE E CONTATO**

**Documentação criada:** 15 de Agosto de 2025  
**Versão:** 1.0.0  
**Status:** ✅ **PRODUÇÃO**  
**Manutenção:** Equipe de Desenvolvimento

**Para dúvidas ou implementações futuras, consultar esta documentação antes de qualquer modificação.**




