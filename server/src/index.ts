import { Application } from './app.js';

const rawPort = process.env['SERVER_PORT'] ?? '3000';
const port = Number(rawPort);
const host = process.env['SERVER_HOST'] ?? '127.0.0.1';

if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('SERVER_PORT deve ser um inteiro entre 1 e 65535.');
}
if (!host.trim()) {
  throw new Error('SERVER_HOST não pode estar vazio.');
}

const application = new Application();
const server = application.http.listen(port, host);
server.once('listening', () => {
  console.info(`Servidor iniciado na porta ${port}.`);
});

server.on('error', () => {
  console.error('Não foi possível iniciar o servidor. Confira host e porta.');
  process.exitCode = 1;
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    server.close();
  });
}
