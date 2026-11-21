import { join } from 'node:path'
import { app, BrowserWindow, shell } from 'electron'

const apiUrl = process.env['VITE_API_URL'] ?? 'http://localhost:3000/api'
const rendererDevUrl = process.env['ELECTRON_RENDERER_URL']

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Biblioteca Comunitaria',
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      additionalArguments: [`--biblioteca-api-url=${apiUrl}`]
    }
  })

  if (rendererDevUrl !== undefined) {
    void window.loadURL(rendererDevUrl)
  } else {
    void window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Navegacao externa somente no navegador do sistema, de forma controlada.
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) {
      void shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  window.webContents.on('will-navigate', (event, url) => {
    const permitido = rendererDevUrl !== undefined
      ? url.startsWith(rendererDevUrl)
      : url.startsWith('file://')
    if (!permitido) {
      event.preventDefault()
    }
  })
}

void app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
