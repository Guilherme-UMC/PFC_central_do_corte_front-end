import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext'
import BarbeariaService from '../services/BarbeariaService';
import AgendamentoService from '../services/AgendamentoService';
import ServicoService from '../services/ServicoService';
import FuncionarioService from '../services/FuncionarioService';
import HorarioService, { DIAS_SEMANA } from '../services/HorarioService';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import CadastroBarbearia from '../components/CadastroBarbearia';

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

const BarbeariaDashboard = ({ onNavigate }) => {
  const { user } = useAuthContext();
  const [barbearias, setBarbearias] = useState([]);
  const [selectedBarbearia, setSelectedBarbearia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('agendamentos');
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [showBarbeariaForm, setShowBarbeariaForm] = useState(false);
  const [editingBarbearia, setEditingBarbearia] = useState(null);
  const [showServicoForm, setShowServicoForm] = useState(false);
  const [editingServico, setEditingServico] = useState(null);
  const [servicoForm, setServicoForm] = useState({ nome: '', descricao: '', preco: '', duracaoMinutos: '' });
  const [showFuncionarioForm, setShowFuncionarioForm] = useState(false);
  const [funcionarioForm, setFuncionarioForm] = useState({ name: '', email: '', telefone: '', password: '' });
  const [vincularEmail, setVincularEmail] = useState('');
  const [showHorarioForm, setShowHorarioForm] = useState(false);
  const [horarioForm, setHorarioForm] = useState({ diaSemana: 'MONDAY', horaInicio: '09:00', horaFim: '18:00' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    carregarBarbearias();
  }, []);

  const carregarBarbearias = async () => {
    try {
      setLoading(true);
      const result = await BarbeariaService.minhasBarbearias(0, 50);
      if (result.success) {
        const data = result.data;
        const lista = data.content || data || [];
        setBarbearias(lista);
      }
    } finally {
      setLoading(false);
    }
  };

  const carregarDadosBarbearia = async (barbeariaId) => {
    await Promise.all([
      carregarAgendamentos(barbeariaId),
      carregarServicos(barbeariaId),
      carregarFuncionarios(barbeariaId),
      carregarHorarios(barbeariaId)
    ]);
  };

  const carregarAgendamentos = async (barbeariaId) => {
    const result = await AgendamentoService.listarPorBarbearia(barbeariaId);
    if (result.success) setAgendamentos(result.data);
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
    const result = await HorarioService.listarPorBarbearia(barbeariaId);
    if (result.success) setHorarios(result.data);
  };

  const handleSelectBarbearia = (barbearia) => {
    setSelectedBarbearia(barbearia);
    carregarDadosBarbearia(barbearia.id);
    setActiveTab('agendamentos');
  };

  const handleUpdateAgendamentoStatus = async (agendamentoId, status) => {
    const result = await AgendamentoService.atualizarStatus(agendamentoId, status);
    if (result.success) {
      carregarAgendamentos(selectedBarbearia.id);
      showMessage('success', `Agendamento ${status.toLowerCase()} com sucesso`);
    } else {
      showMessage('error', result.message);
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
      carregarServicos(selectedBarbearia.id);
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
        carregarServicos(selectedBarbearia.id);
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
      carregarFuncionarios(selectedBarbearia.id);
    } else {
      showMessage('error', result.message);
    }
    setSubmitting(false);
  };

  const handleVincularFuncionario = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await FuncionarioService.vincularExistente(selectedBarbearia.id, vincularEmail);

    if (result.success) {
      showMessage('success', 'Funcionário vinculado com sucesso!');
      setVincularEmail('');
      carregarFuncionarios(selectedBarbearia.id);
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
        carregarFuncionarios(selectedBarbearia.id);
      } else {
        showMessage('error', result.message);
      }
    }
  };

  const handleHorarioSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await HorarioService.criar(selectedBarbearia.id, horarioForm);

    if (result.success) {
      showMessage('success', 'Horário criado com sucesso!');
      setShowHorarioForm(false);
      setHorarioForm({ diaSemana: 'MONDAY', horaInicio: '09:00', horaFim: '18:00' });
      carregarHorarios(selectedBarbearia.id);
    } else {
      showMessage('error', result.message);
    }
    setSubmitting(false);
  };

  const handleDesativarHorario = async (horarioId) => {
    const result = await HorarioService.desativar(horarioId);
    if (result.success) {
      showMessage('success', 'Horário desativado');
      carregarHorarios(selectedBarbearia.id);
    } else {
      showMessage('error', result.message);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getDiaLabel = (dia) => {
    return DIAS_SEMANA.find(d => d.value === dia)?.label || dia;
  };

  if (loading) return <Loader />;

  if (barbearias.length === 0 && !showBarbeariaForm) {
    return (
      <div>
        <div className="dashboard-container">
          <div className="empty-state">
            <p>Você ainda não possui barbearias cadastradas.</p>
            <button className="btn-primary" onClick={() => setShowBarbeariaForm(true)}>
              Cadastrar minha primeira barbearia
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showBarbeariaForm) {
    return (
      <div>
        <CadastroBarbearia
          onSuccess={() => {
            setShowBarbeariaForm(false);
            carregarBarbearias();
          }}
          onCancel={() => setShowBarbeariaForm(false)}
          editingData={editingBarbearia}
        />
      </div>
    );
  }

  return (
    <div className="dashboard-barbearia">

      <div className="dashboard-container">
        {message.text && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
            {message.text}
          </div>
        )}

        <div className="dashboard-header">
          <h1>Painel da Barbearia</h1>
          <p>Gerencie seus estabelecimentos</p>
        </div>

        {/* Seleção de Barbearia */}
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
          <>
            <div className="barbearia-info-bar">
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

            <div className="dashboard-tabs">
              <button className={`tab-btn ${activeTab === 'agendamentos' ? 'active' : ''}`} onClick={() => setActiveTab('agendamentos')}>Agendamentos</button>
              <button className={`tab-btn ${activeTab === 'servicos' ? 'active' : ''}`} onClick={() => setActiveTab('servicos')}>Serviços</button>
              <button className={`tab-btn ${activeTab === 'funcionarios' ? 'active' : ''}`} onClick={() => setActiveTab('funcionarios')}>Funcionários</button>
              <button className={`tab-btn ${activeTab === 'horarios' ? 'active' : ''}`} onClick={() => setActiveTab('horarios')}>Horários</button>
            </div>

            <div className="dashboard-content">
              {/* Aba de Agendamentos */}
              {activeTab === 'agendamentos' && (
                <div className="agendamentos-list">
                  {agendamentos.length === 0 ? (
                    <p>Nenhum agendamento para esta barbearia.</p>
                  ) : (
                    agendamentos.map(ag => (
                      <div key={ag.id} className="agendamento-card">
                        <div className="agendamento-header">
                          <h3>{ag.clienteNome}</h3>
                          <StatusBadge status={ag.status} />
                        </div>
                        <div className="agendamento-info">
                          <p><strong>Data:</strong> {formatDate(ag.dataHora)}</p>
                          <p><strong>Funcionário:</strong> {ag.funcionarioNome}</p>
                          <p><strong>Serviços:</strong> {ag.servicos?.map(s => s.nome).join(', ')}</p>
                          <p><strong>Valor:</strong> R$ {ag.valorTotal?.toFixed(2)}</p>
                          {ag.observacoes && <p><strong>Obs:</strong> {ag.observacoes}</p>}
                        </div>
                        {ag.status === 'AGENDADO' && (
                          <div className="agendamento-actions">
                            <button className="btn-success small" onClick={() => handleUpdateAgendamentoStatus(ag.id, 'CONFIRMADO')}>Confirmar</button>
                            <button className="btn-danger small" onClick={() => handleUpdateAgendamentoStatus(ag.id, 'CANCELADO')}>Cancelar</button>
                          </div>
                        )}
                        {ag.status === 'CONFIRMADO' && (
                          <div className="agendamento-actions">
                            <button className="btn-primary small" onClick={() => handleUpdateAgendamentoStatus(ag.id, 'FINALIZADO')}>Finalizar</button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Aba de Serviços */}
              {activeTab === 'servicos' && (
                <div>
                  <div className="section-header-actions">
                    <h3>Serviços Oferecidos</h3>
                    <button className="btn-primary small" onClick={() => setShowServicoForm(true)}><IconPlus />  Novo Serviço</button>
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

              {/* Aba de Funcionários */}
              {activeTab === 'funcionarios' && (
                <div>
                  <div className="section-header-actions">
                    <h3>Funcionários</h3>
                    <button className="btn-primary small" onClick={() => setShowFuncionarioForm(true)}><IconPlus /> Novo Funcionário</button>
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

                  {/* Vincular funcionário existente */}
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

              {/* Aba de Horários */}
              {activeTab === 'horarios' && (
                <div>
                  <div className="section-header-actions">
                    <h3>Horários de Funcionamento</h3>
                    <button className="btn-primary small" onClick={() => setShowHorarioForm(true)}><IconPlus /> Novo Horário</button>
                  </div>

                  {showHorarioForm && (
                    <div className="modal-overlay">
                      <div className="modal-content">
                        <h3>Novo Horário</h3>
                        <form onSubmit={handleHorarioSubmit}>
                          <select value={horarioForm.diaSemana} onChange={e => setHorarioForm({ ...horarioForm, diaSemana: e.target.value })}>
                            {DIAS_SEMANA.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                          </select>
                          <input type="time" value={horarioForm.horaInicio} onChange={e => setHorarioForm({ ...horarioForm, horaInicio: e.target.value })} required />
                          <input type="time" value={horarioForm.horaFim} onChange={e => setHorarioForm({ ...horarioForm, horaFim: e.target.value })} required />
                          <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={() => { setShowHorarioForm(false); setHorarioForm({ diaSemana: 'MONDAY', horaInicio: '09:00', horaFim: '18:00' }); }}>Cancelar</button>
                            <button type="submit" className="btn-primary" disabled={submitting}>Salvar</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  <div className="horarios-list">
                    {horarios.length === 0 ? (
                      <p>Nenhum horário cadastrado.</p>
                    ) : (
                      horarios.map(h => (
                        <div key={h.id} className="horario-item">
                          <div className="horario-info">
                            <strong>{getDiaLabel(h.diaSemana)}</strong>
                            <span>{h.horaInicio} - {h.horaFim}</span>
                            <span className={h.ativo ? 'status-active' : 'status-inactive'}>
                              {h.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                          <button className="btn-danger small" onClick={() => handleDesativarHorario(h.id)}>Desativar</button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default BarbeariaDashboard;