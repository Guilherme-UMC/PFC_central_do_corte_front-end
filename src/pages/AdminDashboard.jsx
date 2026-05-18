import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AdminService from '../services/AdminService';
import BarbeariaService from '../services/BarbeariaService';
import Loader from '../components/Loader';
const IconEdit = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M17 3l4 4-7 7H10v-4l7-7z"/><path d="M4 20h16"/></svg>);
const IconTrash = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M8 6V4h8v2"/><rect x="10" y="11" width="4" height="8"/></svg>);
const IconPlus = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);

const AdminDashboard = ({ onNavigate }) => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', telefone: '', role: 'ROLE_CLIENTE' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  const carregarDados = async () => {
    setLoading(true);
    if (activeTab === 'usuarios') {
      const result = await AdminService.listarTodosUsuarios();
      if (result.success) setUsuarios(result.data);
    } else {
      const result = await BarbeariaService.listarTodas(0, 100);
      if (result.success) {
        setBarbearias(result.data?.content || result.data || []);
      }
    }
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await AdminService.criarUsuario(userForm);
    if (result.success) {
      showMessage('success', 'Usuário criado com sucesso!');
      setShowUserForm(false);
      setUserForm({ name: '', email: '', password: '', telefone: '', role: 'ROLE_CLIENTE' });
      carregarDados();
    } else {
      showMessage('error', result.message);
    }
    setSubmitting(false);
  };

  const handleToggleUserStatus = async (userId) => {
    const result = await AdminService.ativarDesativarUsuario(userId);
    if (result.success) {
      showMessage('success', 'Status do usuário alterado');
      carregarDados();
    } else {
      showMessage('error', result.message);
    }
  };

  const handleToggleBarbeariaStatus = async (barbeariaId) => {
    const result = await AdminService.ativarDesativarBarbeariaAdmin(barbeariaId);
    if (result.success) {
      showMessage('success', 'Status da barbearia alterado');
      carregarDados();
    } else {
      showMessage('error', result.message);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getRoleLabel = (role) => {
    const roles = {
      'ROLE_ADMIN': 'Administrador',
      'ROLE_BARBEARIA_ADM': 'Proprietário',
      'ROLE_FUNCIONARIO': 'Funcionário',
      'ROLE_CLIENTE': 'Cliente'
    };
    return roles[role] || role;
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-admin">
      
      <div className="dashboard-container">
        {message.text && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
            {message.text}
          </div>
        )}

        <div className="dashboard-header">
          <h1>Painel Administrativo</h1>
          <p>Bem-vindo, {user?.name}</p>
        </div>

        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>Usuários</button>
          <button className={`tab-btn ${activeTab === 'barbearias' ? 'active' : ''}`} onClick={() => setActiveTab('barbearias')}>Barbearias</button>
        </div>

        <div className="dashboard-content">
          {activeTab === 'usuarios' && (
            <div>
              <div className="section-header-actions">
                <h3>Gerenciar Usuários</h3>
                <button className="btn-primary small" onClick={() => setShowUserForm(true)}><IconPlus /> Novo Usuário</button>
              </div>

              {showUserForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Criar Novo Usuário</h3>
                    <form onSubmit={handleCreateUser}>
                      <input type="text" placeholder="Nome completo" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} required />
                      <input type="email" placeholder="Email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required />
                      <input type="password" placeholder="Senha (mínimo 6)" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required />
                      <input type="tel" placeholder="Telefone" value={userForm.telefone} onChange={e => setUserForm({...userForm, telefone: e.target.value})} />
                      <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                        <option value="ROLE_CLIENTE">Cliente</option>
                        <option value="ROLE_FUNCIONARIO">Funcionário</option>
                        <option value="ROLE_BARBEARIA_ADM">Proprietário de Barbearia</option>
                        <option value="ROLE_ADMIN">Administrador</option>
                      </select>
                      <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={() => { setShowUserForm(false); setUserForm({ name: '', email: '', password: '', telefone: '', role: 'ROLE_CLIENTE' }); }}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Criando...' : 'Criar'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="usuarios-table">
                <table>
                  <thead>
                    <tr><th>Nome</th><th>Email</th><th>Telefone</th><th>Role</th><th>Status</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => (
                      <tr key={u.id}>
                        <td>{u.name}</td><td>{u.email}</td><td>{u.telefone || '-'}</td>
                        <td>{getRoleLabel(u.role)}</td>
                        <td><span className={u.active ? 'status-active' : 'status-inactive'}>{u.active ? 'Ativo' : 'Inativo'}</span></td>
                        <td>
                          <button className="btn-secondary small" onClick={() => handleToggleUserStatus(u.id)}>Alternar Status</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'barbearias' && (
            <div>
              <h3>Gerenciar Barbearias</h3>
              <div className="barbearias-table">
                <table>
                  <thead>
                    <tr><th>Nome</th><th>Endereço</th><th>Telefone</th><th>Proprietário</th><th>Status</th><th>Ações</th></tr>
                  </thead>
                  <tbody>
                    {barbearias.map(b => (
                      <tr key={b.id}>
                        <td>{b.nome}</td><td>{b.logradouro}, {b.numero} - {b.cidade}/{b.uf}</td>
                        <td>{b.telefone}</td><td>{b.ownerName || '-'}</td>
                        <td><span className={b.ativo ? 'status-active' : 'status-inactive'}>{b.ativo ? 'Ativa' : 'Inativa'}</span></td>
                        <td>
                          <button className="btn-secondary small" onClick={() => handleToggleBarbeariaStatus(b.id)}>Alternar Status</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default AdminDashboard;