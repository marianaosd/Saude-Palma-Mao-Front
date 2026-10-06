# Style guide — Saúde na Palma da Mão

Referência visual e técnica para padronizar as próximas páginas do frontend.

| Informação | Referência |
| --- | --- |
| Fonte principal | [Arquivo do Figma — Sem título](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt/Sem-t%C3%ADtulo?node-id=1-2) |
| Data da análise | 6 de outubro de 2026 |
| Abrangência | As 13 telas da `Page 1`, incluindo os fluxos de paciente e profissional |
| Método | Inspeção das imagens renderizadas, hierarquia, preenchimentos, textos, medidas, bordas e efeitos das camadas |
| Stack do repositório | React, JavaScript/JSX, CSS e Vite |
| Status | Design documentado; estrutura reorganizada em 6/10/2026; migração visual e componentes do design ainda pendentes |

## 1. Como usar este documento

Antes de desenvolver uma página, localizar sua referência na seção 2, aplicar os fundamentos das seções 3 a 7 e compor os componentes da seção 8. Conferir os estados, a acessibilidade e as pendências antes da entrega.

O documento distingue três tipos de informação:

- **Observado:** valor ou característica presente nas camadas e imagens do Figma.
- **Normalizado:** conversão de uma medida do arquivo para um valor prático de CSS, preservando sua intenção visual. Por exemplo: `47,999px → 48px`, borda `1,0553px → 1px` e raio `35409900px → 9999px`.
- **Proposto:** convenção para implementar ou completar algo que o Figma não especifica. Não representa uma decisão já aprovada no design.

Os nomes dos tokens e componentes deste guia são **propostos**. Os valores identificados como observados vêm do arquivo. A inspeção não encontrou componentes, instâncias, conjuntos de variantes, coleções de variáveis ou estilos locais de cor, texto e efeito. Nomes como `MobileShell`, `TopBar` e `PriorityTag` identificam frames, ainda sem uma biblioteca reutilizável formalizada.

Este guia documenta a análise do design. Os exemplos CSS abaixo não estão instalados na aplicação. Em 6/10/2026, o frontend foi reorganizado por contexto e seus estilos atuais foram separados; essa mudança não redesenhou as telas nem adotou automaticamente os valores do Figma. Consulte a [estrutura implementada e próximas entregas](estrutura-frontend.md).

## 2. Inventário das telas

Todos os frames principais têm **402px de largura**. As alturas abaixo são as dos frames externos; alguns containers internos têm frações de pixel adicionais.

