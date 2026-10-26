# Visão Geral e Arquitetura do Produto

Este documento descreve o propósito, a arquitetura e as jornadas do **Desafila** (Saúde na Palma da Mão), projeto acadêmico do Senac Pernambuco. Ele apresenta os problemas enfrentados, a solução desenvolvida e os papéis atendidos pelo ecossistema da aplicação.

---

## 1. Problema e Proposta de Valor

### O Problema
- **Para os Pacientes:** Filas longas em recepções de clínicas e postos, incerteza sobre qual especialidade médica buscar diante de certos sintomas, dificuldade de encontrar horários compatíveis e falta de histórico centralizado dos seus agendamentos e pré-triagens.
- **Para os Profissionais de Saúde:** Recepções sobrecarregadas, falta de contexto inicial dos pacientes antes do atendimento, conflitos de horários em agendas e excesso de burocracia manual.
- **Para a Gestão de Clínicas:** Dificuldade em cadastrar e organizar disponibilidade de profissionais, clínicas e especialidades em um canal digital unificado.

### A Solução
O **Desafila** integra paciente, médico e gestão em uma plataforma web responsiva e acessível:
1. **Pré-triagem inteligente e orientativa:** O paciente responde a um questionário estruturado por categorias de sintomas, recebendo uma recomendação imediata do nível de cuidado adequado (*Teleconsulta*, *Atendimento Presencial* ou *Possível Urgência*). **Atenção:** A pré-triagem é estritamente orientativa e de apoio, não constituindo diagnóstico médico.
2. **Agendamento simplificado e dinâmico:** Cruzamento das janelas de disponibilidade cadastradas pelos médicos com as consultas já marcadas, oferecendo ao paciente apenas os horários livres reais (em blocos de 30 minutos).
3. **Portal do Profissional:** O médico acessa sua agenda diária, visualiza o histórico de atendimentos e consulta previamente os sintomas e a classificação de pré-triagem informados pelo paciente para aquela consulta específica.
4. **Painel Administrativo:** Gestão centralizada de clínicas, especialidades, corpo clínico e recuperação operacional de senhas.
5. **Inclusão e Acessibilidade:** Painel acessível integrado com suporte a fontes para dislexia (*OpenDyslexic*), controle de tamanho de texto, alto contraste, tema escuro e redução de movimento.

---

## 2. Perfis e Funcionalidades

| Perfil | Funcionalidades Principais |
| --- | --- |
| **Paciente** | • Cadastro com validação de CPF e dados de contato de emergência.<br>• Login seguro via JWT.<br>• Questionário de pré-triagem por categoria de sintomas com feedback imediato.<br>• Catálogo e busca de clínicas e profissionais por especialidade.<br>• Agendamento de consultas com vinculação opcional da pré-triagem realizada.<br>• Cancelamento de consultas agendadas.<br>• Consulta ao histórico de agendamentos e histórico de pré-triagens.<br>• Edição de dados cadastrais e atualização de contato de emergência. |
| **Profissional de Saúde** | • Login médico exclusivo.<br>• Visão geral da rotina do dia e métricas de atendimentos.<br>• Agenda diária interativa com filtros por data, listagem de consultas e horários livres.<br>• Acesso detalhado à pré-triagem do paciente vinculada à consulta marcada.<br>• Histórico completo de consultas realizadas com busca e filtros rápidos.<br>• Configuração e gestão de janelas de disponibilidade (dias da semana e horários).<br>• Perfil profissional com edição de dados e vínculo a clínicas. |
| **Administrador** | • Autenticação administrativa restrita.<br>• Gestão completa (CRUD) de clínicas parceiras.<br>• Gestão completa (CRUD) de especialidades médicas.<br>• Gestão completa (CRUD) e inativação de profissionais de saúde.<br>• Emissão de senhas temporárias para suporte e recuperação de acesso. |
| **Recursos Transversais** | • PWA com manifesto para instalação mobile.<br>• Painel de Acessibilidade (OpenDyslexic, contraste, redimensionamento de fonte).<br>• Interface adaptativa (Mobile First com suporte a Desktop). |

---

## 3. Personas de Referência

