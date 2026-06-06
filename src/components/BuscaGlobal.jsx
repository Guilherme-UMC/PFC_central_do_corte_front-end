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

const IconCorte = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-scissors-icon lucide-scissors"><circle cx="6" cy="6" r="3" /><path d="M8.12 8.12 12 12" /><path d="M20 4 8.12 15.88" /><circle cx="6" cy="18" r="3" /><path d="M14.8 14.8 20 20" /></svg>)
const IconTelefone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" /></svg>
)

const IconLocal = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>)

const IconBarber = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-store-icon lucide-store"><path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" /><path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244" /><path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" /></svg>)


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
                    {resultados?.tipo === 'cep' && ''}
                    {resultados?.tipo === 'localizacao' && ''}
                    {resultados?.tipo === 'nome' && ''}
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
                                <strong><IconLocal/> Endereço do CEP:</strong>
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
                                    <div className="busca-item-icon"><IconCorte/></div>
                                    <div className="busca-item-content">
                                        <div className="busca-item-title">{item.nome}</div>
                                        <div className="busca-item-subtitle">
                                            {item.logradouro}, {item.numero} - {item.bairro}
                                        </div>
                                        <div className="busca-item-subtitle">
                                            {item.cidade} - {item.uf} | <IconTelefone/> {item.telefone}
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