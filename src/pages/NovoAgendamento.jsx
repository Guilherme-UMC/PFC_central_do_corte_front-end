import React, { useState, useEffect, useCallback } from 'react';
import {
  listarBarbearias,
  listarServicos,
  buscarHorariosDisponiveis,
  listarFuncionarios,
  criarAgendamento,
} from '../services/NovoAgendamentoService';
import '../styles/NovoAgendamento.css';

const STEPS = [
  { id: 1, label: 'Barbearia' },
  { id: 2, label: 'Serviços' },
  { id: 3, label: 'Horário' },
  { id: 4, label: 'Profissional' },
  { id: 5, label: 'Confirmar' },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

const formatarPreco = (valor) =>
  Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatarHorario = (isoStr) => {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const formatarDataExibicao = (isoDate) => {
  if (!isoDate) return '';
  const [ano, mes, dia] = isoDate.split('-');
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${ano}`;
};

const agruparHorarios = (horarios) => {
  const grupos = { Manhã: [], Tarde: [], Noite: [] };
  if (!horarios || !Array.isArray(horarios)) return grupos;
  
  horarios.forEach((h) => {
    const horarioStr = h.horario || h;
    const hora = new Date(horarioStr).getHours();
    if (hora < 12) grupos['Manhã'].push(h);
    else if (hora < 18) grupos['Tarde'].push(h);
    else grupos['Noite'].push(h);
  });
  return grupos;
};

// Stepper corrigido
function Stepper({ currentStep }) {
  return (
    <div className="stepper">
      {STEPS.map((s, i) => (
        <React.Fragment key={s.id}>
          <div
            className={`step ${currentStep === s.id ? 'active' : ''} ${currentStep > s.id ? 'done' : ''}`}
          >
            <div className="step-circle">
              {currentStep > s.id ? '✓' : s.id}
            </div>
            <span className="step-label">{s.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`step-line ${currentStep > s.id ? 'done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function StepBarbearia({ onSelect }) {
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarBarbearias()
      .then(setBarbearias)
      .catch(() => setErro('Não foi possível carregar as barbearias.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state">Carregando barbearias...</div>;
  if (erro) return <div className="erro-msg">{erro}</div>;
  if (!barbearias.length)
    return <div className="empty-state">Nenhuma barbearia disponível no momento.</div>;

  return (
    <div>
      <p className="step-section-subtitle">Escolha onde você quer se cuidar</p>
      <div className="barbearias-grid">
        {barbearias.map((b) => (
          <div key={b.id} className="card-barbearia" onClick={() => onSelect(b)}>
            {b.imgUrl ? (
              <img src={b.imgUrl} alt={b.nome} className="card-barbearia-img" />
            ) : (
              <div className="card-barbearia-img placeholder">✂️</div>
            )}
            <div className="card-barbearia-body">
              <h3 className="card-barbearia-nome">{b.nome}</h3>
              {b.cidade && (
                <p className="card-barbearia-info">
                  <span>📍</span> {b.cidade}{b.uf ? `, ${b.uf}` : ''}
                </p>
              )}
              {b.telefone && (
                <p className="card-barbearia-info">
                  <span>📞</span> {b.telefone}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepServicos({ barbearia, servicosSelecionados, onToggleServico, onAvancar, onVoltar }) {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarServicos(barbearia.id)
      .then(setServicos)
      .catch(() => setErro('Não foi possível carregar os serviços.'))
      .finally(() => setLoading(false));
  }, [barbearia.id]);

  const totalSelecionado = servicosSelecionados.reduce((acc, s) => acc + (s.preco || 0), 0);
  const duracaoTotal = servicosSelecionados.reduce((acc, s) => acc + (s.duracaoMinutos || 0), 0);

  return (
    <div className="barbearia-detalhe">
      <div className="barbearia-info-card">
        {barbearia.imgUrl ? (
          <img src={barbearia.imgUrl} alt={barbearia.nome} className="barbearia-info-img" />
        ) : (
          <div className="barbearia-info-img">✂️</div>
        )}
        <div className="barbearia-info-body">
          <h2 className="barbearia-info-nome">{barbearia.nome}</h2>
          <div className="barbearia-info-row">
            <span className="icon">📍</span>
            <span>{barbearia.logradouro}, {barbearia.numero} - {barbearia.bairro}, {barbearia.cidade} - {barbearia.uf}</span>
          </div>
          {barbearia.telefone && (
            <div className="barbearia-info-row">
              <span className="icon">📞</span>
              <span>{barbearia.telefone}</span>
            </div>
          )}
          {barbearia.descricao && (
            <div className="barbearia-info-row" style={{ marginTop: 12 }}>
              <span>{barbearia.descricao}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="servicos-secao">
          <h3>Selecione os serviços</h3>
          {loading && <div className="loading-state">Carregando serviços...</div>}
          {erro && <div className="erro-msg">{erro}</div>}
          {!loading && !erro && (
            <div className="servicos-lista">
              {servicos.map((s) => {
                const selecionado = servicosSelecionados.some((sel) => sel.id === s.id);
                return (
                  <div
                    key={s.id}
                    className={`servico-item ${selecionado ? 'selected' : ''}`}
                    onClick={() => onToggleServico(s)}
                  >
                    <div className="servico-check">{selecionado ? '✓' : ''}</div>
                    <span className="servico-nome">{s.nome}</span>
                    <div className="servico-meta">
                      {s.preco != null && (
                        <span className="servico-preco">{formatarPreco(s.preco)}</span>
                      )}
                      {s.duracaoMinutos && (
                        <span className="servico-duracao">{s.duracaoMinutos} min</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="selecao-bar">
          <div className="selecao-resumo">
            {servicosSelecionados.length === 0 ? (
              'Selecione ao menos 1 serviço'
            ) : (
              <>
                <strong>{servicosSelecionados.length}</strong> serviço(s) •{' '}
                {duracaoTotal > 0 && <><strong>{duracaoTotal} min</strong> • </>}
                <strong>{formatarPreco(totalSelecionado)}</strong>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-ghost" onClick={onVoltar}>Voltar</button>
            <button
              className="btn-primary"
              disabled={servicosSelecionados.length === 0}
              onClick={onAvancar}
            >
              Escolher Horário
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHorario({ barbearia, servicosSelecionados, horarioSelecionado, onSelect, onAvancar, onVoltar }) {
  const [data, setData] = useState(todayISO());
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const carregarHorarios = useCallback(async () => {
    if (!data) return;
    setLoading(true);
    setErro(null);
    try {
      const lista = await buscarHorariosDisponiveis(barbearia.id, [], data);
      setHorarios(lista || []);
    } catch (err) {
      console.error('Erro ao carregar horários:', err);
      setErro('Não foi possível carregar os horários.');
    } finally {
      setLoading(false);
    }
  }, [barbearia.id, data]);

  useEffect(() => {
    carregarHorarios();
  }, [carregarHorarios]);

  const grupos = agruparHorarios(horarios);

  return (
    <div>
      <div className="data-picker-row">
        <label style={{ fontSize: 13, color: 'var(--corte-text-muted)' }}>Data desejada:</label>
        <input
          type="date"
          className="data-input"
          value={data}
          min={todayISO()}
          onChange={(e) => setData(e.target.value)}
        />
        {data && <span style={{ fontSize: 13, color: 'var(--corte-text-muted)' }}>{formatarDataExibicao(data)}</span>}
      </div>

      {loading && <div className="loading-state">Verificando disponibilidade...</div>}
      {erro && <div className="erro-msg">{erro}</div>}

      {!loading && !erro && (
        <>
          {Object.entries(grupos).map(([periodo, slots]) =>
            slots.length > 0 ? (
              <div key={periodo} className="horarios-secao">
                <p className="horario-periodo-titulo">{periodo}</p>
                <div className="horarios-grid">
                  {slots.map((slot, idx) => {
                    const horarioObj = typeof slot === 'object' ? slot : { horario: slot, disponivel: true };
                    const horarioStr = horarioObj.horario;
                    const isSelected = horarioSelecionado === horarioStr;
                    const disponivel = horarioObj.disponivel !== false;
                    return (
                      <button
                        key={`${periodo}-${idx}`}
                        className={`horario-btn ${isSelected ? 'selected' : ''} ${!disponivel ? 'ocupado' : ''}`}
                        disabled={!disponivel}
                        onClick={() => disponivel && onSelect(horarioStr)}
                      >
                        {formatarHorario(horarioStr)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null
          )}

          {(!horarios || horarios.length === 0) && !loading && (
            <div className="empty-state">
              Nenhum horário disponível para esta data.<br />
              <span style={{ fontSize: 12 }}>Tente outra data.</span>
            </div>
          )}
        </>
      )}

      <div className="step-actions">
        <button className="btn-ghost" onClick={onVoltar}>Voltar</button>
        <button
          className="btn-primary"
          disabled={!horarioSelecionado}
          onClick={onAvancar}
        >
          Escolher Profissional
        </button>
      </div>
    </div>
  );
}

function StepFuncionario({ barbearia, funcionarioSelecionado, onSelect, onAvancar, onVoltar }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarFuncionarios(barbearia.id)
      .then(setFuncionarios)
      .catch(() => setErro('Não foi possível carregar os profissionais.'))
      .finally(() => setLoading(false));
  }, [barbearia.id]);

  if (loading) return <div className="loading-state">Carregando profissionais...</div>;
  if (erro) return <div className="erro-msg">{erro}</div>;

  return (
    <div>
      <p className="step-section-subtitle">Prefere algum profissional específico?</p>

      <div className="funcionarios-grid">
        <div
          className={`funcionario-qualquer ${!funcionarioSelecionado ? 'selected' : ''}`}
          onClick={() => onSelect(null)}
        >
          <div className="funcionario-avatar" style={{ fontSize: 28 }}>🎲</div>
          <span className="funcionario-nome">Qualquer um</span>
          <span className="funcionario-esp">Primeiro disponível</span>
        </div>

        {funcionarios.map((f) => (
          <div
            key={f.id}
            className={`funcionario-card ${funcionarioSelecionado?.id === f.id ? 'selected' : ''}`}
            onClick={() => onSelect(f)}
          >
            <div className="funcionario-avatar">
              {f.fotoPerfil ? (
                <img src={f.fotoPerfil} alt={f.name} />
              ) : (
                '💈'
              )}
            </div>
            <span className="funcionario-nome">{f.name}</span>
            {f.especialidade && (
              <span className="funcionario-esp">{f.especialidade}</span>
            )}
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn-ghost" onClick={onVoltar}>Voltar</button>
        <button className="btn-primary" onClick={onAvancar}>
          Revisar Agendamento
        </button>
      </div>
    </div>
  );
}

function StepConfirmacao({ barbearia, servicosSelecionados, horarioSelecionado, funcionario, onConfirmar, onVoltar, loading, erro }) {
  const total = servicosSelecionados.reduce((acc, s) => acc + (s.preco || 0), 0);

  const formatarDataHoraConfirmacao = (dataHora) => {
    if (!dataHora) return '—';
    const d = new Date(dataHora);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <p className="step-section-subtitle">Revise os detalhes antes de confirmar</p>

      {erro && <div className="erro-msg">{erro}</div>}

      <div className="confirmacao-card">
        <p className="confirmacao-titulo">Resumo do agendamento</p>

        <div className="confirmacao-row">
          <span className="confirmacao-label">Barbearia</span>
          <span className="confirmacao-valor">{barbearia.nome}</span>
        </div>

        <div className="confirmacao-row">
          <span className="confirmacao-label">Serviços</span>
          <span className="confirmacao-valor">
            {servicosSelecionados.map((s) => s.nome).join(', ')}
          </span>
        </div>

        <div className="confirmacao-row">
          <span className="confirmacao-label">Data & Hora</span>
          <span className="confirmacao-valor">
            {formatarDataHoraConfirmacao(horarioSelecionado)}
          </span>
        </div>

        <div className="confirmacao-row">
          <span className="confirmacao-label">Profissional</span>
          <span className="confirmacao-valor">
            {funcionario ? funcionario.name : 'Primeiro disponível'}
          </span>
        </div>

        <div className="confirmacao-total">
          <span className="confirmacao-total-label">Total</span>
          <span className="confirmacao-total-valor">{formatarPreco(total)}</span>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-ghost" onClick={onVoltar} disabled={loading}>Voltar</button>
        <button className="btn-primary" onClick={onConfirmar} disabled={loading}>
          {loading ? 'Agendando...' : 'Confirmar Agendamento ✓'}
        </button>
      </div>
    </div>
  );
}

function Sucesso({ onNovo, onVerMeus }) {
  return (
    <div className="sucesso-container">
      <div className="sucesso-icone">✅</div>
      <h2 className="sucesso-titulo">Agendamento confirmado!</h2>
      <p className="sucesso-subtitulo">
        Seu agendamento foi realizado com sucesso. Em breve você receberá a confirmação. 💈
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn-ghost" onClick={onVerMeus}>Ver meus agendamentos</button>
        <button className="btn-primary" onClick={onNovo}>Novo agendamento</button>
      </div>
    </div>
  );
}

export default function NovoAgendamento({ onVoltar, onVerMeusAgendamentos }) {
  const [step, setStep] = useState(1);
  const [barbearia, setBarbearia] = useState(null);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [funcionario, setFuncionario] = useState(null);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [erroConfirm, setErroConfirm] = useState(null);
  const [sucesso, setSucesso] = useState(false);

  const toggleServico = (s) => {
    setServicosSelecionados((prev) =>
      prev.some((sel) => sel.id === s.id)
        ? prev.filter((sel) => sel.id !== s.id)
        : [...prev, s]
    );
  };

  const confirmar = async () => {
    setLoadingConfirm(true);
    setErroConfirm(null);
    try {
      await criarAgendamento({
        barbeariaId: barbearia.id,
        servicoIds: servicosSelecionados.map((s) => s.id),
        funcionarioId: funcionario?.id ?? null,
        dataHora: horarioSelecionado,
      });
      setSucesso(true);
    } catch (e) {
      console.error('Erro ao confirmar agendamento:', e);
      setErroConfirm(
        e?.response?.data?.mensagem || e?.response?.data?.message || 'Erro ao confirmar o agendamento. Tente novamente.'
      );
    } finally {
      setLoadingConfirm(false);
    }
  };

  const resetar = () => {
    setStep(1);
    setBarbearia(null);
    setServicosSelecionados([]);
    setHorarioSelecionado(null);
    setFuncionario(null);
    setSucesso(false);
    setErroConfirm(null);
  };

  const stepTitles = [
    'Escolha a barbearia',
    `${barbearia?.nome ?? 'Barbearia'} — Serviços`,
    'Selecione o horário',
    'Escolha o profissional',
    'Confirmação',
  ];

  if (sucesso) {
    return (
      <div className="novo-agendamento">
        <Sucesso onNovo={resetar} onVerMeus={onVerMeusAgendamentos} />
      </div>
    );
  }

  return (
    <div className="novo-agendamento">
      <div className="agendamento-header">
        <button className="btn-voltar" onClick={step === 1 ? onVoltar : () => setStep((s) => s - 1)}>
          ← {step === 1 ? 'Dashboard' : 'Voltar'}
        </button>
        <h1 className="agendamento-titulo">{stepTitles[step - 1]}</h1>
      </div>

      <Stepper currentStep={step} />

      <div className="step-content">
        {step === 1 && (
          <StepBarbearia
            onSelect={(b) => { setBarbearia(b); setStep(2); }}
          />
        )}

        {step === 2 && barbearia && (
          <StepServicos
            barbearia={barbearia}
            servicosSelecionados={servicosSelecionados}
            onToggleServico={toggleServico}
            onAvancar={() => setStep(3)}
            onVoltar={() => { setBarbearia(null); setStep(1); }}
          />
        )}

        {step === 3 && (
          <StepHorario
            barbearia={barbearia}
            servicosSelecionados={servicosSelecionados}
            horarioSelecionado={horarioSelecionado}
            onSelect={setHorarioSelecionado}
            onAvancar={() => setStep(4)}
            onVoltar={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepFuncionario
            barbearia={barbearia}
            funcionarioSelecionado={funcionario}
            onSelect={setFuncionario}
            onAvancar={() => setStep(5)}
            onVoltar={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <StepConfirmacao
            barbearia={barbearia}
            servicosSelecionados={servicosSelecionados}
            horarioSelecionado={horarioSelecionado}
            funcionario={funcionario}
            onConfirmar={confirmar}
            onVoltar={() => setStep(4)}
            loading={loadingConfirm}
            erro={erroConfirm}
          />
        )}
      </div>
    </div>
  );
}