import { IpcMainEvent } from 'electron';
import { ipcHelper } from '@electron-toolkit/utils';
import { setData, getData } from '../config/data';

export default () => {
  ipcHelper.on('setData', (_event: IpcMainEvent, name: string, data: string) => {
    setData(name, data);
  });

  ipcHelper.handle('getData', async (_event, name: string) => {
    return await getData(name);
  });
};
