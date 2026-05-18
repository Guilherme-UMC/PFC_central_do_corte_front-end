import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';


import RootLayout from './layouts/RootLayout';


import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupBarbearia from './pages/SignupBarbearia';


import CadastroBarbearia from './components/CadastroBarbearia';
import ClienteDashboard from './pages/ClienteDashboard';
import BarbeariaDashboard from './pages/BarbeariaDashboard';
import FuncionarioDashboard from './pages/FuncionarioDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Perfil from './pages/Perfil';


import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      
      {
        element: <PublicRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: 'login', element: <Login /> },
          { path: 'signup', element: <Signup /> },
          { path: 'signup-barbearia', element: <SignupBarbearia /> },
        ],
      },
      
      {
        path: 'dashboard',
        element: <PrivateRoute allowedRoles={['ROLE_CLIENTE', 'ROLE_ADMIN']} />,
        children: [
          { path: 'cliente', element: <ClienteDashboard /> },
        ],
      },
      
      {
        path: 'dashboard',
        element: <PrivateRoute allowedRoles={['ROLE_BARBEARIA_ADM', 'ROLE_ADMIN']} />,
        children: [
          { path: 'barbearia', element: <BarbeariaDashboard /> },
          { path: 'cadastro-barbearia', element: <CadastroBarbearia /> },
        ],
      },
      
      {
        path: 'dashboard',
        element: <PrivateRoute allowedRoles={['ROLE_FUNCIONARIO', 'ROLE_ADMIN']} />,
        children: [
          { path: 'funcionario', element: <FuncionarioDashboard /> },
        ],
      },

      {
        path: 'dashboard',
        element: <PrivateRoute allowedRoles={['ROLE_ADMIN']} />,
        children: [
          { path: 'admin', element: <AdminDashboard /> },
        ],
      },
      
      {
        path: 'perfil',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <Perfil /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;