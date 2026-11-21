# Contexto do Projeto Final de DAD — Biblioteca Comunitária

## Identificação e escopo

Remoto confirmado, sem credenciais: https://github.com/cl205079-arch/TesteProjetoWill

Branch padrão confirmada: `main`. O repositório estava vazio e sem commits no início desta execução. O Prompt inicial único autoriza o primeiro commit da base nessa branch. A pasta interna `.git`, o remoto e o histórico devem sempre ser preservados.

Responsável somente pela inicialização desta execução: Rafael Bernardo Pereira, `cl205079@g.unicamp.br`, conforme os dados fornecidos por ele. Isso não autoriza outros integrantes a usar essa identidade. Cada pessoa deve configurar seu próprio nome e e-mail localmente; pode escolher o e-mail noreply apresentado em sua conta GitHub.

Fonte das etapas: documento do grupo `prompts-biblioteca-comunitaria-aprimorados (1).pdf`, com 43 etapas. O PDF é referência de requisitos e dependências; não autoriza executar todas as etapas automaticamente. Nesta execução, o pedido é inicialização técnica e conferência F1.1 (etapa 1). Não repetir a substituição da base em prompts futuros.

## Arquitetura e estrutura

Aplicativo desktop Electron + React + TypeScript em `app/`; servidor central Express + TypeScript em `server/`; banco relacional SQLite com `better-sqlite3` somente no servidor; tipos TypeScript compartilhados em `shared/`.

O app conversa com o servidor pela API. Nunca acessa o banco, o arquivo SQLite ou o driver diretamente. Regras e persistência ficam no servidor; compartilhamento de tipos não concede acesso ao banco. Tipos de domínio serão aprovados e definidos na etapa 3. Não há migrations nem banco aberto na base inicial.

```text
raiz/
  package.json             npm workspaces e comandos gerais
  package-lock.json        versões resolvidas para npm ci
  tsconfig.base.json       opções strict herdadas
  README.md                instalação, execução e limites
  CONTEXTO.md              regras e sequência do grupo
  .gitignore               dependências, builds, bancos e segredos excluídos
  .gitattributes           finais de linha consistentes
  .env.example             valores locais públicos e variáveis futuras
  app/
    electron.vite.config.ts
    package.json, tsconfig.json, tsconfig.node.json
    src/main/index.ts
    src/preload/index.ts
    src/renderer/index.html
    src/renderer/src/main.tsx
  server/
    package.json, tsconfig.json
    src/app.ts
    src/index.ts
  shared/
    package.json, tsconfig.json
    src/index.ts            exportação vazia até a etapa 3
```

## Inicialização e comandos

Requisitos: Node.js 24 LTS, npm 11 ou superior, ambiente gráfico para Electron e rede para instalar dependências. Todos os comandos abaixo partem da raiz Git.

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

Linux/macOS: `cp .env.example .env`. Não sobrescreva um `.env` existente sem conferir a necessidade; nunca publique seu conteúdo. A base funciona sem `.env` com padrões locais.

- `npm run dev`: shared em watch, servidor e app juntos.
- `npm run dev:server`: servidor com reinício automático, padrão `127.0.0.1:3000`.
- `npm run dev:app`: Electron e renderer local em `127.0.0.1:5173`.
- `npm run dev -w @biblioteca/shared`: observador de tipos, útil após a etapa 3.
- `npm run typecheck`: conferência strict dos três workspaces.
- `npm run build`: conferência e build de shared, server e app, nessa ordem.
- `npm run start:server` / `npm run start:app`: execução após build em terminais separados.
- `GET /health`: único endpoint técnico existente; resposta `{"status":"ok"}`.

`SERVER_HOST` e `SERVER_PORT` são consumidos pelo servidor. `DATABASE_PATH` e `VITE_API_BASE_URL` são somente configurações previstas; o arquivo `.env.example` explica isso. Não há serviço externo configurado, credenciais, envio de mensagens ou acesso ao banco nesta base.

## Regras de implementação

- Usar classes para lógica e responsabilidades claras. Não implementar lógica de negócio em telas.
- TypeScript strict; não usar `any` explícito nem implícito. Usar `unknown` com validação para entradas desconhecidas.
- Validar entradas no limite da API e das integrações; mensagens claras em português simples.
- SQL sempre parametrizado. Não concatenar entrada do usuário em consultas. Definir transações e concorrência nas etapas próprias.
- Segredos fora do Git e fora do renderer. Não expor senhas, hashes, CPF protegido ou tokens internos em DTOs, logs ou mensagens de erro.
- Electron: `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`. A base bloqueia permissões, novas janelas e navegação; preload vazio sem Node/IPC exposto. CSP restritiva em produção; exceções de React Refresh/WebSocket somente no desenvolvimento local.
- Definir contratos antes de integrar. Mocks devem seguir os tipos aprovados e ser identificados como mocks.
- Não implementar etapa posterior por antecipação. Não recriar a base, resetar histórico ou apagar `.git`.

