import { setAudio } from '../player';
import { initData } from './getData';

export const initSet = async () => {
  setAudio();
  initData();
};
