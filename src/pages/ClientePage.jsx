import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import AgendamentoService from '../services/AgendamentoService';
import NovoAgendamento from './NovoAgendamento';
import '../styles/components/barber-card.css';
import '../styles/pages/cliente.css';
import { formatarDataHora, formatarHora } from '../utils/dateUtils';
import barbeariaService from '../services/BarbeariaService';
import BarberCard from '../components/BarberCard';
import BarbeariaDetalhes from '../pages/BarbeariaDetalhes';

const IconTelefone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
)

const IconObs = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scroll-text-icon lucide-scroll-text"><path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg>
)

const IconHome = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>)

const IconTime = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock-icon lucide-alarm-clock"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2 2" /><path d="M5 3 2 6" /><path d="m22 6-3-3" /><path d="M6.38 18.7 4 21" /><path d="M17.64 18.67 20 21" /></svg>)

const IconCorte = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors-icon lucide-scissors"><circle cx="6" cy="6" r="3" /><path d="M8.12 8.12 12 12" /><path d="M20 4 8.12 15.88" /><circle cx="6" cy="18" r="3" /><path d="M14.8 14.8 20 20" /></svg>)

const IconList = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-text-align-justify-icon lucide-text-align-justify"><path d="M3 5h18" /><path d="M3 12h18" /><path d="M3 19h18" /></svg>)

const IconBarber = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store-icon lucide-store"><path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" /><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" /><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" /></svg>)

const IconPerfil = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M17.925 20.056a6 6 0 0 0-11.851.001" /><circle cx="12" cy="11" r="4" /><circle cx="12" cy="12" r="10" /></svg>
)

const IconLogout = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-power-icon lucide-power"><path d="M12 2v10" /><path d="M18.4 6.6a9 9 0 1 1-12.77.04" /></svg>)

const proximoDia = (iso) => {
  if (!iso) return { dia: '—', mes: '—' };
  const d = new Date(iso);
  return {
    dia: d.getDate(),
    mes: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
  };
};

const obterIniciais = (nome = '') => {
  const partes = nome.trim().split(' ');
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return (partes[0]?.[0] ?? '?').toUpperCase();
};

const hojeFormatado = () =>
  new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

const NAV_ITEMS = [
  { id: 'home', icon: <IconHome />, label: 'Início' },
  { id: 'agendar', icon: <IconCorte />, label: 'Novo Agendamento' },
  { id: 'historico', icon: <IconList />, label: 'Meus Agendamentos' },
  { id: 'barbearias', icon: <IconBarber />, label: 'Barbearias' },
  { id: 'perfil', icon: <IconPerfil />, label: 'Meu Perfil' },
];

const getStatusLabel = (status) => {
  const labels = {
    'Aguardando confirmação': 'Aguardando confirmação',
    'Confirmado': 'Confirmado',
    'Cancelado pelo cliente': 'Cancelado',
    'Cancelado pela barbearia': 'Cancelado',
    'Concluído': 'Concluído',
    'Não compareceu': 'Não compareceu'
  };
  return labels[status] || status;
};

const getStatusIcon = (status) => {
  const icons = {
    'Aguardando confirmação': '●',
    'Confirmado': '✓',
    'Cancelado pelo cliente': '✕',
    'Cancelado pela barbearia': '✕',
    'Concluído': '★',
    'Não compareceu': '⚠'
  };
  return icons[status] || '●';
};

const getStatusClass = (status) => {
  if (status === 'Confirmado') return 'confirmado';
  if (status === 'Concluído') return 'confirmado';
  if (status === 'Cancelado pelo cliente' || status === 'Cancelado pela barbearia') return 'cancelado';
  if (status === 'Não compareceu') return 'cancelado';
  return 'pendente';
};

