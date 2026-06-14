import React from 'react';

const TermosModal = ({ isOpen, onClose, tipo = 'cliente' }) => {
  if (!isOpen) return null;

  const getConteudo = () => {
    return (
      <>
        <h3>TERMOS E CONDIÇÕES DE USO – CENTRAL DO CORTE</h3>
        <p><strong>Última atualização:</strong> Junho de 2026</p>

        <h4>1. CADASTRO E CONTA</h4>
        <p><strong>1.1 Informações Cadastrais</strong><br/>
        O usuário compromete-se a fornecer informações verdadeiras, precisas e atualizadas durante o processo de cadastro.</p>
        
        <p><strong>1.2 Segurança da Conta</strong><br/>
        O usuário é responsável pela confidencialidade de sua senha e por todas as atividades realizadas em sua conta.</p>
        
        <p><strong>1.3 Uso Não Autorizado</strong><br/>
        Em caso de suspeita de acesso ou utilização não autorizada da conta, o usuário deverá comunicar imediatamente a plataforma através do contato oficial do nosso suporte.</p>

        <h4>2. AGENDAMENTOS</h4>
        <p><strong>2.1 Comparecimento e Cancelamento</strong><br/>
        Os clientes comprometem-se a comparecer aos horários agendados ou realizar o cancelamento com antecedência mínima de 24 (vinte e quatro) horas.</p>
        
        <p><strong>2.2 Consequências de Cancelamentos Tardios</strong><br/>
        Cancelamentos realizados com menos de 24 horas de antecedência poderão ser registrados e impactar a reputação do usuário na plataforma.</p>
        
        <p><strong>2.3 Disponibilidade</strong><br/>
        A confirmação dos agendamentos está sujeita à disponibilidade do estabelecimento escolhido.</p>
        
        <p><strong>2.4 Responsabilidades dos Estabelecimentos</strong><br/>
        Os estabelecimentos cadastrados comprometem-se a honrar os horários e serviços agendados, mantendo seus horários de funcionamento atualizados e informando eventuais cancelamentos com a maior antecedência possível.</p>

        <h4>3. CADASTRO E OBRIGAÇÕES DOS ESTABELECIMENTOS</h4>
        <p><strong>3.1 Representação Legal</strong><br/>
        O responsável pelo cadastro declara ser proprietário ou representante legal autorizado do estabelecimento.</p>
        
        <p><strong>3.2 Veracidade das Informações</strong><br/>
        O estabelecimento deverá fornecer informações corretas e atualizadas sobre endereço, telefone, serviços, horários de funcionamento e demais dados relevantes.</p>
        
        <p><strong>3.3 Verificação de Informações</strong><br/>
        A Central do Corte poderá verificar as informações fornecidas e recusar cadastros que não atendam aos critérios estabelecidos.</p>
        
        <p><strong>3.4 Gestão de Funcionários</strong><br/>
        O estabelecimento é responsável pelo cadastro, atualização e gerenciamento dos funcionários vinculados à sua conta, bem como pela manutenção das informações de disponibilidade.</p>

        <h4>4. PRODUTOS E SERVIÇOS</h4>
        <p><strong>4.1 Atualização do Catálogo</strong><br/>
        O estabelecimento deverá manter seu catálogo de serviços, produtos e preços sempre atualizado.</p>
        
        <p><strong>4.2 Responsabilidade sobre Informações</strong><br/>
        Os preços e descrições exibidos na plataforma são de responsabilidade exclusiva do estabelecimento.</p>
        
        <p><strong>4.3 Divergências</strong><br/>
        A Central do Corte não se responsabiliza por divergências entre os preços informados na plataforma e os efetivamente praticados pelo estabelecimento.</p>

        <h4>5. COMISSÕES E PAGAMENTOS</h4>
        <p><strong>5.1 Cobranças da Plataforma</strong><br/>
        A Central do Corte poderá cobrar comissões sobre agendamentos realizados por meio da plataforma, conforme política comercial vigente.</p>
        
        <p><strong>5.2 Comunicação Prévia</strong><br/>
        Os valores e condições aplicáveis serão comunicados previamente aos estabelecimentos cadastrados.</p>
        
        <p><strong>5.3 Inadimplência</strong><br/>
        O não pagamento de valores devidos poderá resultar na suspensão ou encerramento da conta do estabelecimento.</p>

        <h4>6. PRIVACIDADE E PROTEÇÃO DE DADOS</h4>
        <p><strong>6.1 Tratamento de Dados</strong><br/>
        Os dados pessoais dos usuários serão tratados em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD), Código de Defesa do Consumidor (CDC), impossibilitando que o sistema induza vícios ao usuário, omissão de cláusulas de atualização, gerar cobranças sem fundamentos, possuir termos abusivos, com observância na ANPD (Autoridade Nacional de Proteção de Dados) e com a Política de Privacidade da plataforma.</p>
        
        <p><strong>6.2 Segurança das Informações</strong><br/>
        A Central do Corte utiliza medidas técnicas e organizacionais adequadas para proteger os dados armazenados, incluindo mecanismos de criptografia e controle de acesso.</p>
        
        <p><strong>6.3 Exclusão de Dados</strong><br/>
        O usuário poderá solicitar a exclusão de seus dados pessoais e de sua conta a qualquer momento, observadas as obrigações legais de retenção aplicáveis.</p>
        
        <p><strong>6.4 Uso de Dados dos Estabelecimentos</strong><br/>
        Os estabelecimentos autorizam a utilização de seus dados comerciais para fins de divulgação e funcionamento da plataforma.</p>

        <h4>7. CONDUTA DO USUÁRIO</h4>
        <p><strong>7.1 Uso Adequado</strong><br/>
        O usuário compromete-se a utilizar a plataforma de forma ética, responsável e respeitosa.</p>
        
        <p><strong>7.2 Práticas Proibidas</strong><br/>
        É proibido realizar agendamentos falsos, utilizar sistemas automatizados, bots ou qualquer mecanismo que prejudique o funcionamento da plataforma.</p>
        
        <p><strong>7.3 Medidas Disciplinares</strong><br/>
        Comportamentos abusivos, fraudulentos ou que violem estes termos poderão resultar em advertência, suspensão ou encerramento definitivo da conta. Com dispositivos normativos exemplares no código penal brasileiro no art. 171 em comprovação de estelionato, art. 154-A em evidência julgada de invasão de dispositivo informático e art.307 em compatibilidade de crime de falsa identidade.</p>

        <h4>8. CONTEÚDO, IMAGENS E LINKS (URLs) CADASTRADOS</h4>
        
        <p><strong>8.1 Responsabilidade pelo Conteúdo</strong><br/>
        O estabelecimento é exclusivamente responsável por todas as imagens, fotografias, logotipos, vídeos, descrições, links (URLs) e demais conteúdos enviados ou vinculados durante o cadastro e operação de sua barbearia na plataforma Central do Corte.</p>
        
        <p><strong>8.2 Proibições Expressas</strong><br/>
        É expressamente proibido o cadastro, envio, vinculação ou compartilhamento de qualquer conteúdo que:</p>
        <ul>
          <li>a) Contenha nudez, atos sexuais, sugestão de ato sexual, linguagem ou material de natureza pornográfica ou obscena;</li>
          <li>b) Apresente violência explícita, incitação à violência, crueldade contra pessoas ou animais;</li>
          <li>c) Divulgue discurso de ódio, discriminação racial, étnica, religiosa, de gênero, orientação sexual ou qualquer forma de preconceito;</li>
          <li>d) Constitua plágio, violação de direitos autorais, direitos de imagem, direitos de propriedade intelectual ou quaisquer outros direitos de terceiros;</li>
          <li>e) Utilize marcas, logotipos ou identidade visual de terceiros sem a devida autorização;</li>
          <li>f) Contenha informações falsas, enganosas ou que possam induzir o usuário a erro;</li>
          <li>g) Promova produtos ou serviços ilegais, ou que violem a legislação brasileira.</li>
        </ul>
        
        <p><strong>8.3 Conteúdo Sensível</strong><br/>
        Considera-se conteúdo sensível, para os fins desta cláusula, qualquer imagem ou informação que:</p>
        <ul>
          <li>a) Exponha dados de saúde, condição médica ou procedimentos estéticos invasivos sem o devido contexto informativo e consentimento;</li>
          <li>b) Revele dados biométricos ou íntimos de clientes, funcionários ou terceiros;</li>
          <li>c) Explore situações de vulnerabilidade, sofrimento ou constrangimento de pessoas;</li>
          <li>d) Divulgue imagens de menores de idade sem a devida autorização dos responsáveis legais.</li>
        </ul>
        <p>Fica vedada a publicação de conteúdo sensível sem a devida justificativa comercial e autorização expressa dos envolvidos, sob pena de remoção imediata e sanções cabíveis.</p>
        
        <p><strong>8.4 Verificação de URLs (Links)</strong><br/>
        Toda URL (link) cadastrada na plataforma, incluindo imagens hospedadas externamente ou redirecionamentos, será considerada de responsabilidade exclusiva do estabelecimento cadastrante.</p>
        <p>A Central do Corte poderá, a seu critério e sem aviso prévio:</p>
        <ul>
          <li>a) Analisar e verificar a conformidade das URLs cadastradas;</li>
          <li>b) Recusar ou remover links que direcionem para conteúdo proibido por estes Termos;</li>
          <li>c) Bloquear domínios ou serviços de hospedagem recorrentemente utilizados para violação destas regras.</li>
        </ul>
        
        <p><strong>8.5 Direitos de Imagem e Autorização</strong><br/>
        Ao cadastrar uma imagem na plataforma, o estabelecimento declara:</p>
        <ul>
          <li>a) Possuir todos os direitos necessários sobre a imagem, incluindo, quando aplicável, autorização dos proprietários de direitos autorais e autorização de imagem das pessoas retratadas;</li>
          <li>b) Ser responsável por eventuais reclamações, ações judiciais ou extrajudiciais decorrentes do uso não autorizado de imagens;</li>
          <li>c) Indenizar a Central do Corte por quaisquer danos, multas, custas processuais e honorários advocatícios decorrentes de violação de direitos de terceiros relacionada ao conteúdo cadastrado.</li>
        </ul>
        
        <p><strong>8.6 Consequências da Violação</strong><br/>
        O descumprimento de qualquer das disposições desta cláusula sujeitará o estabelecimento às seguintes medidas, aplicáveis de forma isolada ou cumulativa:</p>
        <ul>
          <li>a) Remoção imediata do conteúdo violador, sem necessidade de notificação prévia;</li>
          <li>b) Advertência por escrito, com prazo para regularização;</li>
          <li>c) Suspensão temporária da conta do estabelecimento;</li>
          <li>d) Cancelamento definitivo do cadastro e exclusão da plataforma;</li>
          <li>e) Comunicação às autoridades competentes, incluindo delegacias de polícia, Ministério Público ou outros órgãos fiscalizadores, conforme a gravidade da violação.</li>
        </ul>
        
        <p><strong>8.7 Registro de Violações</strong><br/>
        A Central do Corte manterá registro das violações identificadas para fins de controle interno, podendo utilizar tais informações para aplicar medidas disciplinares progressivas ou encerramento definitivo de contas reincidentes.</p>
        
        <p><strong>8.8 Canal de Denúncia</strong><br/>
        Usuários que identificarem conteúdo impróprio, sensível, adulto ou plagiado poderão denunciar através do e-mail: <strong>suporte.centraldocorte@gmail.com</strong></p>
        <p>Todas as denúncias serão analisadas com a devida confidencialidade e, comprovada a violação, as medidas previstas nesta cláusula serão aplicadas.</p>
        
        <p><strong>8.9 Boas Práticas Recomendadas</strong><br/>
        Recomenda-se aos estabelecimentos:</p>
        <ul>
          <li>a) Utilizar apenas imagens originais ou devidamente licenciadas;</li>
          <li>b) Obter autorização por escrito de clientes e funcionários antes de publicar suas imagens;</li>
          <li>c) Priorizar fotografias que reflitam com exatidão os serviços, produtos e estrutura da barbearia;</li>
          <li>d) Manter as URLs cadastradas sempre ativas e com conteúdo apropriado;</li>
          <li>e) Revisar periodicamente o conteúdo publicado para garantir sua conformidade com estes Termos.</li>
        </ul>

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

        <h4>13. ACEITAÇÃO DOS TERMOS</h4>
        <p>Ao clicar em "Aceitar" e se cadastrar na plataforma Central do Corte, seja como cliente ou proprietário de um estabelecimento, o usuário declara que leu, compreendeu e concorda integralmente com os presentes Termos e Condições de Uso.</p>

        <p style={{ marginTop: '20px', textAlign: 'center', fontStyle: 'italic', fontWeight: 'bold' }}>
          Ao clicar em "Aceitar", o usuário confirma que leu, compreendeu e concorda integralmente com os presentes Termos e Condições de Uso da plataforma Central do Corte.
        </p>
      </>
    );
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