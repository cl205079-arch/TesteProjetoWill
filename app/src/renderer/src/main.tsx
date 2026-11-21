import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (!container) throw new Error('Elemento raiz da aplicação não encontrado.');

createRoot(container).render(
  <StrictMode>
    <main>
      <h1>Biblioteca Comunitária</h1>
      <p>Base técnica do Projeto Final de DAD.</p>
    </main>
  </StrictMode>
);
