import { mainWindow } from './MainWindow'
import { ipcMain } from 'electron';
import { resolve } from 'path';

const store = {
  commit: (type, ...args) =>
    mainWindow.webContents.send('store:commit', type, ...args),
  getters: (type, ...args) => {
    mainWindow.webContents.send('store:getters', type, ...args);
    return new Promise((resolve) =>
      ipcMain.once(`getter:${type}`, (event, value) =>
        resolve(value)
      )
    );
  },
  dispatch: (type, ...args) =>
    mainWindow.webContents.send('store:dispatch', type, ...args),
  registerModule: (path, module, options) => {
    mainWindow.webContents.send('store:registerModule', path, module, options)
    return new Promise((resolve) =>
      ipcMain.once(`moduleRegistered:${path.join('/')}`, (event) =>
        resolve()
      )
    );
  },
  unregisterModule: (name) =>
    mainWindow.webContents.send('store:unregisterModule', name),
};

export default store;
