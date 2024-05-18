import { is } from '@electron-toolkit/utils';
import { spawn } from 'child_process';
import { join } from 'path';
import { mainLog } from '../log';

const getPath = () => {
  let exePath;
  if (is.dev) {
    exePath = join(__dirname, '../../service/starrysky-music-backend.exe');
  } else {
    exePath = join(global.sky.rootDir, '../resources/service/starrysky-music-backend.exe');
  }
  mainLog.info('exePath', exePath);

  return exePath;
};

export const satrtServerProcess = () => {
  let serverProcess;
  try {
    serverProcess = spawn(getPath());
  } catch (error) {
    mainLog.error(error);
  }

  serverProcess.stdout.on('data', (data) => {
    console.log('backEnd server' + data);
  });
};
