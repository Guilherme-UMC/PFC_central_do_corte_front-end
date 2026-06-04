import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import AdminService from '../services/AdminService';
import BarbeariaService from '../services/BarbeariaService';
import Loader from '../components/Loader';

const IconEdit = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M17 3l4 4-7 7H10v-4l7-7z" /><path d="M4 20h16" /></svg>);
const IconTrash = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6" /><path d="M8 6V4h8v2" /><rect x="10" y="11" width="4" height="8" /></svg>);
const IconPlus = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);

const AdminPage = ({ onNavigate }) => {
  const { user } = useAuthContext();
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

      const result = await AdminService.listarTodosUsuarios(
        pagination.page,
        pagination.size,
        statusParam,
        roleParam,
        searchTerm || null
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
    const result = await BarbeariaService.listarTodas(pagination.page, 100);
    if (result.success) {
      const data = result.data;
      setBarbearias(data.content || data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'usuarios') {
      carregarUsuarios();
    } else {
      carregarBarbearias();
    }
  }, [activeTab, pagination.page, userFilter, roleFilter, searchTerm]);

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

        <div className="page-tabs">
          <button className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => { setActiveTab('usuarios'); setPagination(prev => ({ ...prev, page: 0 })); }}>Usuários</button>
          <button className={`tab-btn ${activeTab === 'barbearias' ? 'active' : ''}`} onClick={() => setActiveTab('barbearias')}>Barbearias</button>
        </div>

        <div className="page-content">
          {activeTab === 'usuarios' && (
            <div>
              <div className="section-header-actions">
                <h3>Gerenciar Usuários</h3>
                <button className="btn-primary small" onClick={() => setShowUserForm(true)}>
                  <IconPlus /> Novo Usuário
                </button>
              </div>

              {/* Barra de busca */}
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Buscar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button className="btn-clear" onClick={() => setSearchTerm('')}>Limpar</button>
              </div>

              {/* Filtros */}
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

              {/* Filtro por role */}
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
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h3>Criar Novo Usuário</h3>
                    <form onSubmit={handleCreateUser}>
                      <input type="text" placeholder="Nome completo" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
                      <input type="email" placeholder="Email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
                      <input type="password" placeholder="Senha (mínimo 6)" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required />
                      <input type="tel" placeholder="Telefone" value={userForm.telefone} onChange={e => setUserForm({ ...userForm, telefone: e.target.value })} />
                      <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
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
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map(u => {
                      const isRemovido = u.email?.startsWith('removido_');
                      return (
                        <tr key={u.id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.telefone || '-'}</td>
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

                            {isRemovido & (
                              <span className='badeg-removido'>Removido</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
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
                <table>
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
                            className="btn-action btn-warning"
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

      {/* Modal de Confirmação */}
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
              <button className="btn-secondary" onClick={() => setShowConfirmModal(false)}>
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
        .search-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }
        
        .search-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid var(--corte-border);
          border-radius: 8px;
          background: var(--corte-surface);
          color: var(--corte-text);
        }
        
        .btn-clear {
          padding: 8px 16px;
          background: var(--corte-surface);
          border: 1px solid var(--corte-border);
          border-radius: 8px;
          color: var(--corte-text-muted);
          cursor: pointer;
        }
        
        .filter-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .role-filters {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid var(--corte-border);
        }
        
        .filter-btn {
          background: var(--corte-surface);
          border: 1px solid var(--corte-border);
          color: var(--corte-text-muted);
          padding: 6px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }
        
        .filter-btn:hover {
          border-color: var(--corte-gold);
          color: var(--corte-gold);
        }
        
        .filter-btn.active {
          background: var(--corte-gold);
          border-color: var(--corte-gold);
          color: #0f0f0f;
        }
        
        .table-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .btn-action {
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        .btn-success {
          background: #2e7d32;
          color: white;
        }
        
        .btn-warning {
          background: #ed6c02;
          color: white;
        }
        
        .btn-danger {
          background: #d32f2f;
          color: white;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--corte-border);
        }
        
        .pagination-btn {
          padding: 6px 12px;
          background: var(--corte-surface);
          border: 1px solid var(--corte-border);
          border-radius: 6px;
          color: var(--corte-text);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .pagination-btn:hover:not(:disabled) {
          border-color: var(--corte-gold);
          color: var(--corte-gold);
        }
        
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-info {
          color: var(--corte-text-muted);
          font-size: 14px;
        }
        
        .confirm-modal {
          max-width: 450px;
        }
        
        .confirm-info {
          background: var(--corte-bg-tertiary);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .confirm-info p {
          margin: 4px 0;
          font-size: 13px;
        }
        
        .confirm-message {
          margin-bottom: 20px;
          padding: 12px;
          background: rgba(237, 108, 2, 0.1);
          border-radius: 8px;
          color: var(--corte-gold);
          font-weight: 500;
        }
        
        .status-active {
          color: #4caf50;
          font-weight: 600;
        }
        
        .status-inactive {
          color: #f44336;
          font-weight: 600;
        }

        .badge-removido {
  background: #555;
  color: #ccc;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}
      `}</style>
    </div>
  );
};

export default AdminPage;