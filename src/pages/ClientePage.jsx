import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AgendamentoService from '../services/AgendamentoService';
import NovoAgendamento from './NovoAgendamento';
import '../styles/Cliente.css';
import { formatarDataHora, formatarHora } from '../utils/dateUtils';

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
  { id: 'home',       icon: '⌂',  label: 'Início' },
  { id: 'agendar',    icon: '✂',  label: 'Novo Agendamento' },
  { id: 'historico',  icon: '☰',  label: 'Meus Agendamentos' },
  { id: 'barbearias', icon: '📍', label: 'Barbearias' },
  { id: 'perfil',     icon: '◉',  label: 'Meu Perfil' },
];

// Funções auxiliares para status (agora em português)
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

  // Verifica se o cliente pode cancelar (aguardando confirmação e com mais de 2 horas de antecedência)
  const podeCancelar = (dataHora, status) => {
    if (status !== 'Aguardando confirmação') return false;
    
    const agora = new Date();
    const dataAgendamento = new Date(dataHora);
    const diffHoras = (dataAgendamento - agora) / (1000 * 60 * 60);
    return diffHoras >= 2;
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

  if (loading) {
    return <div className="dc-loading">Carregando agendamentos…</div>;
  }

  if (!agendamentos.length) {
    return (
      <div className="dc-table-empty">
        <div style={{ fontSize: 36, marginBottom: 12 }}>✂️</div>
        <p>Você ainda não tem agendamentos.</p>
        <button
          className="btn-primary"
          style={{ marginTop: 16 }}
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
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((ag) => {
              const podeCancelarAgendamento = podeCancelar(ag.dataHora, ag.status);
              const cancelando = cancelandoId === ag.id;
              
              return (
                <tr key={ag.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{formatarDataHora(ag.dataHora)}</div>
                  </td>
                   <td>{ag.barbearia?.nome ?? ag.barbeariaNome ?? '—'}</td>
                  <td style={{ color: 'var(--corte-text-muted)' }}>
                    {Array.isArray(ag.servicos)
                      ? ag.servicos.map((s) => s.nome).join(', ')
                      : ag.servicoNome ?? '—'}
                   </td>
                   <td>{ag.funcionario?.nome ?? ag.funcionarioNome ?? 'Qualquer'}</td>
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
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancelar Agendamento</h3>
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
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCancelModal(false)}>
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
                <span>🕐 {formatarHora(proximo.dataHora)}</span>
                {proximo.funcionario?.nome && <span>👤 {proximo.funcionario.nome}</span>}
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
  const { user, logout } = useAuthContext();
  const [abaAtiva, setAbaAtiva] = useState('home');
  const [agendamentos, setAgendamentos] = useState([]);
  const [loadingAg, setLoadingAg] = useState(true);

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
    }  } catch (error) {
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
      onVoltar={() => setAbaAtiva('home')}
      onVerMeusAgendamentos={() => {
        carregarAgendamentos(); 
        setAbaAtiva('historico');
      }}
      onAgendamentoSucesso={() => {
        carregarAgendamentos(); 
      }}
    />
  );
}

  const pageTitles = {
    home:       { title: `Olá, ${user?.name?.split(' ')[0] || 'Cliente'} 👋`, sub: hojeFormatado() },
    historico:  { title: 'Meus Agendamentos', sub: 'Histórico completo dos seus atendimentos' },
    barbearias: { title: 'Barbearias',        sub: 'Explore os estabelecimentos cadastrados' },
    perfil:     { title: 'Meu Perfil',        sub: 'Gerencie suas informações pessoais' },
  };

  const pg = pageTitles[abaAtiva] ?? pageTitles.home;

  return (
    <div className="dc-root">
      {/* Sidebar */}
      <aside className="dc-sidebar">
        <div className="dc-sidebar-logo">
          <span className="dc-logo-icon">💈</span>
          <div>
            <div className="dc-logo-text">Área do cliente</div>
          </div>
        </div>

        <div className="dc-user-card">
          <div className="dc-avatar">
            {user?.fotoPerfil
              ? <img src={user.fotoPerfil} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
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
              <p className="dc-section-title">Todos os agendamentos</p>
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
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--corte-text-muted)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
              <p style={{ fontSize: 15, marginBottom: 20 }}>
                Para ver as barbearias, inicie um novo agendamento.
              </p>
              <button
                className="btn-primary"
                onClick={() => setAbaAtiva('agendar')}
                style={{
                  background: 'var(--corte-gold)',
                  color: '#0f0f0f',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: 'var(--corte-radius-sm)',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Novo Agendamento
              </button>
            </div>
          )}

          {abaAtiva === 'perfil' && (
            <div style={{ color: 'var(--corte-text-muted)', fontSize: 14 }}>
              <p>👤 Nome: <strong style={{ color: 'var(--corte-text)' }}>{user?.name}</strong></p>
              <p style={{ marginTop: 10 }}>📧 Email: <strong style={{ color: 'var(--corte-text)' }}>{user?.email}</strong></p>
              <p style={{ marginTop: 24, color: 'var(--corte-text-muted)', fontSize: 12 }}>
                Edição de perfil em breve.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientePage;