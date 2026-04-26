import { useState, useEffect } from 'react';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupBarbearia from './pages/SignupBarbearia';
import DashboardCliente from './pages/DashboardCliente';
import DashboardBarbearia from './pages/DashboardBarbearia';
import authService from './services/authService';
import './index.css';

const AppContent = () => {
  const [page, setPage] = useState('login'); // 'login', 'signup', 'signupBarbearia'
  const { isAuthenticated, loading } = useAuthContext();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      const role = authService.getUserRole();
      setUserRole(role);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="login-container">
        <p style={{ textAlign: 'center' }}>Carregando...</p>
      </div>
    );
  }

  // Redirecionamento baseado na role do usuário
  if (isAuthenticated) {
    if (userRole === 'ROLE_BARBEARIA_ADM') {
      return <DashboardBarbearia />;
    } else {
      return <DashboardCliente />;
    }
  }

  // Renderizar página baseada no estado
  const renderPage = () => {
    switch(page) {
      case 'signup':
        return (
          <Signup 
            onSwitchToLogin={() => setPage('login')}
            onSwitchToBarbearia={() => setPage('signupBarbearia')}
          />
        );
      case 'signupBarbearia':
        return (
          <SignupBarbearia 
            onSwitchToLogin={() => setPage('login')}
            onSwitchToCliente={() => setPage('signup')}
          />
        );
      default:
        return (
          <Login 
            onSwitchToSignup={() => setPage('signup')}
          />
        );
    }
  };

  return (
    <div className="login-container">
      {renderPage()}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;