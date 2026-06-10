# Central do Corte - Frontend

**Alunos:**
- Bruna de Medeiros Santos | RGM: 11222101313
- Guilherme de Oliveira Matos | RGM: 11222101717

---

## Sobre o Projeto

O **PFC Central do Corte** é um sistema web desenvolvido como Projeto de Finalização de Curso, com foco na criação de uma plataforma para gerenciamento de estabelecimentos de estética.

A aplicação permite que usuários encontrem **barbearias e salões de beleza com base na localização**, visualizem serviços disponíveis e realizem agendamentos online. Além disso, oferece ferramentas para que os estabelecimentos possam gerenciar seus serviços, clientes, funcionários e horários de forma eficiente.

**Este repositório contém o Frontend da aplicação**, desenvolvido em React com Vite.

---

## Funcionalidades Implementadas

### Autenticação e Segurança
- Login com email e senha
- Cadastro de clientes (`ROLE_CLIENTE`)
- Cadastro de proprietários de barbearia (`ROLE_BARBEARIA_ADM`)
- Logout e gerenciamento de sessão
- Redirecionamento automático baseado no perfil do usuário
- Proteção de rotas (PrivateRoute / PublicRoute)
- Persistência de token no localStorage
- Refresh token automático

### Página Inicial (Home)
- Hero section com apresentação do sistema
- Listagem de barbearias em carrossel
- Filtro por tipo de serviço (corte, barba, tintura, etc.)
- Busca por nome, cidade ou serviço
- Slider para navegação entre barbearias
- WhatsApp direto para contato

### Área do Cliente
- Dashboard personalizado
- Visualização do próximo agendamento
- **Novo Agendamento** (multi-step):
  - Escolha da barbearia
  - Seleção de serviços
  - Escolha de horário
  - Seleção de profissional
  - Confirmação do agendamento
- Histórico de agendamentos com status
- Cancelamento de agendamentos (com +2h de antecedência)
- Modal para informar motivo do cancelamento
- Perfil do usuário

### Área do Proprietário (Barbearia_ADM)
- Listagem de barbearias cadastradas
- Cadastro e edição de barbearias
- Gerenciamento de informações da barbearia (endereço, telefone, etc.)
- **Gerenciamento de Agendamentos:**
  - Lista de todos os agendamentos
  - Agendamentos do dia (destaque)
  - Confirmar agendamentos pendentes
  - Cancelar agendamentos (com motivo)
  - Concluir atendimentos
- **Gerenciamento de Serviços:**
  - CRUD completo de serviços
  - Definição de preço e duração
- **Gerenciamento de Funcionários:**
  - Cadastro de novos funcionários
  - Vinculação de funcionários existentes
  - Desvinculação com transferência de agendamentos
- **Configuração de Horários:**
  - Horários de funcionamento por dia da semana
  - Marcar dias como fechado
- **Dashboard de Métricas:**
  - Cards com faturamento mensal/anual
  - Taxa de conclusão
  - Clientes atendidos
  - Gráficos por período (semana/mês/ano)

### Área do Funcionário
- Listagem de barbearias vinculadas
- Visualização de agendamentos do dia
- Lista de todos os agendamentos
- Conclusão de atendimentos
- Status visual dos agendamentos

### Área Administrativa
- Gerenciamento de usuários (listagem, ativação, desativação, remoção)
- Filtros por status (ativos/inativos/todos)
- Filtros por role (cliente, funcionário, proprietário, admin)
- Busca por nome
- Paginação
- **Logs do Sistema:**
  - Visualização completa de auditoria
  - Filtros por tipo, ação, usuário e período
  - Cards de estatísticas
  - Paginação

### Busca Global
- Busca integrada na Navbar
- Resultados em dropdown
- Busca por nome da barbearia, cidade ou CEP
- Fallback para busca por localização

### Responsividade
- Layout adaptável para desktop e mobile
- Menu hambúrguer para dispositivos móveis
- Sidebar para área do cliente

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| React | 18 | Biblioteca principal |
| Vite | 4 | Build tool e dev server |
| React Router DOM | 6 | Roteamento |
| Axios | 1.4 | Cliente HTTP |
| Context API | - | Gerenciamento de estado global |
| CSS3 | - | Estilização |
| HTML5 Canvas | - | Gráficos do dashboard |
| Material Symbols | - | Ícones |
| LocalStorage | - | Persistência de dados |

