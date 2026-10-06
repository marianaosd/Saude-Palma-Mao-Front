# Estrutura do frontend e próximas entregas

Organização registrada em **6 de outubro de 2026**, após a análise do [style guide](style-guide.md). A [visão geral](visao-geral.md) descreve o produto e suas jornadas; o [README](../README.md) explica como executar o projeto.

## 1. Objetivo desta etapa

Preparar o código existente para desenvolver os fluxos de paciente e profissional em grupo. A home do profissional (`1:147`), a agenda (`2:424`) e o histórico (`2:754`) estão conectados à aplicação. O perfil completo e os fluxos de acesso ainda precisam de implementação.

A escolha de atendimento do paciente continua em `pages/paciente/EscolhaProfissional.jsx`. No portal médico, as páginas compõem componentes de `components/profissional/`; os painéis de demonstração foram retirados de `pages/profissional/components/`. Esta organização preserva os textos, o design e os comportamentos existentes.

## 2. Responsabilidade de cada pasta

| Local atual | Responsabilidade |
| --- | --- |
| `src/pages/institucional/` | Apresentação pública do projeto. |
| `src/pages/auth/` | Login e cadastro compartilhados pelos futuros perfis. Ter a opção de perfil na tela não significa que a autenticação esteja implementada. |
| `src/pages/paciente/` | Área do paciente, pré-triagem, resultado e escolha/agendamento de atendimento. |
| `src/pages/profissional/` | Páginas completas e seu CSS; atualmente a home `1:147`, a agenda `2:424` e o histórico `2:754`. |
| `src/components/layout/` | Estrutura externa às páginas: cabeçalho, conteúdo principal, rodapé e navegação por contexto. |
| `src/components/profissional/` | Componentes do portal médico: cartão de consulta, ícone e diálogo profissional. |
| `src/components/profissional/agendaProfissional/` | Seletor de dia, linha de consulta e faixa de horário livre da agenda. |
| `src/components/profissional/historicoProfissional/` | Filtros, cartão de atendimento e diálogo de detalhe do histórico. |
| `src/components/profissional/panels/` | Conteúdos internos do diálogo: agenda, histórico, horários, perfil e pré-triagem. Não são páginas completas. |
| `src/components/ui/` | Elementos visuais compartilháveis entre os perfis, como `PriorityTag`. |
| `src/data/` | Registros fictícios do profissional, consultas e histórico usados na demonstração. |
| `src/assets/` | SVGs, fontes e respectivas licenças. |
| `src/styles/` | Tokens atuais, estilos globais e classes visuais recorrentes. |
| `public/` | Arquivos públicos utilizados diretamente, como o favicon. |
| `docs/` | Requisitos, referência visual, decisões de organização e próximas entregas. |

Pastas a criar quando houver implementação para elas:

- `src/services/`: chamadas à API, quando o backend começar a ser integrado.

As pastas de componentes já existem. Acrescentar arquivos nelas conforme a necessidade, sem duplicar uma estrutura dentro de `pages/`.

Não criamos páginas vazias para representar funcionalidades futuras. Uma página só entra no inventário de implementadas quando tiver conteúdo e acesso pelo fluxo.

## 3. Componentes, navegação e estilos

### Composição atual

```text
main.jsx
  ├── fonts.css → tokens.css → global.css → shared.css
  └── App.jsx
       ├── AppLayout → páginas institucionais, de acesso e do paciente
       ├── HomeProfissional → ProfessionalLayout → ProfessionalHomePanel
       ├── AgendaProfissional → ProfessionalLayout
            ├── dados fictícios em data/agendaProfissional.js
            ├── componentes em profissional/agendaProfissional/
            └── ProfessionalHomePanel → conteúdos em profissional/panels/
       └── HistoricoProfissional → ProfessionalLayout
            ├── dados fictícios em data/profissional.js
            └── componentes em profissional/historicoProfissional/
```

`App.jsx` mantém `screen` com `useState` e passa ações às páginas por propriedades, como `onBack` e `onConfirmar`. Os identificadores das telas não são URLs. A seleção de profissional passou a usar `escolha-profissional`, evitando confusão com o futuro portal profissional.

O portal profissional abre a home por `#profissional`, a agenda por `#agenda-profissional` e o histórico por `#historico-profissional`, inclusive por acesso direto ou atualização. O perfil abre seu painel demonstrativo; `#inicio` retorna à página institucional. As demais telas continuam usando o estado de demonstração; uma implementação completa de rotas e do histórico do navegador ainda está pendente.

