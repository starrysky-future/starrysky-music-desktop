import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { useSetStore } from '@r/store/setting';
import applyThemeColor from '@r/utils/theme/index.js';
import { setMute } from '../player/audio';

const playStore = usePlayStore(pinia);
const setStore = useSetStore(pinia);
const { playList, curPlayInfo, volume, isMute, playState } = storeToRefs(playStore);
const { setList } = storeToRefs(setStore);

const getData = async (name: string) => {
  return await window.api.getData(name);
};

const getplayList = async () => {
  try {
    const res = await getData('playList');
    if (res) {
      playList.value = JSON.parse(res);

      curPlayInfo.value = {
        ...playList.value[playList.value.playListId].list[playList.value.playId],
        curLyric: '',
        isPlay: false
      };
    }
  } catch (error) {
    console.log('获取playList失败');
  }
};

const getConfig = async () => {
  try {
    const res = await getData('config');

    if (res) {
      const data = JSON.parse(res);

      setList.value = data.setBasic;
      setPlayConfig(data.playConfig);
    }
  } catch (error) {
    console.log('获取config失败');
  }
  applyThemeColor();
};

const setPlayConfig = (playConfig) => {
  volume.value = playConfig.volume;
  playState.value = playConfig.playState;
  isMute.value = playConfig.mute;

  setMute(playConfig.mute);
};

export const initData = () => {
  getplayList();
  getConfig();
};
