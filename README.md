# Saúde na Palma da Mão

Projeto Integrador do 3º período: uma proposta para reduzir filas e o tempo de espera nas recepções de clínicas, permitindo que o paciente inicie etapas do atendimento pelo celular.

Este repositório é o ponto de partida do **frontend em React**. Nesta etapa, o foco é aprender a tecnologia, organizar o código e construir uma base para o trabalho em grupo. A aplicação fullstack será desenvolvida aos poucos.

## Integrantes

- Gabriel Tenório
- Luís Bezerra
- Lorena Torres
- Mariana Oliveira
- Renata Oliveira

## O que existe hoje

- React com JavaScript, Vite e ESLint configurados.
- Página institucional, home profissional de demonstração e nove telas de protótipo de acesso e do paciente: login, cadastro, área do paciente, pré-triagem, resultado, clínicas, escolha de profissional, agendamento e confirmação.
- Páginas agrupadas por contexto, CSS junto das telas e layout compartilhado separado da navegação.
- Tokens atuais centralizados e estilos globais carregados pelo ponto de entrada.
- Style guide baseado no Figma e documentação da estrutura e das próximas entregas.

**Existe navegação de demonstração, mas os fluxos ainda não estão completos.** O login apenas troca de tela; as respostas e escolhas não são compartilhadas; a confirmação não registra uma consulta. A home profissional usa dados fictícios do Figma; seus painéis locais não estão ligados a uma API. Cadastro, autenticação, API, banco de dados e PWA ainda precisam de implementação funcional.

A reorganização preservou o protótipo existente. As limitações conhecidas, inclusive o tratamento pendente do envio do cadastro e o resultado fixo da pré-triagem, estão em [Estrutura do frontend e próximas entregas](docs/estrutura-frontend.md). Use somente dados fictícios.

## A proposta completa

| Perfil | O que pretendemos oferecer |
| --- | --- |
| Paciente | Cadastro, pré-triagem, orientação inicial, busca e agendamento de atendimento, informações da consulta e contato de emergência. |
| Profissional de saúde | Consulta das informações de pré-triagem, pacientes, agenda e disponibilidade. |
| Administrador | Gestão de clínicas, profissionais, usuários, horários e agendamentos. |

O objetivo futuro é disponibilizar uma PWA, uma aplicação web que possa ser instalada em dispositivos compatíveis. A pré-triagem será orientativa e deverá apoiar a avaliação profissional, sem apresentar seu resultado como diagnóstico.

As personas, jornadas e funcionalidades previstas estão em [Visão geral e planejamento](docs/visao-geral.md).

O [Style guide do frontend](docs/style-guide.md) documenta o design do Figma: cores, tipografia, espaçamentos, componentes e orientações para padronizar as páginas. O guia distingue os valores observados no design das propostas de implementação e dos ajustes ainda pendentes.

A [Estrutura do frontend e próximas entregas](docs/estrutura-frontend.md) explica onde colocar cada arquivo, quais telas existem e o que falta nos fluxos de paciente e profissional.

## Tecnologias

| Tecnologia | Papel no projeto | Situação |
| --- | --- | --- |
| React + React DOM | Construção e renderização dos componentes da interface | Configurados |
| JavaScript e JSX | Lógica e marcação dos componentes | Em uso |
| CSS | Aparência e adaptação a diferentes telas | Em uso |
| Vite | Servidor de desenvolvimento e geração do build | Configurado |
| ESLint | Análise estática para identificar problemas no código | Configurado |
| Node.js | Execução das ferramentas de desenvolvimento; futuramente também da API | Usado nas ferramentas |
| PostgreSQL | Persistência dos dados no futuro backend | Planejado |
| PWA | Instalação e definição dos recursos disponíveis sem conexão | Planejada |

JavaScript foi mantido nesta base para concentrar o aprendizado inicial em React. Uma eventual adoção de TypeScript será uma decisão futura do grupo. As dependências declaradas estão em `package.json`, e suas versões fixadas estão em `package-lock.json`.

