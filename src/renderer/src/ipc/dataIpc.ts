export const setDataIpc = (name: string, data: string): void => {
  window.electron.ipcRenderer.send('setData', name, data);
};

export const getDataIpc = async (name: string): Promise<string> => {
  return await window.electron.ipcRenderer.invoke('getData', name);
};
