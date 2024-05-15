import { app } from 'electron';

const rootDir = app.getPath('exe');

global.sky = {
  skyDataPath: '',
  rootDir
};