## Como executar

Pré-requisitos: **Node.js 24** como versão de referência desta base e npm. O arquivo `.nvmrc` registra essa versão para quem usa um gerenciador de versões; ele não instala o Node automaticamente.

Abra um terminal na pasta do projeto e execute:

```bash
npm ci
npm run dev
```

`npm ci` instala as dependências a partir do `package-lock.json`. Abra no navegador o endereço mostrado pelo Vite no terminal, normalmente `http://localhost:5173`. Para encerrar o servidor, use `Ctrl+C`.

**Windows / PowerShell:** se aparecer a mensagem de que `npm.ps1` não pode ser carregado porque a execução de scripts está desabilitada, utilize `npm.cmd`:

```powershell
npm.cmd ci
npm.cmd run dev
```

A mesma alternativa vale para os demais comandos npm. Não é necessário alterar a política de execução do PowerShell.

Neste momento, não é necessário configurar `.env`, API ou banco de dados. Para visualizar a aplicação, use o servidor do Vite; abrir `index.html` diretamente não executa esta base React corretamente.

## Comandos disponíveis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com atualização ao salvar. |
| `npm run lint` | Verifica o código com ESLint. |
| `npm run build` | Gera os arquivos de produção na pasta `dist/`. |
| `npm run preview` | Permite conferir localmente o build já gerado. Execute `build` antes. |

O `preview` serve para conferência local. A publicação da aplicação será definida em uma etapa futura.

## Estrutura atual

```text
saude-palma-mao/
├── docs/
│   ├── estrutura-frontend.md # Organização, inventário e próximas entregas
│   ├── style-guide.md       # Referência visual extraída do Figma
│   └── visao-geral.md       # Problema, personas e jornadas
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx # Cabeçalho, conteúdo, rodapé e atalho acessível
│   │   │   ├── AppLayout.css
│   │   │   ├── Header.jsx
│   │   │   ├── ProfessionalLayout.jsx # Navegação do portal profissional
│   │   │   └── ProfessionalLayout.css
│   │   ├── profissional/
│   │   │   ├── AppointmentCard.jsx
│   │   │   ├── AppointmentCard.css
│   │   │   ├── ProfessionalIcon.jsx
│   │   │   ├── ProfessionalIcon.css
│   │   │   ├── ProfessionalHomePanel.jsx
│   │   │   ├── ProfessionalHomePanel.css
│   │   │   ├── agendaProfissional/
│   │   │   │   ├── AgendaDaySelector.jsx/.css
│   │   │   │   ├── AgendaAppointmentRow.jsx/.css
│   │   │   │   └── AgendaAvailableSlot.jsx/.css
│   │   │   └── panels/     # Prévias e formulários da home
│   │   │       ├── AgendaPreview.jsx
│   │   │       ├── HistoryPreview.jsx
│   │   │       ├── AvailabilityForm.jsx
│   │   │       ├── ProfilePreview.jsx
│   │   │       └── TriagePanel.jsx
│   │   └── ui/
│   │       ├── PriorityTag.jsx
│   │       └── PriorityTag.css
│   ├── pages/
│   │   ├── institucional/
│   │   │   ├── Home.jsx
│   │   │   └── Home.css
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Cadastro.jsx
│   │   │   └── Auth.css     # Estilos compartilhados das telas de acesso
│   │   ├── paciente/
│   │   │   ├── Paciente.jsx
│   │   │   ├── Triagem.jsx
│   │   │   ├── Resultado.jsx
│   │   │   ├── Clinicas.jsx
│   │   │   ├── EscolhaProfissional.jsx
│   │   │   ├── Agendamento.jsx
│   │   │   ├── Confirmacao.jsx
│   │   │   └── …           # Cada JSX desta pasta tem seu CSS de mesmo nome
│   │   └── profissional/
│   │       ├── HomeProfissional.jsx
│   │       ├── HomeProfissional.css
│   │       ├── AgendaProfissional.jsx
│   │       └── AgendaProfissional.css
│   ├── assets/
│   │   ├── fonts/          # Inter e Nunito locais
│   │   └── icons/profissional/ # SVGs exportados do Figma
│   ├── data/
│   │   ├── profissional.js # Dados demonstrativos da home
│   │   └── agendaProfissional.js # Dias e consultas de demonstração
│   ├── styles/
│   │   ├── fonts.css       # Fontes locais
│   │   ├── tokens.css      # Valores efetivos do protótipo atual
│   │   ├── global.css      # Base HTML, tipografia atual e foco
│   │   └── shared.css      # Classes recorrentes de botões e textos
│   ├── App.jsx             # Estado da tela e transições do protótipo
│   └── main.jsx            # Entrada React e importação dos estilos comuns
├── AGENTS.md              # Padrão de organização para agentes e contribuidores
├── .gitignore
├── .nvmrc
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

`node_modules/` é a pasta local de dependências e `dist/` é gerada pelo build. Ambas são ignoradas pelo Git. A home profissional está em `#profissional` e a agenda em `#agenda-profissional`; histórico e perfil completos continuam como próximas etapas.

