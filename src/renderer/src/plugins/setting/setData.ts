import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { useSetStore } from '@r/store/setting';
import { getMute } from '../player/audio';
import { setDataIpc } from '@r/ipc/dataIpc';

const playStore = usePlayStore(pinia);
const setStore = useSetStore(pinia);
const { playList, volume, playState } = storeToRefs(playStore);
const { setList } = storeToRefs(setStore);

const setData = (name: string, data: string) => {
  setDataIpc(name, data);
};

const setPlayList = () => {
  setData('playList', JSON.stringify(playList.value));
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

  setData('config', JSON.stringify(config));
};

export const saveData = () => {
  setPlayList();
  setConfig();
};
