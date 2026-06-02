import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const PublicRoute = () => {
  const { isAuthenticated, user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="login-container">
        <div style={{ textAlign: 'center' }}>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === 'ROLE_CLIENTE') return <Navigate to="/page/cliente" replace />;
    if (user?.role === 'ROLE_BARBEARIA_ADM') return <Navigate to="/page/barbearia" replace />;
    if (user?.role === 'ROLE_FUNCIONARIO') return <Navigate to="/page/funcionario" replace />;
    if (user?.role === 'ROLE_ADMIN') return <Navigate to="/page/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;