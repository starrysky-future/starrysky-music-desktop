import { ipcMain, IpcMainEvent } from 'electron';
import { setData, getData } from '../config/data';

export default () => {
  ipcMain.on('setData', (_event: IpcMainEvent, name: string, data: string) => {
    setData(name, data);
  });

  ipcMain.handleOnce('getData', async (_event, name: string) => {
    return await getData(name);
  });
};