## Quatro funções e cores

| Função / branch | Cor | Responsabilidades |
| --- | --- | --- |
| 1 / `funcao-1` | Laranja `#DF7900` | Interface, Electron e entrega; telas do requisito 2, requisito 6 e entrega. Começa no dia 1. |
| 2 / `funcao-2` | Azul `#2362E6` | Banco e camada de dados; requisito 1, persistência do requisito 2 e apoio ao requisito 5. Começa junto com a função 1. |
| 3 / `funcao-3` | Vermelho `#E22125` | Núcleo, regras de negócio e segurança; requisitos 4 e 5 e parte do requisito 2. Começa pelos contratos e pode usar mocks. |
| 4 / `funcao-4` | Verde `#00A374` | Integrações, notificações e hospedagem; requisito 3, cron jobs, WhatsApp e hospedagem. Começa pelas interfaces e pode usar mocks. |

Essas funções organizam o grupo e não são os perfis de acesso do sistema. Os papéis do sistema serão `ADMIN`, `ATENDENTE` e `LEITOR`, com permissões e ownership definidos no contrato e na etapa de segurança.

## Contratos a combinar

1. Função 2 → 3: entidades e interfaces dos repositórios, nomes e tipos de campos, transações e erros de persistência.
2. Função 2 → 1: tipos usados nos formulários e tabelas, DTOs de criação/atualização, paginação e estados.
3. Função 3 → 1: REST/OpenAPI, rotas, payloads, respostas, erros, login/token, perfis e ownership.
4. Funções 4 e 3: clientes de integração e tipos `LivroSugerido`, `Endereco` e `Feriado`, falhas externas e cache.
5. Função 3 → 4: eventos de devolução, vencimento, atraso e expiração de reserva, com dados mínimos e regras de consentimento.
6. Todo o grupo: convenções de IDs, datas/fuso horário, dinheiro em centavos, nulabilidade, configuração da origem da API e critérios de integração. Estes pontos são decisões a aprovar, não contratos já implementados.

## Regras iniciais de negócio (somente referência nesta etapa)

- Empréstimo por 14 dias; no máximo 3 empréstimos por leitor.
- Uma renovação de 7 dias, somente quando não houver fila.
- Fila de reservas FIFO; prazo de 24 horas para retirada quando o exemplar estiver disponível. Se o prazo vencer em feriado ou fim de semana, prorrogar para o próximo dia útil.
- Limite de 3 reservas ativas por leitor.
- Agendamento separado da fila, com até 3 dias de antecedência.
- Multa de R$ 0,50 por dia de atraso, com teto de R$ 15. Os detalhes de cálculo devem ser formalizados na etapa correspondente.
- Avisos dois dias antes do vencimento e avisos de atraso às 8h; combinar o fuso com o grupo e a hospedagem.
- WhatsApp somente com consentimento explícito, registrado e revogável; integração opcional, sem envio real nesta base.
- Quatro usos distintos de API: Google Books (metadados bibliográficos), ViaCEP (endereço), BrasilAPI (feriados) e API própria (contrato REST do sistema). Não tratar quatro endpoints de um mesmo serviço como quatro integrações.

## Ordem e dependências dos prompts

Execute a etapa liberada mais baixa da função, respeitando as dependências. Fundação: etapas 1–7. Desenvolvimento: 8–40. Integração e entrega: 41–43. Depois da etapa 1, modelagem, revisão Electron e revisão do servidor podem avançar em paralelo em branches distintas. Se uma etapa estiver bloqueada, outra liberada pode avançar. Aprovar tipos e contratos antes de integrar; usar mocks coerentes enquanto houver dependências pendentes.

