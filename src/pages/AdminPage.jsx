import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import AdminService from '../services/AdminService';
import BarbeariaService from '../services/BarbeariaService';
import Loader from '../components/Loader';
import '../styles/pages/admin.css';
import PasswordInput from '../components/PasswordInput';

const IconEdit = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M17 3l4 4-7 7H10v-4l7-7z" /><path d="M4 20h16" /></svg>);
const IconTrash = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6" /><path d="M8 6V4h8v2" /><rect x="10" y="11" width="4" height="8" /></svg>);
const IconPlus = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
const IconLogs = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M4 4h16v16H4z" /><line x1="8" y1="8" x2="16" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="8" y1="16" x2="12" y2="16" /></svg>);

const AdminPage = ({ onNavigate }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [userFilter, setUserFilter] = useState('todos');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 0, totalElements: 0 });
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', telefone: '', role: 'ROLE_CLIENTE' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);

  const carregarUsuarios = useCallback(async () => {
    setLoading(true);
    try {
      let statusParam = null;
      if (userFilter === 'ativos') statusParam = true;
      if (userFilter === 'inativos') statusParam = false;

      let roleParam = roleFilter !== 'todos' ? roleFilter : null;


      let searchParam = searchTerm || null;
      if (searchParam && searchParam.trim() !== '') {

        searchParam = searchParam.trim();
      }
      const result = await AdminService.listarTodosUsuarios(
        pagination.page,
        pagination.size,
        statusParam,
        roleParam,
        searchParam
      );

      if (result.success) {
        setUsuarios(result.data.content);
        setPagination(prev => ({
          ...prev,
          totalPages: result.data.totalPages,
          totalElements: result.data.totalElements
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, userFilter, roleFilter, searchTerm]);

  const carregarBarbearias = async () => {
    setLoading(true);
    const result = await AdminService.listarTodasBarbeariasAdmin(pagination.page, 100);
    if (result.success) {
      const data = result.data;
      setBarbearias(data.content || data || []);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0
      }));
    }
    setLoading(false);
  };
  useEffect(() => {
    if (activeTab === 'usuarios') {
      carregarUsuarios();
    } else {
      carregarBarbearias();
    }
  }, [activeTab, pagination.page, userFilter, roleFilter, searchTerm, carregarUsuarios]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await AdminService.criarUsuario(userForm);
    if (result.success) {
      showMessage('success', 'Usuário criado com sucesso!');
      setShowUserForm(false);
      setUserForm({ name: '', email: '', password: '', telefone: '', role: 'ROLE_CLIENTE' });
      carregarUsuarios();
    } else {
      showMessage('error', result.message);
    }
    setSubmitting(false);
  };

  const openConfirmModal = (usuario, type) => {
    setSelectedUser(usuario);
    setActionType(type);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    let result;
    if (actionType === 'toggle') {
      result = await AdminService.ativarDesativarUsuario(selectedUser.id);
    } else if (actionType === 'delete') {
      result = await AdminService.deletarUsuario(selectedUser.id);
    }

    setShowConfirmModal(false);

    if (result.success) {
      showMessage('success', result.message);
      carregarUsuarios();
    } else {
      showMessage('error', result.message);
    }

    setSelectedUser(null);
    setActionType(null);
  };

  const handleToggleBarbeariaStatus = async (barbeariaId) => {
    const result = await AdminService.ativarDesativarBarbeariaAdmin(barbeariaId);
    if (result.success) {
      showMessage('success', 'Status da barbearia alterado');
      carregarBarbearias();
    } else {
      showMessage('error', result.message);
    }
  };

  const handleNavigateToLogs = () => {
    navigate('/page/admin/logs');
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

  if (loading && usuarios.length === 0 && barbearias.length === 0) return <Loader />;

  return (
    <div className="page-admin">
      <div className="page-container">
        {message.text && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
            {message.text}
          </div>
        )}

        <div className="page-header">
          <h1>Painel Administrativo</h1>
          <p>Bem-vindo, {user?.name}</p>
        </div>

        <div className="admin-actions-bar">
          <button className="btn-logs" onClick={handleNavigateToLogs}>
            <IconLogs /> Logs do Sistema
          </button>
        </div>

        <div className="page-tabs">
          <button
            className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
            onClick={() => { setActiveTab('usuarios'); setPagination(prev => ({ ...prev, page: 0 })); }}
          >
            Usuários
          </button>
          <button
            className={`tab-btn ${activeTab === 'barbearias' ? 'active' : ''}`}
            onClick={() => setActiveTab('barbearias')}
          >
            Barbearias
          </button>
        </div>

        <div className="page-content">
          {activeTab === 'usuarios' && (
            <div>
              <div className="section-header-actions">
                <h3>Gerenciar Usuários</h3>

                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Buscar por nome"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  <button className="btn-clear" onClick={() => setSearchTerm('')}>Limpar</button>
                  <button className="btn-user" onClick={() => setShowUserForm(true)}>
                    <IconPlus /> Novo Usuário
                  </button>
                </div>
              </div>

              <div className="filter-buttons">
                <button
                  className={`filter-btn ${userFilter === 'todos' ? 'active' : ''}`}
                  onClick={() => { setUserFilter('todos'); setPagination(prev => ({ ...prev, page: 0 })); }}
                >
                  Todos
                </button>
                <button
                  className={`filter-btn ${userFilter === 'ativos' ? 'active' : ''}`}
                  onClick={() => { setUserFilter('ativos'); setPagination(prev => ({ ...prev, page: 0 })); }}
                >
                  Ativos
                </button>
                <button
                  className={`filter-btn ${userFilter === 'inativos' ? 'active' : ''}`}
                  onClick={() => { setUserFilter('inativos'); setPagination(prev => ({ ...prev, page: 0 })); }}
                >
                  Inativos
                </button>
              </div>

              <div className="filter-buttons role-filters">
                <button
                  className={`filter-btn ${roleFilter === 'todos' ? 'active' : ''}`}
                  onClick={() => { setRoleFilter('todos'); setPagination(prev => ({ ...prev, page: 0 })); }}
                >
                  Todas as funções
                </button>
                <button
                  className={`filter-btn ${roleFilter === 'ROLE_CLIENTE' ? 'active' : ''}`}
                  onClick={() => { setRoleFilter('ROLE_CLIENTE'); setPagination(prev => ({ ...prev, page: 0 })); }}
                >
                  Clientes
                </button>
                <button
                  className={`filter-btn ${roleFilter === 'ROLE_FUNCIONARIO' ? 'active' : ''}`}
                  onClick={() => { setRoleFilter('ROLE_FUNCIONARIO'); setPagination(prev => ({ ...prev, page: 0 })); }}
                >
                  Funcionários
                </button>
                <button
                  className={`filter-btn ${roleFilter === 'ROLE_BARBEARIA_ADM' ? 'active' : ''}`}
                  onClick={() => { setRoleFilter('ROLE_BARBEARIA_ADM'); setPagination(prev => ({ ...prev, page: 0 })); }}
                >
                  Proprietários
                </button>
                <button
                  className={`filter-btn ${roleFilter === 'ROLE_ADMIN' ? 'active' : ''}`}
                  onClick={() => { setRoleFilter('ROLE_ADMIN'); setPagination(prev => ({ ...prev, page: 0 })); }}
                >
                  Administradores
                </button>
              </div>

              {showUserForm && (
                <div className="modal-overlay2">
                  <div className="modal-content2">
                    <h3>Criar Novo Usuário</h3>
                    <form className="form" onSubmit={handleCreateUser}>
                      <label className="form-label">Nome Completo</label>
                      <input className="form-input" type="text" placeholder="Nome completo" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />

                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" placeholder="Email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />

                      <PasswordInput
                        name="password"
                        label="Senha"
                        placeholder="Mínimo 6 caracteres"
                        value={userForm.password}
                        onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                        required
                      />

                      <label className="form-label">Telefone</label>
                      <input className="form-input" type="tel" placeholder="Telefone" value={userForm.telefone} onChange={e => setUserForm({ ...userForm, telefone: e.target.value })} />

                      <label className="form-label">Função</label>
                      <select className="form-select" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                        <option value="ROLE_CLIENTE">Cliente</option>
                        <option value="ROLE_FUNCIONARIO">Funcionário</option>
                        <option value="ROLE_BARBEARIA_ADM">Proprietário de Barbearia</option>
                        <option value="ROLE_ADMIN">Administrador</option>
                      </select>

                      <div className="modal-actions">
                        <button type="button" className="btn-danger" onClick={() => { setShowUserForm(false); setUserForm({ name: '', email: '', password: '', telefone: '', role: 'ROLE_CLIENTE' }); }}>Cancelar</button>
                        <button type="submit" className="btn-concluir" disabled={submitting}>{submitting ? 'Criando...' : 'Criar'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="usuarios-table">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nome</th>

                      <th>Role</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => {
                      const isRemovido = u.id?.startsWith('removido_');
                      return (
                        <tr key={u.id}>
                          <td>{u.name}</td>

                          <td>{getRoleLabel(u.role)}</td>
                          <td>
                            <span className={u.active ? 'status-active' : 'status-inactive'}>
                              {u.active ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="table-actions">
                            {!isRemovido && (
                              <>
                                <button
                                  className={`btn-action ${u.active ? 'btn-warning' : 'btn-success'}`}
                                  onClick={() => openConfirmModal(u, 'toggle')}
                                  title={u.active ? 'Inativar usuário' : 'Reativar usuário'}
                                >
                                  {u.active ? 'Inativar' : 'Reativar'}
                                </button>

                                {user?.id !== u.id && (
                                  <button
                                    className="btn-action btn-danger"
                                    onClick={() => openConfirmModal(u, 'delete')}
                                    title="Remover usuário"
                                  >
                                    Remover
                                  </button>
                                )}
                              </>
                            )}
                            {isRemovido && (
                              <span className="badge-removido">Removido</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {pagination.page + 1} de {pagination.totalPages} ({pagination.totalElements} usuários)
                  </span>
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page + 1 >= pagination.totalPages}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'barbearias' && (
            <div>
              <h3>Gerenciar Barbearias</h3>
              <div className="barbearias-table">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Endereço</th>
                      <th>Telefone</th>
                      <th>Proprietário</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {barbearias.map(b => (
                      <tr key={b.id}>
                        <td>{b.nome}</td>
                        <td>{b.logradouro}, {b.numero} - {b.cidade}/{b.uf}</td>
                        <td>{b.telefone}</td>
                        <td>{b.ownerName || '-'}</td>
                        <td>
                          <span className={b.ativo ? 'status-active' : 'status-inactive'}>
                            {b.ativo ? 'Ativa' : 'Inativa'}
                          </span>
                        </td>
                        <td className="table-actions">
                          <button
                            className="btn-action btn-cancelar"
                            onClick={() => handleToggleBarbeariaStatus(b.id)}
                          >
                            Alternar Status
                          </button>
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

      {showConfirmModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Confirmar Ação</h3>
            <div className="confirm-info">
              <p><strong>Usuário:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Função:</strong> {getRoleLabel(selectedUser.role)}</p>
              <p><strong>Status atual:</strong> {selectedUser.active ? 'Ativo' : 'Inativo'}</p>
            </div>

            <p className="confirm-message">
              {actionType === 'toggle'
                ? selectedUser.active
                  ? 'Tem certeza que deseja INATIVAR este usuário? Ele perderá acesso ao sistema.'
                  : 'Tem certeza que deseja REATIVAR este usuário?'
                : 'Tem certeza que deseja REMOVER este usuário? Esta ação é irreversível.'
              }
            </p>

            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </button>
              <button
                className={actionType === 'delete' ? 'btn-danger' : 'btn-warning'}
                onClick={handleConfirmAction}
              >
                {actionType === 'toggle'
                  ? (selectedUser.active ? 'Inativar' : 'Reativar')
                  : 'Remover'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-actions-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1.5rem;
        }
        
        .btn-logs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid var(--corte-border);
          border-radius: 8px;
          color: var(--corte-text);
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }
        
        .btn-logs:hover {
          border-color: var(--corte-gold);
          transform: translateY(-1px);
        }
        
        .badge-removido {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background: #c62828;
          color: white;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .admin-table th,
        .admin-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid var(--corte-border);
        }
        
        .admin-table th {
          background: rgba(0, 0, 0, 0.2);
          font-weight: 600;
          color: var(--corte-text-muted);
        }
        
        .table-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .btn-action {
          padding: 4px 8px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        
        .btn-warning {
          background: #e67e22;
          color: white;
        }
        
        .btn-success {
          background: #2e7d32;
          color: white;
        }
        
        .btn-danger {
          background: #c62828;
          color: white;
        }
        
        .btn-cancelar {
          background: #c62828;
          color: white;
        }
        
        .btn-action:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }
        
        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .filter-btn {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--corte-border);
          border-radius: 20px;
          color: var(--corte-text-muted);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .filter-btn.active {
          background: var(--corte-gold);
          color: #0f0f0f;
          border-color: var(--corte-gold);
        }
        
        .search-bar {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .search-input {
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--corte-border);
          border-radius: 6px;
          color: var(--corte-text);
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 20px;
          align-items: center;
        }
        
        .pagination-btn {
          padding: 6px 12px;
          background: var(--corte-gold);
          border: none;
          border-radius: 6px;
          color: #0f0f0f;
          cursor: pointer;
        }
        
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
