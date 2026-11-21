import { app, BrowserWindow, session } from 'electron';
import { fileURLToPath } from 'node:url';

class DesktopApplication {
  createWindow(): void {
    const window = new BrowserWindow({
      width: 1000,
      height: 700,
      show: false,
      title: 'Biblioteca Comunitária',
      webPreferences: {
        preload: fileURLToPath(new URL('../preload/index.cjs', import.meta.url)),
        contextIsolation: true,
        sandbox: true,
        nodeIntegration: false,
        webSecurity: true,
        webviewTag: false
      }
    });

    window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    window.webContents.on('will-navigate', (event) => event.preventDefault());
    window.webContents.on('will-redirect', (event) => event.preventDefault());
    window.once('ready-to-show', () => window.show());

    const devUrl = process.env['ELECTRON_RENDERER_URL'];
    if (!app.isPackaged && devUrl) {
      const url = new URL(devUrl);
      if (url.origin !== 'http://127.0.0.1:5173') {
        throw new Error('A origem de desenvolvimento do renderer não é permitida.');
      }
      void window.loadURL(url.href);
    } else {
      void window.loadFile(fileURLToPath(new URL('../renderer/index.html', import.meta.url)));
    }
  }
}

const desktop = new DesktopApplication();

void app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => {
    callback(false);
  });
  session.defaultSession.setPermissionCheckHandler(() => false);
  desktop.createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) desktop.createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
