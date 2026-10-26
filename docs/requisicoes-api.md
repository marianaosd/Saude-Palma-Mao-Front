# Guia de Requisições e Integração com a API

Este documento detalha como o front-end consome a API REST do **Desafila**, os mecanismos de autenticação, o ciclo de vida dos tokens e a especificação completa de cada endpoint utilizado pelas telas do sistema.

---

## 1. Arquitetura de Comunicação

O front-end comunica-se com a API utilizando JSON sobre HTTPS. Todas as chamadas trafegam pelo módulo centralizador [`src/services/api.js`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/src/services/api.js), garantindo cabeçalhos uniformes, tratamento de erros e autenticação automática.

### Configuração de Base URL
- **Desenvolvimento Local:** As requisições apontam para o caminho relativo `/api`. O Vite ([`vite.config.js`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/vite.config.js)) atua como proxy reverso, encaminhando `/api/*` para `http://localhost:3000/*` (onde o Express está rodando). Isso evita problemas de CORS durante o desenvolvimento local.
- **Produção (Vercel):** O proxy ou a variável de ambiente direciona as requisições para a API em produção hospedada no Render (`https://desafila-api.onrender.com`).
- **Documentação Interativa (Swagger):** Disponível em `https://desafila-api.onrender.com/api-docs` ou localmente em `http://localhost:3000/api-docs`.

---

## 2. Autenticação, Tokens e Sessão

A API utiliza tokens **JWT (JSON Web Token)** transmitidos no cabeçalho HTTP:
```http
Authorization: Bearer <seu_token_jwt>
```
Os tokens são assinados no backend com algoritmo HS256 e possuem validade de **8 horas**.

### Isolamento de Sessão por Perfil
Para que múltiplos perfis possam ser testados no mesmo navegador sem colisão de cookies ou chaves, o front-end divide o `localStorage` por perfil:

| Perfil | Chave do Token | Chave dos Dados |
| --- | --- | --- |
| **Paciente** | `saude_token` | `saude_paciente` |
| **Profissional** | `saude_profissional_token` | `saude_profissional` |
| **Administrador** | `saude_admin_token` | `saude_admin` |

### Injeção Automática de Token
O método `api(path, options)` em [`src/services/api.js`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/src/services/api.js) identifica automaticamente qual token anexar com base na rota ou na opção `perfil`:
- Rotas que iniciam com `/profissionais/me`, `/auth/profissional/` ou `/disponibilidades/me` usam o token do profissional.
- Chamadas com `{ perfil: 'admin' }` usam o token do administrador.
- Todas as demais rotas utilizam o token do paciente.

### Tratamento de Expiração (HTTP 401)
Quando a API retorna status `401 Unauthorized`:
1. A sessão local correspondente é limpa (`limparSessao()`, `limparSessaoProfissional()` ou `limparSessaoAdmin()`).
2. É disparado um evento global no `window`:
   - `sessao-expirada` → redireciona o paciente para `#login`.
   - `sessao-profissional-expirada` → redireciona o médico para `#login-profissional`.
   - `sessao-admin-expirada` → redireciona o admin para `#login-admin`.
3. O componente [`App.jsx`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/src/App.jsx) escuta esses eventos e atualiza a tela sem quebrar a experiência do usuário.

---

## 3. Catálogo Completo de Endpoints

### 3.1. Autenticação (`/auth`)

#### Cadastro de Paciente
- **Método / Rota:** `POST /auth/cadastro`
- **Acesso:** Público (com rate limit: 50 req/15min).
- **Corpo da Requisição (JSON):**
  ```json
  {
    "nome_completo": "Roberta Alves",
    "cpf": "12345678901",
    "data_nascimento": "1982-05-14",
    "telefone": "81999998888",
    "email": "robertaalves@email.com",
    "senha": "MinhaSenhaForte8+",
    "contato_emergencia_nome": "Carlos Alves",
    "contato_emergencia_telefone": "81988887777",
    "contato_emergencia_email": "carlos@email.com",
    "relacao_contato": "Irmão"
  }
  ```
