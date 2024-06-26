import { app } from 'electron';
import path from 'path';
import fs from 'fs';

export const setUserDataPath = () => {
  const userDataPath = app.getPath('userData');
  global.skyDataPath = path.join(userDataPath, 'skyDatas');
  if (!fs.existsSync(global.skyDataPath)) fs.mkdirSync(global.skyDataPath);
};

export const setData = (name: string, data: string) => {
  const dataPath = path.join(global.skyDataPath, name + '.json');
  fs.writeFile(dataPath, data, (err) => {
    if (err) throw err;
  });
};

export const getData = async (name: string) => {
  const dataPath = path.join(global.skyDataPath, name + '.json');
  if (!fs.existsSync(dataPath)) setData(name, '');
  const res = await fs.promises.readFile(dataPath, { encoding: 'utf8' });
  return res;
};
