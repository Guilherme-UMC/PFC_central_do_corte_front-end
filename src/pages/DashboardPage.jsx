import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import BarbeariaService from '../services/BarbeariaService';
import DashboardService from '../services/DashboardService';
import DashboardCard from '../components/DashboardCard';
import ChartBar from '../components/ChartBar';
import Loader from '../components/Loader';
import '../styles/pages/dashboard.css';

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconMoney = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 8c-1.5-1.5-3-2-5-2s-3.5.5-5 2-2 3-2 5 .5 3.5 2 5 3 2 5 2 3.5-.5 5-2" />
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconCancel = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconYear = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
    <path d="M3 3h18v18H3z" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuthContext();
  const [barbearias, setBarbearias] = useState([]);
  const [selectedBarbearia, setSelectedBarbearia] = useState(null);
  const [metricas, setMetricas] = useState(null);
  const [dadosGrafico, setDadosGrafico] = useState({ labels: [], valores: [] });
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('mes');

  useEffect(() => {
    carregarBarbearias();
  }, []);

  useEffect(() => {
    if (selectedBarbearia) {
      carregarDashboard();
    }
  }, [selectedBarbearia, periodo]);

  const carregarBarbearias = async () => {
    try {
      setLoading(true);
      const result = await BarbeariaService.minhasBarbearias();
      if (result.success && result.data) {
        setBarbearias(result.data);
        if (result.data.length > 0) {
          setSelectedBarbearia(result.data[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarDashboard = async () => {
    setLoading(true);
    try {
      const [metricasResult, graficoResult] = await Promise.all([
        DashboardService.getMetricas(selectedBarbearia.id),
        DashboardService.getAgendamentosPorPeriodo(selectedBarbearia.id, periodo)
      ]);
      
      if (metricasResult.success) {
        setMetricas(metricasResult.data);
      }
      
      if (graficoResult.success) {
        setDadosGrafico(graficoResult.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
  };

  if (loading) return <Loader />;

  if (barbearias.length === 0) {
    return (
      <div className="dashboard-container">
        <div className="empty-dashboard">
          <p>Você ainda não possui barbearias cadastradas.</p>
          <button className="btn-primary" onClick={() => onNavigate?.('cadastro')}>
            Cadastrar Barbearia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visualize as métricas e o desempenho da sua barbearia</p>
      </div>

      {/* Seletor de Barbearias */}
      <div className="dashboard-barbearia-selector">
        {barbearias.map(b => (
          <button
            key={b.id}
            className={`dashboard-barbearia-btn ${selectedBarbearia?.id === b.id ? 'active' : ''}`}
            onClick={() => setSelectedBarbearia(b)}
          >
            {b.nome}
          </button>
        ))}
      </div>

      {selectedBarbearia && metricas && (
        <>
          {/* Cards de Métricas */}
          <div className="dashboard-cards">
            <DashboardCard
              title="Total de Agendamentos"
              value={metricas.totalAgendamentos || 0}
              icon={<IconCalendar />}
              color="#d4af37"
            />
            <DashboardCard
              title="Faturamento do Mês"
              value={formatarMoeda(metricas.faturamentoMes || 0)}
              icon={<IconMoney />}
              color="#2e7d32"
            />
            {/* NOVO CARD: Faturamento do Ano */}
            <DashboardCard
              title="Faturamento do Ano"
              value={formatarMoeda(metricas.faturamentoAno || 0)}
              icon={<IconYear />}
              color="#1e88e5"
            />
            <DashboardCard
              title="Clientes Atendidos"
              value={metricas.clientesAtendidos || 0}
              icon={<IconUsers />}
              color="#9b59b6"
            />
            <DashboardCard
              title="Taxa de Conclusão"
              value={`${metricas.taxaConfirmacao || 0}%`}
              icon={<IconCheck />}
              color="#e67e22"
            />

            <DashboardCard
              title="Cancelamentos"
              value={metricas.cancelamentos || 0}
              icon={<IconCancel />}
              color="#c62828"
            />
          </div>

          {/* Seletor de Período */}
          <div className="dashboard-periodo">
            <button className={`periodo-btn ${periodo === 'semana' ? 'active' : ''}`} onClick={() => setPeriodo('semana')}>
              📅 Esta Semana
            </button>
            <button className={`periodo-btn ${periodo === 'mes' ? 'active' : ''}`} onClick={() => setPeriodo('mes')}>
              📆 Este Mês
            </button>
            <button className={`periodo-btn ${periodo === 'ano' ? 'active' : ''}`} onClick={() => setPeriodo('ano')}>
              📈 Este Ano
            </button>
          </div>

          {/* Gráfico de Agendamentos Concluídos */}
          <div className="dashboard-chart">
            <ChartBar
              data={dadosGrafico.valores || [12, 19, 15, 25, 22, 23]}
              labels={dadosGrafico.labels || ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']}
              title="Agendamentos Concluídos por Período"
              height={300}
            />
          </div>

          {/* Informações adicionais */}
          <div className="dashboard-info">
            <div className="info-card">
              <h3>📊 Resumo</h3>
              <div className="info-row">
                <span>Total de serviços realizados:</span>
                <strong>{metricas.servicosRealizados || 0}</strong>
              </div>
              <div className="info-row">
                <span>Agendamentos este mês:</span>
                <strong>{metricas.agendamentosMes || 0}</strong>
              </div>
              <div className="info-row">
                <span>Média de agendamentos/dia:</span>
                <strong>{Math.round((metricas.agendamentosMes || 0) / 30)}</strong>
              </div>
              <div className="info-row">
                <span>Ticket médio por serviço:</span>
                <strong>
                  {metricas.servicosRealizados > 0 
                    ? formatarMoeda((metricas.faturamentoAno || 0) / metricas.servicosRealizados)
                    : formatarMoeda(0)}
                </strong>
              </div>
            </div>
            <div className="info-card">
              <h3>💡 Dicas para melhorar</h3>
              <ul>
                <li>✓ Mantenha seus horários sempre atualizados</li>
                <li>✓ Responda rapidamente as confirmações</li>
                <li>✓ Ofereça serviços variados para atrair mais clientes</li>
                <li>✓ Colete avaliações dos clientes após o atendimento</li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;