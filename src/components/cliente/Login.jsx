// src/components/cliente/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErro("");
    setLoading(true);

    if (!email || !senha) {
      setErro("Preencha o email e a senha para continuar.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/login', { email, senha });
      
      if (res.status === 200) {
        localStorage.setItem("usuario_id", res.data.usuario_id);
        localStorage.setItem("cadastro_email", email);
        localStorage.setItem("cadastro_senha", senha);
        localStorage.setItem("cadastro_tipo", res.data.tipo_usuario);
        
        // Verifica se o usuário já tem cliente cadastrado
        try {
          const clienteRes = await api.get(`/clientes/usuario/${res.data.usuario_id}`);
          if (clienteRes.data._id) {
            navigate('/perfil');
          } else {
            navigate('/cadastro-cliente');
          }
        } catch (err) {
          if (err.response?.status === 404) {
            navigate('/cadastro-cliente');
          } else {
            navigate('/perfil');
          }
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setErro("Email ou senha incorretos.");
      } else if (err.response?.status === 400) {
        setErro(err.response.data.erro || "Dados inválidos. Revise os campos.");
      } else {
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
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
      // Envia o token do Google para o backend
      const res = await api.post('/login/google', {
        credential: credentialResponse.credential
      });
      
      if (res.status === 200) {
        localStorage.setItem("usuario_id", res.data.usuario_id);
        localStorage.setItem("cadastro_email", res.data.email);
        localStorage.setItem("cadastro_tipo", res.data.tipo_usuario);
        
        // Verifica se o usuário já tem cliente cadastrado
        try {
          const clienteRes = await api.get(`/clientes/usuario/${res.data.usuario_id}`);
          if (clienteRes.data._id) {
            navigate('/perfil');
          } else {
            navigate('/cadastro-cliente');
          }
        } catch (err) {
          if (err.response?.status === 404) {
            navigate('/cadastro-cliente');
          } else {
            navigate('/perfil');
          }
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        setErro(err.response.data.erro || "Erro na autenticação com Google.");
      } else {
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErro("Erro no login com Google. Tente novamente.");
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Login
      </h2>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}

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
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          size="large"
          text="continue_with"
          shape="rectangular"
          locale="pt-BR"
        />
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
