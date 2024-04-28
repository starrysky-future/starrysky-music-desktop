import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { useSetStore } from '@r/store/setting';
import { getMute } from '../player';

const playStore = usePlayStore(pinia);
const setStore = useSetStore(pinia);
const { playList, volume, playState } = storeToRefs(playStore);
const { setList } = storeToRefs(setStore);

const setPlayList = () => {
  window.api.setData('playList', JSON.stringify(playList.value));
};

const setConfig = () => {
  const config = {
    setBasic: setList.value,
    playConfig: {
      volume: volume.value,
      playState: playState.value,
      mute: getMute()
    }
  };

  window.api.setData('config', JSON.stringify(config));
};

export const saveData = () => {
  setPlayList();
  setConfig();
};
