import { app } from 'electron'
import { InitUserData } from './userdata'
import { InitFiles } from './files'
import path from 'path';
const log = require('electron-log');
const paths = require('./paths');

export const Init = (args) => {
  try {
    log.debug('Initializing app');
    app.setName('map-creator');
    InitDirectoryStructure(args);
    InitUserData();
    InitFiles();
  } catch (err) {
    throw err;
  }
}

const InitDirectoryStructure = (args) => {
  log.debug('Initializing directory structure');
  const userDataPath = getUserDataPath(args);
  app.setPath('userData', userDataPath);
  log.debug(`UserData directory set to: ${app.getPath('userData')}`);
}

const getUserDataPath = (args) => {
	return path.resolve(args['user-data-dir'] || paths.getDefaultUserDataPath(process.platform));
}