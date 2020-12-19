import { app, globalShortcut } from 'electron';
const log = require('electron-log');

const shortCuts = [];

export const InitGlobalShortCuts = () => {
  log.debug('InitGlobalShortCuts')
  shortCuts.forEach(({accelerator, press}) => {
    const wasShortCutRegistered = globalShortcut.register(accelerator, press);
    if (!wasShortCutRegistered) {
      throw new Error(`Registration of global shortcut '${accelerator}' failed`)
    }
  });

  // Unregister all shortcuts.
  app.on('will-quit', () =>
    globalShortcut.unregisterAll()
  );
};

export default InitGlobalShortCuts;