`EscolhaProfissional.jsx` pertence ao paciente: é a seleção de quem realizará o atendimento. Ela substitui o antigo nome `Profissional.jsx`, que poderia ser confundido com a área de trabalho do médico.

Mantemos `profissional` como nome da área. `HomeProfissional` e `AgendaProfissional` são páginas completas; `ProfessionalHomePanel` também é usado para os diálogos demonstrativos. `AgendaPreview`, `HistoryPreview` e `ProfilePreview` continuam sendo amostras do diálogo da home. Componentes reutilizáveis, como `AppointmentCard`, `ProfessionalIcon` e `ProfessionalLayout`, conservam nomes independentes da home.

## Por onde começar a aprender React

O fluxo inicial é: `index.html` → `src/main.jsx` → `src/App.jsx` → layout e página selecionada.

1. **`index.html`** contém o elemento `root` e carrega `main.jsx`.
2. **`main.jsx`** importa os estilos comuns e monta a aplicação dentro de `root`.
3. **`App.jsx`** usa `useState` para escolher a tela; as funções passadas por propriedades (*props*) permitem avançar e voltar.
4. **`AppLayout.jsx`** recebe o conteúdo em `children` e reúne os elementos externos às páginas.
5. **As páginas** compõem o conteúdo e importam seu CSS. Login e cadastro compartilham `Auth.css`.

Como primeiro exercício, altere um texto em `src/pages/paciente/Paciente.jsx` e observe o resultado. Depois, acompanhe a propriedade `onTriagem` até `App.jsx` para entender como um clique altera a tela. Os formulários ainda precisam de estado, validação e integração dos dados.

### Onde colocar código novo

- `pages/institucional/`: apresentação pública do projeto.
- `pages/auth/`: acesso e cadastro; o link para profissional abre a home demonstrativa.
- `pages/paciente/`: tarefas realizadas pelo paciente, inclusive a escolha do profissional.
- `pages/profissional/`: páginas completas do médico e seu CSS; atualmente a home e a agenda.
- `components/layout/`: estrutura externa às telas e navegação compartilhada.
- `components/profissional/`: cartões, ícones e diálogo do portal; conteúdos do diálogo em `panels/`.
- `components/ui/`: elementos compartilháveis, como etiquetas e futuros campos e botões.
- `styles/`: tokens e regras comuns. Estilos exclusivos ficam junto da página.

**Padrão do projeto:** `pages/` contém somente páginas e seu CSS. Todos os componentes, inclusive os exclusivos do médico, ficam em `components/`. Não criar pastas `components/` dentro de `pages/`. O [AGENTS.md](AGENTS.md) orienta agentes e contribuidores a manter essa organização.

