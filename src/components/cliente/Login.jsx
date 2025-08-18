// src/components/cliente/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../services/api";
import { getButtonConfig } from "../../config/googleOAuthConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [googleOAuthError, setGoogleOAuthError] = useState(false);
  const navigate = useNavigate();

  // Função para verificar fluxo do usuário
  const verificarFluxoUsuario = async (usuario_id) => {
    try {
      console.log('🔍 Iniciando verificação de fluxo para usuário:', usuario_id);
      
      // 1. Verifica se o usuário já aceitou os termos
      console.log('📋 Verificando se usuário aceitou termos...');
      const termosRes = await api.get(`/termo-assinado/${usuario_id}`);
      console.log('📋 Resposta da verificação de termos:', termosRes.data);
      
      if (termosRes.data.assinado) {
        console.log('✅ Usuário já aceitou os termos');
        
        // 2. Se aceitou termos, verifica se tem cliente
        try {
          console.log('👤 Verificando se usuário tem cliente cadastrado...');
          const clienteRes = await api.get(`/clientes/usuario/${usuario_id}`);
          console.log('👤 Resposta da verificação de cliente:', clienteRes.data);
          
          if (clienteRes.data._id) {
            console.log('✅ Usuário tem cliente cadastrado, redirecionando para perfil');
            // 3. Se tem cliente, vai para perfil
            localStorage.setItem("cliente_id", clienteRes.data._id);
            navigate('/perfil');
          } else {
            console.log('❌ Usuário não tem cliente cadastrado, redirecionando para cadastro');
            // 4. Se não tem cliente, vai para cadastro de cliente
            navigate('/cadastro-cliente');
          }
        } catch (err) {
          console.error('❌ Erro ao verificar cliente:', err);
          if (err.response?.status === 404) {
            console.log('❌ Cliente não encontrado, redirecionando para cadastro');
            // 5. Cliente não encontrado, vai para cadastro
            navigate('/cadastro-cliente');
          } else {
            console.log('❌ Erro na busca, redirecionando para perfil (segurança)');
            // 6. Erro na busca, vai para perfil (segurança)
            navigate('/perfil');
          }
        }
      } else {
        console.log('❌ Usuário não aceitou termos, redirecionando para página de termos');
        // 7. Se não aceitou termos, vai para página de termos
        navigate('/termo');
      }
    } catch (err) {
      console.error('❌ Erro na verificação de fluxo:', err);
      if (err.response?.status === 404) {
        console.log('❌ Não tem registro de termos, redirecionando para página de termos');
        // 8. Se não tem registro de termos, vai para página de termos
        navigate('/termo');
      } else {
        console.log('❌ Em caso de erro, redirecionando para página de termos (segurança)');
        // 9. Em caso de erro, vai para página de termos (segurança)
        navigate('/termo');
      }
    }
  };

  // Função para lidar com o login tradicional
  const handleLogin = async () => {
    setErro("");
    setLoading(true);

    try {
      console.log('🔐 Tentando login com email:', email);
      const res = await api.post("/login", {
        email,
        senha,
      });

      if (res.status === 200) {
        console.log('✅ Login bem-sucedido:', res.data);
        localStorage.setItem("usuario_id", res.data.usuario_id);
        localStorage.setItem("cadastro_email", email);
        localStorage.setItem("cadastro_senha", senha);
        localStorage.setItem("cadastro_tipo", res.data.tipo_usuario);
        
        console.log('💾 Dados salvos no localStorage:', {
          usuario_id: res.data.usuario_id,
          email: email,
          tipo_usuario: res.data.tipo_usuario
        });
        
        // Verifica fluxo do usuário
        await verificarFluxoUsuario(res.data.usuario_id);
      }
    } catch (err) {
      console.error('❌ Erro no login:', err);
      
      // Tratamento inteligente de erros
      if (err.response?.status === 401) {
        setErro("Email ou senha incorretos.");
      } else if (err.response?.status === 404) {
        // Usuário não encontrado - sugerir cadastro
        setErro("Usuário não encontrado. Deseja criar uma conta?");
        // Limpar campos para facilitar o cadastro
        setEmail(email); // Mantém o email para facilitar
        setSenha("");
      } else if (err.response?.status === 400) {
        setErro(err.response.data.erro || "Dados inválidos. Revise os campos.");
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        // Erro real de conexão
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
      } else if (err.response?.status >= 500) {
        // Erro do servidor
        setErro("Erro interno do servidor. Tente novamente em alguns minutos.");
      } else {
        // Outros erros
        setErro("Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o login do Google
  const handleGoogleSuccess = async (credentialResponse) => {
    setErro("");
    setLoading(true);

    try {
      console.log('🔐 Tentando login com Google...');
      // Envia o token do Google para o backend
      const res = await api.post('/login/google', {
        credential: credentialResponse.credential
      });
      
      if (res.status === 200) {
        console.log('✅ Login Google bem-sucedido:', res.data);
        localStorage.setItem("usuario_id", res.data.usuario_id);
        localStorage.setItem("cadastro_email", res.data.email);
        localStorage.setItem("cadastro_tipo", res.data.tipo_usuario);
        
        console.log('💾 Dados salvos no localStorage (Google):', {
          usuario_id: res.data.usuario_id,
          email: res.data.email,
          tipo_usuario: res.data.tipo_usuario
        });
        
        // Verifica fluxo do usuário
        await verificarFluxoUsuario(res.data.usuario_id);
      }
    } catch (err) {
      console.error('❌ Erro no login Google:', err);
      
      // Tratamento inteligente de erros para Google OAuth
      if (err.response?.status === 400) {
        setErro(err.response.data.erro || "Erro na autenticação com Google.");
      } else if (err.response?.status === 404) {
        setErro("Usuário Google não encontrado. Será criado automaticamente.");
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        // Erro real de conexão
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
      } else if (err.response?.status >= 500) {
        // Erro do servidor
        setErro("Erro interno do servidor. Tente novamente em alguns minutos.");
      } else {
        // Outros erros
        setErro("Erro na autenticação com Google. Use o login tradicional.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleOAuthError(true);
    setErro("Erro no login com Google. Use o login tradicional ou tente novamente.");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Login
      </h2>

      {erro && (
        <div className="mb-4">
          <p className="text-red-600 mb-3">{erro}</p>
          
          {/* Botão inteligente para usuário não encontrado */}
          {erro.includes("Usuário não encontrado") && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm mb-3">
                💡 Este email não está cadastrado em nossa base.
              </p>
              <button
                onClick={() => navigate("/cadastro-usuario", { 
                  state: { email: email } // Passa o email para facilitar o cadastro
                })}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition text-sm font-medium"
              >
                🚀 Criar conta com este email
              </button>
            </div>
          )}
        </div>
      )}

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          className="border rounded px-3 py-2"
          required
        />

        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha"
          className="border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Separador */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">ou</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Botão Google Login */}
      <div className="flex justify-center">
        {!googleOAuthError ? (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            {...getButtonConfig()}
          />
        ) : (
          <div className="text-center">
            <p className="text-red-600 mb-3">Google OAuth indisponível</p>
            <button
              onClick={() => setGoogleOAuthError(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Tentar Google OAuth Novamente
            </button>
          </div>
        )}
      </div>

      <p className="text-center mt-4">
        Não possui conta?{" "}
        <button
          onClick={() => navigate("/cadastro-usuario")}
          className="text-green-700 underline hover:text-green-900"
        >
          Criar conta
        </button>
      </p>
    </div>
  );
}
