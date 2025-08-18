// src/components/cliente/PaginaCliente.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function PaginaCliente() {
  const [cliente, setCliente] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);
  const [mostrarDados, setMostrarDados] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      setErro('');
      setLoading(true);

      console.log('🔍 PaginaCliente: Iniciando busca de dados do cliente...');
      
      const cliente_id = localStorage.getItem('cliente_id');
      const usuario_id = localStorage.getItem('usuario_id');
      
      console.log('🔍 PaginaCliente: Dados do localStorage:', {
        cliente_id,
        usuario_id
      });
      
      if (!cliente_id) {
        console.log('❌ PaginaCliente: cliente_id não encontrado no localStorage');
        setErro('⚠️ Cliente não autenticado. Faça login novamente.');
        navigate('/login');
        return;
      }

      try {
        console.log('🔍 PaginaCliente: Buscando dados do cliente:', cliente_id);
        const res = await api.get(`/clientes/${cliente_id}`);
        if (res.status === 200) {
          const data = res.data;
          console.log('✅ PaginaCliente: Dados do cliente carregados:', data);
          setCliente(data);
        } else {
          console.log('❌ PaginaCliente: Resposta não foi 200:', res.status);
          setErro('⚠️ Não foi possível carregar os dados do cliente.');
        }
      } catch (err) {
        console.error('❌ PaginaCliente: Erro ao buscar dados:', err);
        setErro('⚠️ Erro ao buscar dados do cliente.');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [navigate]);

  const handleNovaAnamnese = () => {
    navigate('/anamnese');
  };

  // Formatação
  const formatarCPF = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  const formatarTelefone = (telefone) => {
    if (!telefone) return '';
    if (telefone.length === 11) return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };
  const formatarData = (data) => {
    if (!data) return '';
    const d = new Date(data);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-full">
      {/* Controles de dados pessoais */}
      <div className="mb-4 md:mb-6 flex justify-center">
        <button
          onClick={() => setMostrarDados(!mostrarDados)}
          className="w-full md:w-auto px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs md:text-sm font-medium"
        >
          {mostrarDados ? '👁️‍🗨️ Ocultar Dados' : '👁️ Mostrar Dados Pessoais'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-6 md:py-8">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-green-600 mx-auto mb-3 md:mb-4"></div>
          <p className="text-gray-600 text-sm md:text-base">Carregando dados...</p>
        </div>
      )}
      
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded-lg mb-4 md:mb-6 text-center text-sm md:text-base">
          {erro}
        </div>
      )}

      {cliente && (
        <>
          <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-6 text-center text-green-700 px-2">
            Olá, {cliente.primeiro_nome}! Bem-vindo(a) de volta à sua jornada de bem-estar!
          </h2>

          {mostrarDados && (
            <section
              aria-labelledby="dados-pessoais-title"
              className="bg-green-50 border border-green-200 p-3 md:p-4 lg:p-6 rounded-lg mb-4 md:mb-6"
            >
              <h3 id="dados-pessoais-title" className="font-bold mb-3 md:mb-4 text-green-700 text-base md:text-lg">
                📋 Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-gray-800 text-sm md:text-base">
                <div className="p-2 md:p-3 bg-white rounded border">
                  <strong>Nome:</strong> {cliente.primeiro_nome} {cliente.sobrenome}
                </div>
                {cliente.nome_social && (
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Nome Social:</strong> {cliente.nome_social}
                  </div>
                )}
                <div className="p-2 md:p-3 bg-white rounded border">
                  <strong>CPF:</strong> {formatarCPF(cliente.cpf)}
                </div>
                <div className="p-2 md:p-3 bg-white rounded border">
                  <strong>Data de Nascimento:</strong> {formatarData(cliente.data_nascimento)}
                </div>
                {cliente.genero && (
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Gênero:</strong> {cliente.genero}
                  </div>
                )}
                <div className="p-2 md:p-3 bg-white rounded border">
                  <strong>Telefone:</strong> {formatarTelefone(cliente.contato?.telefone)}
                </div>
                {cliente.contato?.email_alternativo && (
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Email Alternativo:</strong> {cliente.contato.email_alternativo}
                  </div>
                )}
              </div>

              {/* Endereço */}
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-green-200">
                <h4 className="font-semibold mb-2 md:mb-3 text-green-700 text-sm md:text-base">📍 Endereço</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Rua:</strong> {cliente.endereco?.rua}, {cliente.endereco?.numero}
                  </div>
                  {cliente.endereco?.complemento && (
                    <div className="p-2 md:p-3 bg-white rounded border">
                      <strong>Complemento:</strong> {cliente.endereco.complemento}
                    </div>
                  )}
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Bairro:</strong> {cliente.endereco?.bairro}
                  </div>
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>Cidade:</strong> {cliente.endereco?.cidade} - {cliente.endereco?.estado}
                  </div>
                  <div className="p-2 md:p-3 bg-white rounded border">
                    <strong>CEP:</strong> {cliente.endereco?.cep}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Seção de Feedback para o Usuário */}
          <section className="bg-blue-50 border border-blue-200 p-3 md:p-4 lg:p-6 rounded-lg mb-4 md:mb-6">
            <h3 className="font-bold mb-3 md:mb-4 text-blue-700 text-base md:text-lg">
              💬 Sua Opinião é Importante
            </h3>
            <p className="text-gray-700 mb-3 md:mb-4 text-xs md:text-sm lg:text-base">
              Ajude-nos a melhorar sua experiência na plataforma. Como está sendo sua jornada até agora?
            </p>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-xs md:text-sm text-gray-600 font-medium">Experiência geral:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-yellow-400 hover:text-yellow-500 text-base md:text-lg lg:text-xl transition-colors"
                      title={`${star} estrela${star > 1 ? 's' : ''}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Comentários ou sugestões:
                </label>
                <textarea
                  className="w-full p-2 md:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-xs md:text-sm"
                  rows="3"
                  placeholder="Conte-nos como podemos melhorar..."
                />
              </div>
              
              <div className="flex justify-end">
                <button className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs md:text-sm font-medium">
                  Enviar Feedback
                </button>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="funcionalidades-title"
            className="bg-white border border-gray-200 p-3 md:p-4 lg:p-6 rounded-lg shadow-sm"
          >
            <h3 id="funcionalidades-title" className="font-bold mb-3 md:mb-4 text-gray-800 text-base md:text-lg">
              🚀 Funcionalidades Disponíveis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              <button
                onClick={handleNovaAnamnese}
                className="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <span className="text-green-600 text-base md:text-lg">📋</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-green-700 text-sm md:text-base">Nova Anamnese</h4>
                    <p className="text-xs md:text-sm text-gray-600">Atualizar dados de saúde</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/agendamentos')}
                className="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 text-base md:text-lg">📅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-blue-700 text-sm md:text-base">Agendamentos</h4>
                    <p className="text-xs md:text-sm text-gray-600">Gerenciar consultas</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => alert('Histórico - Em desenvolvimento para próxima sprint')}
                className="p-3 md:p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <span className="text-purple-600 text-base md:text-lg">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-purple-700 text-sm md:text-base">Histórico</h4>
                    <p className="text-xs md:text-sm text-gray-600">Sessões realizadas</p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