- **Resposta de Sucesso (201 Created):**
  ```json
  {
    "message": "Paciente cadastrado com sucesso",
    "token": "eyJhbGciOi...",
    "paciente": { "id": "uuid", "nome_completo": "Roberta Alves", "email": "robertaalves@email.com" }
  }
  ```
- **Erros Comuns:** `400 Bad Request` (campos obrigatórios ausentes, CPF inválido), `409 Conflict` (e-mail ou CPF já cadastrado).

#### Login de Paciente
- **Método / Rota:** `POST /auth/login`
- **Acesso:** Público.
- **Corpo:** `{ "email": "robertaalves@email.com", "senha": "..." }`
- **Resposta (200 OK):** Retorna `token` e objeto `paciente`.

#### Login de Profissional
- **Método / Rota:** `POST /auth/profissional/login`
- **Acesso:** Público.
- **Corpo:** `{ "email": "rafael.mendes@sauderecife.com.br", "senha": "..." }`
- **Resposta (200 OK):** Retorna `token` e dados do `profissional`.

#### Login de Administrador
- **Método / Rota:** `POST /auth/admin/login`
- **Acesso:** Público.
- **Corpo:** `{ "email": "admin@desafila.com.br", "senha": "..." }`
- **Resposta (200 OK):** Retorna `token` administrativo.

---

### 3.2. Área do Paciente

#### Dados do Perfil do Paciente
- **`GET /pacientes/me`** (Bearer Paciente): Retorna os dados completos do paciente autenticado (nome, CPF, data de nascimento, telefone, contato de emergência).
- **`PUT /pacientes/me`** (Bearer Paciente): Atualiza telefone e dados do contato de emergência (nome, telefone, e-mail, relação).

#### Questionário e Histórico de Pré-triagem
- **`GET /triagem/categorias`** (Bearer Paciente): Lista as categorias de sintomas disponíveis (ex: *Sintomas respiratórios*, *Dor de cabeça e sintomas neurológicos*, *Sintomas gastrointestinais*).
- **`GET /triagem/categorias/:idCategoria/perguntas`** (Bearer Paciente): Retorna a lista de perguntas associadas à categoria selecionada.
- **`POST /triagem`** (Bearer Paciente, rate limit: 30 req/15min):
  - **Corpo:**
    ```json
    {
      "id_categoria": "uuid-da-categoria",
      "respostas": [
        { "id_pergunta": "uuid-1", "resposta_bool": true },
        { "id_pergunta": "uuid-2", "resposta_bool": false }
      ]
    }
    ```
  - **Resposta (201 Created):** Retorna o registro criado em `historico_triagem_paciente` com o campo `status_final` classificado (`TELECONSULTA`, `PRESENCIAL` ou `POSSIVEL_URGENCIA`).
- **`GET /triagem/meu-historico`** (Bearer Paciente): Lista todas as pré-triagens registradas anteriormente pelo paciente.

