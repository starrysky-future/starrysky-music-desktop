import './config/global';
import { initIpcMain } from './ipcMain';
import { createApp, initData } from './app';

initData();
initIpcMain();
createApp();