`AppLayout` conserva a estrutura institucional e do paciente. A home profissional usa `ProfessionalLayout`, com navegação fixa e área de conteúdo próprias; o cabeçalho interno não reutiliza a navegação institucional.

### CSS

- `styles/tokens.css`: conserva os tokens do protótipo anterior e define `.theme-figma`, o escopo de cores e componentes adotados no frame profissional.
- `styles/fonts.css`: declara as fontes locais Nunito 400 e Inter 400, carregadas em `main.jsx`.
- `styles/global.css`: base dos elementos HTML, fonte do sistema, foco e regras gerais.
- `styles/shared.css`: classes existentes de botões, rótulos e títulos de seção. Ainda não é uma biblioteca de componentes React.
- `components/layout/AppLayout.css`: estilos do cabeçalho, container, rodapé e atalho para o conteúdo.
- Cada página importa seu CSS de mesmo nome. Login e cadastro importam o mesmo `Auth.css`.
- Componentes com CSS próprio o importam no seu arquivo JSX: `ProfessionalIcon.css` pertence ao ícone, por exemplo, e não ao layout.
- Os conteúdos de `components/profissional/panels/` usam as classes comuns de `ProfessionalHomePanel.css`, importado pelo diálogo que os contém. Não duplicar essa folha para cada conteúdo.
- As media queries ficam junto das regras da página a que pertencem, nos arquivos correspondentes.

O CSS continua global, sem CSS Modules. Use classes específicas ao contexto e evite seletores genéricos no CSS de páginas. Na escolha de profissional, o prefixo passou de `professional-` para `professional-selection-`, deixando claro a qual fluxo esses estilos pertencem.

`ProfessionalLayout` possui composição e navegação próprias. `HomeProfissional.jsx` importa os dados de demonstração de `data/profissional.js` e os passa aos componentes por propriedades. `ProfessionalHomePanel` controla o diálogo e escolhe seu conteúdo; cada arquivo de `panels/` cuida de uma responsabilidade. Os componentes não importam páginas nem os registros fictícios diretamente. Rótulos de interface, como os títulos dos painéis, podem permanecer junto do componente.

### Convenções para o grupo

1. Componentes e páginas em `PascalCase`; variáveis e funções em `camelCase`.
2. Preservar JavaScript/JSX, aspas simples e ausência de ponto e vírgula.
3. Reservar `pages/` para páginas completas e seu CSS. **Não criar `components/` dentro de `pages/`.**
4. Componentes do médico ficam em `components/profissional/`, mesmo quando usados por uma única página; layouts em `components/layout/`; elementos compartilháveis entre perfis em `components/ui/`.
5. Importar estilos globais somente no ponto de entrada. Não redefinir tokens dentro das páginas.
6. Extrair componentes com base em repetição real; não criar uma biblioteca inteira antes de seus primeiros usos.
7. Ao adicionar uma página, implementar sua entrada e saída na navegação e atualizar o inventário abaixo.
8. Passar registros e ações por propriedades; concentrar os exemplos de dados em `data/`, mantendo o estado de tela na página e o estado de edição local no formulário.
9. Consultar o [AGENTS.md](../AGENTS.md): ele registra esse padrão para as próximas alterações feitas por agentes no repositório.
10. Manter `profissional` como nome da área. Usar `Home` em componentes exclusivos da página inicial e `Preview` nas amostras de futuras páginas. Componentes reutilizáveis mantêm nomes genéricos, como `AppointmentCard`, `ProfessionalIcon` e `ProfessionalLayout`.

### Exemplo para a próxima página profissional

`AgendaProfissional.jsx` e `AgendaProfissional.css` implementam a página completa baseada no frame `2:424`. Seus blocos visuais ficam em `components/profissional/agendaProfissional/`. O `AgendaPreview` da home continua sendo uma amostra em um diálogo e não substitui essa página.

`HistoricoProfissional.jsx` e `HistoricoProfissional.css` implementam o frame `2:754`. `HistoryFilters`, `HistoryCard` e `HistoryDetailDialog` ficam em `components/profissional/historicoProfissional/`; busca e filtros usam registros locais de `data/profissional.js`.

Os painéis foram separados em `AgendaPreview`, `HistoryPreview`, `AvailabilityForm`, `ProfilePreview` e `TriagePanel`. `ProfessionalHomePanel` mantém abertura, fechamento e título do diálogo. O estado de disponibilidade, os horários salvos durante a sessão e a escolha do painel continuam sob responsabilidade de `HomeProfissional`.

