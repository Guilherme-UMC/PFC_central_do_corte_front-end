import React from 'react';

const TermosModal = ({ isOpen, onClose, tipo = 'cliente' }) => {
  if (!isOpen) return null;

  const getConteudo = () => {
    
    const conteudoBase = (
      <>
        <h3>TERMOS E CONDIÇÕES DE USO – CENTRAL DO CORTE</h3>
        <p><strong>Última atualização:</strong> Junho de 2026</p>

        <h4>1. ACEITAÇÃO DOS TERMOS</h4>
        <p>Ao se cadastrar na plataforma Central do Corte, seja como cliente ou proprietário de estabelecimento, o usuário declara que leu, compreendeu e concorda integralmente com os presentes Termos e Condições de Uso.</p>

        <h4>2. CADASTRO E CONTA</h4>
        <p><strong>2.1 Informações Cadastrais</strong><br/>
        O usuário compromete-se a fornecer informações verdadeiras, precisas e atualizadas durante o processo de cadastro.</p>
        
        <p><strong>2.2 Segurança da Conta</strong><br/>
        O usuário é responsável pela confidencialidade de sua senha e por todas as atividades realizadas em sua conta.</p>
        
        <p><strong>2.3 Uso Não Autorizado</strong><br/>
        Em caso de suspeita de acesso ou utilização não autorizada da conta, o usuário deverá comunicar imediatamente a plataforma.</p>

        <h4>3. AGENDAMENTOS</h4>
        <p><strong>3.1 Comparecimento e Cancelamento</strong><br/>
        Os clientes comprometem-se a comparecer aos horários agendados ou realizar o cancelamento com antecedência mínima de 24 (vinte e quatro) horas.</p>
        
        <p><strong>3.2 Consequências de Cancelamentos Tardios</strong><br/>
        Cancelamentos realizados com menos de 24 horas de antecedência poderão ser registrados e impactar a reputação do usuário na plataforma.</p>
        
        <p><strong>3.3 Disponibilidade</strong><br/>
        A confirmação dos agendamentos está sujeita à disponibilidade do estabelecimento escolhido.</p>
        
        <p><strong>3.4 Responsabilidades dos Estabelecimentos</strong><br/>
        Os estabelecimentos cadastrados comprometem-se a honrar os horários e serviços agendados, mantendo seus horários de funcionamento atualizados e informando eventuais cancelamentos com a maior antecedência possível.</p>

        <h4>4. CADASTRO E OBRIGAÇÕES DOS ESTABELECIMENTOS</h4>
        <p><strong>4.1 Representação Legal</strong><br/>
        O proprietário declara ser o responsável legal ou representante autorizado do estabelecimento que está cadastrando.</p>
        
        <p><strong>4.2 Veracidade das Informações</strong><br/>
        O estabelecimento deverá fornecer informações corretas e atualizadas sobre endereço, telefone, serviços, horários de funcionamento e demais dados relevantes.</p>
        
        <p><strong>4.3 Verificação de Informações</strong><br/>
        A Central do Corte poderá verificar as informações fornecidas e recusar cadastros que não atendam aos critérios estabelecidos.</p>
        
        <p><strong>4.4 Gestão de Funcionários</strong><br/>
        O estabelecimento é responsável pelo cadastro, atualização e gerenciamento dos funcionários vinculados à sua conta, bem como pela manutenção das informações de disponibilidade.</p>

        <h4>5. PRODUTOS E SERVIÇOS</h4>
        <p><strong>5.1 Atualização do Catálogo</strong><br/>
        O estabelecimento deverá manter seu catálogo de serviços, produtos e preços sempre atualizado.</p>
        
        <p><strong>5.2 Responsabilidade sobre Informações</strong><br/>
        Os preços e descrições exibidos na plataforma são de responsabilidade exclusiva do estabelecimento.</p>
        
        <p><strong>5.3 Divergências</strong><br/>
        A Central do Corte não se responsabiliza por divergências entre os preços informados na plataforma e os efetivamente praticados pelo estabelecimento.</p>

        <h4>6. COMISSÕES E PAGAMENTOS</h4>
        <p><strong>6.1 Cobranças da Plataforma</strong><br/>
        A Central do Corte poderá cobrar comissões sobre agendamentos realizados por meio da plataforma, conforme política comercial vigente.</p>
        
        <p><strong>6.2 Comunicação Prévia</strong><br/>
        Os valores e condições aplicáveis serão comunicados previamente aos estabelecimentos cadastrados.</p>
        
        <p><strong>6.3 Inadimplência</strong><br/>
        O não pagamento de valores devidos poderá resultar na suspensão ou encerramento da conta do estabelecimento.</p>

        <h4>7. PRIVACIDADE E PROTEÇÃO DE DADOS</h4>
        <p><strong>7.1 Tratamento de Dados</strong><br/>
        Os dados pessoais dos usuários serão tratados em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD) e com a Política de Privacidade da plataforma.</p>
        
        <p><strong>7.2 Segurança das Informações</strong><br/>
        A Central do Corte utiliza medidas técnicas e organizacionais adequadas para proteger os dados armazenados, incluindo mecanismos de criptografia e controle de acesso.</p>
        
        <p><strong>7.3 Exclusão de Dados</strong><br/>
        O usuário poderá solicitar a exclusão de seus dados pessoais e de sua conta a qualquer momento, observadas as obrigações legais de retenção aplicáveis.</p>
        
        <p><strong>7.4 Uso de Dados dos Estabelecimentos</strong><br/>
        Os estabelecimentos autorizam a utilização de seus dados comerciais para fins de divulgação e funcionamento da plataforma.</p>

        <h4>8. CONDUTA DO USUÁRIO</h4>
        <p><strong>8.1 Uso Adequado</strong><br/>
        O usuário compromete-se a utilizar a plataforma de forma ética, responsável e respeitosa.</p>
        
        <p><strong>8.2 Práticas Proibidas</strong><br/>
        É proibido realizar agendamentos falsos, utilizar sistemas automatizados, bots ou qualquer mecanismo que prejudique o funcionamento da plataforma.</p>
        
        <p><strong>8.3 Medidas Disciplinares</strong><br/>
        Comportamentos abusivos, fraudulentos ou que violem estes Termos poderão resultar em advertência, suspensão ou encerramento definitivo da conta.</p>

        <h4>9. CANCELAMENTO E EXCLUSÃO DE CONTA</h4>
        <p><strong>9.1 Solicitação pelo Usuário</strong><br/>
        O usuário poderá solicitar a exclusão de sua conta a qualquer momento por meio das funcionalidades disponibilizadas na plataforma.</p>
        
        <p><strong>9.2 Consequências da Exclusão</strong><br/>
        A exclusão da conta poderá resultar na remoção ou anonimização dos dados pessoais e do histórico de utilização, observadas as exigências legais aplicáveis.</p>
        
        <p><strong>9.3 Suspensão pela Plataforma</strong><br/>
        A Central do Corte reserva-se o direito de suspender ou encerrar contas que violem estes Termos e Condições de Uso.</p>

        <h4>10. LIMITAÇÃO DE RESPONSABILIDADE</h4>
        <p>A Central do Corte atua exclusivamente como intermediadora entre clientes e estabelecimentos. A plataforma não se responsabiliza pela qualidade, execução, segurança, pontualidade ou adequação dos serviços prestados pelos estabelecimentos cadastrados, sendo tais responsabilidades exclusivas dos respectivos prestadores.</p>

        <h4>11. ALTERAÇÕES DOS TERMOS</h4>
        <p>A Central do Corte poderá alterar estes Termos e Condições de Uso a qualquer momento. As alterações entrarão em vigor após sua publicação na plataforma, podendo os usuários ser notificados por e-mail ou outros meios de comunicação disponíveis. A continuidade da utilização da plataforma após a publicação das alterações será considerada como aceitação dos novos termos.</p>

        <h4>12. CONTATO</h4>
        <p>Em caso de dúvidas, solicitações ou esclarecimentos relacionados a estes Termos e Condições de Uso, o usuário poderá entrar em contato através do e-mail:<br/>
        <strong>suporte.centraldocorte@gmail.com</strong></p>

        <p style={{ marginTop: '20px', textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold' }}>
          Ao clicar em "Aceitar", o usuário confirma que leu, compreendeu e concorda integralmente com os presentes Termos e Condições de Uso da plataforma Central do Corte.
        </p>
      </>
    );

    return conteudoBase;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content termos-modal" onClick={(e) => e.stopPropagation()}>
        <div className="termos-body">
          {getConteudo()}
        </div>
        <div className="termos-footer">
          <button className="btn-primary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default TermosModal;