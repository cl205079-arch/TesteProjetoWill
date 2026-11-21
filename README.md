# Biblioteca Comunitária — Projeto Final de DAD

Base técnica inicial em npm workspaces. Leia [CONTEXTO.md](CONTEXTO.md) antes de qualquer etapa.

## Preparar o ambiente

Use Node.js 24 LTS e npm 11 ou superior. Execute os comandos na raiz deste repositório, a pasta `TesteProjetoWill`, e não na pasta que a contém.

```powershell
npm ci
Copy-Item .env.example .env
npm run dev
```

No Linux/macOS, substitua `Copy-Item .env.example .env` por `cp .env.example .env`.
O `.env` é opcional nesta base: o servidor usa `127.0.0.1:3000` por padrão.
`npm ci` instala os três workspaces usando o lockfile. Para alterar dependências deliberadamente, use `npm install` e confira também o `package-lock.json`.

`npm run dev` inicia o observador de tipos compartilhados, o servidor e o Electron. O renderer de desenvolvimento usa `127.0.0.1:5173`. Encerre com Ctrl+C.

Para iniciar as partes separadamente, use dois terminais na raiz:

```powershell
# Terminal 1
npm run dev:server
```

```powershell
# Terminal 2
npm run dev:app
```

Quando os tipos compartilhados forem definidos na etapa 3, mantenha também `npm run dev -w @biblioteca/shared` em execução, ou compile esse workspace antes das outras partes.

## Conferir e compilar

```powershell
npm run typecheck
npm run build
```

O build verifica TypeScript e compila na ordem `shared`, `server`, `app`. As saídas são `shared/dist`, `server/dist` e `app/out`, todas ignoradas pelo Git. Para executar o build, use `npm run start:server` e `npm run start:app` em terminais separados. Ainda não há empacotador de instalador; essa entrega pertence à etapa 39.

Verifique o servidor pelo endpoint técnico `GET http://127.0.0.1:3000/health`, que retorna `{"status":"ok"}`. No PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/health
```

`better-sqlite3` é uma dependência nativa exclusiva do servidor. A versão `12.11.1` está fixada porque fornece binário pré-compilado para Node 24 no Windows; a linha 13 tentou executar `node-gyp` durante a conferência desta base. A instalação precisa de rede para baixar os binários compatíveis. Em outra plataforma sem binário, será necessário o ambiente de compilação exigido pelo pacote. O app Electron não importa nem reconstrói esse módulo.

## Estrutura

```text
TesteProjetoWill/
├── .env.example
├── .gitattributes
├── .gitignore
├── CONTEXTO.md
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.base.json
├── app/
│   ├── package.json
│   ├── electron.vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── src/
│       ├── main/index.ts
│       ├── preload/index.ts
│       └── renderer/
│           ├── index.html
│           └── src/main.tsx
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts
│       └── index.ts
└── shared/
    ├── package.json
    ├── tsconfig.json
    └── src/index.ts
```

## Limites da base

- Electron + React + TypeScript: janela inicial com texto estático; nenhum fluxo funcional.
- `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`; preload vazio em CommonJS, sem expor APIs; permissões, novas janelas e navegação bloqueadas.
- CSP restritiva no build. Somente no desenvolvimento local são liberados o script inline do React Refresh e o WebSocket do Vite.
- Express + TypeScript: inicialização, validação da porta, encerramento e endpoint de saúde. Sem autenticação, CRUD ou regras de negócio.
- `shared/`: módulo vazio; tipos serão definidos na etapa 3. Está ligado aos dois workspaces como `@biblioteca/shared`.
- SQLite com `better-sqlite3` previsto para a etapa 7; sem abertura de banco, tabelas, migrations ou dados.
- `SERVER_HOST` e `SERVER_PORT` são lidos do `.env` da raiz pelos scripts do servidor. `DATABASE_PATH` e `VITE_API_BASE_URL` são apenas reservas documentadas para as próximas etapas. A base não faz chamadas de API; a política CSP de conexão será ajustada quando houver contrato e origem aprovados.
- TypeScript strict em todas as partes; nenhum `any` no código da base.

## Trabalho em grupo

Antes de editar, leia `CONTEXTO.md`, confirme o remoto, a identidade Git e `git status --short`. Cada integrante usa sua própria identidade. A inicialização é a única exceção autorizada de commit na branch padrão; etapas seguintes usam `funcao-1`, `funcao-2`, `funcao-3` ou `funcao-4`. A integração usa `integracao`.

Faça stage seletivo, confira o diff e crie commits locais por etapa. Publique apenas quando sua conta tiver permissão e somente na branch correspondente. Não faça force-push nem reescreva o histórico. Nunca adicione `.env`, credenciais ou bancos ao Git.

Referências técnicas: [electron-vite](https://electron-vite.org/guide/), [segurança do Electron](https://www.electronjs.org/docs/latest/tutorial/security) e [better-sqlite3](https://github.com/WiseLibs/better-sqlite3).
