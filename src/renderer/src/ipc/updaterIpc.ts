export const getAppInfoIpc = async () => {
  return await window.electron.ipcRenderer.invoke('appInfo');
};

export const checkForUpdates = () => {
  window.electron.ipcRenderer.send('checkForUpdates');
};

export const downloadUpdate = () => {
  window.electron.ipcRenderer.send('downloadUpdate');
};

export const getUpdateInfo = (listener) => {
  window.electron.ipcRenderer.on('update', listener);
};