Os dados profissionais, consultas e histórico são exemplos locais em `data/profissional.js`; os dias da agenda ficam em `data/agendaProfissional.js`. As páginas passam os registros aos componentes por propriedades; disponibilidade e consultas ainda não persistem nem se conectam a uma API. Chamadas futuras ficam em `services/`.

O tema `.theme-figma` em `tokens.css` delimita os valores visuais do portal profissional; fontes e SVGs do Figma são carregados de `assets/`. `shared.css` reúne classes existentes e ainda não equivale à biblioteca completa proposta no style guide.

A navegação profissional usa os hashes `#profissional` e `#agenda-profissional`; histórico e perfil abrem painéis demonstrativos. Ainda não há autenticação nem persistência; os estados locais são reiniciados ao recarregar.

## Como vamos evoluir

Esta é uma sequência sugerida para o grupo ajustar às aulas e às entregas, sem prazos ou responsáveis definidos nesta base.

| Etapa | Entrega proposta | Aprendizado principal | Situação |
| --- | --- | --- | --- |
| 1 — Base atual | Apresentação, organização por contexto e documentação | JSX, componentes, props, estado e CSS | Base organizada |
| 2 — Validação e protótipos | Validar as dores, aplicar o style guide e completar as referências das telas | Requisitos e padrões visuais | Design documentado; home e agenda profissionais implementadas |
| 3 — Interface do paciente | Conectar acesso, pré-triagem e acompanhamento das consultas | Estado, eventos, formulários e navegação | Telas parciais; dados e validação pendentes |
| 4 — Fluxo de agendamento | Preservar escolhas, confirmar e consultar agendamentos simulados | Composição de telas e estados de interface | Telas existentes; registros pendentes |
| 5 — Profissional e administração | Portal profissional, detalhes de pré-triagem; gestão administrativa em recorte posterior | Reutilização e organização por perfil | Home e agenda profissionais implementadas; histórico e perfil pendentes |
| 6 — Integração fullstack | API Node.js, PostgreSQL, autenticação, permissões e persistência | Requisições, carregamento, erros e integração | Planejada |
| 7 — Evolução e entrega | PWA, revisão de acessibilidade, testes dos fluxos e publicação | Qualidade e disponibilização da aplicação | Planejada |

O primeiro recorte funcional sugerido é o percurso do paciente: informar a necessidade, preencher um formulário, consultar opções e simular um agendamento. O grupo ainda deve validar esse recorte. Chatbot, classificação de prioridade, notificações e contato de emergência precisam de requisitos próprios antes da implementação.

## Trabalho em grupo

1. Combinar uma tarefa pequena, com um responsável e um resultado esperado, antes de começar.
2. Ao configurar o repositório compartilhado, usar uma branch por tarefa, como `feat/formulario-pre-triagem` ou `docs/atualizar-readme`.
3. Usar nomes de componentes em `PascalCase`, como `AppLayout.jsx`, e variáveis/funções em `camelCase`. Manter o padrão existente de aspas simples e ausência de ponto e vírgula.
4. Verificar a tela em largura de celular e desktop e navegar pelos links usando o teclado. Executar `npm run lint` e `npm run build` antes de entregar a alteração.
5. Abrir um pull request com o que mudou, como foi conferido e imagens quando úteis. Pedir revisão a outro integrante antes de integrar à branch principal.
6. Atualizar a documentação quando uma funcionalidade ou decisão técnica mudar.

Ainda não há suíte de testes automatizados. Lint e build verificam aspectos do código e da compilação, mas não substituem conferir o comportamento no navegador. Testes de comportamento serão adicionados conforme os formulários e fluxos surgirem.

Utilizar apenas dados fictícios nas demonstrações. Arquivos `.env` são ignorados pelo Git; se uma configuração passar a ser necessária, documentá-la e adicionar um `.env.example` sem credenciais. Valores enviados ao frontend ficam acessíveis no navegador.
