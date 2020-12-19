import { ipcMain, Menu } from 'electron';
import { mainWindow } from './MainWindow';
import store from './store';

const recentlyOpened = [];
// const recentlyOpened = store.getters('userdata/recentlyOpened').map((filepath) => ({
//   label: filepath,
//   click: () => {
//     ipcMain.emit('open-file', null, filepath);
//   }
// }));

export const InitMenu = () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}

export default InitMenu;

const menuTemplate = [
  {
    label: 'File',
    role: 'fileMenu',
    submenu: [
      {
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('show-modal', 'new-file');
        }
      },
      { type: 'separator' },
      {
        label: 'Open File...',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          ipcMain.emit('open-file');
        }
      },
      {
        label: 'Open Recent',
        role: 'recentDocuments',
        submenu: [
          ...recentlyOpened,
          {
            label: 'Clear Recently Open',
            click: () => {
              store.dispatch('userdata/clearRecentlyOpened');
            }
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          mainWindow.webContents.send('save-current-file');
        }
      },
      {
        label: 'Export As...',
        accelerator: 'Shift+CmdOrCtrl+S',
        click: () => {
          ipcMain.emit('open-file');
        }
      },
      { type: 'separator' },
      {
        label: 'Close File',
        accelerator: 'CmdOrCtrl+W',
        click: () => {
          mainWindow.webContents.send('close-current-file');
        }
      },
      { type: 'separator' },
      {
        label: 'Exit',
        role: 'quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          mainWindow.webContents.send('exit-app');
        }
      }
    ]
  },
  {
    label: 'Edit',
    role: 'editMenu',
    submenu: [
      {
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: () => {
          mainWindow.webContents.send('undo');
        }
      },
      {
        label: 'Redo',
        accelerator: 'Shift+CmdOrCtrl+Z',
        click: () => {
          mainWindow.webContents.send('redo');
        }
      },
      { type: 'separator' },
      {
        label: 'Cut',
        role: 'cut',
        accelerator: 'CmdOrCtrl+X',
        click: () => {}
      },
      {
        label: 'Copy',
        role: 'copy',
        accelerator: 'CmdOrCtrl+C',
        click: () => {}
      },
      {
        label: 'Paste',
        role: 'paste',
        accelerator: 'CmdOrCtrl+V',
        click: () => {}
      },
      { type: 'separator' },
      {
        label: 'Order',
        submenu: [
          {
            label: 'Bring to Front',
            accelerator: 'Shift+CmdOrCtrl+Up',
            click: () => {}
          },
          {
            label: 'Bring Forward',
            accelerator: 'CmdOrCtrl+Up',
            click: () => {}
          },
          {
            label: 'Send to Back',
            accelerator: 'Shift+CmdOrCtrl+Down',
            click: () => {}
          },
          {
            label: 'Send Backwards',
            accelerator: 'CmdOrCtrl+Down',
            click: () => {}
          },
        ]
      },
      { type: 'separator' },
      {
        label: 'Group',
        accelerator: 'CmdOrCtrl+G',
        click: () => {}
      },
      {
        label: 'Ungroup',
        accelerator: 'Shift+CmdOrCtrl+G',
        click: () => {}
      }
    ]
  },
  {
    label: 'View',
    role: 'viewMenu',
    submenu: [
      {
        label: 'Full screen',
        accelerator: 'F11',
        role: 'togglefullscreen'
      },
      { type: 'separator' },
      {
        label: 'Advanced Layer Control Panel',
        type: 'checkbox',
        click: () => {}
      },
      { type: 'separator' },
      {
        label: 'Zoom In',
        role: 'zoom',
        accelerator: 'CmdOrCtrl+=',
        click: () => {}
      },
      {
        label: 'Zoom Out',
        role: 'front',
        accelerator: 'CmdOrCtrl+-',
        click: () => {}
      },
      { type: 'separator' },
      {
        label: 'Print Size',
        accelerator: 'Shift+CmdOrCtrl+0',
        click: () => {}
      },
      {
        label: 'Fit to Screen',
        accelerator: 'CmdOrCtrl+0',
        click: () => {}
      }
    ]
  },
  {
    label: 'Help',
    role: 'appMenu',
    submenu: [
      {
        label: 'Release Notes',
        click: () => {}
      },
      {
        label: 'Check for Updates',
        click: () => {}
      },
      { type: 'separator' },
      {
        label: 'About',
        role: 'help',
        click: () => {}
      }
    ]
  }
];