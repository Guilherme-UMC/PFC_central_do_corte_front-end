import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ViaCepService from '../services/ViaCepService';
import BarbeariaService from '../services/BarbeariaService';
import '../styles/components/cadastro-barbearia.css';

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

function CadastroBarbearia({ onSuccess, onCancel, editingData }) {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        nome: editingData?.nome || '',
        descricao: editingData?.descricao || '',
        cep: editingData?.cep || '',
        logradouro: editingData?.logradouro || '',
        numero: editingData?.numero || '',
        complemento: editingData?.complemento || '',
        bairro: editingData?.bairro || '',
        cidade: editingData?.cidade || '',
        uf: editingData?.uf || '',
        telefone: editingData?.telefone || '',
        imgUrl: editingData?.imgUrl || ''
    });

    const [loadingCep, setLoadingCep] = useState(false);
    const [cepManual, setCepManual] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');

        if (numbers.length === 0) return '';
        if (numbers.length <= 2) {
            return numbers;
        }
        if (numbers.length <= 6) {
            return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
        }
        if (numbers.length <= 10) {
            return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
        }
        return `${numbers.slice(0, 2)} ${numbers.slice(2, 11)}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'telefone') {
            const formattedPhone = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, [name]: formattedPhone }));
        } else if (name === 'cep') {
            const cepFormatted = value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
            setFormData(prev => ({ ...prev, [name]: cepFormatted }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (name === 'cep') {
            const cepLimpo = value.replace(/\D/g, '');
            if (cepLimpo.length === 8 && !cepManual) {
                buscarCep(cepLimpo);
            }
        }
    };

    const buscarCep = async (cep) => {
        setLoadingCep(true);
        setError('');

        try {
            const result = await ViaCepService.buscarCep(cep);
            setLoadingCep(false);

            if (result.success) {
                setFormData(prev => ({
                    ...prev,
                    logradouro: result.data.logradouro || '',
                    bairro: result.data.bairro || '',
                    cidade: result.data.cidade || '',
                    uf: result.data.uf || ''
                }));
                setCepManual(false);
            } else {
                setError('CEP não encontrado. Preencha o endereço manualmente.');
                setCepManual(true);
            }
        } catch (error) {
            setLoadingCep(false);
            setError('Erro ao buscar CEP. Preencha o endereço manualmente.');
            setCepManual(true);
        }
    };

    const handleCepBlur = () => {
        const cepLimpo = formData.cep.replace(/\D/g, '');
        if (cepLimpo.length === 8 && !cepManual && !loadingCep) {
            buscarCep(cepLimpo);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!formData.nome || formData.nome.trim() === '') {
            setError('Nome da barbearia é obrigatório');
            setLoading(false);
            return;
        }

        const cepLimpo = formData.cep.replace(/\D/g, '');
        if (cepLimpo.length !== 8) {
            setError('CEP inválido. Digite um CEP com 8 dígitos');
            setLoading(false);
            return;
        }

        if (!formData.logradouro || formData.logradouro.trim() === '') {
            setError('Logradouro é obrigatório');
            setLoading(false);
            return;
        }

        if (!formData.numero || formData.numero.trim() === '') {
            setError('Número é obrigatório');
            setLoading(false);
            return;
        }

        if (!formData.bairro || formData.bairro.trim() === '') {
            setError('Bairro é obrigatório');
            setLoading(false);
            return;
        }

        if (!formData.cidade || formData.cidade.trim() === '') {
            setError('Cidade é obrigatória');
            setLoading(false);
            return;
        }

        if (!formData.uf || formData.uf.trim().length !== 2) {
            setError('UF é obrigatória (ex: SP, RJ, MG)');
            setLoading(false);
            return;
        }

        const telefoneNumeros = formData.telefone.replace(/\D/g, '');

        let telefoneFormatado = '';

        if (telefoneNumeros.length === 10) {
            telefoneFormatado = `${telefoneNumeros.substring(0, 2)} ${telefoneNumeros.substring(2, 10)}`;
        }
        else if (telefoneNumeros.length === 11) {
            telefoneFormatado = `${telefoneNumeros.substring(0, 2)} ${telefoneNumeros.substring(2, 11)}`;
        }
        else {
            setError(`Telefone inválido. Digite 10 ou 11 dígitos. Você digitou ${telefoneNumeros.length} dígitos.`);
            setLoading(false);
            return;
        }

        let imgUrlValue = null;
        if (formData.imgUrl && formData.imgUrl.trim() !== '') {
            const urlPattern = /^(http|https):\/\/.+/;
            if (urlPattern.test(formData.imgUrl.trim())) {
                imgUrlValue = formData.imgUrl.trim();
            } else {
                setError('URL da imagem inválida. Deve começar com http:// ou https://');
                setLoading(false);
                return;
            }
        }

        const barbeariaData = {
            nome: formData.nome.trim(),
            descricao: formData.descricao && formData.descricao.trim() !== '' ? formData.descricao.trim() : null,
            logradouro: formData.logradouro.trim(),
            numero: formData.numero.trim(),
            bairro: formData.bairro.trim(),
            cep: cepLimpo,
            cidade: formData.cidade.trim(),
            uf: formData.uf.toUpperCase().trim(),
            telefone: telefoneFormatado,
            imgUrl: imgUrlValue
        };

        try {
            let result;
            if (editingData && editingData.id) {
                result = await BarbeariaService.updateBarbearia(editingData.id, barbeariaData);
                setSuccess('Barbearia atualizada com sucesso!');
                setTimeout(() => {
                    if (onSuccess) onSuccess(result);
                }, 1500);
            } else {
                result = await BarbeariaService.criar(barbeariaData);
                if (result.success) {
                    setSuccess('Barbearia cadastrada com sucesso!');
                    setTimeout(() => {
                        if (onSuccess) onSuccess(result.data);
                    }, 1500);
                } else {
                    setError(result.message);
                    setLoading(false);
                    return;
                }
            }

            setTimeout(() => {
                if (!editingData) {
                    resetForm();
                }
            }, 2000);
        } catch (error) {
            console.error('❌ Erro detalhado:', error);
            console.error('Resposta do erro:', error.response?.data);

            let errorMessage = 'Erro ao salvar barbearia. Tente novamente.';

            if (error.response?.data) {
                const errors = error.response.data;
                const errorList = [];

                if (typeof errors === 'object') {
                    for (const [field, message] of Object.entries(errors)) {
                        errorList.push(`${field}: ${message}`);
                    }
                }

                if (errorList.length > 0) {
                    errorMessage = errorList.join(', ');
                } else if (errors.message) {
                    errorMessage = errors.message;
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nome: '',
            descricao: '',
            cep: '',
            logradouro: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            uf: '',
            telefone: '',
            imgUrl: ''
        });
        setCepManual(false);
    };

    return (
        <div className="auth-container">
            <button className="auth-back-btn" onClick={handleBackToHome}>
                <IconArrowLeft />
            </button>

            <div className="auth-card">
                <h2 className="auth-title">
                    {editingData ? 'Editar Barbearia' : 'Cadastrar Barbearia'}
                </h2>
                <p className="auth-subtitle">
                    {editingData ? 'Atualize as informações' : 'Cadastre seu estabelecimento'}
                </p>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nome da Barbearia *</label>
                        <input
                            className="form-input"
                            type="text"
                            name="nome"
                            placeholder="Nome do estabelecimento"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Descrição</label>
                        <textarea
                            className="form-input"
                            name="descricao"
                            placeholder="Descreva sua barbearia..."
                            value={formData.descricao}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">CEP *</label>
                        <div>
                            <input
                                className="form-input"
                                type="text"
                                name="cep"
                                placeholder="00000-000"
                                value={formData.cep}
                                onChange={handleChange}
                                onBlur={handleCepBlur}
                                maxLength={9}
                                required
                            />
                            {loadingCep && (
                                <span >
                                    Buscando...
                                </span>
                            )}
                            {!cepManual && formData.logradouro && !loadingCep && (
                                <span>
                                    ✓ Encontrado
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Logradouro *</label>
                        <input
                            className="form-input"
                            type="text"
                            name="logradouro"
                            placeholder="Rua, Avenida..."
                            value={formData.logradouro}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <div className="form-group">
                            <label className="form-label">Número *</label>
                            <input
                                className="form-input"
                                type="text"
                                name="numero"
                                placeholder="123"
                                value={formData.numero}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Complemento</label>
                            <input
                                className="form-input"
                                type="text"
                                name="complemento"
                                placeholder="Apto, Sala..."
                                value={formData.complemento}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Bairro *</label>
                        <input
                            className="form-input"
                            type="text"
                            name="bairro"
                            placeholder="Bairro"
                            value={formData.bairro}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div >
                        <div className="form-group">
                            <label className="form-label">Cidade *</label>
                            <input
                                className="form-input"
                                type="text"
                                name="cidade"
                                placeholder="Cidade"
                                value={formData.cidade}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">UF *</label>
                            <input
                                className="form-input"
                                type="text"
                                name="uf"
                                placeholder="SP"
                                value={formData.uf}
                                onChange={handleChange}
                                maxLength={2}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Telefone *</label>
                        <input
                            className="form-input"
                            type="tel"
                            name="telefone"
                            placeholder="(11) 99999-9999"
                            value={formData.telefone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">URL da Imagem</label>
                        <input
                            className="form-input"
                            type="url"
                            name="imgUrl"
                            placeholder="https://exemplo.com/foto.jpg"
                            value={formData.imgUrl}
                            onChange={handleChange}
                        />
                        <small>
                            Link para foto da barbearia (opcional)
                        </small>
                    </div>

                    <div className='form-actions'>
                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? 'Salvando...' : (editingData ? 'Atualizar' : 'Cadastrar')}
                        </button>
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CadastroBarbearia;