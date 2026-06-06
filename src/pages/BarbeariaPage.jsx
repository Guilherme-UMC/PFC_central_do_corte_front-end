import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import BarbeariaService from '../services/BarbeariaService';
import AgendamentoService from '../services/AgendamentoService';
import ServicoService from '../services/ServicoService';
import FuncionarioService from '../services/FuncionarioService';
import ProdutoService from '../services/ProdutoService';
import HorarioService, { DIAS_SEMANA, HORARIOS_PADRAO } from '../services/HorarioService';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import CadastroBarbearia from '../components/CadastroBarbearia';
import Dashboard from './DashboardPage';
import { formatarDataHora, formatarData, isHoje } from '../utils/dateUtils';
import PasswordInput from '../components/PasswordInput';
import '../styles/pages/barbearia.css';

const IconProduto = () =>(
  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-bag-icon lucide-shopping-bag"><path d="M16 10a4 4 0 0 1-8 0"/><path d="M3.103 6.034h17.794"/><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"/></svg>
)

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

const IconLocal = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
)

const IconTelefone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
)

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
  const [produtos, setProdutos] = useState([]);
  const [produtosCategorias, setProdutosCategorias] = useState([]);
  const [showProdutoForm, setShowProdutoForm] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [produtoForm, setProdutoForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    imagemUrl: '',
    categoria: '',
    marca: ''
  });

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

  const carregarDadosBarbearia = async (barbeariaId) => {
    console.log('Recarregando dados da barbearia...');

    setAgendamentos([]);
    setAgendamentosHoje([]);
    setServicos([]);
    setFuncionarios([]);
    setProdutos([]);

    await Promise.all([
      carregarAgendamentos(barbeariaId),
      carregarAgendamentosHoje(barbeariaId),
      carregarServicos(barbeariaId),
      carregarFuncionarios(barbeariaId),
      carregarHorarios(barbeariaId),
      carregarProdutos(barbeariaId),
      carregarCategorias(barbeariaId)
    ]);

    console.log('Dados recarregados com sucesso');
  };

  const carregarAgendamentos = async (barbeariaId) => {
    const result = await AgendamentoService.listarPorBarbearia(barbeariaId);
    if (result.success) {
      setAgendamentos(result.data);
      console.log(`Agendamentos carregados: ${result.data.length}`);
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

  const carregarProdutos = async (barbeariaId) => {
    const result = await ProdutoService.listarTodosPorBarbearia(barbeariaId);
    if (result.success) {
      setProdutos(result.data || []);
      console.log(`📦 Produtos carregados: ${result.data?.length || 0}`);
    }
  };

  const carregarCategorias = async (barbeariaId) => {
    const result = await ProdutoService.listarCategorias(barbeariaId);
    if (result.success) {
      setProdutosCategorias(result.data || []);
    }
  };

  const handleSelectBarbearia = async (barbearia) => {
    setSelectedBarbearia(barbearia);
    setActiveTab('agendamentos');
  };

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

  const handleProdutoSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const produtoData = {
      nome: produtoForm.nome,
      descricao: produtoForm.descricao || null,
      preco: parseFloat(produtoForm.preco),
      imagemUrl: produtoForm.imagemUrl || null,
      categoria: produtoForm.categoria || null,
      marca: produtoForm.marca || null
    };

    let result;
    if (editingProduto) {
      result = await ProdutoService.atualizar(editingProduto.id, produtoData);
    } else {
      result = await ProdutoService.criar(selectedBarbearia.id, produtoData);
    }

    if (result.success) {
      showMessage('success', editingProduto ? 'Produto atualizado!' : 'Produto criado!');
      setShowProdutoForm(false);
      setEditingProduto(null);
      setProdutoForm({ nome: '', descricao: '', preco: '', imagemUrl: '', categoria: '', marca: '' });
      await carregarProdutos(selectedBarbearia.id);
      await carregarCategorias(selectedBarbearia.id);
    } else {
      showMessage('error', result.message);
    }
    setSubmitting(false);
  };

  const handleDesativarProduto = async (produtoId) => {
    if (window.confirm('Tem certeza que deseja desativar este produto?')) {
      const result = await ProdutoService.desativar(produtoId);
      if (result.success) {
        showMessage('success', 'Produto desativado');
        await carregarProdutos(selectedBarbearia.id);
      } else {
        showMessage('error', result.message);
      }
    }
  };

  const handleAtivarProduto = async (produtoId) => {
    const result = await ProdutoService.ativar(produtoId);
    if (result.success) {
      showMessage('success', 'Produto ativado');
      await carregarProdutos(selectedBarbearia.id);
    } else {
      showMessage('error', result.message);
    }
  };

  const openProdutoForm = (produto = null) => {
    if (produto) {
      setEditingProduto(produto);
      setProdutoForm({
        nome: produto.nome,
        descricao: produto.descricao || '',
        preco: produto.preco,
        imagemUrl: produto.imagemUrl || '',
        categoria: produto.categoria || '',
        marca: produto.marca || ''
      });
    } else {
      setEditingProduto(null);
      setProdutoForm({ nome: '', descricao: '', preco: '', imagemUrl: '', categoria: '', marca: '' });
    }
    setShowProdutoForm(true);
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
              <div className="info">
                <span className="info-icon"><IconLocal /></span>
                <span>{selectedBarbearia.logradouro}, {selectedBarbearia.numero}</span>
              </div>
              <div className="info">
                <span className="info-icon"></span>
                <span>{selectedBarbearia.bairro}</span>
              </div>
              <div className="info">
                <span className="info-icon"></span>
                <span>{selectedBarbearia.cidade} - {selectedBarbearia.uf} | CEP: {selectedBarbearia.cep}</span>
              </div>
              {selectedBarbearia.telefone && (
                <div className="info">
                  <span className="info-icon"><IconTelefone /></span>
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
          <button className={`tab-btn ${activeTab === 'produtos' ? 'active' : ''}`} onClick={() => setActiveTab('produtos')}>
            Produtos
          </button>
          <button
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
        </div>

        <div className="page-content">
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
                        <p><strong>Data:</strong><br /> {formatarDataHora(ag.dataHora)}</p>
                        <p><strong>Serviço:</strong> <br />{ag.servicoNome}</p>
                        <p><strong>Valor:</strong><br /> R$ {ag.servicoPreco?.toFixed(2)}</p>
                        <p><strong>Funcionário:</strong> <br />{ag.funcionarioNome || 'Não definido'}</p>
                        {ag.observacao && <p><strong>Obs:</strong> {ag.observacao}</p>}
                      </div>

                      {ag.status === 'Aguardando confirmação' && (
                        <div className="agendamento-actions">
                          <button
                            className="btn-concluir"
                            onClick={() => handleConfirmarAgendamento(ag.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✓ Confirmar'}
                          </button>
                          <button
                            className="btn-danger"
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
                            className="btn-concluir"
                            onClick={() => handleConcluirAgendamento(ag.id)}
                            disabled={isLoading}
                          >
                            {isLoading ? '...' : '✓ Concluir Atendimento'}
                          </button>
                          <button
                            className="btn-danger"
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
                <span className="today-date">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              {agendamentosHoje.length === 0 ? (
                <div className="empty-state-small">
                  <p>Nenhum agendamento para hoje.</p>
                  <p>
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
                            className="btn-concluir"
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

          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <Dashboard barbeariaId={selectedBarbearia?.id} />
          )}

          {/* TAB: SERVIÇOS */}
          {activeTab === 'servicos' && (
            <div>
              <div className="section-header-actions">
                <h3>Serviços Oferecidos</h3>
              </div>
              <button className="btn-concluir" onClick={() => setShowServicoForm(true)}>
                <IconPlus /> Novo Serviço
              </button>

              {showServicoForm && (
                <div className="modal-overlay2">
                  <div className="modal-content2">
                    <h3>{editingServico ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                    <form className="form" onSubmit={handleServicoSubmit}>
                      <div className="form-group">
                        <label className="form-label">Nome do Serviço</label>
                        <input className="form-input" type="text" placeholder="Nome do serviço" value={servicoForm.nome} onChange={e => setServicoForm({ ...servicoForm, nome: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Descrição</label>
                        <textarea className="form-input" placeholder="Descrição" value={servicoForm.descricao} onChange={e => setServicoForm({ ...servicoForm, descricao: e.target.value })} rows={2} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Preço</label>
                        <input className="form-input" type="number" step="0.01" placeholder="Preço (R$)" value={servicoForm.preco} onChange={e => setServicoForm({ ...servicoForm, preco: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Duração</label>
                        <input className="form-input" type="number" placeholder="Duração (minutos)" value={servicoForm.duracaoMinutos} onChange={e => setServicoForm({ ...servicoForm, duracaoMinutos: e.target.value })} required />
                      </div>
                      <div className="modal-actions">
                        <button type="button" className="btn-danger" onClick={() => { setShowServicoForm(false); setEditingServico(null); setServicoForm({ nome: '', descricao: '', preco: '', duracaoMinutos: '' }); }}>Cancelar</button>
                        <button type="submit" className="btn-cancelar" disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar'}</button>
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
              </div>
              <button className="btn-concluir" onClick={() => setShowFuncionarioForm(true)}>
                <IconPlus /> Novo Funcionário
              </button>

              {showFuncionarioForm && (
                <div className="modal-overlay2">
                  <div className="modal-content2">
                    <h3>Novo Funcionário</h3>
                    <form className="form" onSubmit={handleFuncionarioSubmit}>
                      <label className="form-label">Nome</label>
                      <input className='form-input' type="text" placeholder="Nome completo" value={funcionarioForm.name} onChange={e => setFuncionarioForm({ ...funcionarioForm, name: e.target.value })} required />

                      <label className="form-label">Email</label>
                      <input className='form-input' type="email" placeholder="Email" value={funcionarioForm.email} onChange={e => setFuncionarioForm({ ...funcionarioForm, email: e.target.value })} required />

                      <label className="form-label">Telefone</label>
                      <input className='form-input' type="tel" placeholder="Telefone" value={funcionarioForm.telefone} onChange={e => setFuncionarioForm({ ...funcionarioForm, telefone: e.target.value })} required />

                      <PasswordInput
                        name="password"
                        label="Senha"
                        placeholder="Mínimo 6 caracteres"
                        value={funcionarioForm.password}
                        onChange={e => setFuncionarioForm({ ...funcionarioForm, password: e.target.value })}
                        required
                      />
                      <div className="modal-actions">
                        <button type="button" className="btn-danger" onClick={() => { setShowFuncionarioForm(false); setFuncionarioForm({ name: '', email: '', telefone: '', password: '' }); }}>Cancelar</button>
                        <button type="submit" className="btn-concluir" disabled={submitting}>{submitting ? 'Criando...' : 'Criar'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="vinculacao-section">
                <br /><h4>Vincular funcionário existente</h4>
                <form onSubmit={handleVincularFuncionario} className="inline-form">
                  <input type="email" className='form-input' placeholder="Email do funcionário" value={vincularEmail} onChange={e => setVincularEmail(e.target.value)} required />
                  <button type="submit" className="btn-concluir" disabled={submitting}>Vincular</button>
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
              </div>
              <button className="btn-concluir" onClick={() => setShowHorarioForm(true)}>
                <IconPlus /> Editar Horários
              </button>

              {showHorarioForm && (
                <div className="modal-overlay2">
                  <div className="modal-content2">
                    <h3>Editar Horários de Funcionamento</h3>
                    <p className="text-muted">
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
                      <button type="button" className="btn-danger" onClick={() => { setShowHorarioForm(false); carregarHorarios(selectedBarbearia.id); }}>Cancelar</button>
                      <button type="button" className="btn-cancelar" onClick={salvarHorarios} disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar Horários'}</button>
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

          {/* TAB: PRODUTOS */}
          {activeTab === 'produtos' && (
            <div>
              <div className="section-header-actions">
                <h3>Catálogo de Produtos</h3><br />
                <button className="btn-concluir" onClick={() => openProdutoForm()}>
                  <IconPlus /> Novo Produto
                </button>
              </div>

              {/* Modal de formulário */}
              {showProdutoForm && (
                <div className="modal-overlay2">
                  <div className="modal-content2" style={{ maxWidth: '600px' }}>
                    <h3>{editingProduto ? 'Editar Produto' : 'Novo Produto'}</h3>
                    <form className="form" onSubmit={handleProdutoSubmit}>
                      <div className="form-group">
                        <label className="form-label">Nome *</label>
                        <input
                          className="form-input"
                          type="text"
                          placeholder="Ex: Shampoo Antiqueda"
                          value={produtoForm.nome}
                          onChange={e => setProdutoForm({ ...produtoForm, nome: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Marca</label>
                        <input
                          className="form-input"
                          type="text"
                          placeholder="Ex: Nivea, Gillette, etc."
                          value={produtoForm.marca}
                          onChange={e => setProdutoForm({ ...produtoForm, marca: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Categoria</label>
                        <select
                          className="form-select"
                          value={produtoForm.categoria}
                          onChange={e => setProdutoForm({ ...produtoForm, categoria: e.target.value })}
                        >
                          <option className='option' value="">Selecione uma categoria</option>
                          <option className='option' value="Cabelo">Cabelo</option>
                          <option className='option' value="Barba">Barba</option>
                          <option className='option' value="Pele">Pele</option>
                          <option className='option' value="Perfumaria">Perfumaria</option>
                          <option className='option' value="Acessórios">Acessórios</option>
                          <option className='option' value="Outros">Outros</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Descrição</label>
                        <textarea
                          className="form-input"
                          placeholder="Descreva o produto..."
                          value={produtoForm.descricao}
                          onChange={e => setProdutoForm({ ...produtoForm, descricao: e.target.value })}
                          rows={3}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Preço (R$)</label>
                        <input
                          className="form-input"
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={produtoForm.preco}
                          onChange={e => setProdutoForm({ ...produtoForm, preco: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">URL da Imagem</label>
                        <input
                          className="form-input"
                          type="url"
                          placeholder="https://exemplo.com/imagem.jpg"
                          value={produtoForm.imagemUrl}
                          onChange={e => setProdutoForm({ ...produtoForm, imagemUrl: e.target.value })}
                        />
                        <small className="text-muted">Link para foto do produto (opcional)</small>
                      </div>

                      <div className="modal-actions">
                        <button type="button" className="btn-danger" onClick={() => { setShowProdutoForm(false); setEditingProduto(null); }}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                          {submitting ? 'Salvando...' : 'Salvar'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Lista de produtos */}
              {produtos.length === 0 ? (
                <div className="empty-state-small">
                  <p>Nenhum produto cadastrado ainda.</p><br />
                  <button className="btn-concluir" onClick={() => openProdutoForm()}>
                    <IconPlus /> Adicionar primeiro produto
                  </button>
                </div>
              ) : (
                <div className="produtos-grid-admin">
                  {produtos.map(produto => (
                    <div key={produto.id} className="produto-admin-card">
                      {produto.imagemUrl ? (
                        <img src={produto.imagemUrl} alt={produto.nome} className="produto-admin-imagem" />
                      ) : (
                        <div className="produto-admin-imagem-placeholder"><IconProduto/></div>
                      )}
                      <div className="produto-admin-info">
                        <h4>{produto.nome}</h4>
                        {produto.marca && <span className="produto-admin-marca">{produto.marca}</span>}
                        {produto.categoria && <span className="produto-admin-categoria">{produto.categoria}</span>}
                        {produto.descricao && <p className="produto-admin-descricao">{produto.descricao}</p>}
                        {produto.preco && <p className="produto-admin-preco">R$ {produto.preco.toFixed(2)}</p>}
                      </div>
                      <div className="produto-admin-actions">
                        <button className="btn-primary" onClick={() => openProdutoForm(produto)}>
                          <IconEdit /> Editar
                        </button>
                        {produto.ativo ? (
                          <button className="btn-danger" onClick={() => handleDesativarProduto(produto.id)}>
                            <IconTrash /> Desativar
                          </button>
                        ) : (
                          <button className="btn-primary" onClick={() => handleAtivarProduto(produto.id)}>
                            Ativar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarbeariaPage;