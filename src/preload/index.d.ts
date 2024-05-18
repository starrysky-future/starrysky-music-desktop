import { ElectronAPI } from '@electron-toolkit/preload';

// interface Api {}

declare global {
  interface Window {
    electron: ElectronAPI;
    // api: Api;
    api: unknown;
  }
}
