import { BrowserWindow } from 'electron'
import { is } from 'electron-util';

export let mainWindow;

const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

export function createWindow () {
  /**
   * Initial window options
   */

  if (mainWindow) {
    throw new Error('createWindow called when mainWindow is already instanciated');
  }

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    useContentSize: true
  })

  mainWindow.loadURL(winURL)

  if (is.development) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}