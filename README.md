# Central do Corte - Frontend

Alunos: 

Bruna de Medeiros Santos | RGM: 11222101313

Guilherme de Oliveira Matos |RGM: 11222101717


---

## Sobre o Projeto

O PFC Central do Corte é um sistema web desenvolvido como Projeto de Finalização de Curso, com foco na criação de uma plataforma para gerenciamento de estabelecimentos de estética. A aplicação permite que usuários encontrem barbearias e salões de beleza com base na localização, visualizem serviços disponíveis e realizem agendamentos online. Além disso, oferece ferramentas para que os estabelecimentos possam gerenciar seus serviços, clientes e horários de forma eficiente.

Este repositório contém o Frontend da aplicação, produzido em React.

---

## Funcionalidades

### Autenticação
- Login com email e senha  
- Cadastro de clientes (`ROLE_CLIENTE`)  
- Cadastro de proprietários de barbearia (`ROLE_BARBEARIA_ADM`)  
- Logout e gerenciamento de sessão  
- Redirecionamento automático baseado no perfil do usuário  

---

### Dashboard do Cliente
- Área personalizada do cliente  
- Agendamento de cortes  
- Histórico de agendamentos  
- Busca de barbearias próximas  

---

### Dashboard do Proprietário
- Listagem de barbearias cadastradas  
- Cadastro de novas barbearias  
- Exclusão de barbearias  
- Gerenciamento de informações da barbearia  

---

## Tecnologias Utilizadas

| Tecnologia        | Descrição                                   |
|------------------|--------------------------------------------|
| React 18         | Biblioteca para construção da interface     |
| Hooks            | useState, useEffect, useContext             |
| Context API      | Gerenciamento de estado global              |
| Axios            | Cliente HTTP para requisições               |
| CSS3             | Estilização responsiva                      |
| Material Symbols | Ícones da interface                         |
| LocalStorage     | Persistência de dados e token               |

---

## Estrutura do Projeto

src/
├── components/
│   ├── InputFields.jsx
│   └── SocialLogin.jsx
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useForm.js
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── SignupBarbearia.jsx
│   ├── DashboardCliente.jsx
│   └── DashboardBarbearia.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   └── userService.js
├── utils/
│   ├── validators.js
│   └── helpers.js
├── App.jsx
├── main.jsx
└── index.css

# Configuração e Instalação
### Pré-requisitos:

- Node.js 16+
- npm ou yarn
- Backend Spring Boot rodando em http://localhost:8080

## Clone o repositório
git clone https://github.com/seu-usuario/central-do-corte-frontend.git

## Acesse o diretório
cd central-do-corte-frontend

## Instale as dependências
npm install

## Inicie o projeto
npm run dev

A aplicação estará disponível em:

http://localhost:5173