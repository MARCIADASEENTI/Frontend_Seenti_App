// src/components/cliente/CadastroUsuario.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CadastroUsuario() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailValido, setEmailValido] = useState(true);
  const [emailVerificando, setEmailVerificando] = useState(false);
  const [emailDisponivel, setEmailDisponivel] = useState(null);
  const [senhaValida, setSenhaValida] = useState(true);
  const [senhaRequisitos, setSenhaRequisitos] = useState({
    comprimento: false,
    letra: false,
    numero: false,
    especial: false
  });
  const navigate = useNavigate();

  // Validação de formato de e-mail
  const validarFormatoEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  // Validação de senha forte
  const validarSenhaForte = (senha) => {
    const requisitos = {
      comprimento: senha.length >= 8,
      letra: /[a-zA-Z]/.test(senha),
      numero: /\d/.test(senha),
      especial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)
    };
    
    setSenhaRequisitos(requisitos);
    
    return Object.values(requisitos).every(req => req === true);
  };

  // Verificar disponibilidade do e-mail
  const verificarEmailDisponivel = async (email) => {
    if (!email || !validarFormatoEmail(email)) {
      setEmailDisponivel(null);
      return;
    }

    setEmailVerificando(true);
    try {
      // Verificar se o e-mail já existe
      const res = await api.get(`/usuarios/verificar-email/${encodeURIComponent(email)}`);
      setEmailDisponivel(true);
    } catch (err) {
      if (err.response?.status === 409) {
        setEmailDisponivel(false);
      } else {
        setEmailDisponivel(null);
      }
    } finally {
      setEmailVerificando(false);
    }
  };

  // Debounce para verificação de e-mail
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email) {
        verificarEmailDisponivel(email);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [email]);

  // Validação em tempo real
  useEffect(() => {
    if (email) {
      setEmailValido(validarFormatoEmail(email));
    } else {
      setEmailValido(true);
    }
  }, [email]);

  // Validação de senha em tempo real
  useEffect(() => {
    if (senha) {
      setSenhaValida(validarSenhaForte(senha));
    } else {
      setSenhaValida(true);
      setSenhaRequisitos({
        comprimento: false,
        letra: false,
        numero: false,
        especial: false
      });
    }
  }, [senha]);

  const handleCadastro = async () => {
    setErro("");
    setLoading(true);

    // Validações client-side
    if (!email || !senha) {
      setErro("Preencha o email e a senha para continuar.");
      setLoading(false);
      return;
    }

    if (!emailValido) {
      setErro("Formato de e-mail inválido.");
      setLoading(false);
      return;
    }

    if (emailDisponivel === false) {
      setErro("Este e-mail já está cadastrado. Use outro e-mail ou faça login.");
      setLoading(false);
      return;
    }

    if (!senhaValida) {
      setErro("A senha não atende aos requisitos de segurança.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/usuarios', {
        email,
        senha,
        tipo_usuario: "C",
        tenant_id: "686af5e0bb776faa73fa8e03" // Tenant padrão
      });

      if (res.status === 201) {
        // Salva o ID do usuário criado
        localStorage.setItem("usuario_id", res.data.usuario_id);
        localStorage.setItem("cadastro_email", email);
        localStorage.setItem("cadastro_senha", senha);
        localStorage.setItem("cadastro_tipo", "C");
        
        // Vai para o termo de uso
        navigate("/termo");
      } else {
        setErro("Erro ao criar usuário. Tente novamente.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        setErro("Email já cadastrado. Use outro email ou faça login.");
        setEmailDisponivel(false);
      } else if (err.response?.status === 400) {
        setErro(err.response.data.erro || "Dados inválidos. Revise os campos.");
      } else {
        setErro("Erro de conexão com o servidor. Verifique sua internet.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para obter mensagem de status do e-mail
  const getEmailStatusMessage = () => {
    if (emailVerificando) return "Verificando disponibilidade...";
    if (emailDisponivel === true) return "✅ E-mail disponível";
    if (emailDisponivel === false) return "❌ E-mail já cadastrado";
    if (!email) return "";
    if (!emailValido) return "❌ Formato de e-mail inválido";
    return "";
  };

  // Função para obter cor do status do e-mail
  const getEmailStatusColor = () => {
    if (emailVerificando) return "text-blue-600";
    if (emailDisponivel === true) return "text-green-600";
    if (emailDisponivel === false) return "text-red-600";
    if (!emailValido) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
        Cadastro de Usuário
      </h2>

      {erro && <p className="text-red-600 mb-4">{erro}</p>}

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleCadastro(); }}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className={`border rounded px-3 py-2 w-full ${
              email && !emailValido ? 'border-red-500' : 
              email && emailDisponivel === false ? 'border-red-500' : 
              email && emailDisponivel === true ? 'border-green-500' : 
              'border-gray-300'
            }`}
            required
          />
          {email && (
            <p className={`text-sm mt-1 ${getEmailStatusColor()}`}>
              {getEmailStatusMessage()}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            className={`border rounded px-3 py-2 w-full ${
              senha && !senhaValida ? 'border-red-500' : 
              senha && senhaValida ? 'border-green-500' : 
              'border-gray-300'
            }`}
            required
          />
          {senha && (
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
              <div className="space-y-1">
                <p className={`text-xs ${senhaRequisitos.comprimento ? 'text-green-600' : 'text-red-600'}`}>
                  {senhaRequisitos.comprimento ? '✅' : '❌'} Mínimo 8 caracteres
                </p>
                <p className={`text-xs ${senhaRequisitos.letra ? 'text-green-600' : 'text-red-600'}`}>
                  {senhaRequisitos.letra ? '✅' : '❌'} Pelo menos 1 letra
                </p>
                <p className={`text-xs ${senhaRequisitos.numero ? 'text-green-600' : 'text-red-600'}`}>
                  {senhaRequisitos.numero ? '✅' : '❌'} Pelo menos 1 número
                </p>
                <p className={`text-xs ${senhaRequisitos.especial ? 'text-green-600' : 'text-red-600'}`}>
                  {senhaRequisitos.especial ? '✅' : '❌'} Pelo menos 1 caractere especial
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !emailValido || emailDisponivel === false || emailVerificando || !senhaValida}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Criando conta..." : "Criar Conta"}
        </button>
      </form>

      <p className="text-center mt-4">
        Já possui conta?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-green-700 underline hover:text-green-900"
        >
          Voltar para o Login
        </button>
      </p>
    </div>
  );
}