| Tela no arquivo | Nó / referência | Tamanho | Padrões principais |
| --- | --- | --- | --- |
| Login - profissional | [1:2](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=1-2) | 402 × 873 | Apresentação da marca e escolha de perfil |
| Login - paciente | [2:1169](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-1169) | 402 × 873 | Segunda cópia da escolha de perfil |
| Login | [1:70](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=1-70) | 402 × 873 | Acesso profissional, campos e recuperação de senha |
| Home — profissional | [1:147](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=1-147) | 402 × 1071 | Disponibilidade, resumo, atalhos e próximas consultas |
| Agenda | [2:424](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-424) | 402 × 873 | Seletor de dia, consultas e horário livre |
| Agenda 2 | [2:604](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-604) | 402 × 873 | Outro dia selecionado e consultas sem etiqueta de prioridade |
| HIstórico | [2:754](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-754) | 402 × 873 | Busca, filtros e atendimentos concluídos |
| Perfil - profissional | [2:902](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-902) | 402 × 899 | Identificação, dados profissionais e clínicas vinculadas |
| Home — paciente | [2:1051](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-1051) | 402 × 887 | Pré-triagem em destaque, atalhos, dica e última consulta |
| Pré-triagem | [2:1221](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-1221) | 402 × 897 | Etapa 1: seleção de sintomas em grade |
| Pré-triagem 2 | [2:1337](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-1337) | 402 × 873 | Etapa 2: intensidade e duração |
| Pré-triagem 3 | [2:1421](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-1421) | 402 × 873 | Etapa 3: situações específicas em lista |
| Resultado | [2:1501](https://www.figma.com/design/0ULIcyB6uePTl8Zl0MeVgt?node-id=2-1501) | 402 × 1060 | Prioridade, aviso orientativo, especialidade e próximos passos |

**Limites da referência:** não há layouts de desktop/tablet, tema escuro, área administrativa ou telas específicas de cadastro, busca de clínicas, escolha de profissional e confirmação de agendamento nesse conjunto. As telas novas devem reutilizar os fundamentos; sua composição será uma extensão do sistema.

As duas telas chamadas `Login - ...` mostram a mesma composição, inclusive o destaque visual em **Sou profissional de saúde**. Não representam dois estados distintos de seleção. O formulário de login detalhado é profissional; um formulário de acesso do paciente não está especificado separadamente.

## 3. Direção visual

O design prioriza o uso pelo celular: uma coluna de conteúdo, ações principais largas, perguntas curtas e grupos delimitados por cartões. A identidade combina verde-água, neutros quentes, branco, cantos arredondados e iconografia predominantemente de contorno.

| Elemento | Uso observado e orientação de composição |
| --- | --- |
| Verde-água | Marca, ações principais, navegação ativa, destaques e progresso |
| Branco e neutros claros | Separação entre superfície da página, cartões e campos |
| Nunito | Marca, títulos, nomes e parte dos rótulos de ação |
| Inter | Descrições, campos, metadados e etiquetas compactas |
| Cantos arredondados | Cartões e controles acolhedores, com raios consistentes por função |
| Sombras | Destaque pontual de ações e alguns cartões, sem elevação forte em toda a interface |
| Hierarquia | Título → explicação breve → opções/conteúdo → ação principal |

Uma tela de aplicação deve usar seu cabeçalho funcional e sua navegação de contexto. A página institucional existente tem uma estrutura diferente e não deve determinar automaticamente o layout dos fluxos internos.

## 4. Cores

### 4.1 Marca e interação

Valores **observados**; nomes de tokens **propostos**. Usar os códigos extraídos, inclusive os tons claros específicos do arquivo, sem substituí-los por aproximações de uma biblioteca de cores.

| Token CSS | Valor | Aplicação observada |
| --- | --- | --- |
| `--color-primary` | `#0D9488` | Botão principal, cabeçalho profissional e dia selecionado |
| `--color-primary-bright` | `#14B8A6` | Final do gradiente, etapas preenchidas e intensidade selecionada |
| `--color-primary-dark` | `#0F766E` | Links, horários, textos de interação e ícones |
| `--color-primary-strong` | `#134E4A` | Títulos sobre superfícies claras de marca |
| `--color-primary-light` | `#F0FDF9` | Cartão destacado, navegação ativa e fundos de ícones |
| `--color-primary-soft` | `#CCFBEF` | Avatares, bordas suaves e texto secundário sobre verde |
| `--color-primary-border` | `#99F6E0` | Borda de cartão destacado e de avisos informativos |
| `--color-primary-marker` | `#2DD4BF` | Marcador vertical nas linhas da agenda |
| `--color-on-primary` | `#FFFFFF` | Texto e ícones sobre preenchimentos de marca |

O gradiente observado vai de `#0D9488` a `#14B8A6`. Na abertura `1:8`, a extração gera aproximadamente **140,76°**, com paradas intermediárias. A forma simplificada `linear-gradient(141deg, #0d9488, #14b8a6)` é uma **normalização proposta**, a conferir visualmente em cada cabeçalho.

Os círculos decorativos usam branco com opacidade de **5% ou 10%**; botões translúcidos usam **15%**, e bases de ícones/avatares usam **20%**. Aplicar a transparência ao fundo, preservando a opacidade do texto e do ícone. O avatar do perfil também apresenta borda branca a **40%**.

### 4.2 Neutros e superfícies

| Token CSS | Valor | Aplicação observada |
| --- | --- | --- |
| `--color-background` | `#FAFAF9` | Fundo das telas internas / `MobileShell` |
| `--color-surface` | `#FFFFFF` | Cartões, cabeçalhos e tela de acesso |
| `--color-surface-muted` | `#F5F5F4` | Blocos de apoio, dias não selecionados, busca e canvas externo |
| `--color-border` | `#E7E5E4` | Contornos discretos e divisores |
| `--color-text` | `#1C1917` | Títulos e nomes |
| `--color-text-secondary` | `#44403C` | Rótulos, opções e conteúdo secundário |
| `--color-muted` | `#78716C` | Descrições, datas e metadados |
| `--color-ink` | `#000000` | Alguns ícones, itens inativos da navegação e textos de formulário |

`#F5F5F4` aparece nos frames externos, mas isso não torna essa cor o fundo de todas as telas. O login tem superfície branca; agenda, histórico e pré-triagem usam o quase branco `#FAFAF9`. A busca do histórico possui texto preto a 50% de opacidade, uma exceção ao tom secundário recorrente.

### 4.3 Prioridade e feedback

As combinações abaixo documentam a aparência, sem definir regras clínicas ou critérios de classificação.

| Uso observado | Fundo | Borda | Texto / ponto |
| --- | --- | --- | --- |
| Etiqueta “Moderado” na agenda | `#ECFDF5` | `#A4F4CF` | `#007A55` |
| Etiqueta “Urgente” | `#FFF7ED` | `#FFD6A8` | `#CA3500` |
| Etiqueta “Emergência” | `#FEF2F2` | `#FFC9C9` | `#C10007` |
| Informação / dica | `#F0FDF9` | `#99F6E0` | `#0F766E`; o aviso do resultado usa texto preto |
| Resultado “Atenção recomendada” | `#FFFBEB` | `#FEE685` | Título `#7B3306`, descrição `#973C00` |

No resultado, o ícone e o subtítulo usam `#BB4D00`, a base do ícone usa `#FEF3C6`, a trilha da barra usa `#FEE685` e o preenchimento usa `#FFB900`. O indicador “Ativo” da área profissional tem ponto `#00BC7D`.

**Pendência de consistência:** “Moderado” aparece em verde nas etiquetas profissionais e em amarelo no resultado do paciente. Manter essa diferença registrada até definir a semântica; não consolidar ambos em um token genérico de sucesso. Proposta de nomes separados: `--priority-moderate-*`, `--priority-urgent-*`, `--priority-emergency-*` e `--feedback-attention-*`.

## 5. Tipografia

### 5.1 Famílias e pesos

- **Nunito Regular, 400:** família de títulos, marca, nomes e diversas ações.
- **Inter Regular, 400:** família de leitura, dados auxiliares e formulários.
- **Inter Bold, 700:** ênfase em trechos do resultado e do aviso orientativo.
- **Espaçamento entre letras:** predominantemente `0`. Exceções observadas: `0,25px` em “Portal profissional” e `0,3px` na data do histórico.

Não aplicar `font-weight: 700` ou `800` a todos os títulos e botões: o arquivo utiliza majoritariamente peso **400**, inclusive nesses elementos. Carregar as fontes reais antes de comparar a interface; `system-ui` é apenas fallback.

### 5.2 Escala observada

Tamanho e entrelinha em pixels. Os nomes de estilo são propostas para organizar o código; a hierarquia HTML deve seguir o significado do conteúdo.

| Estilo proposto | Família / peso | Tamanho / entrelinha | Referência de uso |
| --- | --- | --- | --- |
| `display` | Nunito 400 | 30 / 37,5 | “Saúde na Palma da Mão” na abertura |
| `page-title` | Nunito 400 | 24 / 32 | “Acesse sua conta” |
| `hero-title` | Nunito 400 | 24 / 30 | Pergunta principal da home do paciente |
| `section-title` | Nunito 400 | 20 / 28 | Títulos das etapas e mês da agenda |
| `topbar-title` / `action-large` | Nunito 400 | 18 / 28 | Cabeçalho e botão “Continuar” |
| `hero-action-title` | Nunito 400 | 18 / 22,5 | “Iniciar Pré-triagem” |
| `card-title` / `action` | Nunito 400 | 16 / 24 | Perfil, seções e botão “Entrar” |
| `label` / `item-title` | Nunito 400 | 14 / 20 | Labels, nomes e horários |
| `body` | Inter 400 | 14 / 20 | Texto corrente e valor dos campos |
| `body-relaxed` | Inter 400 | 14 / 22,75 | Apresentação e descrição do resultado |
| `caption` | Inter 400 | 12 / 16 | Subtítulos, datas e metadados |
| `caption-relaxed` | Inter 400 | 12 / 19,5 | Privacidade e aviso orientativo |
| `option-label` | Inter 400 | 12 / 15 | Nome do sintoma |
| `quick-action-label` | Nunito 400 | 12 / 15 | Atalhos do paciente |
| `compact-description` | Inter 400 | 11 / 16,5 | Sintoma resumido na agenda |
| `badge` / `nav-label` | Inter 400 | 10 / 15 | Etiquetas e navegação inferior |
| `weekday` | Inter 400 | 9 / 13,5 | Abreviações dos dias da semana |

Há exceções locais: atalhos profissionais em Nunito `11/13,75`, situações específicas em Inter `14/17,5`, orientações do resultado em Inter `14/19,25` e iniciais do histórico em Nunito `12/16`. Evitar criar um token global para cada ocorrência isolada.

**Proposta de implementação:** usar `rem` para fontes, mantendo `1rem = 16px` como referência de conversão, sem travar o tamanho padrão do navegador. Usar entrelinhas proporcionais; por exemplo, `14/20 → line-height: 1.4286`. Os textos de 9–11px exigem revisão de legibilidade antes de virarem o padrão definitivo.

## 6. Espaçamento, geometria e elevação

### 6.1 Escala de espaçamento

O arquivo usa principalmente múltiplos de 4, com medidas auxiliares de 2, 6, 10 e 14px. Não é uma escala exclusivamente de 8px.

| Token proposto | Valor | Uso observado / normalizado |
| --- | --- | --- |
| `--space-0-5` | 2px | Ajustes compactos entre linhas |
| `--space-1` | 4px | Título e descrição; ícone e rótulo de navegação |
| `--space-1-5` | 6px | Segmentos de progresso; ponto e texto de etiqueta |
| `--space-2` | 8px | Ícone e texto; intervalos compactos |
| `--space-2-5` | 10px | Padding horizontal de etiqueta; vertical do dia |
| `--space-3` | 12px | Grades, listas, controles e blocos de apoio |
| `--space-3-5` | 14px | Padding vertical de “Sair da conta” |
| `--space-4` | 16px | Interior de cartões e distância entre grupos |
| `--space-5` | 20px | Margem lateral padrão e padding de cartões destacados |
| `--space-6` | 24px | Margem lateral do login e grupos do cabeçalho |
| `--space-7` | 28px | Padding vertical na escolha de perfil |
| `--space-8` | 32px | Separações amplas e área inferior do cabeçalho de perfil |

Há recuos de 40 e 48px em campos e posicionamento de 48px no topo da abertura. Esses valores atendem à composição específica, sem justificar espaçamentos grandes em todos os componentes.

### 6.2 Raios e bordas

| Token proposto | Valor normalizado | Uso |
| --- | --- | --- |
| `--radius-sm` | 8px | Bases pequenas de ícone |
| `--radius-md` | 12px | Inputs, linhas da agenda, filtros de dia e ações secundárias |
| `--radius-lg` | 16px | Cartões maiores, seleção de perfil e botão principal |
| `--radius-header` | 24px | Apenas cantos inferiores dos cabeçalhos profissionais |
| `--radius-pill` | 9999px | Etiquetas e botões circulares; usar `50%` em círculos de lados iguais |
| `--border-width` | 1px | Contornos e separadores; derivado dos aproximadamente 1,055px do arquivo |

A linha de horário livre tem borda tracejada verde escura e fundo `#F0FDF9` a 50%. A espessura normalizada é 1px; a aparência do tracejado CSS precisa de conferência visual.

### 6.3 Sombras observadas

Equivalentes CSS dos efeitos extraídos; nomes propostos:

```css
--shadow-sm:
  0 1px 2px -1px rgb(0 0 0 / 10%),
  0 1px 3px 0 rgb(0 0 0 / 10%);
--shadow-primary:
  0 4px 6px -4px rgb(13 148 136 / 20%),
  0 10px 15px -3px rgb(13 148 136 / 20%);
--shadow-primary-strong:
  0 4px 6px -4px rgb(13 148 136 / 30%),
  0 10px 15px -3px rgb(13 148 136 / 30%);
```

`shadow-sm`: marca do login, cartão de resumo e dia selecionado. `shadow-primary`: login e CTAs da pré-triagem. `shadow-primary-strong`: cartão “Iniciar Pré-triagem”. A intensidade selecionada usa a mesma geometria da sombra forte, com `rgb(20 184 166 / 30%)`.

## 7. Layout e responsividade

### 7.1 Composição observada no celular

- Largura de referência: **402px**, com área útil aproximada de **362px** quando as margens laterais são de 20px.
- Login: margens laterais de **24px**, resultando em conteúdo de aproximadamente **354px**.
- Barra superior com voltar: cerca de **73px**, padding `16px 20px`, controle de 40px, intervalo de 12px e divisor inferior.
- Escolha de perfil: cabeçalho com gradiente de cerca de **328px**; conteúdo abaixo com padding `28px 20px`.
- Atalhos do paciente e sintomas: **duas colunas**, intervalo de **12px**. Atalhos profissionais: **três colunas**.
- Agenda: cinco dias visíveis em linha; cards de consulta empilhados. Histórico e perfil também usam uma coluna.
- Navegação profissional: aproximadamente **68px**, quatro destinos e superfície branca com divisor superior.
- Pré-triagem: cabeçalho, progresso, conteúdo e área inferior de ação. Nos passos 2 e 3, a área inferior mede aproximadamente **105px**, incluindo botão de 60px e respiros.

As alturas dos frames representam composições de referência, não alturas fixas obrigatórias para a página. O conteúdo deve crescer, quebrar linhas e rolar.

### 7.2 Adaptação proposta para o frontend

O arquivo não define breakpoints. As regras abaixo são propostas para iniciar a implementação e devem ser verificadas em navegador:

| Contexto | Diretriz proposta |
| --- | --- |
| 320–559px | Uma coluna principal; margens de 16–20px conforme o espaço; manter grades de duas colunas quando os rótulos couberem |
| A partir de 560px | Centralizar formulários e fluxos curtos; limitar inicialmente sua largura a cerca de 480px |
| A partir de 800px | Estudar grades mais amplas para agenda e painéis; largura máxima de 1120px pode reaproveitar o container atual, mediante composição específica |
| Textos ampliados | Permitir altura variável e reduzir o número de colunas quando necessário |

Os pontos de 560 e 800px já aparecem no CSS do repositório; o limite de 480px é uma proposta nova. Nenhum desses valores foi extraído de um frame desktop do Figma.

Para navegação ou ações persistentes, reservar espaço equivalente no conteúdo e considerar `env(safe-area-inset-bottom)`. Não copiar os valores absolutos de `top` dos frames: na home profissional e no perfil, a navegação renderizada se sobrepõe a conteúdo. A implementação deve manter todos os itens acessíveis por rolagem, teclado e com o teclado virtual aberto.

## 8. Catálogo de componentes

As medidas abaixo são **normalizadas** a partir do arquivo. Usar altura mínima para elementos com texto variável. Os nomes React são **propostos**.

### 8.1 Estrutura, marca e navegação

| Componente | Especificação e comportamento proposto |
| --- | --- |
| `AppShell` | Estrutura de página com fundo, área de conteúdo e espaço para barras persistentes. Variar por contexto: acesso, paciente ou profissional. |
| `BrandMark` | Coração branco em base verde ou translúcida arredondada. Na abertura: base 56px, raio 16px e coração 32px. No login: base de aproximadamente 44px. Preservar o desenho da marca do Figma. |
| `TopBar` | Barra branca de aproximadamente 73px; voltar à esquerda e título Nunito 18/28. Ícone de voltar de 20px em controle visual de 40px. |
| `ProfessionalHeader` | Fundo `primary`, raios inferiores de 24px, avatar/iniciais e dados do profissional. Home inclui notificação e disponibilidade; perfil inclui edição e verificação. |
| `ProfessionalBottomNav` | Início, Agenda, Histórico e Perfil. Cada item mede aproximadamente 64 × 51px, ícone 20px, intervalo 4px e texto Inter 10/15. Ativo: fundo `primary-light`, texto/ícone `primary-dark`, raio 12px. Usar navegação semântica e `aria-current="page"`. |
| `Avatar` | Iniciais em círculo para pacientes; base arredondada para profissional. Perfil profissional: 80 × 80px, raio 16px, fundo branco a 20%, borda a 40%. Não exigir fotografia. |

### 8.2 Botões e campos

| Componente / variante | Especificação observada |
| --- | --- |
| `Button` primário padrão | Login: altura 56px, largura do conteúdo, raio 16px, fundo `primary`, Nunito 16/24 branco e sombra primária |
| `Button` primário grande | Pré-triagem e resultado: altura 60px, raio 16px, Nunito 18/28 e sombra primária |
| `Button` suave | “Ver pré-triagem”: altura visual 36px, fundo `primary-light`, texto Inter 12/16 em `primary-dark`, raio 12px |
| `TextButton` | Sem preenchimento. Exemplos: “Mostrar”, “Esqueci minha senha”, “Ver todas” e “Apenas salvar resultado”. Tamanho depende do contexto; ampliar a área de interação sem depender só da caixa do texto. |
| `IconButton` | Bases visuais de 36 ou 40px; formato circular ou raio 8/12px segundo o contexto. Usar nome acessível. |
| `FormField` | Label acima, Nunito 14/20 em `text-secondary`; campo com altura aproximada de 54px, fundo `background`, borda neutra de 1px e raio 12px |
| `PasswordField` | Campo com ação “Mostrar” à direita. Preservar o espaço da ação, alternar entre senha visível/oculta e manter o foco. |
| `SearchField` | Busca do histórico: cerca de 44px, fundo `surface-muted`, raio 12px, texto Inter 14px; sem borda visível no frame |

O campo de e-mail/CPF tem recuo esquerdo de 48px, enquanto a busca usa 40px. São medidas locais do desenho; a presença de um recuo não comprova que exista um ícone visível naquele campo.

**Semântica proposta:** usar `<button>` para ação, `<a>` para destino de navegação e `<label>` associado ao input. Separar estados `disabled`, `loading` e `invalid`. Placeholder não substitui label. A marcação de campos como obrigatórios e a validação dependem dos requisitos do formulário.

### 8.3 Cartões e listas

| Componente | Especificação observada |
| --- | --- |
| `RoleOption` | Padding 20px, intervalo 16px, raio 16px, base de ícone 48px com raio 12px, título Nunito 16/24, descrição Inter 12/16 e chevron 20px. Altura cresce com a descrição. Destacado: fundo `primary-light`, borda `primary-border`, ícone branco sobre `primary`. |
| `TriageStartCard` | Cartão inteiro acionável: aproximadamente 362 × 105px, padding 20px, intervalo 16px, raio 16px, fundo primário, base de ícone 56px e sombra forte. |
| `QuickActionCard` | Paciente: aproximadamente 175 × 97px, padding 16px, raio 12px e intervalo 8px entre ícone e rótulo. Profissional: aproximadamente 115 × 98px, padding 12px. |
| `AppointmentCard` | Home profissional: padding 16px, raio 16px, horário, avatar, nome, resumo, prioridade e ação inferior. Um cartão tem borda preta e sombra; os demais usam contorno neutro. O significado dessa exceção não está definido. |
| `AgendaRow` | Aproximadamente 362 × 70px, padding 12px, intervalo 12px, raio 12px. Horário à esquerda, marcador vertical de marca, paciente/resumo e etiqueta opcional. |
| `AvailableSlot` | Cerca de 46px de altura, padding 12px, raio 12px, fundo de marca a 50%, borda tracejada, horário, ícone de adição e descrição |
| `HistoryCard` | Cerca de 362 × 97px, padding 16px, intervalo 12px e raio 16px. Avatar, nome, descrição, conclusão e chevron. |
| `InfoCard` | Grupos de dados ou orientação; superfície branca ou suave, padding de 16–20px e raio de 12–16px conforme a função |

Evitar clique no cartão inteiro quando ele contiver botões independentes. Para cartões com múltiplas ações, manter cada controle separado e alcançável por teclado.

### 8.4 Filtros, seleção e progresso

| Componente | Especificação observada e semântica proposta |
| --- | --- |
| `FilterChip` | Altura visual de 34px, padding `8px 16px`, formato pílula. Ativo: primário e texto branco; inativo: branco com borda neutra. Usar estado pressionado ou seleção única conforme a função. |
| `WeekDaySelector` | Cinco controles de aproximadamente 66 × 58px; raio 12px, dia abreviado Inter 9/13,5 e número abaixo. Selecionado: primário, branco e sombra pequena; demais: fundo neutro. O nome acessível deve incluir a data completa. |
| `SymptomOption` | Grade de duas colunas; aproximadamente 175 × 97px, padding 16px, raio 16px, base de ícone 40px e rótulo Inter 12/15. Seleção múltipla: proposta de checkbox nativo com label em formato de cartão. O frame mostra somente opções não selecionadas. |
| `IntensitySelector` | Cinco opções de 48 × 48px com raio 12px. “3” aparece selecionado em `primary-bright`, texto branco e sombra. Proposta: grupo de radios de 1 a 5, com descrição textual da escala. |
| `DurationOption` | Grade 2 × 2, controles de aproximadamente 175 × 46px, padding `12px 16px`, raio 12px e borda neutra. Proposta: seleção única com radios. |
| `SituationOption` | Lista de aproximadamente 362 × 70px por item, padding 16px, intervalo 16px e raio 12px. Base de ícone 36px; texto Inter 14/17,5. Definir a exclusividade de “Nenhuma das opções acima”. |
| `StepProgress` | Três segmentos de aproximadamente 6px de altura, separados por 6px. Preenchidos em `primary-bright`, restantes em `border`; legenda “Etapa N de 3” em Inter 12/16. Expor a etapa atual em texto acessível. |

### 8.5 Etiquetas, avisos e resultado

`PriorityTag`: formato pílula, padding `4px 10px`, intervalo de 6px entre ponto e texto, borda de 1px e Inter 10/15. A cor deve sempre acompanhar um rótulo. “Concluída”, “Ativo” e “Perfil verificado” têm funções diferentes de prioridade e devem receber variantes semânticas próprias.

`Notice`: ícone à esquerda, texto à direita, padding 16px, intervalo de 12px e raio 12px. Pode ter superfície neutra para privacidade ou superfície de marca para informação. Avisos de resultado têm trechos em Inter 700. Mensagens informativas persistentes não precisam ser anunciadas como alerta urgente.

`TriageResultCard`: superfície amarela, borda suave, raio 16px e padding 20px; reúne ícone, título, nível, barra e explicação. A barra do exemplo mede aproximadamente 320 × 8px, com preenchimento de 60%. Esse número descreve a geometria do mockup, **não uma probabilidade nem um cálculo de risco**. Definir o significado da barra antes de expor um valor numérico ou usar `role="progressbar"`.

## 9. Ícones, imagens e conteúdo

**Observado:** o arquivo usa coração preenchido como marca, ícones de contorno para navegação e ações, símbolos relacionados a sintomas e avatares com iniciais. Não foram observadas fotografias nessas telas. Os frames de ícones têm nomes como `IconHeart`, `IconUser`, `IconChevronRight` e `AppIcon`; esses nomes não comprovam a biblioteca de origem.

| Medida normalizada | Uso |
| --- | --- |
| 16px | Indicadores e ações compactas |
| 20px | Navegação, chevrons e avisos |
| 24px | Ícones de cartões |
| 28–32px | Destaques e marca |
| Bases de 32, 36, 40, 48 e 56px | Área de fundo do ícone, distinta do desenho interno |

Na implementação, exportar os SVGs correspondentes ou reutilizar somente equivalentes exatos já disponíveis. Versionar os arquivos locais; URLs temporárias de exportação do Figma não devem entrar no código de produção. Usar `aria-hidden="true"` para ícones decorativos e nome acessível nos controles sem texto. Emojis não preservam o desenho ou as medidas dos ícones do projeto.

O tom textual é direto, em português, com verbos de ação: “Continuar”, “Entrar”, “Ver resultado”. Padronizar a grafia das ações e de “pré-triagem” entre telas. Evitar caixa alta em descrições extensas; o arquivo a utiliza apenas em alguns metadados compactos.

Nomes, datas e textos clínicos do protótipo são conteúdo de demonstração. As regras de classificação e as orientações de saúde devem ser definidas no escopo funcional, separado deste guia visual. Preservar o aviso de que a pré-triagem é orientativa, conforme a [visão geral do projeto](visao-geral.md).

## 10. Estados e comportamento

### 10.1 Estados efetivamente visíveis

Foram observados: cartão de perfil destacado, destino atual da navegação, dia ativo, filtro ativo, intensidade selecionada, progresso por etapa, consulta concluída, disponibilidade e diferentes etiquetas de prioridade.

O arquivo não apresenta uma especificação completa de hover, foco, pressionado, carregamento, desabilitado, erro de campo, resultado vazio ou falha de rede. A aparência desses estados precisa ser completada.

### 10.2 Convenções propostas

| Estado | Diretriz para implementação |
| --- | --- |
| Hover | Alteração discreta de fundo/borda; botões de marca podem usar `primary-dark`. Não depender de hover para revelar informação essencial. |
| Foco por teclado | Contorno visível, por exemplo 3px em `primary-dark`, offset de 3px. Ajustar a cor conforme o fundo. |
| Pressionado / selecionado | Além da cor, refletir o estado na semântica nativa ou em atributos ARIA adequados; manter seleção ao avançar/voltar quando fizer sentido no fluxo. |
| Carregando | Mostrar texto de andamento, preservar o tamanho do controle e evitar envios duplicados; expor atualização por região de status quando necessário. |
| Desabilitado | Distinguir visualmente, bloquear a ação de forma efetiva e explicar o requisito faltante quando necessário. |
| Erro | Mensagem próxima ao campo, `aria-invalid` e descrição associada; não depender apenas de borda vermelha. |
| Vazio | Explicar o que não foi encontrado e oferecer uma ação contextual, como limpar filtros. |
| Movimento | Transições discretas de 150–200ms para cor, borda e sombra; respeitar `prefers-reduced-motion`. Esses tempos não foram extraídos do Figma. |

## 11. Acessibilidade e ajustes necessários

As metas de contraste são 4,5:1 para texto comum e 3:1 para texto grande. O limiar de texto grande corresponde a 24 CSS px regular ou aproximadamente 18,67px em negrito. Fonte de 18px em peso 400, como a dos CTAs, continua sendo texto comum. Referência: [W3C — contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Razões calculadas com as cores sólidas extraídas, pela luminância relativa sRGB; exibidas com duas casas decimais. Esta é uma verificação parcial, não uma auditoria de conformidade da aplicação.

| Combinação | Contraste aproximado | Consequência |
| --- | --- | --- |
| Branco sobre `#0D9488` | 3,74:1 | Abaixo da meta para os textos de 16/18px dos botões |
| Branco sobre `#14B8A6` | 2,49:1 | Abaixo inclusive da meta de texto grande; revisar seleção e regiões claras do gradiente |
| `#CCFBEF` sobre `#0D9488` | 3,32:1 | Abaixo da meta para descrições pequenas |
| Branco sobre `#0F766E` | 5,47:1 | Alternativa proposta para fundo de ações com texto branco |
| `#78716C` sobre branco | 4,80:1 | Atende à meta de texto comum nessa combinação |
| `#78716C` sobre `#FAFAF9` | 4,59:1 | Atende, com pouca margem; não reduzir a opacidade |
| `#0F766E` sobre `#F0FDF9` | 5,24:1 | Adequado para textos sobre superfície suave |

**Proposta de ajuste:** preservar `primary` como cor de marca e adotar um token específico de fundo de ação, inicialmente `primary-dark`, onde houver texto branco pequeno. Revisar também o gradiente e a intensidade selecionada. Esta proposta altera a aparência e deve ser registrada como evolução do design, sem fingir que o valor original era outro.

A WCAG 2.2 estabelece alvo mínimo de 24 × 24 CSS px, com exceções e condições de espaçamento. Para este projeto, propõe-se área de toque de **pelo menos 44 × 44px** em ações frequentes, mesmo quando o ícone visual for menor. Conferir especialmente “Mostrar”, “Ver todas” e os botões de ícone. Referência: [W3C — tamanho mínimo do alvo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

Na revisão das páginas, conferir também foco visível, labels associados, ordem lógica de títulos, leitura dos estados, uso sem teclado/mouse, quebra de textos e ausência de conteúdo oculto atrás das barras. A borda neutra muito clara exige avaliação específica quando for o único recurso que identifica um campo ou controle.

## 12. Base de tokens para futura implementação

Exemplo **documental**, para organizar a migração. Não é uma folha de estilo já aplicada nem uma declaração de acessibilidade completa. Os valores visuais preservam a extração; `--color-action-background` apresenta separadamente a proposta de ajuste de contraste.

```css
:root {
  --font-body: 'Inter', system-ui, sans-serif;
  --font-heading: 'Nunito', system-ui, sans-serif;

  --color-background: #fafaf9;
  --color-surface: #ffffff;
  --color-surface-muted: #f5f5f4;
  --color-border: #e7e5e4;
  --color-text: #1c1917;
  --color-text-secondary: #44403c;
  --color-muted: #78716c;
  --color-ink: #000000;

  --color-primary: #0d9488;
  --color-primary-bright: #14b8a6;
  --color-primary-dark: #0f766e;
  --color-primary-strong: #134e4a;
  --color-primary-light: #f0fdf9;
  --color-primary-soft: #ccfbef;
  --color-primary-border: #99f6e0;
  --color-primary-marker: #2dd4bf;
  --color-on-primary: #ffffff;
  /* Proposta de contraste; não é o fundo original dos CTAs. */
  --color-action-background: var(--color-primary-dark);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-7: 1.75rem;
  --space-8: 2rem;

  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-header: 1.5rem;
  --radius-pill: 9999px;
  --border-width: 1px;

  --control-height: 3.5rem;
  --control-height-lg: 3.75rem;
  --input-height: 3.375rem;
  --page-gutter: var(--space-5);

  --shadow-sm:
    0 1px 2px -1px rgb(0 0 0 / 10%),
    0 1px 3px 0 rgb(0 0 0 / 10%);
  --shadow-primary:
    0 4px 6px -4px rgb(13 148 136 / 20%),
    0 10px 15px -3px rgb(13 148 136 / 20%);
}
```

Essa base é intencionalmente parcial. Completar os tokens de prioridade, feedback, tamanhos de texto e medidas auxiliares a partir das tabelas, ao implementar os componentes que os utilizam. Separar tokens primitivos de aliases semânticos evita acoplar “sucesso”, “prioridade” e “marca” por terem cores semelhantes.

## 13. Adoção no repositório

### 13.1 Diagnóstico anterior à reorganização

A tabela registra o código analisado antes da reorganização de 6/10/2026. Os caminhos antigos são mantidos aqui como referência do diagnóstico. As cores efetivas foram centralizadas em `src/styles/tokens.css`, sem migrar os valores visuais; fontes, escala tipográfica, componentes e layouts do design continuam pendentes.

| Área | Situação na análise inicial | Direção de padronização |
| --- | --- | --- |
| Tokens | `src/index.css` e `src/App.css` declaram cores em `:root`, inclusive valores diferentes para os mesmos nomes | Consolidar uma fonte de tokens e eliminar conflitos de cascata |
| Marca | `index.css` declara `#146B5C`; `App.css`, `#0D9488` | Alinhar a marca ao Figma e separar o ajuste de contraste das ações |
| Fundo | `App.css` usa `#F5F5F4` no body | Diferenciar canvas/fundo neutro, páginas internas e superfície branca |
| Verde claro | `App.css` usa `#E8F2ED` | Adotar o `#F0FDF9` observado para a função equivalente |
| Texto secundário | `App.css` usa `#57534E`; `index.css`, `#516963` | Mapear funções para `#44403C` e `#78716C` |
| Tipografia | Fonte do sistema e vários pesos 700/800 | Carregar Nunito/Inter e aplicar a escala observada por componente |
| Títulos | A home atual chega a 4,5rem; várias páginas usam títulos de até 3,25rem | Usar a escala compacta nos fluxos internos; avaliar a página institucional separadamente |
| Raios | Mistura de 0,6rem, 1rem e 1,25rem | Consolidar os raios documentados por função |
| Layout | Container de até 1120px, cabeçalho e rodapé globais | Criar composição própria para acesso, paciente e profissional |
| Ícones | Favicon local e alguns símbolos/emojis nos textos | Conferir correspondência com a marca e os SVGs do Figma |
| Reutilização | `Header` e `ProfileCard` existentes; botões e cartões recorrentes nas páginas | Extrair componentes de interface com variantes claras |

O antigo `src/pages/Profissional.jsx` passou a ser `src/pages/paciente/EscolhaProfissional.jsx`. Ele participa da escolha de atendimento pelo paciente. O portal de trabalho do profissional usa `src/pages/profissional/`, com contexto e navegação próprios.

### 13.2 Estrutura alvo e adoção parcial

Manter React/JSX e CSS do projeto. A presença de classes utilitárias em código extraído do Figma não exige instalar Tailwind ou uma biblioteca de componentes.

```text
src/
├── styles/
│   ├── tokens.css          # Variáveis de cor, fonte, espaço e efeitos
│   └── typography.css      # Estilos tipográficos reutilizáveis
├── components/
│   ├── ui/                 # Button, FormField, Avatar, Notice, PriorityTag
│   ├── layout/             # Estruturas e navegação de contexto
│   └── profissional/       # Componentes do médico; conteúdos de diálogo em panels/
├── assets/
│   ├── icons/              # SVGs locais correspondentes ao design
│   └── fonts/              # Caso sejam adotadas fontes hospedadas localmente
└── pages/                  # Composição dos fluxos com os componentes comuns
```

A árvore acima descreve a estrutura alvo. Já existem `styles/tokens.css`, `styles/fonts.css`, componentes em `layout/`, `profissional/` e `ui/`, além de páginas agrupadas em `institucional/`, `auth/`, `paciente/` e `profissional/`. Nunito/Inter e os SVGs usados pela home médica estão versionados em `assets/`. `typography.css` e os componentes ainda não implementados do catálogo continuam propostos. `pages/` contém apenas páginas e seu CSS; componentes ficam em `components/`, inclusive quando específicos de um único fluxo. A organização obrigatória está no [AGENTS.md](../AGENTS.md) e detalhada em [Estrutura do frontend](estrutura-frontend.md). Os tokens atuais são importados uma única vez em `main.jsx`; cada página importa seu CSS, e login/cadastro compartilham `Auth.css`. Não redefinir tokens no CSS de cada página. Usar variantes por propriedades/classes, por exemplo `variant="primary"`, `size="large"` e `selected`, em vez de duplicar estilos por tela. Preservar a convenção existente de JavaScript com aspas simples e sem ponto e vírgula.

#### Adoção: home profissional (`1:147`)

Implementação iniciada em **6 de outubro de 2026**. A página em `src/pages/profissional/HomeProfissional.jsx` compõe o cabeçalho com disponibilidade, o resumo do dia, os três atalhos, as três consultas do frame e a navegação profissional. A largura móvel acompanha os 402px do Figma e centraliza o conteúdo em janelas maiores. A navegação fica fixa e o conteúdo reserva o espaço inferior para continuar rolável.

- `tokens.css` mantém os tokens existentes do protótipo e acrescenta o escopo `.theme-figma` com os valores observados usados por esta página.
- `fonts.css` declara Nunito 400 e Inter 400 como fontes locais; os arquivos e licenças estão em `src/assets/fonts/`.
- `ProfessionalIcon.jsx` aponta para os SVGs originais do frame, guardados em `src/assets/icons/profissional/`, sem referências a URLs temporárias nem alterações às dimensões intrínsecas.
- `AppointmentCard` e `PriorityTag` dividem a construção das consultas e suas etiquetas. Os registros fictícios do profissional, consultas e histórico estão em `src/data/profissional.js` e são passados pela página aos componentes.
- `components/profissional/ProfessionalHomePanel.jsx` controla o diálogo; os conteúdos de agenda, histórico, horários, perfil e pré-triagem ficam em `components/profissional/panels/`. Todos usam `ProfessionalHomePanel.css`; não há componentes dentro de `pages/`. `AgendaPreview`, `HistoryPreview` e `ProfilePreview` identificam as amostras abertas pela home, sem representar páginas completas.
- `App.jsx` abre a nova experiência em `#profissional`, inclusive ao acessar ou atualizar essa URL. O login de demonstração oferece o link “Entrar como profissional”; “Início” e o retorno do painel de perfil usam `#inicio`.
- Os atalhos abrem painéis nativos acessíveis. Disponibilidade, amostras da agenda, pré-triagem de demonstração, horários locais, histórico e dados de perfil têm interações de demonstração; disponibilidade e horários não persistem nem chegam a um backend.
- O fundo da marca e dos CTAs primários usa a cor original `#0D9488`, como no Figma. O contraste da marca e a possível proposta de separar o fundo de ação permanecem documentados na seção 11; o ajuste não foi incorporado à arte reproduzida.

Esta adoção é uma etapa: não implanta ainda a agenda profissional como página completa, nem conecta os registros ao percurso do paciente ou a uma API. Funcionalidades não construídas não devem ser inferidas a partir dos painéis locais.

### 13.3 Ordem sugerida

1. Resolver as pendências de contraste, prioridade e estados que afetam componentes compartilhados.
2. Completar a navegação por URL e construir a agenda, o histórico e o perfil profissionais.
3. Aplicar a identidade aprovada às telas de acesso e à home do paciente.
4. Unificar os registros dos dois perfis e construir a consulta vinculada à pré-triagem.
5. Implementar e validar as etapas restantes da pré-triagem e do agendamento do paciente.
6. Estender a base às telas sem frame, documentando as decisões de design aprovadas.

## 14. Pendências do design e critérios de entrega

### 14.1 Decisões ainda abertas

| Pendência | Evidência / encaminhamento |
| --- | --- |
| Significado de “Moderado” | Verde na agenda e amarelo no resultado; definir semântica compartilhada |
| Acesso por perfil | As duas telas de escolha repetem o destaque profissional; especificar a variante paciente e seu formulário |
| Estados de interação | Completar foco, hover, selecionado em sintomas/situações, validação, loading e vazio |
| Contraste e texto pequeno | Revisar CTAs, gradiente, intensidade ativa e rótulos de 9–11px |
| Navegação sobreposta | Home/perfil profissional exibem sobreposição; reservar área para a barra na implementação |
| Cartão com borda preta | Primeiro atendimento da home tem contorno diferente; definir se é destaque intencional ou inconsistência |
| Agenda e datas | “Agenda 2” seleciona TER/23, mas o título diz “Segunda-feira, 23”; gerar dia da semana e data a partir do mesmo dado |
| Contagens da agenda | O resumo anuncia mais horários livres do que os exibidos; calcular os totais a partir dos dados disponíveis |
| Desktop e telas ausentes | Criar composições próprias sem apresentar as propostas deste guia como frames existentes |
| Marca e ícones | Exportar os arquivos definitivos e confirmar a biblioteca/origem antes de padronizar todos os assets |

### 14.2 Checklist para cada página

- [ ] Referência Figma identificada, ou extensão do sistema documentada quando não existir frame.
- [ ] Cores, fontes, pesos, espaçamentos, raios e sombras usam tokens compartilhados.
- [ ] Componentes recorrentes reutilizados; exceções locais justificadas.
- [ ] Tela conferida em 402px e com largura menor, sem corte de conteúdo ou rolagem horizontal indevida.
- [ ] Conteúdo legível com ampliação e nomes/descrições maiores do que os exemplos.
- [ ] Foco, seleção, validação, carregamento e demais estados aplicáveis funcionam.
- [ ] Navegação por teclado, nomes acessíveis, labels e contraste conferidos.
- [ ] Barras persistentes não impedem acesso ao último item ou ao campo focado.
- [ ] Ícones e fontes carregam de fontes estáveis; não há URLs temporárias do Figma.
- [ ] `npm run lint` e `npm run build` executados para alterações no código, além da revisão no navegador.

Ao mudar um padrão compartilhado, atualizar este guia e a referência no Figma, registrando o que foi observado e o que passou a ser uma decisão de implementação. Assim, as páginas futuras partem da mesma base.
