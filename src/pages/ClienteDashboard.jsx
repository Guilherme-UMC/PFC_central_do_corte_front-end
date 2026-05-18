import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AgendamentoService from '../services/AgendamentoService';
import BarbeariaService from '../services/BarbeariaService';
import ServicoService from '../services/ServicoService';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconScissors = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
  </svg>
);

const ClienteDashboard = ({ onNavigate }) => {
  const { user } = useAuthContext();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('agendamentos');
  const [barbearias, setBarbearias] = useState([]);
  const [servicos, setServicos] = useState({});
  const [showAgendamentoForm, setShowAgendamentoForm] = useState(false);
  const [selectedBarbearia, setSelectedBarbearia] = useState('');
  const [selectedServicos, setSelectedServicos] = useState([]);
  const [selectedFuncionario, setSelectedFuncionario] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [funcionarios, setFuncionarios] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    await Promise.all([
      carregarAgendamentos(),
      carregarBarbearias()
    ]);
    setLoading(false);
  };

  const carregarAgendamentos = async () => {
    const result = await AgendamentoService.listarMeus();
    if (result.success) {
      setAgendamentos(result.data);
    }
  };

  const carregarBarbearias = async () => {
    const result = await BarbeariaService.listarTodas(0, 50);
    if (result.success) {
      const lista = result.data?.content || result.data || [];
      setBarbearias(lista);
    }
  };

  const carregarServicos = async (barbeariaId) => {
    if (!barbeariaId) return;
    const result = await ServicoService.listarPorBarbearia(barbeariaId);
    if (result.success) {
      const servicosMap = { ...servicos, [barbeariaId]: result.data };
      setServicos(servicosMap);
    }
  };

  const handleBarbeariaChange = async (e) => {
    const barbeariaId = e.target.value;
    setSelectedBarbearia(barbeariaId);
    setSelectedServicos([]);
    setSelectedFuncionario('');
    if (barbeariaId) {
      await carregarServicos(barbeariaId);
      await carregarFuncionarios(barbeariaId);
    }
  };

  const carregarFuncionarios = async (barbeariaId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/funcionarios/barbearia/${barbeariaId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFuncionarios(data);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  const handleServicoToggle = (servicoId) => {
    setSelectedServicos(prev => 
      prev.includes(servicoId) 
        ? prev.filter(id => id !== servicoId)
        : [...prev, servicoId]
    );
  };

  const handleSubmitAgendamento = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    if (!selectedBarbearia || !selectedFuncionario || selectedServicos.length === 0 || !dataHora) {
      setFormError('Preencha todos os campos obrigatórios');
      setSubmitting(false);
      return;
    }

    const agendamentoData = {
      barbeariaId: selectedBarbearia,
      funcionarioId: selectedFuncionario,
      servicosIds: selectedServicos,
      dataHora: new Date(dataHora).toISOString(),
      observacoes: observacoes || null
    };

    const result = await AgendamentoService.criar(agendamentoData);
    
    if (result.success) {
      setFormSuccess('Agendamento realizado com sucesso!');
      setTimeout(() => {
        setShowAgendamentoForm(false);
        carregarAgendamentos();
        resetForm();
      }, 2000);
    } else {
      setFormError(result.message || 'Erro ao criar agendamento');
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setSelectedBarbearia('');
    setSelectedServicos([]);
    setSelectedFuncionario('');
    setDataHora('');
    setObservacoes('');
    setFormError('');
    setFormSuccess('');
  };

  const cancelarAgendamento = async (agendamentoId) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      const result = await AgendamentoService.cancelar(agendamentoId);
      if (result.success) {
        carregarAgendamentos();
      } else {
        alert(result.message);
      }
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-cliente">
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Olá, {user?.name?.split(' ')[0]}!</h1>
          <p>Gerencie seus agendamentos</p>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'agendamentos' ? 'active' : ''}`}
            onClick={() => setActiveTab('agendamentos')}
          >
            <IconCalendar /> Meus Agendamentos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'novo' ? 'active' : ''}`}
            onClick={() => { setActiveTab('novo'); setShowAgendamentoForm(true); }}
          >
            <IconScissors /> Novo Agendamento
          </button>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <Loader />
          ) : activeTab === 'agendamentos' ? (
            agendamentos.length === 0 ? (
              <div className="empty-state">
                <p>Você não tem agendamentos.</p>
                <button 
                  className="btn-primary"
                  onClick={() => { setActiveTab('novo'); setShowAgendamentoForm(true); }}
                >
                  Fazer primeiro agendamento
                </button>
              </div>
            ) : (
              <div className="agendamentos-list">
                {agendamentos.map(ag => (
                  <div key={ag.id} className="agendamento-card">
                    <div className="agendamento-header">
                      <h3>{ag.barbeariaNome}</h3>
                      <StatusBadge status={ag.status} />
                    </div>
                    <div className="agendamento-info">
                      <p><strong>Data:</strong> {formatDate(ag.dataHora)}</p>
                      <p><strong>Funcionário:</strong> {ag.funcionarioNome}</p>
                      <p><strong>Serviços:</strong> {ag.servicos?.map(s => s.nome).join(', ')}</p>
                      <p><strong>Valor total:</strong> R$ {ag.valorTotal?.toFixed(2)}</p>
                      {ag.observacoes && <p><strong>Observações:</strong> {ag.observacoes}</p>}
                    </div>
                    {ag.status === 'AGENDADO' && (
                      <div className="agendamento-actions">
                        <button 
                          className="btn-secondary"
                          onClick={() => cancelarAgendamento(ag.id)}
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : showAgendamentoForm && (
            <div className="agendamento-form-container">
              <h2>Novo Agendamento</h2>
              {formError && <div className="error-message">{formError}</div>}
              {formSuccess && <div className="success-message">{formSuccess}</div>}
              
              <form onSubmit={handleSubmitAgendamento}>
                <div className="form-group">
                  <label>Barbearia *</label>
                  <select 
                    value={selectedBarbearia} 
                    onChange={handleBarbeariaChange}
                    required
                  >
                    <option value="">Selecione uma barbearia</option>
                    {barbearias.map(b => (
                      <option key={b.id} value={b.id}>{b.nome} - {b.cidade}/{b.uf}</option>
                    ))}
                  </select>
                </div>

                {selectedBarbearia && servicos[selectedBarbearia] && (
                  <div className="form-group">
                    <label>Serviços * (pode selecionar múltiplos)</label>
                    <div className="servicos-checkbox-group">
                      {servicos[selectedBarbearia].map(s => (
                        <label key={s.id} className="checkbox-label">
                          <input
                            type="checkbox"
                            value={s.id}
                            checked={selectedServicos.includes(s.id)}
                            onChange={() => handleServicoToggle(s.id)}
                          />
                          <span>{s.nome} - R$ {s.preco?.toFixed(2)} ({s.duracaoMinutos} min)</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {selectedBarbearia && funcionarios.length > 0 && (
                  <div className="form-group">
                    <label>Funcionário *</label>
                    <select 
                      value={selectedFuncionario} 
                      onChange={(e) => setSelectedFuncionario(e.target.value)}
                      required
                    >
                      <option value="">Selecione um profissional</option>
                      {funcionarios.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Data e Hora *</label>
                  <input
                    type="datetime-local"
                    value={dataHora}
                    onChange={(e) => setDataHora(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Observações (opcional)</label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows={3}
                    placeholder="Alguma observação para o profissional?"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-secondary"
                    onClick={() => { setShowAgendamentoForm(false); setActiveTab('agendamentos'); resetForm(); }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Agendando...' : 'Confirmar Agendamento'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ClienteDashboard;