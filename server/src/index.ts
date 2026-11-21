import { createApp } from './app.js'

const porta = Number.parseInt(process.env['PORT'] ?? '3000', 10)
const app = createApp()

app.listen(porta, () => {
  console.log(`Servidor ouvindo na porta ${porta}`)
})
