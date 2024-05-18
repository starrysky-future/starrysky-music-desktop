import operateIpc from './operate';
import dataIpc from './data';
import appIpc from './app';

export const initIpcMain = () => {
  operateIpc();
  dataIpc();
  appIpc();
};
