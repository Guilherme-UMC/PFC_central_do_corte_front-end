import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AgendamentoService from '../services/AgendamentoService';
import FuncionarioService from '../services/FuncionarioService';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import {formatarDataHora} from '../utils/dateUtils';

const FuncionarioPage = () => {
  const { user } = useAuthContext();
  const [barbearias, setBarbearias] = useState([]);
  const [selectedBarbearia, setSelectedBarbearia] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('todos');
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const handleUpdateStatus = async (agendamentoId, status, motivo = null) => {
    let result;
    
    if (status === 'CANCELADO') {
      result = await AgendamentoService.cancelar(agendamentoId, motivo || 'Cancelado pelo funcionário');
    } else if (status === 'CONFIRMADO') {
      result = await AgendamentoService.confirmar(agendamentoId);
    } else if (status === 'CONCLUIDO') {
      result = await AgendamentoService.concluir(agendamentoId);
    }
    
    if (result?.success) {
      showMessage('success', `Agendamento ${status.toLowerCase()} com sucesso`);
      await carregarAgendamentos();
    } else {
      showMessage('error', result?.message || 'Erro ao atualizar agendamento');
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
            <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--corte-text-muted)' }}>
              Solicite ao proprietário da barbearia que vincule seu email.
            </p>
          </div>
        ) : (
          <>
            {/* Seletor de Barbearias */}
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
                    {totalAgendamentos > 0 && (
                      <span className="badge-count">{totalAgendamentos}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Informações da barbearia selecionada */}
            {selectedBarbearia && (
              <div className="barbearia-info">
                <h3>{selectedBarbearia.nome}</h3>
                <p className="barbearia-endereco">
                  {selectedBarbearia.logradouro}, {selectedBarbearia.numero} - {selectedBarbearia.bairro}, {selectedBarbearia.cidade} - {selectedBarbearia.uf}
                </p>
                {selectedBarbearia.telefone && (
                  <p className="barbearia-telefone"> {selectedBarbearia.telefone}</p>
                )}
              </div>
            )}

            {/* Tabs */}
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
                  <span className="tab-count">
                    {agendamentos.filter(a => {
                      const hoje = new Date().toDateString();
                      const dataAg = new Date(a.dataHora).toDateString();
                      return dataAg === hoje;
                    }).length}
                  </span>
                )}
              </button>
            </div>

            {/* Lista de Agendamentos */}
            <div className="agendamentos-list">
              {agendamentos.length === 0 ? (
                <div className="empty-agendamentos">
                  <p>Nenhum agendamento para você nesta barbearia.</p>
                  {activeTab === 'hoje' && (
                    <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--corte-text-muted)' }}>
                      Você não tem atendimentos agendados para hoje.
                    </p>
                  )}
                </div>
              ) : (
                agendamentos.map(ag => (
                  <div key={ag.id} className="agendamento-card">
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
                    
                    {/* Botões de ação conforme o status */}
                    {ag.status === 'PENDENTE' && (
                      <div className="agendamento-actions">
                        <button 
                          className="btn-success small" 
                          onClick={() => handleUpdateStatus(ag.id, 'CONFIRMADO')}
                        >
                          ✓ Confirmar
                        </button>
                        <button 
                          className="btn-danger small" 
                          onClick={() => handleUpdateStatus(ag.id, 'CANCELADO', 'Cancelado pelo funcionário')}
                        >
                          ✗ Cancelar
                        </button>
                      </div>
                    )}
                    
                    {ag.status === 'CONFIRMADO' && (
                      <div className="agendamento-actions">
                        <button 
                          className="btn-primary small" 
                          onClick={() => handleUpdateStatus(ag.id, 'CONCLUIDO')}
                        >
                          ✓ Concluir Atendimento
                        </button>
                      </div>
                    )}
                    
                    {(ag.status === 'CANCELADO_PELO_CLIENTE' || ag.status === 'CANCELADO_PELA_BARBEARIA') && (
                      <div className="agendamento-actions">
                        <span className="status-cancelled">Agendamento cancelado</span>
                      </div>
                    )}
                    
                    {ag.status === 'CONCLUIDO' && (
                      <div className="agendamento-actions">
                        <span className="status-finished">Atendimento concluído</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Estilos adicionais */}
      <style>{`
        .barbearia-info {
          background: var(--corte-card-bg);
          padding: 16px 20px;
          border-radius: var(--corte-radius-md);
          margin-bottom: 24px;
          border-left: 4px solid var(--corte-gold);
        }
        
        .barbearia-info h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
        }
        
        .barbearia-endereco, .barbearia-telefone {
          margin: 4px 0;
          font-size: 14px;
          color: var(--corte-text-muted);
        }
        
        .badge-count {
          background: var(--corte-gold);
          color: #0f0f0f;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 20px;
          margin-left: 8px;
        }
        
        .tab-count {
          background: var(--corte-gold);
          color: #0f0f0f;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 20px;
          margin-left: 8px;
        }
        
        .empty-agendamentos {
          text-align: center;
          padding: 40px;
          color: var(--corte-text-muted);
        }
        
        .status-cancelled, .status-finished {
          font-size: 13px;
          padding: 6px 12px;
          border-radius: var(--corte-radius-sm);
          background: var(--corte-bg-tertiary);
          color: var(--corte-text-muted);
        }
      `}</style>
    </div>
  );
};

export default FuncionarioPage;