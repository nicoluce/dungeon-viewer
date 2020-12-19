import { dialog, ipcMain } from 'electron';
import store from './store';
import path from 'path';
import { get } from 'http';
import FileDataModule from '../store/modules/filedata';
const fs = require('fs');
const log = require('electron-log');

const mapFilter = {name: 'DMC Map (.dmc)', extensions: ['dmc']};

export const InitFiles = () => {
  log.debug('Init Files');

  ipcMain.on('save-file', async (event, id, data) => {
    log.debug('save-file');
    try {
      const metadata = await store.getters('files/getMetadata', id);
      let filepath = dialog.showSaveDialog({
        defaultPath: metadata.name,
        filters: [mapFilter],
        properties: ['createDirectory', 'showOverwriteConfirmation']
      });
      if (filepath && fs.existsSync(path.dirname(filepath))) {
        if (path.extname(filepath) !== '.dmc') {
          filepath += '.dmc';
        }
        const writeStream = fs.createWriteStream(filepath);
        writeStream.write(new Buffer(data));
        writeStream.close();
        store.dispatch('files/saveFile', {id, filepath});
        ipcMain.emit('save-file:success', null, {id, filepath});
      }
    } catch(err) {
      ipcMain.emit('save-file:failure', null, id);
      throw err;
    }
  });
  
  ipcMain.on('open-file', (event, pathToOpen) => {
    const filepath = pathToOpen
      ? [pathToOpen]
      : dialog.showOpenDialog({
          filters: [mapFilter],
          properties: ['openFile']
        });
  
    if (filepath &&
        filepath.length > 0 &&
        fs.existsSync(path.dirname(filepath[0])) &&
        path.extname(filepath[0]) === '.dmc') {
      store.dispatch('files/addFile', filepath[0]);
      ipcMain.emit('open-file:success', null, filepath[0]);
    } else {
      ipcMain.emit('open-file:failure');
    }
  });
  
  ipcMain.on('load-file', (event, filepath) => {
    const data = fs.readFileSync(filepath);
    event.returnValue = JSON.parse(data.toString());
  });

  ipcMain.on('new-file', async (event, config) => {
    store.dispatch('files/addTempFile',config);
  });

  ipcMain.on('close-file', async (event, id) => {
    const metadata = await store.getters('files/getMetadata', id);
    console.log(metadata);
    if (metadata.isDirty) {
      store.dispatch('app/setActiveFileId', id);
      const buttonIdx = dialog.showMessageBox({
        type: 'warning',
        buttons: ["Don't Save", 'Cancel', 'Save'],
        defaultId: 2,
        message: `Do you want to save the changes you made to ${metadata.name}?`,
        detail: `Your changes will be lost if you don't save them.`
      });
      switch (buttonIdx) {
        case 0: {
          store.commit('files/removeMetadata', id);
          event.returnValue = true;
        } break;
        case 2: {
          event.sender.send('save-file', id);
          ipcMain.once('save-file:success', (event, {id: savedFileId}) => {
            if (savedFileId === id) {
              store.commit('files/removeMetadata', id);
              event.returnValue = true;
            }
          });
          ipcMain.once('save-file:failure', (event, {id: savedFileId}) => {
            if (savedFileId === id) {
              event.returnValue = false;
            }
          });
        } break;
        default: {
          event.returnValue = false;
        } break;
      }
    } else {
      store.commit('files/removeMetadata', id);
      event.returnValue = true;
    }
  });  
};
