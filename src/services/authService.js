import api from './api';

class AuthService {
    async login(email, password) {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken); 
                localStorage.setItem('user', JSON.stringify({
                    id: response.data.userId,
                    name: response.data.name,
                    role: response.data.role,
                    email: email
                }));
            }
            
            return response.data;
        } catch (error) {
            throw error;
        }
    }
  
    async signup(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return { 
                success: true, 
                data: response.data,
                email: userData.email
            };
        } catch (error) {
            throw error;
        }
    }

    async signup_ADM_BARBEARIA(userData) {
        try {
            const response = await api.post('/auth/register/barbearia', userData);
            return { 
                success: true, 
                data: response.data,
                email: userData.email
            };
        } catch (error) {
            throw error;
        }
    }

    async confirmarEmail(token) {
        try {
            const response = await api.post('/auth/confirmar-email', null, {
                params: { token }
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.response?.data?.mensagem || 'Erro ao confirmar e-mail'
            };
        }
    }

    async reenviarConfirmacao(email) {
        try {
            const response = await api.post('/auth/reenviar-confirmacao', null, {
                params: { email }
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.response?.data?.mensagem || 'Erro ao reenviar e-mail de confirmação'
            };
        }
    }
    
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('pendingConfirmationEmail');
    }
    
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    
    getToken() {
        return localStorage.getItem('token');
    }
    
    isAuthenticated() {
        return !!this.getToken();
    }
    
    getUserRole() {
        const user = this.getCurrentUser();
        return user?.role || null;
    }
    
    isBarbeariaAdm() {
        return this.getUserRole() === 'ROLE_BARBEARIA_ADM';
    }
    
    isCliente() {
        return this.getUserRole() === 'ROLE_CLIENTE';
    }
    
    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');
            
            const response = await api.post('/auth/refresh-token', null, {
                headers: { Authorization: `Bearer ${refreshToken}` }
            });
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.refreshToken);
                }
            }
            
            return response.data;
        } catch (error) {
            this.logout();
            throw error;
        }
    }
}

export default new AuthService();