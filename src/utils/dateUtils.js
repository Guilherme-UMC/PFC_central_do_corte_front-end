export const parseDataHora = (dataHora) => {
  if (!dataHora) return null;
  
  if (dataHora instanceof Date && !isNaN(dataHora.getTime())) {
    return dataHora;
  }
  
  try {
    let data;
    
    if (typeof dataHora === 'string' && dataHora.includes('/')) {
      const partes = dataHora.split(' ');
      const dataParte = partes[0];
      const horaParte = partes[1] || '00:00';
      
      const [dia, mes, ano] = dataParte.split('/');
      const [horas, minutos] = horaParte.split(':');
      
      data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), parseInt(horas), parseInt(minutos));
    }
    else if (typeof dataHora === 'string' && dataHora.includes('T')) {
      data = new Date(dataHora);
    }
    else if (typeof dataHora === 'string' && dataHora.includes('-')) {
      data = new Date(dataHora.replace(' ', 'T'));
    }
    else if (typeof dataHora === 'number') {
      data = new Date(dataHora);
    }
    else {
      data = new Date(dataHora);
    }
    
    return !isNaN(data.getTime()) ? data : null;
  } catch (error) {
    console.error('Erro ao parsear data:', error, dataHora);
    return null;
  }
};

export const formatarDataHora = (dataISO) => {
    if (!dataISO) return '—';

    try {
        if (typeof dataISO === 'string' && /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(dataISO)) {
            return dataISO;
        }
        if (typeof dataISO === 'string' && /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(dataISO)) {
            return dataISO.substring(0, 16);
        }

        let data;
        if (typeof dataISO === 'string') {
            data = new Date(dataISO);
            if (isNaN(data.getTime())) {
                data = new Date(dataISO.replace('T', ' '));
            }
        } else if (dataISO instanceof Date) {
            data = dataISO;
        } else {
            return '—';
        }

        if (isNaN(data.getTime())) {
            console.warn('Data inválida recebida:', dataISO);
            return '—';
        }

        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    } catch (error) {
        console.error('Erro ao formatar data:', error, dataISO);
        return '—';
    }
};

export const formatarData = (dataISO) => {
    if (!dataISO) return '—';

    try {
        if (typeof dataISO === 'string' && /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(dataISO)) {
            return dataISO.split(' ')[0];
        }

        if (typeof dataISO === 'string' && /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(dataISO)) {
            return dataISO.substring(0, 10);
        }

        let data;
        if (typeof dataISO === 'string') {
            data = new Date(dataISO);
            if (isNaN(data.getTime())) {
                data = new Date(dataISO.replace('T', ' '));
            }
        } else if (dataISO instanceof Date) {
            data = dataISO;
        } else {
            return '—';
        }

        if (isNaN(data.getTime())) return '—';

        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();

        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        console.error('Erro ao formatar data:', error, dataISO);
        return '—';
    }
};

export const formatarHora = (dataHora) => {
  if (!dataHora) return '—';
  
  try {
    let data;
    
    if (typeof dataHora === 'string' && dataHora.includes('/')) {
      const partes = dataHora.split(' ');
      const dataParte = partes[0];
      const horaParte = partes[1] || '00:00';
      const [dia, mes, ano] = dataParte.split('/');
      const [horas, minutos] = horaParte.split(':');
      data = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia), parseInt(horas), parseInt(minutos));
    } else {
      data = new Date(dataHora);
    }
    
    if (isNaN(data.getTime())) return '—';
    
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
};

export const formatarDataHoraCurta = (dataISO) => {
    if (!dataISO) return '—';

    try {
        if (typeof dataISO === 'string' && /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/.test(dataISO)) {
            const [data, hora] = dataISO.split(' ');
            const [dia, mes, ano] = data.split('/');
            const anoCurto = ano.slice(-2);
            return `${dia}/${mes}/${anoCurto} ${hora}`;
        }

        let data;
        if (typeof dataISO === 'string') {
            data = new Date(dataISO);
            if (isNaN(data.getTime())) {
                data = new Date(dataISO.replace('T', ' '));
            }
        } else if (dataISO instanceof Date) {
            data = dataISO;
        } else {
            return '—';
        }

        if (isNaN(data.getTime())) return '—';

        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = String(data.getFullYear()).slice(-2);
        const hora = String(data.getHours()).padStart(2, '0');
        const minuto = String(data.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
    } catch (error) {
        console.error('Erro ao formatar data curta:', error, dataISO);
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
        let data;

        if (typeof dataISO === 'string' && /^\d{2}\/\d{2}\/\d{4}/.test(dataISO)) {
            const [dia, mes, ano] = dataISO.split(' ')[0].split('/');
            data = new Date(`${ano}-${mes}-${dia}`);
        } else {
            data = new Date(dataISO);
            if (isNaN(data.getTime())) {
                data = new Date(dataISO.replace('T', ' '));
            }
        }

        if (isNaN(data.getTime())) return false;

        const hoje = new Date();
        return data.toDateString() === hoje.toDateString();
    } catch {
        return false;
    }
};

export const isFuturo = (dataISO) => {
    if (!dataISO) return false;

    try {
        let data;

        if (typeof dataISO === 'string' && /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/.test(dataISO)) {
            const [dataPart, horaPart] = dataISO.split(' ');
            const [dia, mes, ano] = dataPart.split('/');
            const [hora, minuto] = horaPart.split(':');
            data = new Date(ano, parseInt(mes) - 1, dia, hora, minuto);
        } else {
            data = new Date(dataISO);
            if (isNaN(data.getTime())) {
                data = new Date(dataISO.replace('T', ' '));
            }
        }

        if (isNaN(data.getTime())) return false;

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