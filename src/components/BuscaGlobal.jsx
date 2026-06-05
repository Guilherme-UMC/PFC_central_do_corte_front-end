import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BuscaService from '../services/BuscaService';
import { debounce } from '../utils/helpers';
import '../styles/components/busca-global.css';

const IconSearch = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const BuscaGlobal = ({ termo, onClose, isOpen, onNavigate }) => {
    const [resultados, setResultados] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const realizarBusca = useCallback(
        debounce(async (query) => {
            if (!query || query.length < 2) {
                setResultados(null);
                return;
            }

            setLoading(true);
            const result = await BuscaService.buscar(query);
            
            if (result.success) {
                let resultadosFormatados = {};

                if (result.tipo === 'cep') {
                    resultadosFormatados = {
                        barbearias: result.data.barbearias || [],
                        tipo: 'cep',
                        endereco: result.data.endereco_do_cep,
                        mensagem: result.data.mensagem,
                        totalResultados: (result.data.barbearias || []).length
                    };
                } else if (result.tipo === 'localizacao') {
                    resultadosFormatados = {
                        barbearias: result.data.barbearias || [],
                        tipo: 'localizacao',
                        totalResultados: (result.data.barbearias || []).length
                    };
                } else {
                    resultadosFormatados = {
                        barbearias: result.data.barbearias || [],
                        tipo: result.tipo || 'nome',
                        totalResultados: (result.data.barbearias || []).length
                    };
                }
                
                setResultados(resultadosFormatados);
            } else {
                setResultados(null);
            }
            setLoading(false);
        }, 500),
        []
    );

    useEffect(() => {
        if (termo && isOpen) {
            realizarBusca(termo);
        } else {
            setResultados(null);
        }
    }, [termo, isOpen, realizarBusca]);

    const handleItemClick = (item) => {
        onClose();
        if (item.link) {
            navigate(item.link);
        } else if (onNavigate) {
            onNavigate(item.link);
        }
    };

    if (!isOpen || !termo || termo.length < 2) return null;

    const total = resultados?.totalResultados || 0;
    const isLoading = loading;

    return (
        <div className="busca-dropdown">
            <div className="busca-dropdown-header">
                <IconSearch />
                <span>
                    {resultados?.tipo === 'cep' && '📍 '}
                    {resultados?.tipo === 'localizacao' && '🏙️ '}
                    {resultados?.tipo === 'nome' && '✂️ '}
                    {isLoading ? 'Buscando...' : `${total} resultado${total !== 1 ? 's' : ''} para "${termo}"`}
                </span>
            </div>

            {isLoading ? (
                <div className="busca-loading">Carregando resultados...</div>
            ) : (
                <>
                    {/* Seção de informação de CEP */}
                    {resultados?.tipo === 'cep' && resultados.endereco && (
                        <div className="busca-cep-info">
                            <div className="busca-cep-endereco">
                                <strong>📍 Endereço do CEP:</strong>
                                <span>{resultados.endereco.logradouro || '—'}, {resultados.endereco.bairro || '—'}</span>
                                <span>{resultados.endereco.cidade} - {resultados.endereco.uf}</span>
                            </div>
                            {resultados.mensagem && (
                                <div className="busca-cep-mensagem">{resultados.mensagem}</div>
                            )}
                        </div>
                    )}

                    {/* Seção de barbearias */}
                    {resultados?.barbearias?.length > 0 ? (
                        <div className="busca-section">
                            <h4>Barbearias encontradas</h4>
                            {resultados.barbearias.map(item => (
                                <div 
                                    key={item.id} 
                                    className="busca-item" 
                                    onClick={() => handleItemClick({ ...item, link: `/barbearia/${item.id}` })}
                                >
                                    <div className="busca-item-icon">✂️</div>
                                    <div className="busca-item-content">
                                        <div className="busca-item-title">{item.nome}</div>
                                        <div className="busca-item-subtitle">
                                            {item.logradouro}, {item.numero} - {item.bairro}
                                        </div>
                                        <div className="busca-item-subtitle">
                                            {item.cidade} - {item.uf} | 📞 {item.telefone}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isLoading && (
                            <div className="busca-empty">
                                <p>Nenhuma barbearia encontrada para "{termo}".</p>
                                <p className="busca-empty-suggestion">
                                    {resultados?.tipo === 'cep' 
                                        ? 'Tente um CEP diferente ou busque por cidade.'
                                        : 'Tente digitar o nome da barbearia ou cidade.'}
                                </p>
                            </div>
                        )
                    )}
                </>
            )}
        </div>
    );
};
   
export default BuscaGlobal;