# Estrutura do frontend e próximas entregas

Organização registrada em **6 de outubro de 2026**, após a análise do [style guide](style-guide.md). A [visão geral](visao-geral.md) descreve o produto e suas jornadas; o [README](../README.md) explica como executar o projeto.

## 1. Objetivo desta etapa

Preparar o código existente para desenvolver os fluxos de paciente e profissional em grupo. Esta etapa reorganiza arquivos, separa responsabilidades e atualiza o inventário. A implementação das telas que faltam e a migração visual do Figma serão as próximas entregas.

A interface atual foi preservada: componentes de página, textos e transições continuam sendo os do protótipo. A principal renomeação é `Profissional.jsx` → `pages/paciente/EscolhaProfissional.jsx`, pois essa tela é utilizada pelo paciente para selecionar atendimento.

## 2. Responsabilidade de cada pasta

| Local atual | Responsabilidade |
| --- | --- |
| `src/pages/institucional/` | Apresentação pública do projeto. |
| `src/pages/auth/` | Login e cadastro compartilhados pelos futuros perfis. Ter a opção de perfil na tela não significa que a autenticação esteja implementada. |
| `src/pages/paciente/` | Área do paciente, pré-triagem, resultado e escolha/agendamento de atendimento. |
| `src/components/layout/` | Estrutura externa às páginas: cabeçalho, conteúdo principal, rodapé e atalho acessível. |
| `src/styles/` | Tokens atuais, estilos globais e classes visuais recorrentes. |
| `public/` | Arquivos públicos utilizados diretamente, como o favicon. |
| `docs/` | Requisitos, referência visual, decisões de organização e próximas entregas. |

Pastas a criar quando houver implementação para elas:

- `src/pages/profissional/`: painel, agenda, histórico, perfil e acompanhamento de atendimentos do profissional.
- `src/components/ui/`: componentes realmente compartilhados, como botão, campo e aviso, com as variantes definidas durante a adoção do style guide.
- `src/data/`: dados fictícios centralizados quando começarmos a conectar os fluxos.
- `src/services/`: chamadas à API quando o backend começar a ser integrado.
- `src/assets/fonts/` e `src/assets/icons/`: fontes e ícones locais, caso essa seja a forma escolhida de disponibilizá-los.

Não criamos páginas vazias para representar funcionalidades futuras. Uma página só entra no inventário de implementadas quando tiver conteúdo e acesso pelo fluxo.

## 3. Componentes, navegação e estilos

### Composição atual

```text
main.jsx
  ├── styles/tokens.css → styles/global.css → styles/shared.css
  └── App.jsx
       ├── estado da tela e funções de navegação
       └── AppLayout.jsx
            ├── Header.jsx
            ├── página selecionada
            └── rodapé
```

`App.jsx` mantém `screen` com `useState` e passa ações às páginas por propriedades, como `onBack` e `onConfirmar`. Os identificadores das telas não são URLs. A seleção de profissional passou a usar `escolha-profissional`, evitando confusão com o futuro portal profissional.

`AppLayout` extrai a estrutura que já era repetida em torno das páginas. É uma estrutura provisória do protótipo: na adoção do design, acesso, paciente e profissional terão composições apropriadas ao seu contexto. O cabeçalho institucional não é a especificação do cabeçalho interno, e `AppLayout` ainda não implementa `AppShell`, `TopBar` ou a navegação profissional descritos no guia.

### CSS

- `styles/tokens.css`: única declaração dos tokens de cor atuais. Conserva os valores que já prevaleciam no antigo `App.css`.
- `styles/global.css`: base dos elementos HTML, fonte do sistema, foco e regras gerais.
- `styles/shared.css`: classes existentes de botões, rótulos e títulos de seção. Ainda não é uma biblioteca de componentes React.
- `components/layout/AppLayout.css`: estilos do cabeçalho, container, rodapé e atalho para o conteúdo.
- Cada página importa seu CSS de mesmo nome. Login e cadastro importam o mesmo `Auth.css`.
- As media queries ficam junto das regras da página a que pertencem, nos arquivos correspondentes.

O CSS continua global, sem CSS Modules. Use classes específicas ao contexto e evite seletores genéricos no CSS de páginas. Na escolha de profissional, o prefixo passou de `professional-` para `professional-selection-`, deixando claro a qual fluxo esses estilos pertencem.

Os antigos `App.css` e `index.css` foram distribuídos nesses arquivos. `ProfileCard.jsx`, `data/profiles.js` e seus estilos foram removidos porque a Home atual já não os utilizava; não havia conteúdo visível dependente deles.

### Convenções para o grupo

1. Componentes e páginas em `PascalCase`; variáveis e funções em `camelCase`.
2. Preservar JavaScript/JSX, aspas simples e ausência de ponto e vírgula.
3. Colocar a composição da tela em `pages/`; componentes usados em diferentes contextos em `components/`.
4. Um componente exclusivo de um fluxo pode ficar em uma subpasta `components/` desse fluxo, quando necessário.
5. Importar estilos globais somente no ponto de entrada. Não redefinir tokens dentro das páginas.
6. Extrair componentes com base em repetição real; não criar uma biblioteca inteira antes de seus primeiros usos.
7. Ao adicionar uma página, implementar sua entrada e saída na navegação e atualizar o inventário abaixo.

