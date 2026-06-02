export const formatarDataHora = (dataISO) => {
    if (!dataISO) return '—';
    try {
        const data = new Date(dataISO);
        if (isNaN(data.getTime())) return '—';
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return '—';
    }
};

export const formatarData = (dataISO) => {
    if (!dataISO) return '—';
    try {
        const data = new Date(dataISO);
        if (isNaN(data.getTime())) return '—';
        return data.toLocaleDateString('pt-BR');
    } catch {
        return '—';
    }
};

export const formatarHora = (dataISO) => {
    if (!dataISO) return '—';
    try {
        const data = new Date(dataISO);
        if (isNaN(data.getTime())) return '—';
        return data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return '—';
    }
};
export const formatarDataHoraCurta = (dataISO) => {
    if (!dataISO) return '—';
    try {
        const data = new Date(dataISO);
        if (isNaN(data.getTime())) return '—';
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = String(data.getFullYear()).slice(-2);
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    } catch {
        return '—';
    }
};

export const formatarDataAtual = () => {
    const hoje = new Date();
    return hoje.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export const getDataAtualInput = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

export const isHoje = (dataISO) => {
    if (!dataISO) return false;
    try {
        const data = new Date(dataISO);
        const hoje = new Date();
        return data.toDateString() === hoje.toDateString();
    } catch {
        return false;
    }
};

export const isFuturo = (dataISO) => {
    if (!dataISO) return false;
    try {
        const data = new Date(dataISO);
        const agora = new Date();
        return data > agora;
    } catch {
        return false;
    }
};

export const agruparPorData = (agendamentos) => {
    if (!agendamentos || !Array.isArray(agendamentos)) return {};
    
    return agendamentos.reduce((grupo, agendamento) => {
        const data = formatarData(agendamento.dataHora);
        if (!grupo[data]) grupo[data] = [];
        grupo[data].push(agendamento);
        return grupo;
    }, {});
};