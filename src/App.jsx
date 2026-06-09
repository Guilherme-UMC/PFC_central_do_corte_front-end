import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import RootLayout from './layouts/RootLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import EsqueciSenha from './pages/EsqueciSenha';
import RedefinirSenha from './pages/RedefinirSenha';
import Signup from './pages/Signup';
import SignupBarbearia from './pages/SignupBarbearia';
import BarbeariaDetalhes from './pages/BarbeariaDetalhes';

import CadastroBarbearia from './components/CadastroBarbearia';
import ClientePage from './pages/ClientePage';
import BarbeariaPage from './pages/BarbeariaPage';
import FuncionarioPage from './pages/FuncionarioPage';
import AdminPage from './pages/AdminPage';
import Perfil from './pages/Perfil';
import DashboardPage from './pages/DashboardPage';
import AdminLogsPage from './pages/AdminLogsPage';

import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: 'barbearia/:id', element: <BarbeariaDetalhes /> },
      
      {
        element: <PublicRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: 'login', element: <Login /> },
          { path: 'signup', element: <Signup /> },
          { path: 'signup-barbearia', element: <SignupBarbearia /> },
          { path: 'esqueci-senha', element: <EsqueciSenha /> },
          { path: 'redefinir-senha', element: <RedefinirSenha /> },
          { path: 'cadastro-barbearia', element: <CadastroBarbearia /> },
        ],
      },
      
      {
        element: <PrivateRoute allowedRoles={['ROLE_CLIENTE', 'ROLE_ADMIN']} />,
        children: [
          { path: 'page/cliente', element: <ClientePage /> },
        ],
      },
      
      {
        element: <PrivateRoute allowedRoles={['ROLE_BARBEARIA_ADM', 'ROLE_ADMIN']} />,
        children: [
          { path: 'page/barbearia', element: <BarbeariaPage /> },
          { path: 'page/dashboard', element: <DashboardPage /> },
          { path: 'page/cadastro-barbearia', element: <CadastroBarbearia /> },
        ],
      },
      
      {
        element: <PrivateRoute allowedRoles={['ROLE_FUNCIONARIO', 'ROLE_ADMIN']} />,
        children: [
          { path: 'page/funcionario', element: <FuncionarioPage /> },
        ],
      },

      {
        element: <PrivateRoute allowedRoles={['ROLE_ADMIN']} />,
        children: [
          { path: 'page/admin', element: <AdminPage /> },
          { path: 'page/admin/logs', element: <AdminLogsPage /> },
        ],
      },
      
      {
        element: <PrivateRoute />,
        children: [
          { path: 'perfil', element: <Perfil /> },
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