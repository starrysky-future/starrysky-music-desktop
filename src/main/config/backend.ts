import { is } from '@electron-toolkit/utils';
import { spawn } from 'child_process';
import { join } from 'path';

const exePath = is.dev
  ? join(__dirname, '../../build/Release/starrysky-music-backend.exe')
  : join(__dirname, '../build/Release/starrysky-music-backend.exe');

export const satrtServerProcess = () => {
  console.log('exePath', exePath);
  const serverProcess = spawn(exePath);

  serverProcess.stdout.on('data', (data) => {
    console.log('backEnd server' + data);
  });
};