function TabelaAgendamentos({ agendamentos, loading, onNovoAgendamento, onCancelarAgendamento, onRecarregar }) {
  const [cancelandoId, setCancelandoId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState('');
  const [showObservacaoModal, setShowObservacaoModal] = useState(false);
  const [observacaoSelecionada, setObservacaoSelecionada] = useState('');


  const parseDataHora = (dataHoraStr) => {
    if (!dataHoraStr) return null;
    if (dataHoraStr instanceof Date) return dataHoraStr;

    if (dataHoraStr.includes('/')) {
      const [data, hora] = dataHoraStr.split(' ');
      const [dia, mes, ano] = data.split('/');
      const [horas, minutos] = hora.split(':');
      return new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), parseInt(horas), parseInt(minutos));
    }

    return new Date(dataHoraStr);
  };

  const podeCancelar = (dataHora, status) => {
    if (status !== 'Aguardando confirmação' && status !== 'Confirmado') {
      console.log(`Status não permite cancelamento: ${status}`);
      return false;
    }

    const agora = new Date();
    const dataAgendamento = parseDataHora(dataHora);
    if (!dataAgendamento) return false;
    const diffHoras = (dataAgendamento - agora) / (1000 * 60 * 60);
    return diffHoras >= 24;
  };

  const handleCancelarClick = (agendamento) => {
    setSelectedAgendamento(agendamento);
    setMotivoCancelamento('');
    setShowCancelModal(true);
  };

  const handleConfirmarCancelamento = async () => {
    if (!motivoCancelamento.trim()) {
      alert('Por favor, informe o motivo do cancelamento');
      return;
    }

    setCancelandoId(selectedAgendamento.id);
    const result = await onCancelarAgendamento(selectedAgendamento.id, motivoCancelamento);
    setCancelandoId(null);

    if (result?.success) {
      setShowCancelModal(false);
      setSelectedAgendamento(null);
      setMotivoCancelamento('');
      if (onRecarregar) onRecarregar();
    }
  };

  const handleVerObservacao = (observacao) => {
    setObservacaoSelecionada(observacao);
    setShowObservacaoModal(true);
  };

  if (loading) {
    return <div className="dc-loading">Carregando agendamentos…</div>;
  }

  if (!agendamentos.length) {
    return (
      <div className="dc-table-empty">
        <div>✂️</div>
        <p>Você ainda não tem agendamentos.</p>
        <button
          className="btn-primary"
          onClick={onNovoAgendamento}
        >
          Agendar agora
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="dc-table-wrap">
        <table className="dc-table">
          <thead>
            <tr>
              <th>Data & Hora</th>
              <th>Barbearia</th>
              <th>Serviço(s)</th>
              <th>Profissional</th>
              <th>Observação</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((ag) => {
              const podeCancelarAgendamento = podeCancelar(ag.dataHora, ag.status);
              const cancelando = cancelandoId === ag.id;
              const temObservacao = ag.observacao && ag.observacao.trim().length > 0;

              return (
                <tr key={ag.id}>
                  <td>
                    <div>{formatarDataHora(ag.dataHora)}</div>
                  </td>
                  <td>{ag.barbearia?.nome ?? ag.barbeariaNome ?? '—'}</td>
                  <td>
                    {Array.isArray(ag.servicos)
                      ? ag.servicos.map((s) => s.nome).join(', ')
                      : ag.servicoNome ?? '—'}
                  </td>
                  <td>{ag.funcionario?.nome ?? ag.funcionarioNome ?? 'Qualquer'}</td>
                  <td className="observacao-cell">
                    {temObservacao ? (
                      <button
                        className="btn-ver-observacao"
                        onClick={() => handleVerObservacao(ag.observacao)}
                        title="Ver observação"
                      >
                        <IconObs /> Ver observação
                      </button>
                    ) : (
                      <span className="sem-observacao">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`dc-badge ${getStatusClass(ag.status)}`}>
                      {getStatusIcon(ag.status)} {getStatusLabel(ag.status)}
                    </span>
                  </td>
                  <td>
                    {podeCancelarAgendamento ? (
                      <button
                        className="btn-cancelar-small"
                        onClick={() => handleCancelarClick(ag)}
                        disabled={cancelando}
                      >
                        {cancelando ? '...' : 'Cancelar'}
                      </button>
                    ) : (
                      <span className="no-action">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de Cancelamento */}
      {showCancelModal && selectedAgendamento && (
        <div className="modal-overlay2" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content2 cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancelar Agendamento</h3>
            <div className="form">
              <div className="cancel-info">
                <p><strong>Barbearia:</strong> {selectedAgendamento.barbearia?.nome ?? selectedAgendamento.barbeariaNome}</p>
                <p><strong>Data:</strong> {formatarDataHora(selectedAgendamento.dataHora)}</p>
                <p><strong>Serviço:</strong> {selectedAgendamento.servicoNome}</p>
              </div>
              <div className="form-group">
                <label>Motivo do cancelamento:</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Digite o motivo do cancelamento..."
                  value={motivoCancelamento}
                  onChange={(e) => setMotivoCancelamento(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setShowCancelModal(false)}>
                Voltar
              </button>
              <button
                className="btn-danger"
                onClick={handleConfirmarCancelamento}
                disabled={cancelandoId === selectedAgendamento.id}
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}

      {showObservacaoModal && (
        <div className="modal-overlay2" onClick={() => setShowObservacaoModal(false)}>
          <div className="modal-content2 observacao-modal" onClick={(e) => e.stopPropagation()}>
            <h3><IconObs /> Observação do Agendamento</h3>
            <div className="observacao-content">
              <p>{observacaoSelecionada}</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setShowObservacaoModal(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TelaHome({ user, agendamentos, loadingAg, onNavegar, onCancelarAgendamento, onRecarregar }) {
  const confirmados = agendamentos.filter((a) => a.status === 'Confirmado');
  const proximo = confirmados.sort(
    (a, b) => new Date(a.dataHora) - new Date(b.dataHora)
  )[0];

  const { dia, mes } = proximoDia(proximo?.dataHora);

  return (
    <>
      {/* Próximo agendamento */}
      {proximo && (
        <>
          <p className="dc-section-title">Próximo agendamento</p>
          <div className="dc-proximo">
            <div className="dc-proximo-data">
              <div className="dc-proximo-dia">{dia}</div>
              <div className="dc-proximo-mes">{mes}</div>
            </div>
            <div className="dc-proximo-info">
              <div className="dc-proximo-titulo">
                {proximo.barbearia?.nome ?? proximo.barbeariaNome ?? 'Barbearia'}
              </div>
              <div className="dc-proximo-detalhe">
                <span>
                  {Array.isArray(proximo.servicos)
                    ? proximo.servicos.map((s) => s.nome).join(', ')
                    : proximo.servicoNome ?? 'Serviço'}
                </span>
                <span><IconTime /> {formatarHora(proximo.dataHora)}</span>

                {proximo.funcionario?.nome && <span><IconPerfil />{proximo.funcionario.nome}</span>}
              </div>
            </div>
            <span className="dc-proximo-badge">● Confirmado</span>
          </div>
        </>
      )}

      {/* Ações rápidas */}
      <p className="dc-section-title">Outras ações</p>
      <div className="dc-actions-row">
        <div className="dc-action-card primary" onClick={() => onNavegar('agendar')}>
          <div className="dc-action-emoji">✂️</div>
          <div className="dc-action-title">Novo Agendamento</div>
          <div className="dc-action-desc">
            Escolha a barbearia, serviço, horário e profissional.
          </div>
        </div>
        <div className="dc-action-card" onClick={() => onNavegar('historico')}>
          <div className="dc-action-emoji">📋</div>
          <div className="dc-action-title">Meus Agendamentos</div>
          <div className="dc-action-desc">
            Veja todo o seu histórico e agendamentos futuros.
          </div>
        </div>
      </div>

      {/* Histórico recente */}
      {agendamentos.length > 0 && (
        <>
          <p className="dc-section-title">Histórico recente</p>
          <TabelaAgendamentos
            agendamentos={agendamentos.slice(0, 5)}
            loading={loadingAg}
            onNovoAgendamento={() => onNavegar('agendar')}
            onCancelarAgendamento={onCancelarAgendamento}
            onRecarregar={onRecarregar}
          />
        </>
      )}
    </>
  );
}

const ClientePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [abaAtiva, setAbaAtiva] = useState('home');
  const [agendamentos, setAgendamentos] = useState([]);
  const [loadingAg, setLoadingAg] = useState(true);
  const [barbearias, setBarbearias] = useState([]);
  const [loadingBarbearias, setLoadingBarbearias] = useState(false);

  const [barbeariaIdPreselecionado, setBarbeariaIdPreselecionado] = useState(null);

  useEffect(() => {
    const barbeariaId = location.state?.barbeariaId;
    const preselecionar = location.state?.preselecionarBarbearia;

    if (barbeariaId && preselecionar) {
      setBarbeariaIdPreselecionado(barbeariaId);
      setAbaAtiva('agendar');
      navigate('/page/cliente', { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (abaAtiva === 'perfil') {
      navigate('/perfil');
    }
  }, [abaAtiva, navigate]);

  const carregarBarbearias = async () => {
    setLoadingBarbearias(true);
    try {
      const result = await barbeariaService.listarTodas(0, 50);
      if (result.success) {
        const data = result.data;
        const lista = data.content || data || [];
        setBarbearias(lista);
      }
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
    } finally {
      setLoadingBarbearias(false);
    }
  };

  useEffect(() => {
    if (abaAtiva === 'barbearias') {
      carregarBarbearias();
    }
  }, [abaAtiva]);


  const carregarAgendamentos = async () => {
    try {
      const response = await AgendamentoService.listarMeus();
      if (response.success) {
        response.data.forEach(ag => {
          console.log(`Agendamento ${ag.id}: dataHora = ${ag.dataHora}, tipo = ${typeof ag.dataHora}`);
        });
        setAgendamentos(response.data);
      } else {
        setAgendamentos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      setAgendamentos([]);
    } finally {
      setLoadingAg(false);
    }
  };

  useEffect(() => {
    carregarAgendamentos();
  }, []);

  const handleCancelarAgendamento = async (agendamentoId, motivo) => {
    const result = await AgendamentoService.cancelar(agendamentoId, motivo);
    if (result.success) {
      alert('Agendamento cancelado com sucesso!');
      await carregarAgendamentos();
    } else {
      alert(result.message || 'Erro ao cancelar agendamento');
    }
    return result;
  };


  if (abaAtiva === 'agendar') {
    return (
      <NovoAgendamento
        onVoltar={() => {
          setAbaAtiva('home');
          setBarbeariaIdPreselecionado(null);
        }}
        onVerMeusAgendamentos={() => {
          carregarAgendamentos();
          setAbaAtiva('historico');
          setBarbeariaIdPreselecionado(null);
        }}
        onAgendamentoSucesso={() => {
          carregarAgendamentos();
          setBarbeariaIdPreselecionado(null);
        }}
        barbeariaIdPreselecionado={barbeariaIdPreselecionado}
      />
    );
  }

  const pageTitles = {
    home: { title: `Olá, ${user?.name?.split(' ')[0] || 'Cliente'}`, sub: hojeFormatado() },
    historico: { title: 'Meus Agendamentos', sub: 'Histórico completo dos seus atendimentos' },
    barbearias: { title: 'Barbearias', sub: 'Explore os estabelecimentos cadastrados' },
    perfil: { title: 'Meu Perfil', sub: 'Gerencie suas informações pessoais' },
  };

  const pg = pageTitles[abaAtiva] ?? pageTitles.home;

  return (
    <div className="dc-root">
      <aside className="dc-sidebar">

        <div className="dc-user-card">
          <div className="dc-avatar">
            {user?.fotoPerfil
              ? <img src={user.fotoPerfil} alt={user.name} />
              : obterIniciais(user?.name)}
          </div>
          <div className="dc-user-info">
            <div className="dc-user-name">{user?.name || 'Cliente'}</div>
            <div className="dc-user-role">Cliente</div>
          </div>
        </div>

        <nav className="dc-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`dc-nav-item ${abaAtiva === item.id ? 'active' : ''}`}
              onClick={() => setAbaAtiva(item.id)}
            >
              <span className="dc-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div className="dc-nav-divider" />

          <button className="dc-nav-item danger" onClick={logout}>
            <span className="dc-nav-icon">⏻</span>
            Sair
          </button>
        </nav>
      </aside>

      {/* Área principal */}
      <main className="dc-main">
        <div className="dc-topbar">
          <div>
            <h1 className="dc-page-title">{pg.title}</h1>
            <p className="dc-page-subtitle">{pg.sub}</p>
          </div>
          <span className="dc-topbar-date">{hojeFormatado()}</span>
        </div>

        <div className="dc-content">
          {abaAtiva === 'home' && (
            <TelaHome
              user={user}
              agendamentos={agendamentos}
              loadingAg={loadingAg}
              onNavegar={setAbaAtiva}
              onCancelarAgendamento={handleCancelarAgendamento}
              onRecarregar={carregarAgendamentos}
            />
          )}

          {abaAtiva === 'historico' && (
            <>
            <div className='heading'>
              <p className="dc-section-title">Todos os agendamentos</p>
              <p className='dc-section-title2'>Cancelamentos não são permitidos faltando menos de 24 horas para o agendamento</p>
              </div>
              <TabelaAgendamentos
                agendamentos={agendamentos}
                loading={loadingAg}
                onNovoAgendamento={() => setAbaAtiva('agendar')}
                onCancelarAgendamento={handleCancelarAgendamento}
                onRecarregar={carregarAgendamentos}
              />
            </>
          )}

          {abaAtiva === 'barbearias' && (
            <div>
              <p className="dc-section-title">Todas as barbearias</p>
              {loadingBarbearias ? (
                <div className="loading-state">Carregando barbearias...</div>
              ) : barbearias.length === 0 ? (
                <div className="empty-state">
                  <p>Nenhuma barbearia cadastrada no momento.</p>
                  <button
                    className="btn-primary"
                    onClick={() => setAbaAtiva('agendar')}
                    style={{ marginTop: 16 }}
                  >
                    Ver barbearias ao agendar
                  </button>
                </div>
              ) : (
                <div className="barbearias-grid-cliente">
                  {barbearias.map(barbearia => (
                    <BarberCard
                      key={barbearia.id}
                      barbearia={barbearia}
                      onAgendarClick={(barbeariaId) => {
                        navigate('/page/cliente', {
                          state: {
                            barbeariaId: barbeariaId,
                            preselecionarBarbearia: true
                          }
                        });
                        setAbaAtiva('agendar');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {abaAtiva === 'perfil' && (
            <div className="perfil-redirect">
              <p>Redirecionando para seu perfil...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientePage;