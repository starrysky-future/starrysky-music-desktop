import { app, shell, BrowserWindow } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { getAppWH } from './config/config';
import { setUserDataPath } from './config/data';
import { setSession } from './config/session';

export const createApp = () => {
  function createWindow(): void {
    const { width, height }: SKY.Config.WindowSize = getAppWH();

    const mainWindow = new BrowserWindow({
      width: width,
      height: height,
      show: false,
      center: true,
      frame: false,
      resizable: false,
      maximizable: false,
      transparent: true,
      titleBarStyle: 'hidden',
      icon,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,

        webSecurity: is.dev ? false : true
      }
    });

    mainWindow.on('ready-to-show', () => {
      mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: 'deny' };
    });

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
    } else {
      mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
  }

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.electron');
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window);
    });

    createWindow();
    setSession();

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
};

export const initData = () => {
  setUserDataPath();
};
