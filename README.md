# Desafila

Aplicação web (PWA) que organiza o atendimento em clínicas: o paciente faz uma
**pré-triagem orientativa**, encontra clínicas e profissionais e agenda a consulta.
A pré-triagem **não emite diagnóstico** nem substitui avaliação médica — ela apenas
orienta o próximo passo e adianta informação para o profissional.

Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas — Senac
Pernambuco. Este repositório contém o **front-end**; a API está no
[repositório do back-end](https://github.com/srenataoliveira/Saude-na-Palma-da-M-o---Senac).

## Acessos

| | Endereço |
| --- | --- |
| Aplicação (produção) | https://saudepalmamao.vercel.app |
| API (produção) | https://desafila-api.onrender.com |
| Documentação da API (Swagger) | https://desafila-api.onrender.com/api-docs |
| Front-end (este repositório) | https://github.com/marianaosd/Saude-Palma-Mao-Front |
| Back-end | https://github.com/srenataoliveira/Saude-na-Palma-da-M-o---Senac |

> A API está no plano gratuito do Render e **dorme após 15 minutos sem uso**.
> O primeiro acesso do dia pode levar até 1 minuto para responder.

## Contas de demonstração

O ambiente publicado tem uma conta de demonstração para cada perfil:

| Perfil | E-mail |
| --- | --- |
| Paciente | `robertaalves@email.com` |
| Profissional | `rafael.mendes@sauderecife.com.br` |
| Administrador | `admin@desafila.com.br` |

Todas com dados fictícios. **As senhas não ficam neste repositório** — são
entregues junto com o material do projeto (Teams) e nas anotações da
apresentação.

> O acesso administrativo é o mais sensível: além da gestão de clínicas,
> especialidades e profissionais, ele permite gerar senha temporária para
> qualquer conta. Em um projeto real, essa conta teria senha forte, autenticação
> em duas etapas e ficaria restrita a uma rede interna.

## Tecnologias

- **React 19** com JavaScript e JSX
- **Vite 8** (desenvolvimento e build)
- **CSS puro**, organizado em tokens, com fontes hospedadas localmente
- **ESLint** para padronização do código
- Nenhuma biblioteca de UI, roteador ou gerenciador de estado: navegação e estado
  são resolvidos com React e a API do navegador, para manter o código
  compreensível para quem está aprendendo.

## Requisitos

- **Node.js 24 ou superior** (`node -v`) — exigido em `engines` no `package.json`
  e registrado no `.nvmrc`
- Acesso à internet para falar com a API publicada, ou o back-end rodando localmente

## Como rodar localmente

### 1. Front-end

```bash
npm ci
npm run dev
```

`npm ci` instala as versões exatas do `package-lock.json`. Abre em
`http://localhost:5173`.

**Windows / PowerShell:** se aparecer que `npm.ps1` não pode ser carregado porque
a execução de scripts está desabilitada, use `npm.cmd`:

```powershell
npm.cmd ci
npm.cmd run dev
```

Não é preciso alterar a política de execução do PowerShell.

### 2. Back-end (obrigatório)

O front **não funciona sozinho**: as telas de clínicas, profissionais, agenda e
pré-triagem consultam a API. Sem ela, o app mostra a mensagem genérica
"Não foi possível concluir a solicitação."

Em outro terminal:

```bash
git clone https://github.com/srenataoliveira/Saude-na-Palma-da-M-o---Senac
cd Saude-na-Palma-da-M-o---Senac
npm install
npm start
```

A API sobe em `http://localhost:3000`. As variáveis de ambiente necessárias
(`DB_*`, `JWT_SECRET`, `ADMIN_*`) estão descritas no README do back-end.

> **Importante:** toda chamada do front começa com `/api`. Em desenvolvimento, o
> `vite.config.js` faz proxy de `/api` para `http://localhost:3000` e remove o
> prefixo. Em produção, o mesmo papel é do `vercel.json`.

### 3. Login do administrador em desenvolvimento

O login administrativo não fica no banco: ele compara com as variáveis
`ADMIN_EMAIL` e `ADMIN_SENHA_HASH`. Para gerar o hash da senha desejada:

```bash
node -e "console.log(require('bcrypt').hashSync('SUA-SENHA-AQUI', 10))"
```

E acrescente ao `.env` do back-end:

```
ADMIN_EMAIL=seu-email@exemplo.com
ADMIN_SENHA_HASH=<hash gerado acima>
```

O `.env` não é versionado. Ao iniciar, o servidor deve exibir
`injected env (8)` — se aparecer `(6)`, as duas variáveis do admin não carregaram.

### Reiniciar após alterar o back-end

O back-end roda com Node puro, **sem recarga automática**. Depois de mudar
qualquer arquivo da API, pare (`Ctrl+C`) e suba de novo. Se a porta 3000 ficar
presa por um processo antigo, as rotas novas "não existem":

```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen | Select-Object OwningProcess
Stop-Process -Id <numero> -Force
```

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com recarga automática |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | ESLint em todo o projeto |

## Estrutura

```
src/
├── assets/          fontes locais (com as licenças) e SVGs
├── components/
│   ├── layout/       AppLayout, Header, PatientLayout, ProfessionalLayout
│   ├── profissional/ peças do portal médico (cartões, painéis, agenda)
│   └── ui/           AccessibilityPanel, PriorityTag
├── data/            registros fictícios usados só em demonstração
├── pages/
│   ├── institucional/  Home
│   ├── auth/           Login, LoginProfissional, LoginAdmin, Cadastro, EsqueciSenha
│   ├── paciente/       Início, Triagem, Clínicas, Agendamento, Histórico, Perfil
│   ├── profissional/   Início, Agenda, Histórico, Perfil, Disponibilidades
│   └── admin/          Clínicas, Especialidades, Profissionais, Senhas
├── services/        integração real com a API (api.js, agenda.js, accessibility.js)
└── styles/          tokens, fontes, base global e estilos compartilhados
public/              manifest do PWA, service worker e ícones
docs/                style guide, estrutura, visão geral e créditos
```

As convenções completas de código estão em [AGENTS.md](AGENTS.md).

## Documentação do projeto

- [Visão geral e planejamento](docs/visao-geral.md): problema, personas e jornadas
- [Style guide](docs/style-guide.md): referência do Figma, tokens e componentes
- [Estrutura do frontend](docs/estrutura-frontend.md): organização, inventário e
  próximas entregas
- [Créditos de terceiros](docs/creditos.md): origem e licença de fontes, ícones e
  do símbolo de acessibilidade da ONU

## Acessibilidade

Recursos implementados, pensados principalmente para o público idoso:

- **Texto ajustável** em 4 níveis (85%, 100%, 115% e 130%), aplicado ao app inteiro
- **Alto contraste** em verde (não em azul)
- **Fonte OpenDyslexic** para leitura por pessoas com dislexia
- **Painel acessível por teclado**, fechando com `Esc`
- **Layout sem quebra** em zoom de 400% e de 375px a 1400px de largura
- Controles com altura mínima de 44px e foco visível por teclado

## PWA

O app é instalável e funciona com carregamento em cache. O manifest e o service
worker estão em `public/` e foram escritos à mão — não há `vite-plugin-pwa`.

> Após um novo deploy, o service worker pode servir o bundle antigo. Se algo
> parecer desatualizado: `Ctrl+Shift+R` ou, no DevTools, *Application → Service
> Workers → Unregister*.

## Deploy

| Camada | Serviço | Observação |
| --- | --- | --- |
| Front-end | Vercel | Publica automaticamente a partir da branch `main` |
| API | Render (plano free) | Dorme após 15 min sem uso |
| Banco | Supabase (PostgreSQL) | Conexão via pooler com `DB_SSL=true` |

O `vercel.json` reescreve `/api/:path*` para a API no Render, então o front não
precisa conhecer o endereço do back-end em tempo de execução.

## Situação conhecida

- `npm run lint` acusa **um** erro pré-existente em `src/pages/paciente/Triagem.jsx:36`
  (`react-hooks/set-state-in-effect`). Não afeta o build nem o uso; está na lista
  de pendências.
- Os dados de demonstração em `src/data/` são fictícios e não vêm da API.
- Telas públicas (login, cadastro e recuperação de senha) não guardam rota na URL:
  recarregar a página volta ao login. As áreas logadas preservam a tela no F5.

## Funcionalidades

**Paciente:** cadastro e login, pré-triagem orientativa, busca de clínicas e
profissionais, agendamento e cancelamento, histórico e perfil.

**Profissional:** login próprio, agenda do dia, histórico de atendimentos,
disponibilidades semanais, acesso à pré-triagem respondida pelo paciente e perfil.

**Administração:** gestão de clínicas, especialidades e profissionais, e geração
de **senha temporária** para quem esqueceu a senha.

## Recuperação de senha

O app não envia e-mail: o plano gratuito do Render bloqueia SMTP, e o envio para
terceiros exigiria domínio verificado. Por isso a recuperação funciona
presencialmente:

1. A pessoa clica em **"Esqueci minha senha"** no login e vê as instruções
2. Procura a recepção da clínica e informa o e-mail cadastrado
3. A administração usa a aba **Senhas** para gerar uma senha temporária de 8
   caracteres (sem letras ambíguas como `0/O` e `1/I/L`)
4. A senha aparece uma única vez na tela, para ser repassada na hora

## Créditos de terceiros

Fontes, ícones e o símbolo de acessibilidade da ONU estão documentados em
[docs/creditos.md](docs/creditos.md), com origem e licença de cada um.

## Equipe

Gabriel Tenório · Luís Bezerra · Lorena Torres · Mariana Oliveira · Renata Oliveira
