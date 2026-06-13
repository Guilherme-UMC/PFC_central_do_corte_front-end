export const CATEGORIAS_SERVICO = [
    { value: 'CORTE', label: 'Corte de Cabelo' },
    { value: 'BARBA', label: 'Barba' },
    { value: 'CABELO_E_BARBA', label: 'Cabelo e Barba' },
    { value: 'QUIMICA', label: 'Química' },
    { value: 'TINTURA', label: 'Tintura e Coloração' },
    { value: 'SOBRANCELHA', label: 'Sobrancelha' },
    { value: 'OUTROS', label: 'Outros Serviços' }
];

export const getCategoriaByValue = (value) => {
    return CATEGORIAS_SERVICO.find(c => c.value === value) || CATEGORIAS_SERVICO[CATEGORIAS_SERVICO.length - 1];
};

export const getCategoriaLabel = (value) => {
    if (!value) return 'Outros Serviços';
    const categoria = CATEGORIAS_SERVICO.find(c => c.value === value);
    return categoria ? categoria.label : value;
};

export const getCategoriaValueByLabel = (label) => {
    const categoria = CATEGORIAS_SERVICO.find(c => c.label === label);
    return categoria ? categoria.value : 'OUTROS';
};