import { ipcMain, app, BrowserWindow, IpcMainEvent } from 'electron';
export default () => {
  const getWin = (_event: IpcMainEvent): BrowserWindow => {
    return BrowserWindow.fromWebContents(_event.sender)!;
  };

  ipcMain.on('min', (_event: IpcMainEvent) => {
    const win = getWin(_event);
    win.minimize();
  });

  ipcMain.on('max', (_event: IpcMainEvent) => {
    const win = getWin(_event);
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('quit', () => {
    app.quit();
  });
};
