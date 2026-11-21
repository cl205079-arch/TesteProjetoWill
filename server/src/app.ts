import express, { type Express } from 'express'

// Esqueleto: sem banco, repositorios, regras de negocio ou autenticacao.
export function createApp(): Express {
  const app = express()

  app.use(express.json({ limit: '100kb' }))

  app.get('/health', (_requisicao, resposta) => {
    resposta.status(200).json({ status: 'ok' })
  })

  return app
}
