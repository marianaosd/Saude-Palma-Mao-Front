# Visão geral e planejamento

Este documento organiza o contexto fornecido pelo grupo para o Projeto Integrador **Saúde na Palma da Mão**. Ele descreve a visão futura do produto. O que já está implementado e as instruções para executar estão no [README](../README.md).

## Problema e proposta

Pacientes enfrentam filas nas recepções, dificuldade para encontrar horários e dúvidas sobre qual atendimento procurar. Profissionais recebem informações incompletas e precisam lidar com agendas e processos administrativos.

A proposta é uma aplicação que permita iniciar o atendimento pelo celular: registrar informações em uma pré-triagem, receber uma orientação inicial e buscar/agendar uma consulta. Os profissionais poderão consultar as informações antes do atendimento, e a administração organizará clínicas, usuários e agendas.

Reduzir o tempo de espera é o objetivo do projeto, ainda a ser validado com possíveis usuários. Não há medição de resultados nesta etapa.

## Perfis e funcionalidades previstas

| Perfil | Funcionalidades da visão inicial |
| --- | --- |
| Paciente | Cadastro e login; pré-triagem por chatbot ou formulário; classificação orientativa de prioridade; busca por clínicas e profissionais; agendamento; visualização das informações da consulta; cadastro e acionamento/compartilhamento com contato de emergência. |
| Profissional de saúde | Consulta da pré-triagem e das informações antes do atendimento; visualização de pacientes e agendamentos; organização da disponibilidade e acompanhamento da agenda. |
| Administrador | Gestão de clínicas parceiras, profissionais, usuários, horários, agendamentos e configurações do sistema. |
| Experiência geral | Interface acessível, uso pelo celular e futura PWA. Confirmações e lembretes aparecem nas necessidades da jornada do paciente; os canais ainda serão definidos. |

A pré-triagem é orientativa: seu resultado deve ser apresentado como apoio à avaliação de um profissional, sem ser tratado como diagnóstico. As regras dessa orientação ainda não foram definidas.

## Personas

As personas abaixo são referências de planejamento apresentadas pelo grupo, não registros de pacientes ou profissionais reais.

### Roberta Alves — paciente

42 anos, analista administrativa. Usa o celular no dia a dia e prefere aplicativos simples, objetivos e fáceis de entender.

- **Contexto:** precisa marcar uma consulta, mas nem sempre sabe qual especialidade procurar ou a prioridade de atendimento.
- **Dores:** filas, horários incompatíveis, dificuldade de encontrar atendimento e receio de agendar uma consulta inadequada.
- **Objetivos:** entender o próximo passo, encontrar atendimento e agendar sem enfrentar filas.
- **Necessidades:** linguagem clara, pré-triagem simples, busca por clínicas/profissionais, confirmação e lembretes.

| Etapa da jornada | Ação esperada | Necessidade a considerar |
| --- | --- | --- |
| 1. Identificação da necessidade | Acessar a aplicação ao buscar atendimento | Encontrar com facilidade o início do fluxo |
| 2. Pré-triagem | Responder às perguntas sobre sua situação | Compreender as perguntas e conseguir se expressar |
| 3. Orientação | Consultar a orientação inicial | Entender os limites do resultado e o próximo passo |
| 4. Escolha | Consultar clínicas, especialidades, profissionais e horários | Comparar opções adequadas à sua disponibilidade |
| 5. Agendamento | Escolher data/horário e confirmar a consulta | Concluir um processo simples e compreensível |
| 6. Notificação | Receber confirmação e lembrete | Encontrar os dados da consulta e lembrar do horário |

### Rafael Mendes — profissional de saúde

36 anos, médico clínico geral. Usa sistemas digitais no trabalho e precisa de informações organizadas para a rotina da clínica.

- **Contexto:** atende pacientes e depende das informações e horários organizados pela recepção.
- **Dores:** informações incompletas, conflitos de agenda, sobrecarga da recepção e tempo gasto com processos administrativos.
- **Objetivos:** receber informações organizadas, manter a agenda atualizada e utilizar a pré-triagem como apoio.
- **Necessidades:** consulta clara dos dados, disponibilidade de horários e integração com o agendamento.

| Etapa da jornada | Ação esperada | Necessidade a considerar |
| --- | --- | --- |
| 1. Acesso | Entrar na área profissional | Encontrar a agenda com facilidade |
| 2. Configuração da agenda | Definir horários e disponibilidade | Organizar os períodos de atendimento |
| 3. Recebimento do agendamento | Visualizar uma nova consulta | Saber quem será atendido e quando |
| 4. Consulta da pré-triagem | Ler as informações fornecidas pelo paciente | Encontrar os dados iniciais de forma organizada |
| 5. Atendimento | Utilizar o contexto inicial durante a consulta | Ter a pré-triagem como apoio ao atendimento |
| 6. Gestão da agenda | Acompanhar e atualizar os atendimentos | Manter os horários consistentes e evitar conflitos |

A persona e a jornada do administrador ainda precisam ser detalhadas pelo grupo.

## Limite desta entrega e recorte sugerido

Nesta entrega existe apenas a base do frontend e uma página de apresentação. Todos os fluxos descritos acima são planejados.

Como primeiro recorte, sugerimos prototipar a jornada do paciente com um formulário de pré-triagem e um agendamento simulado. O grupo deverá validar esse recorte com as aulas e com os possíveis usuários antes de tratá-lo como escopo fechado.

Um formulário pode ser o primeiro exercício de estado, eventos e validação em React. A decisão entre formulário, chatbot ou ambos permanece aberta. Uma classificação clínica não deve ser inventada para preencher o protótipo; a orientação e seus critérios precisam ser definidos com participação de profissionais de saúde.

## Arquitetura prevista

```text
Frontend React no navegador → API Node.js → Banco de dados PostgreSQL
```

Hoje apenas o frontend existe. O Node.js instalado executa as ferramentas de desenvolvimento; não existe servidor de aplicação implementado. O frontend consumirá a API, e a API será responsável pelas regras de negócio, autenticação, permissões e acesso ao banco. O navegador não acessará diretamente o PostgreSQL.

A PWA será uma evolução do frontend. Manifesto, service worker, estratégia de cache e experiência sem conexão ainda não estão implementados nem definidos. A presença do favicon e da cor do tema não torna a aplicação uma PWA.

## Decisões para as próximas etapas

- Validar o problema com pacientes, recepção e profissionais e definir como avaliar se a solução ajuda.
- Priorizar funcionalidades para a primeira entrega e dividir tarefas entre os integrantes.
- Desenhar telas e navegação com foco em celular, linguagem simples e uso por teclado.
- Definir perguntas, conteúdo e limites da orientação de pré-triagem com profissionais de saúde.
- Detalhar criação, confirmação, alteração e cancelamento de agendamentos, incluindo conflitos de horário.
- Definir quais dados cada perfil pode consultar e como será o acesso às informações de saúde antes de armazenar dados reais.
- Definir canais e condições para lembretes e contato de emergência.
- Combinar os contratos da API e decidir onde o backend será mantido.
- Definir recursos da PWA, hospedagem e critérios de aceitação dos fluxos.

Cada decisão aprovada deve ser refletida nesta documentação e nas tarefas do grupo. A sequência de implementação sugerida está no [README](../README.md#como-vamos-evoluir).
