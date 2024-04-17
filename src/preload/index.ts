import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

const api = {
  min: (): void => ipcRenderer.send('min'),
  max: (): void => ipcRenderer.send('max'),
  quit: (): void => ipcRenderer.send('quit'),
  setData: (name: string, data: string): void => ipcRenderer.send('setData', name, data),
  getData: async (name: string) => {
    return await ipcRenderer.invoke('getData', name);
  }
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-expect-error
  window.electron = electronAPI;
  // @ts-expect-error
  window.api = api;
}
