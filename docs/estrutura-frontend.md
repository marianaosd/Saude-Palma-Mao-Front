# Estrutura do Front-end e Inventário de Componentes

Este documento registra a organização técnica do front-end do **Desafila** (Saúde na Palma da Mão), a divisão de responsabilidades entre pastas, as convenções adotadas e o inventário completo de páginas e componentes integrados.

---

## 1. Organização dos Arquivos e Pastas

```text
src/
├── assets/                 # SVGs, fontes locais (Nunito, Inter, OpenDyslexic) e licenças
├── components/
│   ├── layout/             # Estruturas de casca: AppLayout, PatientLayout, ProfessionalLayout
│   ├── profissional/       # Componentes exclusivos do portal médico (agenda, histórico, perfil, ícones)
│   │   ├── agendaProfissional/
│   │   ├── historicoProfissional/
│   │   ├── perfilProfissional/
│   │   └── panels/         # Conteúdos dos diálogos demonstrativos da Home Profissional
│   └── ui/                 # Componentes compartilhados (AccessibilityPanel, PriorityTag)
├── data/                   # Registros fictícios de demonstração e fallbacks
├── pages/
│   ├── admin/              # Painel administrativo (Admin, Clínicas, Especialidades, Médicos, Senhas)
│   ├── auth/               # Páginas de login (Paciente, Médico, Admin), Cadastro e Esqueci a Senha
│   ├── institucional/      # Landing page pública de apresentação
│   ├── paciente/           # Fluxo completo do paciente (Home, Triagem, Resultado, Agendamento, etc.)
│   └── profissional/       # Portal médico completo (Home, Agenda, Histórico, Perfil)
├── services/               # Comunicação com a API (api.js), cálculo de agenda e acessibilidade
└── styles/                 # Tokens (tokens.css), fontes (fonts.css) e CSS global
```

### Responsabilidades por Pasta

| Diretório | Responsabilidade |
| --- | --- |
| `src/pages/<contexto>/<pagina>/` | Contém exclusivamente a página em sua respectiva subpasta junto ao seu arquivo CSS correspondente (ex: `src/pages/paciente/pacienteHome/Paciente.jsx`). |
| `src/components/layout/` | Cascas de aplicação que encapsulam cabeçalhos, rodapés, barras de navegação e atalhos por contexto (`AppLayout`, `PatientLayout`, `ProfessionalLayout`). |
| `src/components/profissional/` | Blocos visuais e componentes reutilizáveis do portal médico (cartões de dados, linhas de agenda, filtros de histórico e diálogos). |
| `src/components/ui/` | Componentes transversais de interface, como o `AccessibilityPanel` e tags de prioridade (`PriorityTag`). |
| `src/services/` | Lógica pura sem JSX: cliente HTTP centralizado ([`api.js`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/src/services/api.js)), gerador dinâmico de slots de agenda ([`agenda.js`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/src/services/agenda.js)) e gerenciador de preferências acessíveis ([`accessibility.js`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/src/services/accessibility.js)). |
| `src/styles/` | Tokens do design system sob o escopo `.theme-figma`, tipografia e estilos globais. |

---

## 2. Padrões de Código e Convenções

1. **Nomenclatura:**
   - Componentes e páginas em `PascalCase` (ex: `AgendaProfissional.jsx`, `PatientLayout.jsx`).
   - Funções, variáveis e utilitários em `camelCase` (ex: `gerarHorarios`, `salvarSessao`).
   - Arquivos CSS acompanham o nome do componente e residem no mesmo diretório.
2. **Estilização com CSS Puro:**
   - Não são utilizadas bibliotecas externas de CSS (como Tailwind ou Bootstrap).
   - O escopo `.theme-figma` centraliza as variáveis de cor (verde-água, superfícies neutras, estados de prioridade).
   - Classes com nomes semânticos e prefixadas por contexto para evitar colisão global.
3. **Gerenciamento de Estado:**
   - Estado de tela e fluxo coordenados por `App.jsx` com sincronização por hash na URL.
   - Estado local de formulários contido dentro do próprio componente.
   - Nenhum framework pesado de gerenciamento global (sem Redux ou Zustand desnecessários).
4. **Respeito aos Contratos de API:**
   - Componentes recebem dados e emitem eventos via props, utilizando o módulo `api` para persistência.
   - Em caso de indisponibilidade de rede ou falha na API, o sistema exibe mensagens claras de erro.

---

## 3. Inventário Completo de Telas e Funcionalidades

