import { createAudio } from '../player/audio';
import { initData } from './getData';

export const initSet = async () => {
  createAudio();
  initData();
};
