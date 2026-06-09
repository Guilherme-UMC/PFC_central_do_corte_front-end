import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import LogService from '../services/LogService';
import Loader from '../components/Loader';
import '../styles/pages/AdminLogs.css';

const AdminLogsPage = () => {
  const { user } = useAuthContext();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: '',
    acao: '',
    dataInicio: '',
    dataFim: ''
  });
  const [tipos, setTipos] = useState([]);
  const [acoes, setAcoes] = useState([]);
  const [estatisticas, setEstatisticas] = useState({});
  const [paginacao, setPaginacao] = useState({
    page: 0,
    totalPages: 0,
    totalElements: 0
  });
  useEffect(() => {
    console.log('👤 Usuário logado:', user);
    console.log('👤 Role do usuário:', user?.role);
    console.log('👤 Role esperada: ROLE_ADMIN');
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  useEffect(() => {
    carregarLogs();
  }, [filtros, paginacao.page]);

  const carregarDadosIniciais = async () => {
    try {
      const [tiposRes, acoesRes, statsRes] = await Promise.all([
        LogService.getTipos(),
        LogService.getAcoes(),
        LogService.getEstatisticas()
      ]);
      setTipos(tiposRes.data || []);
      setAcoes(acoesRes.data || []);
      setEstatisticas(statsRes.data || {});
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const carregarLogs = async () => {
    setLoading(true);
    try {
      const response = await LogService.buscarLogs({
        ...filtros,
        page: paginacao.page
      });
      if (response.success) {
        setLogs(response.data.logs || []);
        setPaginacao({
          page: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements
        });
      }
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    setPaginacao(prev => ({ ...prev, page: 0 }));
  };

  const limparFiltros = () => {
    setFiltros({
      tipo: '',
      acao: '',
      dataInicio: '',
      dataFim: ''
    });
    setPaginacao(prev => ({ ...prev, page: 0 }));
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  const getCorTipo = (tipo) => {
    const cores = {
      'AGENDAMENTO': '#d4af37',
      'USUARIO': '#2e7d32',
      'BARBEARIA': '#1e88e5',
      'SERVICO': '#e67e22',
      'FUNCIONARIO': '#9b59b6',
      'LOGIN': '#00bcd4',
      'LOGOUT': '#f44336'
    };
    return cores[tipo] || '#757575';
  };

  if (loading && logs.length === 0) return <Loader />;

  return (
    <div className="admin-logs-container">
      <div className="admin-logs-header">
        <h1>Logs do Sistema</h1>
        <p>Visualize todas as ações realizadas no sistema</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-value">{paginacao.totalElements}</span>
          <span className="stat-label">Total de Logs</span>
        </div>
        {Object.entries(estatisticas).map(([tipo, total]) => (
          <div key={tipo} className="stat-card" style={{ borderTopColor: getCorTipo(tipo) }}>
            <span className="stat-value">{total}</span>
            <span className="stat-label">{tipo}</span>
          </div>
        ))}
      </div>

    
      <div className="filtros-container">
        <select name="tipo" className="select" value={filtros.tipo} onChange={handleFiltroChange}>
          <option value="">Todos os tipos</option>
          {tipos.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>

        <select name="acao" className="select" value={filtros.acao} onChange={handleFiltroChange}>
          <option value="">Todas as ações</option>
          {acoes.map(acao => (
            <option key={acao} value={acao}>{acao}</option>
          ))}
        </select>

        <label className="form-label">Data Inicio:</label>
        <input
          type="date"
          name="dataInicio"
          value={filtros.dataInicio}
          onChange={handleFiltroChange}
          placeholder="Data início"
        />

        <label className="form-label">Data Fim:</label>
        <input
          type="date"
          name="dataFim"
          value={filtros.dataFim}
          onChange={handleFiltroChange}
          placeholder="Data fim"
        />

        <button className="btn-limpar" onClick={limparFiltros}>
          Limpar Filtros
        </button>
      </div>

    
      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Tipo</th>
              <th>Ação</th>
              <th>Usuário</th>
              <th>Role</th>
              <th>Descrição</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-logs">
                  Nenhum log encontrado
                </td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td>{formatarData(log.dataHora)}</td>
                  <td>
                    <span className="tipo-badge" style={{ backgroundColor: getCorTipo(log.tipo) }}>
                      {log.tipo}
                    </span>
                  </td>
                  <td>
                    <span className={`acao-badge acao-${log.acao.toLowerCase()}`}>
                      {log.acao}
                    </span>
                  </td>
                  <td>
                    <div className="usuario-info">
                      <strong>{log.usuarioNome}</strong>
                      <small>{log.usuarioEmail}</small>
                    </div>
                  </td>
                  <td>{log.usuarioRole}</td>
                  <td className="descricao-cell">
                    <div className="descricao-text">{log.descricao}</div>
                    {log.entidade && (
                      <small className="entidade-info">
                        {log.entidade}: {log.entidadeId}
                      </small>
                    )}
                  </td>
                  <td>{log.ipOrigem || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    
      {paginacao.totalPages > 0 && (
        <div className="pagination">
          <button
            onClick={() => setPaginacao(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={paginacao.page === 0}
          >
            Anterior
          </button>
          <span>
            Página {paginacao.page + 1} de {paginacao.totalPages}
          </span>
          <button
            onClick={() => setPaginacao(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={paginacao.page + 1 >= paginacao.totalPages}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminLogsPage;