import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import BarbeariaService from '../services/BarbeariaService';
import AgendamentoService from '../services/AgendamentoService';
import ServicoService from '../services/ServicoService';
import FuncionarioService from '../services/FuncionarioService';
import HorarioService, { DIAS_SEMANA, HORARIOS_PADRAO } from '../services/HorarioService';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import CadastroBarbearia from '../components/CadastroBarbearia';
import { formatarDataHora, formatarData, isHoje } from '../utils/dateUtils';

const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M17 3l4 4-7 7H10v-4l7-7z" /><path d="M4 20h16" />
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <polyline points="3 6 5 6 21 6" /><path d="M8 6V4h8v2" /><rect x="10" y="11" width="4" height="8" />
  </svg>
);

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const BarbeariaPage = ({ onNavigate }) => {
  const { user } = useAuthContext();
  const [barbearias, setBarbearias] = useState([]);
  const [selectedBarbearia, setSelectedBarbearia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('agendamentos');
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentosHoje, setAgendamentosHoje] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [horarios, setHorarios] = useState([...HORARIOS_PADRAO]);
  const [showBarbeariaForm, setShowBarbeariaForm] = useState(false);
  const [editingBarbearia, setEditingBarbearia] = useState(null);
  const [showServicoForm, setShowServicoForm] = useState(false);
  const [editingServico, setEditingServico] = useState(null);
  const [servicoForm, setServicoForm] = useState({ nome: '', descricao: '', preco: '', duracaoMinutos: '' });
  const [showFuncionarioForm, setShowFuncionarioForm] = useState(false);
  const [funcionarioForm, setFuncionarioForm] = useState({ name: '', email: '', telefone: '', password: '' });
  const [vincularEmail, setVincularEmail] = useState('');
  const [showHorarioForm, setShowHorarioForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    carregarBarbearias();
  }, []);

  useEffect(() => {
    if (selectedBarbearia) {
      carregarDadosBarbearia(selectedBarbearia.id);
    }
  }, [selectedBarbearia]);

  const carregarBarbearias = async () => {
    try {
      setLoading(true);
      const result = await BarbeariaService.minhasBarbearias();
      if (result.success) {
        const lista = result.data || [];
        setBarbearias(lista);
        if (lista.length > 0 && !selectedBarbearia) {
          setSelectedBarbearia(lista[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
    } finally {
      setLoading(false);
    }
  };

  // FUNÇÃO MODIFICADA - Limpa os estados antes de recarregar
  const carregarDadosBarbearia = async (barbeariaId) => {
    console.log('🔄 Recarregando dados da barbearia...');
    
    // Limpar os estados primeiro para forçar atualização visual
    setAgendamentos([]);
    setAgendamentosHoje([]);
    setServicos([]);
    setFuncionarios([]);
    
    // Aguardar todas as requisições
    await Promise.all([
      carregarAgendamentos(barbeariaId),
      carregarAgendamentosHoje(barbeariaId),
      carregarServicos(barbeariaId),
      carregarFuncionarios(barbeariaId),
      carregarHorarios(barbeariaId)
    ]);
    
    console.log('✅ Dados recarregados com sucesso');
  };

  const carregarAgendamentos = async (barbeariaId) => {
    const result = await AgendamentoService.listarPorBarbearia(barbeariaId);
    if (result.success) {
      setAgendamentos(result.data);
      console.log(`📋 Agendamentos carregados: ${result.data.length}`);
    }
  };

  const carregarAgendamentosHoje = async (barbeariaId) => {
    const result = await AgendamentoService.listarDoDia(barbeariaId);
    if (result.success) {
      setAgendamentosHoje(result.data);
      console.log(`📅 Agendamentos de hoje: ${result.data.length}`);
    }
  };

  const carregarServicos = async (barbeariaId) => {
    const result = await ServicoService.listarPorBarbearia(barbeariaId);
    if (result.success) setServicos(result.data);
  };

  const carregarFuncionarios = async (barbeariaId) => {
    const result = await FuncionarioService.listarPorBarbearia(barbeariaId);
    if (result.success) setFuncionarios(result.data);
  };

  const carregarHorarios = async (barbeariaId) => {
    const result = await HorarioService.getHorarios(barbeariaId);
    if (result.success && result.data && result.data.length > 0) {
      const horariosConvertidos = HorarioService.converterHorariosParaFrontend(result.data);
      setHorarios(horariosConvertidos);
    } else {
      setHorarios([...HORARIOS_PADRAO]);
    }
  };

  const handleSelectBarbearia = async (barbearia) => {
    setSelectedBarbearia(barbearia);
    setActiveTab('agendamentos');
  };

  // FUNÇÕES DE AÇÃO DOS AGENDAMENTOS
  const handleCancelarAgendamento = async (agendamentoId) => {
    const motivo = prompt('Informe o motivo do cancelamento:');
    if (!motivo || !motivo.trim()) return;
    
    setLoadingAction(agendamentoId);
    const result = await AgendamentoService.cancelar(agendamentoId, motivo);
    setLoadingAction(null);
    
    if (result.success) {
      showMessage('success', 'Agendamento cancelado com sucesso');
      await carregarDadosBarbearia(selectedBarbearia.id);
    } else {
      showMessage('error', result.message || 'Erro ao cancelar agendamento');
    }
  };

  const handleConfirmarAgendamento = async (agendamentoId) => {
    setLoadingAction(agendamentoId);
    const result = await AgendamentoService.confirmar(agendamentoId);
    setLoadingAction(null);
    
    if (result.success) {
      showMessage('success', 'Agendamento confirmado com sucesso');
      await carregarDadosBarbearia(selectedBarbearia.id);
    } else {
      showMessage('error', result.message || 'Erro ao confirmar agendamento');
    }
  };

  const handleConcluirAgendamento = async (agendamentoId) => {
    setLoadingAction(agendamentoId);
    const result = await AgendamentoService.concluir(agendamentoId);
    setLoadingAction(null);
    
    if (result.success) {
      showMessage('success', 'Atendimento concluído com sucesso');
      await carregarDadosBarbearia(selectedBarbearia.id);
    } else {
      showMessage('error', result.message || 'Erro ao concluir atendimento');
    }
  };

  const handleServicoSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const servicoData = {
      nome: servicoForm.nome,
      descricao: servicoForm.descricao || null,
      preco: parseFloat(servicoForm.preco),
      duracaoMinutos: parseInt(servicoForm.duracaoMinutos)
    };

    let result;
    if (editingServico) {
      result = await ServicoService.atualizar(editingServico.id, servicoData);
    } else {
      result = await ServicoService.criar(selectedBarbearia.id, servicoData);
    }

    if (result.success) {
      showMessage('success', editingServico ? 'Serviço atualizado!' : 'Serviço criado!');
      setShowServicoForm(false);
      setEditingServico(null);
      setServicoForm({ nome: '', descricao: '', preco: '', duracaoMinutos: '' });
      await carregarServicos(selectedBarbearia.id);
    } else {
      showMessage('error', result.message);
    }
    setSubmitting(false);
  };

  const handleDesativarServico = async (servicoId) => {
    if (window.confirm('Tem certeza que deseja desativar este serviço?')) {
      const result = await ServicoService.desativar(servicoId);
      if (result.success) {
        showMessage('success', 'Serviço desativado');
        await carregarServicos(selectedBarbearia.id);
      } else {
        showMessage('error', result.message);
      }
    }
  };

  const handleFuncionarioSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await FuncionarioService.criar(selectedBarbearia.id, funcionarioForm);

    if (result.success) {
      showMessage('success', 'Funcionário criado e vinculado com sucesso!');
      setShowFuncionarioForm(false);
      setFuncionarioForm({ name: '', email: '', telefone: '', password: '' });
      await carregarFuncionarios(selectedBarbearia.id);
    } else {
      showMessage('error', result.message);
    }
    setSubmitting(false);
  };

  const handleVincularFuncionario = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await FuncionarioService.vincularFuncionarioExistente(selectedBarbearia.id, vincularEmail);

    if (result.success) {
      showMessage('success', 'Funcionário vinculado com sucesso!');
      setVincularEmail('');
      await carregarFuncionarios(selectedBarbearia.id);
    } else {
      showMessage('error', result.message);
    }
    setSubmitting(false);
  };

  const handleDesvincularFuncionario = async (funcionarioId, funcionarioNome) => {
    if (window.confirm(`Tem certeza que deseja desvincular ${funcionarioNome} da barbearia?`)) {
      const result = await FuncionarioService.desvincular(selectedBarbearia.id, funcionarioId);
      if (result.success) {
        showMessage('success', 'Funcionário desvinculado');
        await carregarFuncionarios(selectedBarbearia.id);
      } else {
        showMessage('error', result.message);
      }
    }
  };

  const salvarHorarios = async () => {
    const { valid, errors } = HorarioService.validarHorarios(horarios);
    if (!valid) {
      showMessage('error', errors.join(', '));
      return;
    }

    setSubmitting(true);
    try {
      const horariosParaEnviar = horarios.map(h => ({
        dia: h.dia,
        horaAbertura: h.fechado ? null : (h.horaAbertura || '09:00'),
        horaFechamento: h.fechado ? null : (h.horaFechamento || '18:00'),
        fechado: h.fechado
      }));
      
      const result = await HorarioService.updateHorarios(selectedBarbearia.id, horariosParaEnviar);
      
      if (result.success) {
        showMessage('success', 'Horários salvos com sucesso!');
        setShowHorarioForm(false);
        await carregarHorarios(selectedBarbearia.id);
      } else {
        showMessage('error', result.message || 'Erro ao salvar horários');
      }
    } catch (error) {
      console.error('Erro ao salvar horários:', error);
      showMessage('error', 'Erro ao salvar horários. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  if (loading) return <Loader />;

  if (barbearias.length === 0 && !showBarbeariaForm) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Você ainda não possui barbearias cadastradas.</p>
          <button className="btn-primary" onClick={() => setShowBarbeariaForm(true)}>
            Cadastrar minha primeira barbearia
          </button>
        </div>
      </div>
    );
  }

  if (showBarbeariaForm) {
    return (
      <CadastroBarbearia
        onSuccess={() => {
          setShowBarbeariaForm(false);
          carregarBarbearias();
        }}
        onCancel={() => setShowBarbeariaForm(false)}
        editingData={editingBarbearia}
      />
    );
  }

  return (
    <div className="page-barbearia">
      <div className="page-container">
        {message.text && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
            {message.text}
          </div>
        )}

        <div className="page-header">
          <h1>Painel da Barbearia</h1>
          <p>Gerencie seus estabelecimentos</p>
        </div>

        <div className="barbearia-selector">
          {barbearias.map(b => (
            <button
              key={b.id}
              className={`barbearia-btn ${selectedBarbearia?.id === b.id ? 'active' : ''}`}
              onClick={() => handleSelectBarbearia(b)}
            >
              {b.nome}
            </button>
          ))}
          <button className="barbearia-btn barbearia-btn--new" onClick={() => {
            setEditingBarbearia(null);
            setShowBarbeariaForm(true);
          }}>
            <IconPlus /> Nova
          </button>
        </div>

        {selectedBarbearia && (
          <div className="barbearia-info-card">
            <div className="barbearia-info-header">
              <div>
                <h2 className="barbearia-info-nome">{selectedBarbearia.nome}</h2>
                {selectedBarbearia.descricao && (
                  <p className="barbearia-info-desc">{selectedBarbearia.descricao}</p>
                )}
              </div>
              <button
                className="btn-secondary small"
                onClick={() => {
                  setEditingBarbearia(selectedBarbearia);
                  setShowBarbeariaForm(true);
                }}
              >
                <IconEdit /> Editar
              </button>
            </div>
            
            <div className="barbearia-info-details">
              <div className="info-row">
                <span className="info-icon">📍</span>
                <span>{selectedBarbearia.logradouro}, {selectedBarbearia.numero}</span>
              </div>
              <div className="info-row">
                <span className="info-icon">🏘️</span>
                <span>{selectedBarbearia.bairro}</span>
              </div>
              <div className="info-row">
                <span className="info-icon">🏙️</span>
                <span>{selectedBarbearia.cidade} - {selectedBarbearia.uf} | CEP: {selectedBarbearia.cep}</span>
              </div>
              {selectedBarbearia.telefone && (
                <div className="info-row">
                  <span className="info-icon">📞</span>
                  <span>{selectedBarbearia.telefone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="page-tabs">
          <button className={`tab-btn ${activeTab === 'agendamentos' ? 'active' : ''}`} onClick={() => setActiveTab('agendamentos')}>
            Todos os Agendamentos
            {agendamentos.length > 0 && <span className="tab-count">{agendamentos.length}</span>}
          </button>
          <button className={`tab-btn ${activeTab === 'hoje' ? 'active' : ''}`} onClick={() => setActiveTab('hoje')}>
            Agendamentos de Hoje
            {agendamentosHoje.length > 0 && <span className="tab-count today">{agendamentosHoje.length}</span>}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'servicos' ? 'active' : ''}`} 
            onClick={() => setActiveTab('servicos')}
          >Serviços</button>
          <button 
            className={`tab-btn ${activeTab === 'funcionarios' ? 'active' : ''}`} 
            onClick={() => setActiveTab('funcionarios')}
          >Funcionários</button>
          <button 
            className={`tab-btn ${activeTab === 'horarios' ? 'active' : ''}`} 
            onClick={() => setActiveTab('horarios')}
          >Horários</button>
        </div>

        <div className="page-content">
          
          {/* TAB: TODOS OS AGENDAMENTOS */}
          {activeTab === 'agendamentos' && (
            <div className="agendamentos-list">
              {agendamentos.length === 0 ? (
                <div className="empty-state-small">
                  <p>Nenhum agendamento para esta barbearia.</p>
                </div>
              ) : (
                agendamentos.map(ag => {
                  const isLoading = loadingAction === ag.id;
                  return (
                    <div key={ag.id} className="agendamento-card">
                      <div className="agendamento-header">
                        <h3>{ag.clienteNome}</h3>
                        <StatusBadge status={ag.status} />
                      </div>
                      <div className="agendamento-info">
                        <p><strong>Data:</strong> {formatarDataHora(ag.dataHora)}</p>
                        <p><strong>Serviço:</strong> {ag.servicoNome}</p>
                        <p><strong>Valor:</strong> R$ {ag.servicoPreco?.toFixed(2)}</p>
                        <p><strong>Funcionário:</strong> {ag.funcionarioNome || 'Não definido'}</p>
                        {ag.observacao && <p><strong>Obs:</strong> {ag.observacao}</p>}
                      </div>
                      
                      {/* Botões para agendamentos AGUARDANDO CONFIRMAÇÃO */}
                      {ag.status === 'Aguardando confirmação' && (
                        <div className="agendamento-actions">
                          <button 
                            className="btn-success small" 
                            onClick={() => handleConfirmarAgendamento(ag.id)} 
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✓ Confirmar'}
                          </button>
                          <button 
                            className="btn-danger small" 
                            onClick={() => handleCancelarAgendamento(ag.id)} 
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✗ Cancelar'}
                          </button>
                        </div>
                      )}
                      
                      {/* Botões para agendamentos CONFIRMADOS */}
                      {ag.status === 'Confirmado' && (
                        <div className="agendamento-actions">
                          <button 
                            className="btn-primary small" 
                            onClick={() => handleConcluirAgendamento(ag.id)} 
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✓ Concluir Atendimento'}
                          </button>
                          <button 
                            className="btn-danger small" 
                            onClick={() => handleCancelarAgendamento(ag.id)} 
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✗ Cancelar'}
                          </button>
                        </div>
                      )}
                      
                      {/* Status para agendamentos CANCELADOS */}
                      {(ag.status === 'Cancelado pelo cliente' || ag.status === 'Cancelado pela barbearia') && (
                        <div className="agendamento-actions">
                          <span className="status-cancelled">
                            {ag.status}
                          </span>
                        </div>
                      )}
                      
                      {/* Status para agendamentos CONCLUÍDOS */}
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
          )}

          {/* TAB: AGENDAMENTOS DE HOJE */}
          {activeTab === 'hoje' && (
            <div className="agendamentos-list">
              <div className="today-header">
                <span className="today-date">📅 {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {agendamentosHoje.length === 0 ? (
                <div className="empty-state-small">
                  <p>Nenhum agendamento para hoje.</p>
                  <p style={{ fontSize: '14px', marginTop: '8px', color: 'var(--corte-text-muted)' }}>
                    Aproveite para organizar a agenda!
                  </p>
                </div>
              ) : (
                agendamentosHoje.map(ag => {
                  const isLoading = loadingAction === ag.id;
                  return (
                    <div key={ag.id} className="agendamento-card today-card">
                      <div className="agendamento-header">
                        <h3>{ag.clienteNome}</h3>
                        <StatusBadge status={ag.status} />
                      </div>
                      <div className="agendamento-info">
                        <p><strong>Horário:</strong> {formatarDataHora(ag.dataHora)}</p>
                        <p><strong>Serviço:</strong> {ag.servicoNome}</p>
                        <p><strong>Valor:</strong> R$ {ag.servicoPreco?.toFixed(2)}</p>
                        <p><strong>Funcionário:</strong> {ag.funcionarioNome || 'Não definido'}</p>
                        {ag.observacao && <p><strong>Obs:</strong> {ag.observacao}</p>}
                      </div>
                      
                      {/* Botões para agendamentos AGUARDANDO CONFIRMAÇÃO */}
                      {ag.status === 'Aguardando confirmação' && (
                        <div className="agendamento-actions">
                          <button 
                            className="btn-success small" 
                            onClick={() => handleConfirmarAgendamento(ag.id)} 
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✓ Confirmar'}
                          </button>
                          <button 
                            className="btn-danger small" 
                            onClick={() => handleCancelarAgendamento(ag.id)} 
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✗ Cancelar'}
                          </button>
                        </div>
                      )}
                      
                      {/* Botões para agendamentos CONFIRMADOS */}
                      {ag.status === 'Confirmado' && (
                        <div className="agendamento-actions">
                          <button 
                            className="btn-primary small" 
                            onClick={() => handleConcluirAgendamento(ag.id)} 
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✓ Concluir Atendimento'}
                          </button>
                          <button 
                            className="btn-danger small" 
                            onClick={() => handleCancelarAgendamento(ag.id)} 
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✗ Cancelar'}
                          </button>
                        </div>
                      )}
                      
                      {/* Status para agendamentos CANCELADOS */}
                      {(ag.status === 'Cancelado pelo cliente' || ag.status === 'Cancelado pela barbearia') && (
                        <div className="agendamento-actions">
                          <span className="status-cancelled">
                            {ag.status}
                          </span>
                        </div>
                      )}
                      
                      {/* Status para agendamentos CONCLUÍDOS */}
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
          )}

          {/* TAB: SERVIÇOS */}
          {activeTab === 'servicos' && (
            <div>
              <div className="section-header-actions">
                <h3>Serviços Oferecidos</h3>
                <button className="btn-primary small" onClick={() => setShowServicoForm(true)}>
                  <IconPlus /> Novo Serviço
                </button>
              </div>

              {showServicoForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>{editingServico ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                    <form onSubmit={handleServicoSubmit}>
                      <input type="text" placeholder="Nome do serviço" value={servicoForm.nome} onChange={e => setServicoForm({ ...servicoForm, nome: e.target.value })} required />
                      <textarea placeholder="Descrição" value={servicoForm.descricao} onChange={e => setServicoForm({ ...servicoForm, descricao: e.target.value })} rows={2} />
                      <input type="number" step="0.01" placeholder="Preço (R$)" value={servicoForm.preco} onChange={e => setServicoForm({ ...servicoForm, preco: e.target.value })} required />
                      <input type="number" placeholder="Duração (minutos)" value={servicoForm.duracaoMinutos} onChange={e => setServicoForm({ ...servicoForm, duracaoMinutos: e.target.value })} required />
                      <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={() => { setShowServicoForm(false); setEditingServico(null); setServicoForm({ nome: '', descricao: '', preco: '', duracaoMinutos: '' }); }}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="servicos-list">
                {servicos.length === 0 ? (
                  <p>Nenhum serviço cadastrado.</p>
                ) : (
                  servicos.map(s => (
                    <div key={s.id} className="servico-item">
                      <div className="servico-info">
                        <strong>{s.nome}</strong>
                        <span>R$ {s.preco?.toFixed(2)}</span>
                        <span>{s.duracaoMinutos} min</span>
                        {s.descricao && <span className="servico-desc">{s.descricao}</span>}
                      </div>
                      <div className="servico-actions">
                        <button className="btn-secondary small" onClick={() => { setEditingServico(s); setServicoForm({ nome: s.nome, descricao: s.descricao || '', preco: s.preco, duracaoMinutos: s.duracaoMinutos }); setShowServicoForm(true); }}><IconEdit /></button>
                        <button className="btn-danger small" onClick={() => handleDesativarServico(s.id)}><IconTrash /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: FUNCIONÁRIOS */}
          {activeTab === 'funcionarios' && (
            <div>
              <div className="section-header-actions">
                <h3>Funcionários</h3>
                <button className="btn-primary small" onClick={() => setShowFuncionarioForm(true)}>
                  <IconPlus /> Novo Funcionário
                </button>
              </div>

              {showFuncionarioForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Novo Funcionário</h3>
                    <form onSubmit={handleFuncionarioSubmit}>
                      <input type="text" placeholder="Nome completo" value={funcionarioForm.name} onChange={e => setFuncionarioForm({ ...funcionarioForm, name: e.target.value })} required />
                      <input type="email" placeholder="Email" value={funcionarioForm.email} onChange={e => setFuncionarioForm({ ...funcionarioForm, email: e.target.value })} required />
                      <input type="tel" placeholder="Telefone" value={funcionarioForm.telefone} onChange={e => setFuncionarioForm({ ...funcionarioForm, telefone: e.target.value })} required />
                      <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={funcionarioForm.password} onChange={e => setFuncionarioForm({ ...funcionarioForm, password: e.target.value })} required />
                      <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={() => { setShowFuncionarioForm(false); setFuncionarioForm({ name: '', email: '', telefone: '', password: '' }); }}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Criando...' : 'Criar'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="vinculacao-section">
                <h4>Vincular funcionário existente</h4>
                <form onSubmit={handleVincularFuncionario} className="inline-form">
                  <input type="email" placeholder="Email do funcionário" value={vincularEmail} onChange={e => setVincularEmail(e.target.value)} required />
                  <button type="submit" className="btn-primary" disabled={submitting}>Vincular</button>
                </form>
              </div>

              <div className="funcionarios-list">
                {funcionarios.length === 0 ? (
                  <p>Nenhum funcionário vinculado.</p>
                ) : (
                  funcionarios.map(f => (
                    <div key={f.id} className="funcionario-item">
                      <div className="funcionario-info">
                        <strong>{f.name}</strong>
                        <span>{f.email}</span>
                        <span>{f.telefone}</span>
                      </div>
                      <button className="btn-danger small" onClick={() => handleDesvincularFuncionario(f.id, f.name)}>Desvincular</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: HORÁRIOS */}
          {activeTab === 'horarios' && (
            <div>
              <div className="section-header-actions">
                <h3>Horários de Funcionamento</h3>
                <button className="btn-primary small" onClick={() => setShowHorarioForm(true)}>
                  <IconPlus /> Editar Horários
                </button>
              </div>

              {showHorarioForm && (
                <div className="modal-overlay">
                  <div className="modal-content" style={{ maxWidth: '600px' }}>
                    <h3>Editar Horários de Funcionamento</h3>
                    <p className="text-muted" style={{ fontSize: '13px', marginBottom: '20px' }}>
                      Configure os horários de funcionamento para cada dia da semana
                    </p>
                    
                    <div className="horarios-edit-list">
                      {DIAS_SEMANA.map((dia) => {
                        const horarioAtual = horarios.find(h => h.dia === dia.value) || { 
                          dia: dia.value, 
                          horaAbertura: '09:00', 
                          horaFechamento: '18:00', 
                          fechado: false 
                        };
                        
                        return (
                          <div key={dia.value} className="horario-edit-row">
                            <span className="horario-edit-dia">{dia.label}</span>
                            <label className="horario-edit-checkbox">
                              <input
                                type="checkbox"
                                checked={horarioAtual.fechado}
                                onChange={(e) => {
                                  const novosHorarios = [...horarios];
                                  const index = novosHorarios.findIndex(h => h.dia === dia.value);
                                  if (index >= 0) {
                                    novosHorarios[index] = {
                                      ...novosHorarios[index],
                                      fechado: e.target.checked
                                    };
                                  } else {
                                    novosHorarios.push({
                                      dia: dia.value,
                                      horaAbertura: '09:00',
                                      horaFechamento: '18:00',
                                      fechado: e.target.checked
                                    });
                                  }
                                  setHorarios(novosHorarios);
                                }}
                              />
                              Fechado
                            </label>
                            {!horarioAtual.fechado && (
                              <div className="horario-time-group">
                                <input
                                  type="time"
                                  className="horario-edit-time"
                                  value={horarioAtual.horaAbertura || '09:00'}
                                  onChange={(e) => {
                                    const novosHorarios = [...horarios];
                                    const index = novosHorarios.findIndex(h => h.dia === dia.value);
                                    if (index >= 0) {
                                      novosHorarios[index] = {
                                        ...novosHorarios[index],
                                        horaAbertura: e.target.value
                                      };
                                    } else {
                                      novosHorarios.push({
                                        dia: dia.value,
                                        horaAbertura: e.target.value,
                                        horaFechamento: '18:00',
                                        fechado: false
                                      });
                                    }
                                    setHorarios(novosHorarios);
                                  }}
                                />
                                <span>às</span>
                                <input
                                  type="time"
                                  className="horario-edit-time"
                                  value={horarioAtual.horaFechamento || '18:00'}
                                  onChange={(e) => {
                                    const novosHorarios = [...horarios];
                                    const index = novosHorarios.findIndex(h => h.dia === dia.value);
                                    if (index >= 0) {
                                      novosHorarios[index] = {
                                        ...novosHorarios[index],
                                        horaFechamento: e.target.value
                                      };
                                    } else {
                                      novosHorarios.push({
                                        dia: dia.value,
                                        horaAbertura: '09:00',
                                        horaFechamento: e.target.value,
                                        fechado: false
                                      });
                                    }
                                    setHorarios(novosHorarios);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="modal-actions">
                      <button type="button" className="btn-secondary" onClick={() => { setShowHorarioForm(false); carregarHorarios(selectedBarbearia.id); }}>Cancelar</button>
                      <button type="button" className="btn-primary" onClick={salvarHorarios} disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar Horários'}</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="horarios-list">
                {horarios.length === 0 ? (
                  <p>Nenhum horário cadastrado. Clique em "Editar Horários" para configurar.</p>
                ) : (
                  <div className="horarios-table">
                    {DIAS_SEMANA.map(dia => {
                      const horario = horarios.find(h => h.dia === dia.value);
                      return (
                        <div key={dia.value} className="horario-item">
                          <strong>{dia.label}</strong>
                          {horario?.fechado ? (
                            <span className="status-inactive">Fechado</span>
                          ) : (
                            <span>{horario?.horaAbertura || '09:00'} - {horario?.horaFechamento || '18:00'}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

<style>{`
  .barbearia-info-card {
    background-color: rgba(17, 17, 17, 0.85);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 24px;
    border: 1px solid var(--corte-border);
    transition: all 0.2s ease;
    border-left: 3px solid var(--corte-gold);
    position: relative;
  }
  
  .barbearia-info-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .barbearia-info-nome {
    margin: 0 0 8px 0;
    font-size: 22px;
    color: var(--corte-text);
  }
  
  .barbearia-info-desc {
    margin: 0;
    color: var(--corte-text-muted);
    font-size: 14px;
  }
  
  .barbearia-info-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid var(--corte-border);
  }
  
  .info-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--corte-text-muted);
  }
  
  .info-icon {
    font-size: 16px;
    min-width: 24px;
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
  
  .tab-count.today {
    background: #2e7d32;
    color: white;
  }
  
  .today-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--corte-gold);
  }
  
  .today-date {
    font-size: 16px;
    font-weight: 600;
    color: var(--corte-text);
  }
  
  .today-card {
    border-left: 4px solid var(--corte-gold);
  }
  
  .empty-state-small {
    text-align: center;
    padding: 40px;
    color: var(--corte-text-muted);
  }
  
  .status-cancelled {
    font-size: 13px;
    padding: 6px 12px;
    border-radius: var(--corte-radius-sm);
    background: rgba(244, 67, 54, 0.1);
    color: #f44336;
  }
  
  .status-finished {
    font-size: 13px;
    padding: 6px 12px;
    border-radius: var(--corte-radius-sm);
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }
  
  .agendamento-actions {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--corte-border);
    flex-wrap: wrap;
  }
  
  .btn-success.small, .btn-primary.small, .btn-danger.small {
    padding: 6px 14px;
    font-size: 12px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }
  
  .btn-success.small {
    background: #2e7d32;
    color: white;
  }
  
  .btn-success.small:hover:not(:disabled) {
    background: #1b5e20;
    transform: translateY(-1px);
  }
  
  .btn-primary.small {
    background: var(--corte-gold);
    color: #0f0f0f;
  }
  
  .btn-primary.small:hover:not(:disabled) {
    background: var(--corte-gold-light);
    transform: translateY(-1px);
  }
  
  .btn-danger.small {
    background: #c62828;
    color: white;
  }
  
  .btn-danger.small:hover:not(:disabled) {
    background: #b71c1c;
    transform: translateY(-1px);
  }
  
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`}</style>
    </div>
  );
};

export default BarbeariaPage;