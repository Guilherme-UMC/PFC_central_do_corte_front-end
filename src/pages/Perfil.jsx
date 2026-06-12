import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import UsuarioService from '../services/UsuarioService';
import Loader from '../components/Loader';
import PasswordInput from '../components/PasswordInput';
import '../styles/pages/perfil.css';
import { useNavigate } from 'react-router-dom';
import AdminService from '../services/AdminService';

const Perfil = ({ onNavigate }) => {
  const { user, logout } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', telefone: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    setLoading(true);
    const result = await UsuarioService.getProfile(user?.id);
    if (result.success) {
      setProfile(result.data);
      setFormData({
        name: result.data.name,
        email: result.data.email,
        telefone: result.data.telefone || ''
      });
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await UsuarioService.updateProfile(user?.id, formData);
    if (result.success) {
      setProfile(result.data);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.name = result.data.name;
      localStorage.setItem('user', JSON.stringify(storedUser));
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setEditing(false);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
    setSubmitting(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As novas senhas não coincidem' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setSubmitting(true);
    const result = await UsuarioService.changePassword(user?.id, passwordData.oldPassword, passwordData.newPassword);

    if (result.success) {
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setSubmitting(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const getRoleLabel = (role) => {
    const roles = {
      'ROLE_ADMIN': 'Administrador',
      'ROLE_BARBEARIA_ADM': 'Proprietário de Barbearia',
      'ROLE_FUNCIONARIO': 'Funcionário',
      'ROLE_CLIENTE': 'Cliente'
    };
    return roles[role] || role;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Função para excluir conta (inativa e depois remove)
  const handleExcluirConta = async () => {
    setDeleting(true);
    setMessage({ type: '', text: '' });

    try {
      // PASSO 1: Verificar se o usuário está ativo
      if (profile?.active) {
        setMessage({ type: 'info', text: 'Inativando conta...' });

        // Inativar o usuário primeiro
        const inativarResult = await AdminService.ativarDesativarUsuario(user?.id);

        if (!inativarResult.success) {
          throw new Error(inativarResult.message || 'Erro ao inativar conta');
        }

        setMessage({ type: 'info', text: 'Conta inativada. Removendo permanentemente...' });

        // Pequeno delay para garantir que a inativação foi processada
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // PASSO 2: Remover permanentemente o usuário
      const removerResult = await AdminService.deletarUsuario(user?.id);

      if (!removerResult.success) {
        throw new Error(removerResult.message || 'Erro ao remover conta');
      }

      // Sucesso - fazer logout e redirecionar
      setMessage({ type: 'success', text: 'Sua conta foi excluída permanentemente com sucesso!' });

      setTimeout(() => {
        logout();
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      setMessage({ type: 'error', text: error.message || 'Erro ao excluir conta. Tente novamente mais tarde.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setDeleting(false);
      setShowConfirmModal(false);
    }
  };

  // Abrir modal de confirmação
  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  if (loading) return <Loader />;

  return (
    <div className="perfil-page">
      <div className="page-container">
        <div className="page-header">
          <h1>Meu Perfil</h1>
          <p>Gerencie suas informações</p>
        </div>

        {message.text && (
          <div className={`message ${message.type === 'success' ? 'success-message' : 'error-message'}`}>
            {message.text}
          </div>
        )}

        <div className="perfil-content">

          <div className="perfil-card">
            <div className="card-header">
              <h3>Informações Pessoais</h3>
              {!editing && (
                <button className="btn-secondary small" onClick={() => setEditing(true)}>
                  Editar
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input className="form-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input className="form-input"
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-danger" onClick={() => { setEditing(false); carregarPerfil(); }}>Cancelar</button>
                  <button type="submit" className="btn-concluir" disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <p><strong>Nome:</strong> {profile?.name}</p>
                <p><strong>Email:</strong> {profile?.email}</p>
                <p><strong>Telefone:</strong> {profile?.telefone || 'Não informado'}</p>
                <p><strong>Função:</strong> {getRoleLabel(profile?.role)}</p>
                <p><strong>Status:</strong> <span className={profile?.active ? 'status-active' : 'status-inactive'}>{profile?.active ? 'Ativo' : 'Inativo'}</span></p>
              </div>
            )}
          </div>


          <div className="perfil-card">
            <h3>Alterar Senha</h3>
            <br />
            <form onSubmit={handleChangePassword}>
              <PasswordInput
                id="oldPassword"
                name="oldPassword"
                label="Senha Atual"
                placeholder="Digite sua senha atual"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                required
              />

              <PasswordInput
                id="newPassword"
                name="newPassword"
                label="Nova Senha"
                placeholder="Mínimo 6 caracteres"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar Nova Senha"
                placeholder="Repita a nova senha"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />

              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </form>
          </div>
          {/* Botão de Excluir Conta */}
          <div className="delete-account-section">
            <button
              className="btn-excluir-conta"
              onClick={openConfirmModal}
              disabled={deleting}
            >
              {deleting ? 'Processando...' : ' Excluir Conta'}
            </button>
            <p className="delete-note">
              Esta ação é irreversível. Sua conta será desativada e todos os seus dados serão anonimizados.
            </p>
          </div>
        </div>
      </div>
      {/* Modal de Confirmação de Exclusão */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3> Atenção!</h3>
            <p className="confirm-message-delete">
              <strong>Tem certeza que deseja EXCLUIR PERMANENTEMENTE sua conta?</strong>
              <br /><br />
              Esta ação irá:
              <br />
              Inativar sua conta imediatamente
              <br />
              Anonimizar todos os seus dados pessoais
              <br />
              Cancelar todos os seus agendamentos futuros
              <br />
              Impedir qualquer acesso futuro à plataforma
              <br /><br />
              <strong>Esta ação é IRREVERSÍVEL e não poderá ser desfeita!</strong>
            </p>

            <div className="modal-actions">
              <button className="btn-cancelar" onClick={() => setShowConfirmModal(false)} disabled={deleting}>
                Cancelar
              </button>
              <button
                className="btn-excluir-modal"
                onClick={handleExcluirConta}
                disabled={deleting}
              >
                {deleting ? 'Processando...' : 'Sim, quero excluir minha conta'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Perfil;