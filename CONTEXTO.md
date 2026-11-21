# CONTEXTO.md — Biblioteca Comunitária

Documento de referência do Projeto Final de DAD. Leia as seções necessárias antes de cada etapa. Linguagem simples, decisões explícitas, nada de segredos versionados.

## Projeto e arquitetura

- Remoto confirmado (sem credenciais): https://github.com/cl205079-arch/TesteProjetoWill
- Desktop: aplicativo Electron + React + TypeScript em `app/`. Janela inicial com `contextIsolation: true`, `sandbox: true` e `nodeIntegration: false`; o renderer não acessa Node diretamente.
- Servidor central: Express + TypeScript em `server/`.
- Banco relacional: SQLite com `better-sqlite3` como dependência prevista. Nesta base não há tabelas, migrations nem conexão ativa.
- `shared/`: pacote TypeScript vazio até a Etapa 3, quando receberá os tipos compartilhados.
- O aplicativo conversa com o servidor pela API e **não** acessa o banco diretamente. Regras de negócio ficam no servidor, em classes.
- Qualidade: sem `any`, entradas validadas na fronteira, SQL sempre parametrizado, nomes de coluna em atualização vindos de lista permitida, segredos fora do Git (`.env` ignorado; `.env.example` sem valores reais).
- Padrão de texto: português simples em código, documentação, mensagens ao usuário e commits.
- Estrutura criada na base:

```text
.
├── CONTEXTO.md
├── README.md
├── .env.example
├── .gitignore
├── package.json            # npm workspaces
├── tsconfig.base.json      # TypeScript strict
├── app/                    # Electron + electron-vite + React + TS
│   └── src/{main,preload,renderer}
├── server/                 # Express + TS (esqueleto)
│   └── src/{app,index}.ts
└── shared/                 # pacote TS vazio (tipos na Etapa 3)
    └── src/index.ts
```

- O modelo relacional documentado fica em `docs/modelo-relacional.md` (Etapa 2). A base não cria schema físico.

## Regras de negócio

- Papéis: **ADMIN** (gestão de usuários, configurações, perdão/estorno), **ATENDENTE** (balcão: cadastro, empréstimo, devolução, fila, pagamento de multa), **LEITOR** (somente os próprios dados; nunca dados de outro leitor).
- Empréstimo: prazo inicial de **14 dias**, até **3** exemplares por leitor, **1** renovação de **7 dias**, bloqueada se existir fila para o livro.
- Fila de espera: ordem **FIFO**, sem escolha de data. A pessoa avisada tem **24 horas corridas** para retirar; se o limite cair em fim de semana ou feriado, prorrogar até o próximo dia útil. Limite de **3 reservas ativas** por leitor.
- Agendamento de exemplar já disponível é operação separada da fila: até **3 dias** à frente, guardado até o fim do dia escolhido; também respeita o limite de 3 reservas ativas.
- Multa: **R$ 0,50 por dia** de atraso, teto de **R$ 15,00**. Avisos: **2 dias antes** do vencimento e aviso de atraso às **8h**. Multa antiga não muda quando a configuração é alterada.
- Quatro usos de API, com propósitos distintos: **Google Books** (metadados/sugestão bibliográfica), **ViaCEP** (endereço por CEP), **BrasilAPI** (feriados nacionais para dias úteis) e **API própria** (consumida pelo Electron). Fontes alternativas para disponibilidade não aumentam a contagem.
- WhatsApp: somente com consentimento explícito e revogável; canal opcional, com e-mail como base. Nenhum envio real sem consentimento.
- Prazos, limites, valores e canais são decisões iniciais: devem ficar configuráveis, nunca espalhados como números fixos no código.

## Funções e dependências

- **Função 1 — laranja `#DF7900`**: Interface, Electron e Entrega. Telas, cliente da API, login/ativação, tema, manual e instalador. Começa no dia 1.
- **Função 2 — azul `#2362E6`**: Banco de Dados e Camada de Dados. DER, tipos compartilhados, migrations, conexão, repositórios, consultas, transações e seed. Começa no dia 1.
- **Função 3 — vermelho `#E22125`**: Núcleo, Regras de Negócio e Segurança. Contrato OpenAPI, validação, erros, autenticação, autorização, serviços de domínio, empréstimos, fila, multas e revisão de segurança. Pode começar com mocks.
- **Função 4 — verde `#00A374`**: Integrações, Notificações e Hospedagem. Cliente HTTP, Google Books, ViaCEP, feriados, e-mail, WhatsApp, agendamentos e implantação. Pode começar com mocks.
- Ordem: Etapa 1 (F1) libera as etapas 2 (F2), 4 (F1) e 6 (F4); Etapa 3 (F2) depende da 2; Etapa 5 (F3) depende de 2 e 3; Etapa 7 (F2) depende de 1 e 2. Etapas 8–40 seguem a numeração respeitando as dependências de cada prompt. Integração e entrega (41–43) somente no fim.
- Entregas entre funções: F2 → F3 (interfaces das entidades e repositórios); F2 → F1 (tipos para formulários e tabelas); F3 → F1 (contrato REST/OpenAPI com rotas, payloads, erros e token); F4 + F3 (interfaces `LivroSugerido`, `Endereco`, `Feriado`); F3 → F4 (eventos de aviso: devolução, vencimento, atraso e expiração da reserva).
- Regra de integração: definir interfaces TypeScript e contratos cedo; cada integrante pode trabalhar em paralelo com mocks; integrar as partes ao final.

## Git e Execução local

- Branches: `main` (base comum; etapas normais **nunca** são enviadas diretamente para ela), `funcao-1`, `funcao-2`, `funcao-3`, `funcao-4` e `integracao`.
- Cada integrante usa a **sua própria identidade Git real**. Antes de cada etapa, conferir:

```bash
git config user.name
git config user.email
```

- Se a identidade estiver ausente ou divergir do integrante que está executando, pedir **somente** nome e e-mail do integrante atual e orientar uma única vez com:

```bash
git config --local user.name "Nome do integrante atual"
git config --local user.email "email-do-integrante@exemplo"
```

Não inventar autoria, não usar dados de outra pessoa e nunca pedir senha, token ou chave no chat. Se quiser ocultar o e-mail pessoal, usar o endereço `noreply` mostrado pelo GitHub.

- Regras para **toda** etapa: ler este CONTEXTO; conferir o remoto; executar somente a etapa liberada; validar o resultado; usar a identidade real do integrante atual e a branch da sua função; selecionar apenas os arquivos da etapa no commit (`git add` seletivo); enviar somente se houver permissão; **não fazer commit quando a etapa não pedir**.
- Commits locais por etapa, após conferência de `git status`. Envio apenas para a branch da função. Manter `.git`, remoto, branches e histórico: sem reescrita, sem `force-push`, sem `reset` destrutivo. Se a branch estiver protegida, usar branch de trabalho e PR, sem burlar a proteção.
- Dados históricos (empréstimos, reservas, pagamentos, notificações, auditoria de configurações) devem ser preservados: exclusão lógica ou restrição, nunca remoção física que apague histórico.
- Comandos de inicialização e uso:

```bash
npm install
cp .env.example .env
npm run dev          # servidor + aplicativo
npm run dev:server   # somente servidor
npm run dev:app      # somente aplicativo Electron
npm run typecheck
npm run build
npm start            # servidor compilado (após build)
```

- Antes de rodar, conferir se a conta GitHub está conectada/autorizada na ferramenta. Sem permissão de escrita, deixar o commit local e conectar a conta; não compartilhar credenciais no chat.