## 4. O que o style guide define para os próximos passos

O guia registra 13 frames, com largura de referência de 402px. **Isso não significa 13 páginas obrigatórias:** há cópias de escolha de perfil, duas versões da agenda e três etapas de uma mesma pré-triagem.

A direção visual usa verde-água, superfícies claras, Nunito para títulos, Inter para leitura, cartões arredondados e composições voltadas ao celular. A seção 2 do guia identifica os frames; telas sem referência serão extensões documentadas do sistema.

Nesta reorganização os valores atuais foram mantidos. Fontes Nunito/Inter, escala tipográfica, cores completas, componentes do design e layouts por perfil ainda precisam ser aplicados. Por exemplo, `tokens.css` ainda usa `#F5F5F4` para o fundo, `#E8F2ED` para o verde claro e `#57534E` para texto secundário. Isso é uma etapa de migração, não uma alteração dos valores observados no Figma.

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
| Profissional | Home do profissional | Nó `1:147`: disponibilidade, resumo, atalhos e próximas consultas. |
| Profissional | Agenda | Nós `2:424` e `2:604`: uma tela com seleção de dia, consultas e horários livres. |
| Profissional | Histórico | Nó `2:754`: busca, filtros e atendimentos concluídos. |
| Profissional | Perfil | Nó `2:902`: identificação, dados profissionais e clínicas vinculadas. |
| Profissional | Detalhes do atendimento e leitura da pré-triagem | Requisito da jornada e ação dos cartões; composição de detalhes ainda não especificada. |
| Profissional | Configuração da disponibilidade | Requisito da jornada; definir dias/horários e alimentar a oferta vista pelo paciente. |
| Experiência geral | Confirmações e lembretes | Definir canais e estados; não pressupõe uma página exclusiva. |

A área administrativa e a PWA permanecem na visão completa do produto. Não são tratadas como telas já desenvolvidas nesta etapa de organização.

## 7. Sequência sugerida de desenvolvimento

1. **Tratar limitações imediatas:** interceptar o envio do cadastro e validar os campos; explicitar a simulação do resultado de triagem, sem apresentar classificação fixa como se fosse calculada.
2. **Aplicar a base visual:** resolver os pontos de contraste/seleção, carregar as fontes e migrar os tokens e estilos comuns. Criar os primeiros componentes reutilizáveis e layouts por contexto.
3. **Conectar o paciente:** acesso de demonstração por perfil, estado das etapas da triagem e seleção de clínica/profissional/horário. Criar “Meus agendamentos” e seus detalhes.
4. **Construir o portal profissional:** home, agenda, leitura da pré-triagem vinculada à consulta, disponibilidade, histórico e perfil. Usar os mesmos registros simulados do fluxo do paciente.
5. **Revisar a navegação:** rotas por URL, voltar do navegador, acesso direto, retorno ao início, saída da conta e comportamento ao atualizar a página. Definir o que persistirá no protótipo antes de adicionar armazenamento.
6. **Completar os requisitos complementares:** contato de emergência, lembretes e demais itens priorizados com o grupo. Depois, integrar API, autenticação real e banco de dados conforme a visão geral.

Para conectar os dois perfis, cada consulta precisa identificar paciente, profissional, clínica, data/hora, pré-triagem e situação. Evitar repetir nomes e horários como textos independentes em cada tela. Enquanto não houver backend, usar dados fictícios e comunicar os limites da simulação.

**Critério de conclusão do primeiro fluxo integrado:** o paciente escolhe um atendimento, confirma e encontra a consulta na sua área; no perfil profissional correspondente, aparece a mesma consulta com as respostas da pré-triagem. As mudanças de situação devem ser coerentes nos dois contextos. A simulação no mesmo navegador não substitui a futura integração entre usuários/dispositivos.

## 8. Limitações conhecidas preservadas nesta reorganização

- Cadastro sem tratamento de envio: o formulário pode enviar os campos, inclusive senhas, na URL por GET. Corrigir antes de usar informações reais ou apresentar o cadastro como funcional.
- Login sem validação de credenciais e sem sessão/perfil funcional.
- Pré-triagem sem coleta das respostas e com resultado fixo.
- Escolhas de clínica, médico e horário descartadas; resumo e confirmação fixos.
- Atalhos do paciente sem ação, ausência de lista de consultas e ausência do portal profissional.
- Navegação apenas por estado: recarregar reinicia a aplicação e os links institucionais do cabeçalho não retornam à Home a partir de outras telas.
- Visual ainda anterior à adoção do style guide. A separação dos arquivos não resolve as pendências de contraste, fontes e responsividade apontadas no guia.

## 9. Verificação por entrega

Executar `npm run lint` e `npm run build` e conferir o fluxo alterado no navegador. Para páginas novas ou redesenhadas, usar o checklist da seção 14 do [style guide](style-guide.md), incluindo 402px, largura menor, teclado, texto ampliado e estados aplicáveis.

Para uma reorganização, conferir também imports, transições, carregamento dos estilos, ordem das regras e referências da documentação. Comparar a renderização antes/depois ajuda a detectar mudanças acidentais, mas não substitui a revisão visual no navegador.
