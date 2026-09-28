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
- Página inicial em português com a proposta e os três perfis do sistema.
- Componentes reutilizáveis, página e conteúdo de apresentação em pastas separadas.
- Estilos para telas menores, navegação por âncoras, foco visível e atalho para pular ao conteúdo.
- Documentação inicial com instruções para executar e uma sequência de evolução.

A página atual é uma apresentação estática. **Ainda não há cadastro, login, pré-triagem, classificação de prioridade, agendamento, API, banco de dados ou PWA.** Nenhuma informação de paciente é coletada ou armazenada.

## A proposta completa

| Perfil | O que pretendemos oferecer |
| --- | --- |
| Paciente | Cadastro, pré-triagem, orientação inicial, busca e agendamento de atendimento, informações da consulta e contato de emergência. |
| Profissional de saúde | Consulta das informações de pré-triagem, pacientes, agenda e disponibilidade. |
| Administrador | Gestão de clínicas, profissionais, usuários, horários e agendamentos. |

O objetivo futuro é disponibilizar uma PWA, uma aplicação web que possa ser instalada em dispositivos compatíveis. A pré-triagem será orientativa e deverá apoiar a avaliação profissional, sem apresentar seu resultado como diagnóstico.

As personas, jornadas e funcionalidades previstas estão em [Visão geral e planejamento](docs/visao-geral.md).

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
│   └── visao-geral.md       # Problema, personas, jornadas e escopo futuro
├── public/
│   └── favicon.svg         # Ícone utilizado na aba e no cabeçalho
├── src/
│   ├── components/
│   │   ├── Header.jsx      # Marca e navegação da página
│   │   └── ProfileCard.jsx # Cartão reutilizável de perfil
│   ├── data/
│   │   └── profiles.js     # Conteúdo estático dos perfis previstos
│   ├── pages/
│   │   └── Home.jsx        # Página de apresentação
│   ├── App.jsx             # Composição principal da aplicação
│   ├── App.css             # Estilos da página e dos componentes atuais
│   ├── index.css           # Estilos globais e variáveis de cores
│   └── main.jsx            # Ponto de entrada do React
├── .gitignore              # Arquivos locais que não devem ser versionados
├── .nvmrc                  # Versão de referência do Node.js
├── eslint.config.js        # Regras de análise do código
├── index.html              # Documento HTML que recebe a aplicação
├── package.json            # Dependências e comandos
├── package-lock.json       # Versões fixadas das dependências
├── vite.config.js          # Configuração do Vite
└── README.md
```

`node_modules/` é a pasta local de dependências e `dist/` é gerada pelo build. Ambas são ignoradas pelo Git.

## Por onde começar a aprender React

O fluxo inicial é: `index.html` → `src/main.jsx` → `src/App.jsx` → `src/pages/Home.jsx`.

1. **`index.html`** contém o elemento `root` e carrega `main.jsx`. O conteúdo das telas será escrito nos componentes React.
2. **`main.jsx`** monta a aplicação dentro de `root` e importa os estilos globais.
3. **`App.jsx`** reúne cabeçalho, conteúdo principal e rodapé.
4. **`Home.jsx`** organiza a tela e transforma a lista de perfis em cartões usando `map`.
5. **`ProfileCard.jsx`** recebe `title`, `description` e `features` como propriedades (*props*). Assim, o mesmo componente apresenta conteúdos diferentes.

Como primeiro exercício, altere um texto em `src/data/profiles.js` e observe o resultado. Depois, experimente adicionar uma nova propriedade ao cartão. Estado com `useState`, eventos e formulários entrarão nas próximas etapas, quando houver interação para implementar.

### Onde colocar código novo

- `components/`: elementos reutilizáveis, como cabeçalho, cartões e, futuramente, campos de formulário.
- `pages/`: componentes que representam telas completas.
- `data/`: conteúdo estático de apresentação; futuros dados de demonstração devem ser fictícios e identificados como simulados.
- `index.css`: estilos globais; `App.css`: estilos da interface inicial. Conforme as telas crescerem, seus estilos podem ficar ao lado dos respectivos componentes.

Novas pastas devem surgir quando houver necessidade. Por exemplo, `services/` poderá reunir as chamadas à API quando começar a integração. Ainda não há roteador, autenticação, estado global ou cliente de API instalado.

## Como vamos evoluir

Esta é uma sequência sugerida para o grupo ajustar às aulas e às entregas, sem prazos ou responsáveis definidos nesta base.

| Etapa | Entrega proposta | Aprendizado principal |
| --- | --- | --- |
| 1 — Base atual | Apresentação, organização inicial e documentação | JSX, componentes, props, listas e CSS |
| 2 — Validação e protótipos | Conversar com possíveis usuários, revisar as dores e desenhar o fluxo do paciente | Requisitos e organização das telas |
| 3 — Interface do paciente | Telas de cadastro/login e formulário de pré-triagem com dados fictícios | Estado, eventos, formulários e navegação |
| 4 — Fluxo de agendamento | Busca, escolha de horário e confirmação simuladas | Composição de telas, validação e estados de interface |
| 5 — Profissional e administração | Agenda, consulta da pré-triagem e telas de gestão simuladas | Reutilização de componentes e organização por perfil |
| 6 — Integração fullstack | API Node.js, PostgreSQL, autenticação, permissões e persistência | Requisições, carregamento, erros e integração |
| 7 — Evolução e entrega | PWA, revisão de acessibilidade, testes dos fluxos e publicação | Qualidade e disponibilização da aplicação |

O primeiro recorte funcional sugerido é o percurso do paciente: informar a necessidade, preencher um formulário, consultar opções e simular um agendamento. O grupo ainda deve validar esse recorte. Chatbot, classificação de prioridade, notificações e contato de emergência precisam de requisitos próprios antes da implementação.

## Trabalho em grupo

1. Combinar uma tarefa pequena, com um responsável e um resultado esperado, antes de começar.
2. Ao configurar o repositório compartilhado, usar uma branch por tarefa, como `feat/formulario-pre-triagem` ou `docs/atualizar-readme`.
3. Usar nomes de componentes em `PascalCase`, como `ProfileCard.jsx`, e variáveis/funções em `camelCase`. Manter o padrão existente de aspas simples e ausência de ponto e vírgula.
4. Verificar a tela em largura de celular e desktop e navegar pelos links usando o teclado. Executar `npm run lint` e `npm run build` antes de entregar a alteração.
5. Abrir um pull request com o que mudou, como foi conferido e imagens quando úteis. Pedir revisão a outro integrante antes de integrar à branch principal.
6. Atualizar a documentação quando uma funcionalidade ou decisão técnica mudar.

Ainda não há suíte de testes automatizados. Lint e build verificam aspectos do código e da compilação, mas não substituem conferir o comportamento no navegador. Testes de comportamento serão adicionados conforme os formulários e fluxos surgirem.

Utilizar apenas dados fictícios nas demonstrações. Arquivos `.env` são ignorados pelo Git; se uma configuração passar a ser necessária, documentá-la e adicionar um `.env.example` sem credenciais. Valores enviados ao frontend ficam acessíveis no navegador.
