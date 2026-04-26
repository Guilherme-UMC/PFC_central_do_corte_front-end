import { useAuthContext } from '../contexts/AuthContext';

const DashboardCliente = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="login-container">
      <h2 className="form-title">Área do Cliente</h2>
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <p>Bem-vindo, {user?.name || 'Cliente'}!</p>
        <p style={{ marginTop: '10px', color: '#666' }}>
          Aqui você poderá agendar seus cortes, ver histórico e muito mais.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        <button className="login-button" style={{ background: '#4CAF50' }}>
          Agendar Corte
        </button>
        <button className="login-button" style={{ background: '#2196F3' }}>
          Meus Agendamentos
        </button>
        <button className="login-button" style={{ background: '#FF9800' }}>
          Barbearias Próximas
        </button>
        <button onClick={logout} className="login-button" style={{ background: '#f44336' }}>
          Sair
        </button>
      </div>
    </div>
  );
};

export default DashboardCliente;