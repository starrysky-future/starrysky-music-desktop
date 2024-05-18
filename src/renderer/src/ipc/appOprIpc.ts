export const minIpc = () => {
  window.electron.ipcRenderer.send('min');
};
export const maxIpc = () => {
  window.electron.ipcRenderer.send('max');
};
export const quitIpc = () => {
  window.electron.ipcRenderer.send('quit');
};
