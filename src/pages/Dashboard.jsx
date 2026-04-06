import { useAuthContext } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="login-container">
      <h2 className="form-title">Bem-vindo!</h2>
      <p style={{ textAlign: 'center', margin: '20px 0' }}>
        Olá, {user?.name || 'Usuário'}! Você está logado.
      </p>
      <button 
        onClick={logout}
        className="login-button"
        style={{ marginTop: '20px' }}
      >
        Sair
      </button>
    </div>
  );
};

export default Dashboard;