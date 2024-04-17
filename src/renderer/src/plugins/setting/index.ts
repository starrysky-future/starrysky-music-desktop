import { storeToRefs } from 'pinia';
import { useSetStore } from '@r/store/setting/index';
import applyThemeColor from '@r/utils/theme/index.js';
import { createAudio } from '../player/index';
import pinia from '@r/store';
import { initData } from './data';

const setStore = useSetStore(pinia);
const { themeId } = storeToRefs(setStore);

export const initSet = async () => {
  applyThemeColor(themeId.value);
  createAudio();
  initData();
};
