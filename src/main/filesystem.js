const {ipcMain} = require('electron');
const fs = require('fs');
const log = require('electron-log')

ipcMain.on('open-file', (event, data) => {
  const {path} = data;
  fs.readFile(path, (err, data) => {
    if (err) {
      log.error(err);
      event.sender.send('notify:error', err);
      return;
    }
    
  })
});