| Etapa | Prompt / função | Objetivo | Depende de |
| --- | --- | --- | --- |
| 1 | F1.1 | Conferência da base nova | Inicialização |
| 2 | F2.1 | Modelo relacional | 1 |
| 3 | F2.2 | Tipos compartilhados | 2 |
| 4 | F1.2 | Revisão do Electron e limites seguros | 1 |
| 5 | F3.1 | Contrato OpenAPI | 2, 3 |
| 6 | F4.1 | Revisão da base do servidor | 1 |
| 7 | F2.3 | Migrações e conexão | 1, 2 |
| 8 | F2.4 | Repositórios do catálogo | 3, 7 |
| 9 | F3.2 | Validação e erros | 6 |
| 10 | F4.2 | Cliente HTTP, cache e erros externos | 6 |
| 11 | F1.3 | Tema e componentes base | 4 |
| 12 | F2.5 | Repositórios de pessoas e operações | 8 |
| 13 | F3.3 | Autenticação, proteção de dados e permissões | 9, 12 |
| 14 | F4.3 | API de metadados bibliográficos | 10, 5, 3 |
| 15 | F4.4 | API de endereço por CEP | 10, 5 |
| 16 | F4.5 | Feriados e dias úteis | 10 |
| 17 | F1.4 | Cliente da API, login e ativação | 11, 5 |
| 18 | F2.6 | Consultas específicas do domínio | 12 |
| 19 | F3.4 | Serviços de catálogo e leitores | 13, 12 |
| 20 | F2.7 | Transações e concorrência | 18 |
| 21 | F3.5 | Empréstimos, prazos e atrasos | 19, 18 |
| 22 | F4.6 | E-mail e registro de notificações | 10, 12 |
| 23 | F1.5 | CRUD do catálogo e cadastro assistido | 17 |
| 24 | F3.6 | Fila de espera e agendamento separado | 21, 20 |
| 25 | F2.8 | Dados de demonstração | 20 |
| 26 | F3.7 | Multas e configurações | 24 |
| 27 | F4.7 | WhatsApp opcional | 22 |
| 28 | F1.6 | Leitores e usuários do sistema | 23 |
| 29 | F3.8 | Rotas REST e controle de acesso | 26, 6 |
| 30 | F4.8 | Tarefas agendadas e recuperação | 27, 24 |
| 31 | F1.7 | Balcão: empréstimo, devolução, fila e início | 28 |
| 32 | F2.9 | Testes e documentação do banco | 25 |
| 33 | F3.9 | Verificações das regras de negócio | 29 |
| 34 | F4.9 | Rotas de notificações e integração | 30, 29 |
| 35 | F1.8 | Configurações e central de notificações | 31 |
| 36 | F1.9 | Portal do leitor | 35 |
| 37 | F3.10 | Revisão de segurança e justificativa | 33, 36 |
| 38 | F4.10 | Hospedagem e HTTPS | 34, 37 |
| 39 | F1.10 | Revisão final, instalador e manual | 36, 38 |
| 40 | F4.11 | Documentação das integrações | 38 |
| 41 | Todos / `integracao` | Fluxo ponta a ponta | 39, 40, 37 |
| 42 | Todos / `integracao` | Matriz de requisitos do professor | 41 |
| 43 | Todos / `integracao` | Apresentação e revisão cruzada | 42 |

## Git, autoria e publicação

Antes de cada etapa, ler este arquivo e conferir:

```powershell
git rev-parse --show-toplevel
git remote -v
git branch --show-current
git status --short
git config user.name
git config user.email
```

O remoto deve corresponder exatamente ao link acima. Pare se for outro repositório. Nome e e-mail devem ser do integrante atual, sem placeholders. Se faltarem dados, peça somente os dados ausentes. Se houver autorização e comandos disponíveis, configure a identidade com `git config --local`; não altere a configuração global nem invente autoria.

O commit inicial da base usa `chore: cria base limpa do projeto`. Em repositório com histórico, substituir arquivos por commit normal mantendo o histórico; nunca usar reset destrutivo ou force-push. Se a branch padrão for protegida, usar `base-inicial` e Pull Request, sem contornar proteção. Como este repositório estava vazio, o commit inicial local pode inicializar `main`; conferir proteções antes de futura publicação.

Após a base, criar/usar `funcao-1`, `funcao-2`, `funcao-3`, `funcao-4` e `integracao`. Etapas normais nunca são enviadas diretamente à branch padrão. Trabalhar na branch da função; usar `integracao` para integrar os trabalhos conferidos e depois o fluxo de revisão do grupo.

Ao concluir uma etapa com alterações: conferir status, executar as verificações pertinentes, fazer stage seletivo dos arquivos da etapa, revisar `git diff --cached --check` e `git diff --cached`, confirmar a identidade e criar o commit local pedido pelo prompt. Não usar stage indiscriminado que inclua arquivos de terceiros, segredos ou artefatos. Na etapa 1, criar `fix: corrige base inicial do projeto` somente se uma falha da base já commitada tiver sido corrigida; sem correção, não criar outro commit.

Enviar commits para GitHub somente quando a conta conectada tiver permissão de escrita e somente para a branch prevista. Sem permissão, manter commit local e orientar a conexão/autorização uma única vez; nunca pedir senha, token ou chave no chat. Conferir `willcotil` como colaborador; se a ferramenta não permitir a consulta, orientar uma vez o responsável a adicioná-lo nas configurações de colaboradores do GitHub.
