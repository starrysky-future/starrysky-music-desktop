import { app, BrowserWindow, IpcMainEvent } from 'electron';
import { ipcHelper } from '@electron-toolkit/utils';
export default () => {
  const getWin = (_event: IpcMainEvent): BrowserWindow => {
    return BrowserWindow.fromWebContents(_event.sender)!;
  };

  ipcHelper.on('min', (_event: IpcMainEvent) => {
    const win = getWin(_event);
    win.minimize();
  });

  ipcHelper.on('max', (_event: IpcMainEvent) => {
    const win = getWin(_event);
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcHelper.on('quit', () => {
    app.quit();
  });
};
