import operateIpc from './operate';
import dataIpc from './data';

export const initIpcMain = () => {
  operateIpc();
  dataIpc();
};