#### Catálogo de Clínicas, Especialidades e Profissionais
- **`GET /clinicas`** (Bearer Qualquer): Retorna lista de clínicas ativas (id, nome, cnpj, endereco, telefone, horario_funcionamento).
- **`GET /especialidades`** (Bearer Qualquer): Retorna lista de especialidades cadastradas.
- **`GET /profissionais`** (Bearer Qualquer): Retorna a lista pública de profissionais com nome, CRM, conselho, especialidade e clínica vinculada (sem expor CPF ou telefone pessoal).
- **`GET /profissionais/:id/horarios-ocupados`** (Bearer Qualquer): Retorna os agendamentos já confirmados daquele profissional (data e faixa de horário), usado pelo utilitário [`src/services/agenda.js`](file:///c:/Users/maria/OneDrive/Projetos-Programacao/Projeto_PI_3/saude-palma-mao/src/services/agenda.js) para calcular os horários livres.
- **`GET /disponibilidades?id_profissional=:id`** (Bearer Qualquer): Retorna as janelas de trabalho cadastradas pelo profissional por dia da semana (`dia_semana`, `horario_inicio`, `horario_fim`).

#### Agendamentos do Paciente
- **`GET /agendamentos`** (Bearer Paciente): Lista todas as consultas do paciente logado, com dados detalhados da clínica e do médico.
- **`POST /agendamentos`** (Bearer Paciente):
  - **Corpo:**
    ```json
    {
      "id_profissional": "uuid-profissional",
      "id_clinica": "uuid-clinica",
      "data_consulta": "2026-11-10",
      "horario_inicio": "09:00",
      "horario_fim": "09:30",
      "id_triagem": "uuid-opcional-da-triagem"
    }
    ```
  - **Resposta (201 Created):** Consulta confirmada.
  - **Erros:** `409 Conflict` (horário já ocupado por outro paciente), `400 Bad Request` (data no passado ou fora da disponibilidade).
- **`PATCH /agendamentos/:id/cancelar`** (Bearer Paciente): Altera o status da consulta para `'Cancelado'`.

---

### 3.3. Portal do Profissional de Saúde

#### Perfil e Clínicas
- **`GET /profissionais/me`** (Bearer Profissional): Retorna os dados cadastrais do médico autenticado.
- **`PUT /profissionais/me`** (Bearer Profissional): Atualiza telefone ou e-mail profissional.

#### Agenda e Triagem da Consulta
- **`GET /profissionais/me/agendamentos`** (Bearer Profissional): Retorna a lista de todas as consultas agendadas com aquele médico, ordenadas por data e hora, contendo o nome e telefone do paciente.
- **`GET /profissionais/me/agendamentos/:id/triagem`** (Bearer Profissional): Retorna as respostas e a classificação de pré-triagem do paciente vinculada à consulta identificada por `:id`. Retorna `404` caso a consulta não possua triagem associada.

#### Janelas de Disponibilidade
- **`GET /disponibilidades/me`** (Bearer Profissional): Lista as janelas de atendimento configuradas pelo próprio médico.
- **`POST /disponibilidades`** (Bearer Profissional): Cria uma nova janela (`dia_semana` de 0 a 6, `horario_inicio`, `horario_fim`).
- **`PUT /disponibilidades/:id`** (Bearer Profissional): Atualiza uma janela existente.
- **`DELETE /disponibilidades/:id`** (Bearer Profissional): Remove a janela de atendimento.

---

### 3.4. Gestão Administrativa (`/admin`)

- **`POST /admin/senha-temporaria`** (Bearer Admin):
  - **Corpo:** `{ "email": "usuario@email.com" }`
  - **Resposta (200 OK):** Retorna `{ "senha_temporaria": "..." }` para ser entregue manualmente ao solicitante.
- **CRUD de Clínicas:** `POST /clinicas`, `PUT /clinicas/:id`, `DELETE /clinicas/:id` (Bearer Admin).
- **CRUD de Especialidades:** `POST /especialidades`, `PUT /especialidades/:id`, `DELETE /especialidades/:id` (Bearer Admin).
- **CRUD de Profissionais:** `POST /profissionais`, `PUT /profissionais/:id`, `DELETE /profissionais/:id` (Bearer Admin).

---

## 4. Padrão de Tratamento de Erros no Front-end

A API sempre responde em caso de erro com corpo JSON no formato:
```json
{
  "error": "Descrição legível do erro"
}
```

No front-end, a chamada `api(path, options)` captura esse formato e lança um `Error(data.error)`. Nos componentes de página, os blocos `try / catch` exibem essa mensagem diretamente para o usuário:
```javascript
try {
  await api('/agendamentos', { method: 'POST', body: JSON.stringify(dados) })
} catch (error) {
  setMensagemErro(error.message)
}
```
