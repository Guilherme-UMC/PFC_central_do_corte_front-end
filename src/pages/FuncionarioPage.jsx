import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AgendamentoService from '../services/AgendamentoService';
import FuncionarioService from '../services/FuncionarioService';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import { formatarDataHora } from '../utils/dateUtils';
import '../styles/pages/funcionario.css';
const IconTelefone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
)
const FuncionarioPage = () => {
  const { user, logout } = useAuthContext();
  const [barbearias, setBarbearias] = useState([]);
  const [selectedBarbearia, setSelectedBarbearia] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    carregarBarbeariasVinculadas();
  }, []);

  useEffect(() => {
    if (selectedBarbearia) {
      carregarAgendamentos();
    }
  }, [selectedBarbearia, activeTab]);

  const carregarBarbeariasVinculadas = async () => {
    setLoading(true);
    try {
      const result = await FuncionarioService.listarMinhasBarbearias();

      if (result.success && result.data) {
        setBarbearias(result.data);
        if (result.data.length > 0) {
          setSelectedBarbearia(result.data[0]);
        }
      } else {
        showMessage('error', result.message || 'Erro ao carregar barbearias');
      }
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
      showMessage('error', 'Erro ao carregar barbearias vinculadas');
    }
    setLoading(false);
  };

  const carregarAgendamentos = async () => {
    let result;

    if (activeTab === 'hoje') {
      result = await AgendamentoService.listarMeusHojeComoFuncionario();
    } else {
      result = await AgendamentoService.listarMeusComoFuncionario();
    }

    if (result.success && result.data) {
      const agendamentosFiltrados = result.data.filter(
        ag => ag.barbeariaId === selectedBarbearia?.id || ag.barbeariaNome === selectedBarbearia?.nome
      );
      setAgendamentos(agendamentosFiltrados);
    } else {
      setAgendamentos([]);
    }
  };

  const handleSelectBarbearia = (barbearia) => {
    setSelectedBarbearia(barbearia);
  };

  const handleConcluirAgendamento = async (agendamentoId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    console.log('🔍 Tentando concluir agendamento:', agendamentoId);

    setLoadingAction(agendamentoId);

    try {
      const result = await AgendamentoService.concluir(agendamentoId);
      console.log('📥 Resposta do servidor:', result);

      if (result.success) {
        showMessage('success', 'Atendimento concluído com sucesso!');
        await carregarAgendamentos();
      } else {
        showMessage('error', result.message || 'Erro ao concluir atendimento');
      }
    } catch (error) {
      console.error('Erro ao concluir agendamento:', error);
      showMessage('error', error.response?.data?.message || 'Erro ao concluir atendimento');
    } finally {
      setLoadingAction(null);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (loading) return <Loader />;

  return (
    <div className="page-funcionario">
      <div className="page-container">
        {message.text && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
            {message.text}
          </div>
        )}

        <div className="page-header">
          <h1>Olá, {user?.name?.split(' ')[0] || 'Funcionário'}!</h1>
          <p>Gerencie sua agenda de atendimentos</p>
        </div>

        {barbearias.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não está vinculado a nenhuma barbearia.</p>
            <p>
              Solicite ao proprietário da barbearia que vincule seu email.
            </p>
          </div>
        ) : (
          <>
            <div className="barbearia-selector">
              {barbearias.map(b => {
                const totalAgendamentos = agendamentos.filter(
                  a => a.barbeariaId === b.id || a.barbeariaNome === b.nome
                ).length;

                return (
                  <button
                    key={b.id}
                    className={`barbearia-btn ${selectedBarbearia?.id === b.id ? 'active' : ''}`}
                    onClick={() => handleSelectBarbearia(b)}
                  >
                    {b.nome}
                  </button>
                );
              })}
            </div>

            {selectedBarbearia && (
              <div className="barbearia-info">
                <h3>{selectedBarbearia.nome}</h3>
                <p className="barbearia-endereco">
                  {selectedBarbearia.logradouro}, {selectedBarbearia.numero} - {selectedBarbearia.bairro}, {selectedBarbearia.cidade} - {selectedBarbearia.uf}
                </p>
                {selectedBarbearia.telefone && (
                  <p className="barbearia-telefone"><IconTelefone/> {selectedBarbearia.telefone}</p>
                )}
              </div>
            )}

            <div className="page-tabs">
              <button
                className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
                onClick={() => setActiveTab('todos')}
              >
                Todos os Agendamentos
                {agendamentos.length > 0 && (
                  <span className="tab-count">{agendamentos.length}</span>
                )}
              </button>
              <button
                className={`tab-btn ${activeTab === 'hoje' ? 'active' : ''}`}
                onClick={() => setActiveTab('hoje')}
              >
                Agendamentos de Hoje
                {agendamentos.filter(a => {
                  const hoje = new Date().toDateString();
                  const dataAg = new Date(a.dataHora).toDateString();
                  return dataAg === hoje;
                }).length > 0 && (
                    <span className="tab-count today">
                      {agendamentos.filter(a => {
                        const hoje = new Date().toDateString();
                        const dataAg = new Date(a.dataHora).toDateString();
                        return dataAg === hoje;
                      }).length}
                    </span>
                  )}
              </button>
            </div>

            <div className="agendamentos-list">
              {agendamentos.length === 0 ? (
                <div className="empty-agendamentos">
                  <p>Nenhum agendamento para você nesta barbearia.</p>
                  {activeTab === 'hoje' && (
                    <p>
                      Você não tem atendimentos agendados para hoje.
                    </p>
                  )}
                </div>
              ) : (
                agendamentos.map(ag => {
                  const isLoading = loadingAction === ag.id;
                  const isToday = new Date(ag.dataHora).toDateString() === new Date().toDateString();

                  return (
                    <div key={ag.id} className={`agendamento-card ${isToday ? 'today-card' : ''}`} className="agendamento-card">
                      <div className="agendamento-header">
                        <h3>{ag.clienteNome}</h3>
                        <StatusBadge status={ag.status} />
                      </div>
                      <div className="agendamento-info">
                        <p><strong>Data:</strong> {formatarDataHora(ag.dataHora)}</p>
                        <p><strong>Serviço:</strong> {ag.servicoNome || 'Não informado'}</p>
                        <p><strong>Valor:</strong> R$ {ag.servicoPreco?.toFixed(2) || '0,00'}</p>
                        {ag.observacao && <p><strong>Observações:</strong> {ag.observacao}</p>}
                      </div>

                      {ag.status === 'Confirmado' && (
                        <div className="agendamento-actions">
                          <button
                            className="btn-concluir"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleConcluirAgendamento(ag.id);
                            }}
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✓ Concluir Atendimento'}
                          </button>
                        </div>
                      )}

                      {ag.status === 'Aguardando confirmação' && (
                        <div className="agendamento-actions">
                          <span className="status-pending-msg">Aguardando confirmação da barbearia</span>
                        </div>
                      )}

                      {(ag.status === 'Cancelado pelo cliente' || ag.status === 'Cancelado pela barbearia') && (
                        <div className="agendamento-actions">
                          <span className="status-cancelled">
                            {ag.status === 'Cancelado pelo cliente' ? 'Cancelado pelo cliente' : 'Cancelado pela barbearia'}
                          </span>
                        </div>
                      )}

                      {ag.status === 'Concluído' && (
                        <div className="agendamento-actions">
                          <span className="status-finished">✓ Atendimento concluído</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FuncionarioPage;