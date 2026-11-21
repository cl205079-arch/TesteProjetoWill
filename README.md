# Biblioteca Comunitária — Projeto Final de DAD

Base técnica do projeto. Esta etapa **não** contém telas de negócio, CRUD, regras, migrations, autenticação, notificações nem integrações. O modelo de dados está descrito em `CONTEXTO.md` e o DER em `docs/modelo-relacional.md`.

Repositório: https://github.com/cl205079-arch/TesteProjetoWill

## Arquitetura

- `app/`: aplicativo desktop Electron + React + TypeScript (janela segura com `contextIsolation`, `sandbox` e sem `nodeIntegration`).
- `server/`: servidor central Express + TypeScript.
- `shared/`: pacote TypeScript de tipos compartilhados; começa vazio e será preenchido na Etapa 3.
- `tsconfig.base.json`: configuração TypeScript estrita usada pelos três pacotes.

O aplicativo conversa com o servidor pela API. O aplicativo não acessa o banco diretamente. O banco previsto é SQLite com `better-sqlite3`, sem tabelas ou migrations nesta base.

## Preparação

Requisito: Node.js 20 ou superior.

```bash
npm install
cp .env.example .env
```

Ajuste `.env` localmente. Nunca versionar `.env`, credenciais, CPF real ou dados pessoais reais.

## Comandos

```bash
npm run dev          # inicia servidor e aplicativo juntos
npm run dev:server   # somente servidor
npm run dev:app      # somente aplicativo Electron
npm run typecheck    # conferência TypeScript dos pacotes
npm run build        # compila shared, server e app
npm start            # inicia o servidor compilado (após build)
```

## Git

Branches: `main` (base), `funcao-1`, `funcao-2`, `funcao-3`, `funcao-4` e `integracao`. Etapas normais nunca são enviadas diretamente para `main`. Cada integrante usa sua própria identidade Git e commita somente os arquivos da sua etapa. Regras completas em `CONTEXTO.md`.
