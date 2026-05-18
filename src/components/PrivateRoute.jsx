import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const PrivateRoute = ({ allowedRoles = [] }) => {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'ROLE_CLIENTE') return <Navigate to="/dashboard/cliente" replace />;
    if (user.role === 'ROLE_BARBEARIA_ADM') return <Navigate to="/dashboard/barbearia" replace />;
    if (user.role === 'ROLE_FUNCIONARIO') return <Navigate to="/dashboard/funcionario" replace />;
    if (user.role === 'ROLE_ADMIN') return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;