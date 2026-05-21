import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AgendamentoService from '../services/AgendamentoService';
import NovoAgendamento from './NovoAgendamento';
import '../styles/DashboardCliente.css';

const formatarData = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

const formatarHora = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit',
  });
};

const proximoDia = (iso) => {
  if (!iso) return { dia: '—', mes: '—' };
  const d = new Date(iso);
  return {
    dia: d.getDate(),
    mes: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
  };
};

const statusConfig = {
  CONFIRMADO: { label: 'Confirmado', cls: 'confirmado', icon: '✓' },
  CANCELADO:  { label: 'Cancelado',  cls: 'cancelado',  icon: '✕' },
  PENDENTE:   { label: 'Pendente',   cls: 'pendente',   icon: '●' },
  CONCLUIDO:  { label: 'Concluído',  cls: 'confirmado', icon: '★' },
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
  { id: 'barbearias', icon: '', label: 'Barbearias' },
  { id: 'perfil',     icon: '◉',  label: 'Meu Perfil' },
];

function TabelaAgendamentos({ agendamentos, loading, onNovoAgendamento }) {
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
    <div className="dc-table-wrap">
      <table className="dc-table">
        <thead>
          <tr>
            <th>Data & Hora</th>
            <th>Barbearia</th>
            <th>Serviço(s)</th>
            <th>Profissional</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map((ag) => {
            const st = statusConfig[ag.status] ?? statusConfig.PENDENTE;
            return (
              <tr key={ag.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{formatarData(ag.dataHora)}</div>
                  <div style={{ fontSize: 12, color: 'var(--corte-text-muted)' }}>
                    {formatarHora(ag.dataHora)}
                  </div>
                </td>
                <td>{ag.barbearia?.nome ?? ag.barbeariaNome ?? '—'}</td>
                <td style={{ color: 'var(--corte-text-muted)' }}>
                  {Array.isArray(ag.servicos)
                    ? ag.servicos.map((s) => s.nome).join(', ')
                    : ag.servicoNome ?? '—'}
                </td>
                <td>{ag.funcionario?.nome ?? ag.funcionarioNome ?? 'Qualquer'}</td>
                <td>
                  <span className={`dc-badge ${st.cls}`}>
                    {st.icon} {st.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TelaHome({ user, agendamentos, loadingAg, onNavegar }) {
  const confirmados = agendamentos.filter((a) => a.status === 'CONFIRMADO');
  const concluidos  = agendamentos.filter((a) => a.status === 'CONCLUIDO');
  const proximo     = confirmados.sort(
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
          />
        </>
      )}
    </>
  );
}

const DashboardCliente = () => {
  const { user, logout } = useAuthContext();
  const [abaAtiva, setAbaAtiva] = useState('home');
  const [agendamentos, setAgendamentos] = useState([]);
  const [loadingAg, setLoadingAg] = useState(true);

  useEffect(() => {
  const carregarAgendamentos = async () => {
    try {
      const response = await AgendamentoService.listarMeus();
      if (response.success) {
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
  
  carregarAgendamentos();
}, []);

  if (abaAtiva === 'agendar') {
    return (
      <NovoAgendamento
        onVoltar={() => setAbaAtiva('home')}
        onVerMeusAgendamentos={() => setAbaAtiva('historico')}
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
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="dc-sidebar">
        {/* Logo */}
        <div className="dc-sidebar-logo">
          <span className="dc-logo-icon">💈</span>
          <div>
            <div className="dc-logo-text">Central do Corte</div>
            <div className="dc-logo-sub">Área do cliente</div>
          </div>
        </div>

        {/* User card */}
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

        {/* Nav */}
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

      {/* ── Área principal ──────────────────────────────────── */}
      <main className="dc-main">
        {/* Topbar */}
        <div className="dc-topbar">
          <div>
            <h1 className="dc-page-title">{pg.title}</h1>
            <p className="dc-page-subtitle">{pg.sub}</p>
          </div>
          <span className="dc-topbar-date">{hojeFormatado()}</span>
        </div>

        {/* Conteúdo da aba */}
        <div className="dc-content">
          {abaAtiva === 'home' && (
            <TelaHome
              user={user}
              agendamentos={agendamentos}
              loadingAg={loadingAg}
              onNavegar={setAbaAtiva}
            />
          )}

          {abaAtiva === 'historico' && (
            <>
              <p className="dc-section-title">Todos os agendamentos</p>
              <TabelaAgendamentos
                agendamentos={agendamentos}
                loading={loadingAg}
                onNovoAgendamento={() => setAbaAtiva('agendar')}
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

export default DashboardCliente;