---

## Estrutura do Projeto

src/

├── components/

│ ├── BuscaGlobal.jsx # Busca com dropdown

│ ├── CadastroBarbearia.jsx# Formulário de barbearia

│ ├── ChartBar.jsx # Gráfico de barras

│ ├── DashboardCard.jsx # Card de métricas

│ ├── InputFields.jsx # Campos de input

│ ├── Loader.jsx # Loading spinner

│ ├── Navbar.jsx # Barra de navegação

│ ├── PasswordInput.jsx # Input de senha com toggle

│ ├── PrivateRoute.jsx # Rota protegida

│ ├── PublicRoute.jsx # Rota pública

│ ├── SocialLogin.jsx # Login social (placeholder)

│ └── StatusBadge.jsx # Badge de status

├── contexts/

│ └── AuthContext.jsx # Contexto de autenticação

├── layouts/

│ └── RootLayout.jsx # Layout principal

├── pages/

│ ├── AdminLogsPage.jsx # Logs do sistema

│ ├── AdminPage.jsx # Painel administrativo

│ ├── BarbeariaDetalhes.jsx# Detalhes da barbearia

│ ├── BarbeariaPage.jsx # Painel do proprietário

│ ├── ClientePage.jsx # Área do cliente

│ ├── DashboardPage.jsx # Dashboard de métricas

│ ├── EsqueciSenha.jsx # Recuperação de senha

│ ├── FuncionarioPage.jsx # Área do funcionário

│ ├── Home.jsx # Página inicial

│ ├── Login.jsx # Login

│ ├── NovoAgendamento.jsx # Multi-step agendamento

│ ├── Perfil.jsx # Perfil do usuário

│ ├── RedefinirSenha.jsx # Redefinição de senha

│ ├── Signup.jsx # Cadastro cliente

│ └── SignupBarbearia.jsx # Cadastro proprietário

├── services/

│ ├── AdminService.js # Admin endpoints

│ ├── AgendamentoService.js# Agendamentos

│ ├── api.js # Axios config

│ ├── authService.js # Autenticação

│ ├── BarbeariaService.js # Barbearias

│ ├── BuscaService.js # Busca global

│ ├── DashboardService.js # Dashboard métricas

│ ├── FuncionarioService.js# Funcionários

│ ├── HorarioService.js # Horários

│ ├── LogService.js # Logs do sistema

│ ├── NovoAgendamentoService.js

│ ├── RecuperacaoSenhaService.js

│ ├── ServicoService.js # Serviços

│ ├── UserService.js # Usuários

│ └── ViaCepService.js # CEP

├── styles/

│ ├── AdminLogs.css

│ ├── Busca.css

│ ├── Cliente.css

│ ├── Dashboard.css

│ ├── NovoAgendamento.css

│ └── index.css

├── utils/

│ ├── dateUtils.js

│ └── helpers.js

├── App.jsx

└── main.jsx


---

## Fluxos da Aplicação

### Fluxo de Agendamento (Cliente)
1. Cliente acessa página inicial
2. Busca barbearia ou clica em "Agendar"
3. Seleciona barbearia
4. Escolhe serviços
5. Seleciona horário disponível
6. Escolhe profissional (opcional)
7. Confirma agendamento
8. Visualiza no histórico

### Fluxo de Gerenciamento (Proprietário)
1. Acessa painel da barbearia
2. Gerencia agendamentos (confirmar/cancelar/concluir)
3. Gerencia serviços (criar/editar/desativar)
4. Gerencia funcionários (vincular/desvincular)
5. Configura horários de funcionamento
6. Gerencia produtos (criar/editar/desativar)
7. Visualiza dashboard com métricas

### Fluxo Administrativo (ADMIN)
1. Acessa painel administrativo
2. Gerencia usuários (ativar/inativar/remover)
3. Gerencia barbearias (ativar/desativar)
4. Visualiza logs do sistema com filtros

---

## Configuração e Instalação

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- Backend Spring Boot rodando em `http://localhost:8080`

### Passos

```bash
# Clone o repositório
git clone https://github.com/Guilherme-UMC/PFC_central_do_corte_front-end.git

# Acesse o diretório
cd PFC_central_do_corte_front-end

# Instale as dependências
npm install

# Configure as variáveis de ambiente (opcional)
cp .env.example .env
# Edite .env com a URL do backend

# Inicie o projeto
npm run dev