### Roberta Alves — Paciente
- **Idade e Perfil:** 42 anos, analista administrativa. Utiliza principalmente o smartphone para resolver tarefas do dia a dia.
- **Contexto:** Apresenta sintomas recorrentes de dor de cabeça e febre leve, mas não tem certeza se deve procurar um clínico geral, neurologista ou pronto atendimento.
- **Dores:** Longas esperas em filas de recepção, medo de marcar a especialidade incorreta e perda de tempo em deslocamentos desnecessários.
- **Expectativa:** Iniciar o atendimento pelo celular, responder perguntas claras sobre o que está sentindo, agendar em uma clínica próxima e ter confirmação na tela.

### Dr. Rafael Mendes — Profissional de Saúde
- **Idade e Perfil:** 36 anos, médico especialista em Clínica Geral e Medicina da Família.
- **Contexto:** Atende em mais de uma clínica durante a semana e necessita de uma rotina pontual e sem sobreposição de horários.
- **Dores:** Chegada de pacientes sem informações prévias sobre a queixa principal, recepções que agendam horários conflitantes e falta de visibilidade da agenda diária.
- **Expectativa:** Abrir o sistema no celular ou computador da clínica, conferir a lista de pacientes do dia, ver antecipadamente o que o paciente respondeu na triagem e gerenciar com precisão seus horários de atendimento.

### Carlos Eduardo — Administrador da Clínica
- **Idade e Perfil:** 48 anos, gestor de operações clínicas.
- **Contexto:** Coordena as unidades conveniadas, controla o credenciamento de médicos e presta suporte operacional a pacientes e médicos com dificuldades de acesso.
- **Dores:** Processos manuais de cadastro em planilhas e dificuldade em manter atualizado o catálogo de especialidades e clínicas parceiras.
- **Expectativa:** Painel único e direto para cadastrar unidades, especialidades e médicos, além de poder gerar senhas temporárias seguras para usuários que esqueceram suas credenciais.

---

## 4. Arquitetura da Solução

```text
┌────────────────────────────────────────────────────────┐
│                  FRONTEND (SPA / PWA)                  │
│  React 19 + Vanilla CSS + Vite                         │
│  • Hospedagem: Vercel (https://saudepalmamao.vercel.app) │
│  • Navegação por hash e estado de jornada               │
│  • Gerenciador de Sessão por Perfil                    │
│  • Painel de Acessibilidade (OpenDyslexic, Contraste)   │
└───────────────────────────┬────────────────────────────┘
                            │
              Requisições HTTPS / JSON
              (Bearer Token JWT no Header)
                            │
┌───────────────────────────▼────────────────────────────┐
│                    BACKEND (API REST)                  │
│  Node.js + Express 5                                   │
│  • Hospedagem: Render (https://desafila-api.onrender.com)│
│  • Documentação OpenAPI / Swagger UI (/api-docs)       │
│  • Middlewares: Helmet, CORS, Rate Limit, Auth JWT     │
│  • Motor de Classificação Orientativa de Triagem       │
└───────────────────────────┬────────────────────────────┘
                            │
               Pool pg & ORM Sequelize
                            │
┌───────────────────────────▼────────────────────────────┐
│                  BANCO DE DADOS (SGBD)                 │
│  PostgreSQL (Relacional)                               │
│  • Extensão pgcrypto (UUIDs nativos)                   │
│  • Tabelas: pacientes, profissionais, clínicas,        │
│    especialidades, disponibilidades, agendamentos,     │
│    categorias_sintomas, perguntas, respostas,          │
│    historico_triagem_paciente                          │
└────────────────────────────────────────────────────────┘
```

---

## 5. Integração entre Ambientes

- **Ambiente Local:** O Vite roda na porta `5173` e possui um proxy configurado em `vite.config.js` para redirecionar chamadas de `/api/*` para a API local na porta `3000` (`http://localhost:3000`).
- **Ambiente de Produção:** O frontend na Vercel comunica-se diretamente com a API no Render (`https://desafila-api.onrender.com`), utilizando cabeçalhos CORS restritos e criptografia HTTPS.
- **Segurança de Sessão:** Cada papel possui isolamento de chave no armazenamento local (`saude_token`, `saude_profissional_token`, `saude_admin_token`). Em caso de token expirado (código HTTP `401`), o cliente intercepta o erro, limpa o token e redireciona automaticamente para a respectiva tela de login.
