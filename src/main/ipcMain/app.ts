import { ipcMain, app } from 'electron';

export default () => {
  ipcMain.handle('appInfo', () => {
    const version = app.getVersion();
    return { version };
  });
};
