# Saúde na Palma da Mão — padrão de desenvolvimento

Projeto acadêmico em React, JavaScript/JSX, CSS puro e Vite. O foco atual é o frontend do profissional de saúde. Manter a implementação compreensível para quem está aprendendo React a partir de HTML e CSS.

## Referências

- [README](README.md): execução e situação do projeto.
- [Estrutura do frontend](docs/estrutura-frontend.md): responsabilidades, inventário e próximas entregas.
- [Style guide](docs/style-guide.md): referências do Figma, tokens, fontes, componentes e estados.
- [Visão geral](docs/visao-geral.md): requisitos e jornadas.

Consultar os trechos pertinentes antes de criar ou alterar telas. Distinguir o que já está implementado dos exemplos e propostas documentados.

## Organização dos arquivos

- `src/pages/<contexto>/`: somente páginas completas e o CSS dessas páginas. **Não criar pastas `components/` dentro de `pages/`.**
- `src/components/profissional/`: componentes específicos do portal médico, mesmo que usados por uma única página.
- `src/components/profissional/panels/`: conteúdos dos painéis demonstrativos abertos por `ProfessionalPanel`; não confundir esses conteúdos com páginas completas.
- `src/components/ui/`: elementos de interface compartilháveis entre contextos, como `PriorityTag` e futuros botões/campos.
- `src/components/layout/`: estrutura externa às páginas e navegação de contexto, como `ProfessionalLayout`.
- `src/data/`: registros fictícios de demonstração. Rótulos de interface e configurações visuais pequenas podem ficar junto do componente.
- `src/assets/`: SVGs, fontes e licenças locais.
- `src/styles/`: tokens, fontes, base global e estilos comuns.
- Criar `src/services/` somente quando houver integração com API para implementar.

Uma nova agenda completa, por exemplo, deve ser `src/pages/profissional/AgendaProfissional.jsx`, com seu CSS ao lado. Blocos visuais extraídos dessa página pertencem a `src/components/profissional/`.

## Responsabilidades e convenções

- A página coordena dados, estado do fluxo e navegação. Componentes recebem registros e ações por propriedades; não importam páginas nem os dados fictícios diretamente.
- Estado de edição temporária pode ficar no formulário. Não criar estado global ou abstrações sem uma necessidade concreta.
- Usar nomes de componentes/arquivos JSX em `PascalCase`, variáveis/funções em `camelCase`, aspas simples e ausência de ponto e vírgula.
- Manter os nomes existentes e a organização por perfil. Não renomear todos os componentes só para traduzir nomes.
- Separar componentes por responsabilidade quando isso facilitar a leitura; pequenos auxiliares privados podem ficar no arquivo que os utiliza.
- Importar o CSS próprio pelo JSX do componente ou da página. Os conteúdos de `panels/` compartilham `ProfessionalPanel.css`, carregado pelo diálogo que os contém.
- Reutilizar o que já existe antes de criar novos componentes. Não criar pastas, páginas ou arquivos vazios para representar trabalho futuro.

## Design e escopo

- Continuar com CSS puro. Não introduzir Tailwind, biblioteca de UI ou TypeScript durante uma reorganização.
- Manter tokens em `styles/tokens.css`, fontes locais em `styles/fonts.css` e o escopo `.theme-figma` usado pelo portal profissional. Não duplicar tokens nos estilos de página.
- CSS é global: usar classes específicas de cada componente/contexto para evitar colisões. Preservar os SVGs, as fontes e suas licenças.
- Em reorganizações, preservar conteúdo, marcação, aparência, interações e dados existentes, limitando as alterações a responsabilidades, caminhos e imports necessários.
- Em páginas novas, seguir a referência visual documentada e registrar extensões quando não houver frame. Não inventar regras clínicas a partir das cores ou textos de demonstração.
- As amostras de agenda, histórico, perfil e pré-triagem nos painéis não equivalem às futuras páginas completas nem a dados persistidos.
- Preservar alterações locais já presentes; não sobrescrever o trabalho de outros integrantes.

## Verificação e documentação

- Executar `npm run lint` e `npm run build` após alterações no código. No PowerShell com bloqueio de `npm.ps1`, usar `npm.cmd`.
- Em movimentações, conferir imports, CSS, assets e links locais da documentação. Comparar a renderização antes/depois quando isso ajudar a validar a preservação da interface.
- Para mudanças visuais ou funcionais, conferir no navegador os estados e tamanhos pertinentes ao checklist do style guide. Se essa conferência não for realizada, informar a limitação.
- Atualizar README e documentação de estrutura quando pastas, páginas ou responsabilidades mudarem. Registrar mudanças visuais compartilhadas no style guide.
