import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <main>
      <h1>Biblioteca Comunitaria</h1>
      <p>Base tecnica criada. Nenhuma funcionalidade implementada ainda.</p>
    </main>
  )
}

const elemento = document.getElementById('root')
if (elemento === null) {
  throw new Error('Elemento #root nao encontrado')
}

createRoot(elemento).render(
  <StrictMode>
    <App />
  </StrictMode>
)
