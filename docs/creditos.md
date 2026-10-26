# Créditos e licenças de terceiros

Materiais de terceiros usados no front-end do Desafila, com origem e licença.

## Símbolo de acessibilidade da ONU

- **Arquivo no projeto:** `src/assets/icons/acessibilidade-onu.svg`
- **Uso:** ícone do botão que abre o painel de acessibilidade (componente
  `AccessibilityPanel`, presente nas áreas do paciente, do profissional e do
  administrador).
- **Símbolo original:** Organização das Nações Unidas — *Accessibility logo*,
  Graphic Design Unit. **Domínio público** (publicação da ONU sem aviso de
  copyright).
- **Vetorização SVG:** Pablo Busatto. Licença **Creative Commons — Atribuição
  (CC BY)**; a versão exata está indicada na página do arquivo.
- **Origem:** Wikimedia Commons, arquivo `Accessibility_logo.svg` —
  https://commons.wikimedia.org/wiki/File:Accessibility_logo.svg
- **Página oficial (arquivada):** https://www.un.org/webaccessibility/logo.shtml

> O arquivo é servido localmente (não vem de CDN), o que mantém o PWA
> funcionando offline e evita dependência externa.

## Fontes

Todas são locais (`src/assets/fonts/`) e acompanham o texto da licença no próprio
repositório.

| Fonte | Uso no projeto | Licença | Arquivo da licença |
| --- | --- | --- | --- |
| Nunito | Títulos (`--font-heading`) | SIL Open Font License 1.1 | `Nunito-OFL.txt` |
| Inter | Texto corrido (`--font-body`) | SIL Open Font License 1.1 | `Inter-OFL.txt` |
| OpenDyslexic | Opção de leitura para dislexia (`data-theme="dislexia"`) | SIL Open Font License 1.1 | `OpenDyslexic-OFL.txt` |

Origem da OpenDyslexic: https://opendyslexic.org/

## Ícones da área do profissional

Os SVGs em `src/assets/icons/profissional/` foram exportados do arquivo de
design do próprio projeto (Figma). Não são de bibliotecas de terceiros.

## Criação própria

Logotipo, ícones do PWA (`public/icone-192.png`, `public/icone-512.png`,
`public/apple-touch-icon.png`) e demais elementos visuais foram produzidos pela
equipe, a partir da marca do projeto.
