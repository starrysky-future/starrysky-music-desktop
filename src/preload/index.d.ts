import { ElectronAPI } from '@electron-toolkit/preload';

interface Api {
  min: function;
  max: function;
  quit: function;
  setData: function;
  getData: function;
}

declare global {
  interface Window {
    electron: ElectronAPI;
    api: Api;
  }
}
