import fs from 'fs';
import path from 'path';
import { app, ipcMain } from 'electron';
import store from './store';
const log = require('electron-log');

const userdataFilePath = () => app.getPath('userData') + '/userdata.json';

export const InitUserData = () => {
  try {
    log.debug('Initializing user data');
    if (!fs.existsSync(userdataFilePath())) {
      log.debug('User data file not found, creating one');
      const emptyUserData = {recentlyOpened: [], opened: []};
      fs.writeFileSync(userdataFilePath(), JSON.stringify(emptyUserData));
    }
  } catch(err) {
    throw err;
  }
}

export const LoadUserData = () => {
  try {
    const data = fs.readFileSync(userdataFilePath());
    return JSON.parse(data.toString());
  } catch (err) {
    throw err;
  }
}

app.on('will-quit', async () => {
  try {
    const data = await store.getters('userdata/data');
    console.log(data)
    fs.writeFileSync(userdataFilePath(), JSON.stringify(data));
    log.debug('Successfully saved user data');
  } catch (err) {
    log.err(`Failed to saved user data: ${err}`);
    throw err;
  }
})

ipcMain.on('load:user-data', (event) => {
  log.debug('load user data requested');
  const data = LoadUserData();
  if (data.recentlyOpened && data.recentlyOpened.length > 0) {
    store.commit('userdata/setRecentlyOpened',
      data.recentlyOpened.filter((filepath) =>
        fs.existsSync(filepath) && path.extname(filepath) === '.dmc')
    );
  }

  if (data.opened && data.opened.length > 0) {
    store.commit('userdata/setOpened', data.opened);
    data.opened.forEach((filepath) => {
      if (fs.existsSync(filepath) && path.extname(filepath) === '.dmc') {
        // ipcMain.emit('open-file', null, filepath);
      }
    });
  }
});

ipcMain.on('open-file:success', (event, path) => {
  store.commit('userdata/addRecentlyOpened', path);
  store.commit('userdata/addOpened', path);
  app.addRecentDocument(path);
});