`HomeProfissional.jsx` continua identificando a página inicial. Para as próximas páginas completas, seguir os nomes `AgendaProfissional.jsx`, `HistoricoProfissional.jsx` e `PerfilProfissional.jsx`, sempre com o CSS correspondente. O sufixo `Preview` identifica apenas as amostras atuais; esses componentes não substituem as páginas planejadas.

## 4. O que o style guide define para os próximos passos

O guia registra 13 frames, com largura de referência de 402px. **Isso não significa 13 páginas obrigatórias:** há cópias de escolha de perfil, duas versões da agenda e três etapas de uma mesma pré-triagem.

A direção visual usa verde-água, superfícies claras, Nunito para títulos, Inter para leitura, cartões arredondados e composições voltadas ao celular. A seção 2 do guia identifica os frames; telas sem referência serão extensões documentadas do sistema.

O portal profissional aplica Nunito/Inter locais, cores, ícones e cartões do frame `1:147`. `.theme-figma` mantém esses tokens isolados; o protótipo institucional e as telas existentes do paciente ainda usam seus estilos anteriores. Os painéis profissionais são interações demonstrativas, sem persistência ou API.

Antes de padronizar os componentes, registrar as decisões sobre contraste dos botões, semântica de prioridade, estados selecionados e foco. “Moderado” aparece de formas diferentes no paciente e na agenda profissional; o style guide documenta essa diferença sem estabelecer uma regra clínica. O desktop, as fontes definitivas e os ícones também precisam da implementação e conferência descritas no guia.

## 5. Inventário das telas existentes

“Existente” significa que o componente está conectado à navegação de demonstração, não que seus requisitos estejam concluídos.

| Página relativa a `src/pages/` | Referência visual | Situação funcional |
| --- | --- | --- |
| `institucional/Home.jsx` | Sem frame institucional no conjunto analisado | Apresentação e entrada no login; layout próprio existente. |
| `auth/Login.jsx` | Login profissional, nó `1:70`; adaptar acesso por perfil | Formulário que leva ao paciente, sem autenticação. |
| `auth/Cadastro.jsx` | Extensão do sistema, sem frame específico | Formulário visual; envio e validação pendentes. |
| `paciente/Paciente.jsx` | Home paciente, `2:1051` | Entrada na triagem; atalhos e dados pessoais ainda fixos. |
| `paciente/Triagem.jsx` | Três etapas, `2:1221`, `2:1337`, `2:1421` | Hoje é uma única tela; faltam etapas, estado e validação. |
| `paciente/Resultado.jsx` | Resultado, `2:1501` | Conteúdo fixo; não interpreta respostas. |
| `paciente/Clinicas.jsx` | Extensão do sistema, sem frame específico | Lista fixa; não guarda a clínica selecionada. |
| `paciente/EscolhaProfissional.jsx` | Extensão do sistema, sem frame específico | Lista fixa; não guarda profissional/data/horário selecionados. |
| `paciente/Agendamento.jsx` | Extensão do sistema, sem frame específico | Resumo fixo; ainda não usa a seleção do paciente. |
| `paciente/Confirmacao.jsx` | Extensão do sistema, sem frame específico | Mensagem de confirmação; não cria registro de consulta. |
| `profissional/HomeProfissional.jsx` | Home profissional, nó `1:147` | Composição visual implementada; atalhos usam dados fictícios e estado local. Perfil ainda não é uma página completa. |
| `profissional/AgendaProfissional.jsx` | Agenda profissional, nó `2:424` (estado alternativo `2:604`) | Seleção de dia, consultas e configuração de disponibilidade em estado local. Registros são demonstrativos. |
| `profissional/HistoricoProfissional.jsx` | Histórico profissional, nó `2:754` | Busca, filtros, agrupamento por data e detalhes; registros e classificações são demonstrativos. |

## 6. Telas e experiências pendentes

Os nomes abaixo são propostas. Algumas experiências podem ser seções, etapas ou diálogos, em vez de páginas separadas.

