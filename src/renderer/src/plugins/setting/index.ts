import { createAudio } from '../player/index';
import { initData } from './getData';

export const initSet = async () => {
  createAudio();
  initData();
};