| Contexto | Arquivo da Página | Situação Funcional e Integração com a API |
| --- | --- | --- |
| **Institucional** | `pages/institucional/Home.jsx` | Apresentação pública da proposta de valor do Desafila, com atalhos para entrada nos perfis. |
| **Autenticação** | `pages/auth/Login.jsx` | Autenticação de pacientes via `POST /auth/login`. Armazena token JWT `saude_token`. |
| **Autenticação** | `pages/auth/LoginProfissional.jsx` | Autenticação do médico via `POST /auth/profissional/login`. Armazena `saude_profissional_token`. |
| **Autenticação** | `pages/auth/LoginAdmin.jsx` | Autenticação do administrador via `POST /auth/admin/login`. Armazena `saude_admin_token`. |
| **Autenticação** | `pages/auth/Cadastro.jsx` | Cadastro de paciente via `POST /auth/cadastro` com validação de CPF e contato de emergência. |
| **Autenticação** | `pages/auth/EsqueciSenha.jsx` | Instruções para recuperação de acesso via suporte administrativo. |
| **Paciente** | `pages/paciente/pacienteHome/Paciente.jsx` | Home do paciente. Consome `GET /agendamentos` e `GET /pacientes/me`. Permite cancelar consultas via `PATCH /agendamentos/:id/cancelar`. |
| **Paciente** | `pages/paciente/triagem/Triagem.jsx` | Carrega categorias (`GET /triagem/categorias`) e perguntas (`GET /triagem/categorias/:id/perguntas`). Envia respostas via `POST /triagem`. |
| **Paciente** | `pages/paciente/resultado/Resultado.jsx` | Exibe a classificação orientativa retornada pela API e orienta o próximo passo do atendimento. |
| **Paciente** | `pages/paciente/clinicas/Clinicas.jsx` | Lista as unidades parceiras via `GET /clinicas` e permite a seleção da clínica desejada. |
| **Paciente** | `pages/paciente/escolhaProfissional/EscolhaProfissional.jsx` | Filtra médicos (`GET /profissionais`) e calcula slots livres em tempo real com base em `GET /disponibilidades` e horários ocupados. |
| **Paciente** | `pages/paciente/agendamento/Agendamento.jsx` | Tela de revisão dos dados do agendamento. Cria a consulta na API via `POST /agendamentos` associando a pré-triagem. |
| **Paciente** | `pages/paciente/confirmacao/Confirmacao.jsx` | Feedback de sucesso com os dados da consulta confirmada e atalhos para retorno. |
| **Paciente** | `pages/paciente/historico/HistoricoPaciente.jsx` | Exibe consultas anteriores e histórico de pré-triagens via `GET /triagem/meu-historico`. |
| **Paciente** | `pages/paciente/perfilPaciente/PerfilPaciente.jsx` | Consulta e atualização dos dados do paciente e do contato de emergência via `GET /pacientes/me` e `PUT /pacientes/me`. |
| **Profissional** | `pages/profissional/home/HomeProfissional.jsx` | Painel diário do médico com resumo de atendimentos, métricas e atalhos rápidos. |
| **Profissional** | `pages/profissional/agenda/AgendaProfissional.jsx` | Agenda diária via `GET /profissionais/me/agendamentos`. Permite abrir modal de pré-triagem do paciente via `GET /profissionais/me/agendamentos/:id/triagem`. |
| **Profissional** | `pages/profissional/historico/HistoricoProfissional.jsx` | Histórico de atendimentos do médico com busca por paciente e filtros de período. |
| **Profissional** | `pages/profissional/perfil/PerfilProfissional.jsx` | Consulta/edição de perfil e gestão de disponibilidades via `GET /disponibilidades/me` e `POST/PUT/DELETE /disponibilidades`. |
| **Administração**| `pages/admin/Admin.jsx` | Hub administrativo integrando subcomponentes de gestão. |
| **Administração**| `pages/admin/ClinicasAdmin.jsx` | CRUD completo de clínicas via `POST`, `PUT`, `DELETE /clinicas`. |
| **Administração**| `pages/admin/EspecialidadesAdmin.jsx` | CRUD completo de especialidades via `POST`, `PUT`, `DELETE /especialidades`. |
| **Administração**| `pages/admin/ProfissionaisAdmin.jsx` | Credenciamento e inativação de médicos via `/profissionais`. |
| **Administração**| `pages/admin/SenhasAdmin.jsx` | Emissão de senha temporária operacional via `POST /admin/senha-temporaria`. |

---

## 4. Recursos de Acessibilidade

O front-end incorpora um painel modal acessível em todas as áreas logadas:
- **`AccessibilityPanel.jsx`:** Componente flutuante acionado pelo botão oficial de acessibilidade da ONU.
- **Opções disponíveis:**
  1. **Tipografia:** Alternância para a fonte inclusiva **OpenDyslexic**.
  2. **Tamanho do Texto:** Modos Normal, Grande e Extragrande (`data-font-size`).
  3. **Contraste:** Padrão, Alto Contraste e Modo Escuro (`data-theme`).
  4. **Movimento:** Redução de transições e animações (`data-motion="reduzido"`).
- **Persistência:** As preferências são guardadas em `localStorage` e recarregadas automaticamente em todas as páginas através de [`src/services/accessibility.js`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/src/services/accessibility.js).

---

## 5. Validação e Qualidade

- **Linting:** Configurado em [`eslint.config.js`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/eslint.config.js) com regras específicas para React e JSX, ignorando diretórios de build e módulos externos. Executar com `npm run lint`.
- **Compilação de Produção:** Testada e validada via `npm run build` (Vite), gerando os pacotes minificados e otimizados em `dist/`.