| Contexto | Próxima tela/experiência | Base e resultado esperado |
| --- | --- | --- |
| Acesso | Escolha de perfil | Frames `1:2` e `2:1169` repetem a composição; criar uma experiência compartilhada com seleção definida. |
| Acesso | Recuperação de acesso | Ação prevista no login do Figma; conteúdo e fluxo ainda precisam ser definidos. |
| Paciente | Pré-triagem em três etapas | Adaptar `Triagem.jsx`, preservando as respostas ao avançar e voltar. |
| Paciente | Meus agendamentos e detalhes | Requisito da jornada; exibir o registro confirmado e seus dados. Sem frame específico no guia. |
| Paciente | Contato de emergência | Requisito da visão geral; definir cadastro, acionamento e compartilhamento antes de implementar. |
| Paciente | Histórico | Atalho já presente no protótipo; definir o recorte. O frame de histórico do Figma é profissional. |
| Profissional | Home do profissional | Nó `1:147`: composição implementada; ligar disponibilidade e resumo aos registros persistentes. |
| Profissional | Agenda | Implementada em `profissional/AgendaProfissional.jsx`; restam integração e persistência dos registros. |
| Profissional | Histórico | Implementado em `profissional/HistoricoProfissional.jsx`; restam integrar e persistir atendimentos. |
| Profissional | Perfil | Nó `2:902`: identificação, dados profissionais e clínicas vinculadas. |
| Profissional | Detalhes do atendimento e leitura da pré-triagem | Requisito da jornada e ação dos cartões; composição de detalhes ainda não especificada. |
| Profissional | Configuração da disponibilidade | Requisito da jornada; definir dias/horários e alimentar a oferta vista pelo paciente. |
| Experiência geral | Confirmações e lembretes | Definir canais e estados; não pressupõe uma página exclusiva. |

A área administrativa e a PWA permanecem na visão completa do produto. Não são tratadas como telas já desenvolvidas nesta etapa de organização.

## 7. Sequência sugerida de desenvolvimento

1. **Tratar limitações imediatas:** interceptar o envio do cadastro e validar os campos; explicitar a simulação do resultado da triagem.
2. **Completar o portal profissional:** agenda, histórico, perfil, detalhes da consulta e leitura da pré-triagem. Ligar os controles locais aos registros escolhidos.
3. **Conectar o paciente:** acesso por perfil, etapas da triagem e seleção de clínica/profissional/horário. Criar “Meus agendamentos” e seus detalhes.
4. **Padronizar as páginas restantes:** resolver pendências de contraste/seleção, aplicar os tokens e conectar os elementos que serão compartilhados.
5. **Completar a navegação:** rotas por URL e histórico do navegador para os fluxos restantes. Definir o que persiste antes de adicionar armazenamento.
6. **Completar os requisitos complementares:** contato de emergência, lembretes e itens priorizados com o grupo; então, integrar API, autenticação real e banco de dados.

Para conectar os dois perfis, cada consulta precisa identificar paciente, profissional, clínica, data/hora, pré-triagem e situação. Evitar repetir nomes e horários como textos independentes em cada tela. Enquanto não houver backend, usar dados fictícios e comunicar os limites da simulação.

**Critério de conclusão do primeiro fluxo integrado:** o paciente escolhe um atendimento, confirma e encontra a consulta na sua área; no perfil profissional correspondente, aparece a mesma consulta com as respostas da pré-triagem. As mudanças de situação devem ser coerentes nos dois contextos. A simulação no mesmo navegador não substitui a futura integração entre usuários/dispositivos.

## 8. Limitações conhecidas preservadas nesta reorganização

- Cadastro sem tratamento de envio: o formulário pode enviar os campos, inclusive senhas, na URL por GET. Corrigir antes de usar informações reais ou apresentar o cadastro como funcional.
- Login sem validação de credenciais e sem sessão/perfil funcional.
- Pré-triagem sem coleta das respostas e com resultado fixo.
- Escolhas de clínica, médico e horário descartadas; resumo e confirmação fixos.
- Atalhos do paciente sem ação, ausência da lista de consultas e dados profissionais sem persistência.
- As telas, salvo `#profissional`, navegam por estado: recarregar retorna ao início; os links do cabeçalho institucional ainda não retornam à Home a partir de todas as telas.
- A nova home aplica os tokens e as fontes do frame profissional. As demais telas ainda precisam da migração visual e da revisão responsiva.

## 9. Verificação por entrega

Executar `npm run lint` e `npm run build` e conferir o fluxo alterado no navegador. Para páginas novas ou redesenhadas, usar o checklist da seção 14 do [style guide](style-guide.md), incluindo 402px, largura menor, teclado, texto ampliado e estados aplicáveis.

Para uma reorganização, conferir também imports, transições, carregamento dos estilos, ordem das regras e referências da documentação. Comparar a renderização antes/depois ajuda a detectar mudanças acidentais, mas não substitui a revisão visual no navegador.
