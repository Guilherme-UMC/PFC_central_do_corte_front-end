import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AgendamentoService from '../services/AgendamentoService';
import BarbeariaService from '../services/BarbeariaService';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';

const FuncionarioDashboard = ({ onNavigate }) => {
  const { user } = useAuthContext();
  const [barbearias, setBarbearias] = useState([]);
  const [selectedBarbearia, setSelectedBarbearia] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarBarbeariasVinculadas();
  }, []);

  const carregarBarbeariasVinculadas = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/funcionarios/barbearias', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBarbearias(data);
        if (data.length > 0) {
          setSelectedBarbearia(data[0]);
          carregarAgendamentos(data[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
    }
    setLoading(false);
  };

  const carregarAgendamentos = async (barbeariaId) => {
    const result = await AgendamentoService.listarPorBarbearia(barbeariaId);
    if (result.success) {
      // Filtrar apenas agendamentos do funcionário logado
      const meusAgendamentos = result.data.filter(ag => ag.funcionarioId === user?.id);
      setAgendamentos(meusAgendamentos);
    }
  };

  const handleSelectBarbearia = (barbearia) => {
    setSelectedBarbearia(barbearia);
    carregarAgendamentos(barbearia.id);
  };

  const handleUpdateStatus = async (agendamentoId, status) => {
    const result = await AgendamentoService.atualizarStatus(agendamentoId, status);
    if (result.success) {
      carregarAgendamentos(selectedBarbearia.id);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-funcionario">
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Olá, {user?.name?.split(' ')[0]}!</h1>
          <p>Gerencie sua agenda de atendimentos</p>
        </div>

        {barbearias.length === 0 ? (
          <div className="empty-state">
            <p>Você ainda não está vinculado a nenhuma barbearia.</p>
          </div>
        ) : (
          <>
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
            </div>

            {selectedBarbearia && (
              <div className="agendamentos-list">
                <h2>Meus Agendamentos - {selectedBarbearia.nome}</h2>
                {agendamentos.length === 0 ? (
                  <p>Nenhum agendamento para você.</p>
                ) : (
                  agendamentos.map(ag => (
                    <div key={ag.id} className="agendamento-card">
                      <div className="agendamento-header">
                        <h3>{ag.clienteNome}</h3>
                        <StatusBadge status={ag.status} />
                      </div>
                      <div className="agendamento-info">
                        <p><strong>Data:</strong> {formatDate(ag.dataHora)}</p>
                        <p><strong>Serviços:</strong> {ag.servicos?.map(s => s.nome).join(', ')}</p>
                        <p><strong>Valor:</strong> R$ {ag.valorTotal?.toFixed(2)}</p>
                        {ag.observacoes && <p><strong>Observações:</strong> {ag.observacoes}</p>}
                      </div>
                      {ag.status === 'AGENDADO' && (
                        <div className="agendamento-actions">
                          <button className="btn-success small" onClick={() => handleUpdateStatus(ag.id, 'CONFIRMADO')}>Confirmar</button>
                          <button className="btn-danger small" onClick={() => handleUpdateStatus(ag.id, 'CANCELADO')}>Cancelar</button>
                        </div>
                      )}
                      {ag.status === 'CONFIRMADO' && (
                        <div className="agendamento-actions">
                          <button className="btn-primary small" onClick={() => handleUpdateStatus(ag.id, 'FINALIZADO')}>Finalizar Atendimento</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
      
    </div>
  );
};

export default FuncionarioDashboard;