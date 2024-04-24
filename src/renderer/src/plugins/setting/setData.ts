import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { useSetStore } from '@r/store/setting';

const playStore = usePlayStore(pinia);
const setStore = useSetStore(pinia);
const { playList } = storeToRefs(playStore);
const { setList } = storeToRefs(setStore);

export const setPlayList = () => {
  window.api.setData('playList', JSON.stringify(playList.value));
};

export const setConfig = () => {
  const config = {
    setBasic: setList.value
  };

  window.api.setData('config', JSON.stringify(config));
};

export const saveData = () => {
  setPlayList();
  setConfig();
};
