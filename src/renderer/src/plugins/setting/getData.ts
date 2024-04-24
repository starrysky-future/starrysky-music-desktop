import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { useSetStore } from '@r/store/setting';
import applyThemeColor from '@r/utils/theme/index.js';

const playStore = usePlayStore(pinia);
const setStore = useSetStore(pinia);
const { playList, curPlayInfo } = storeToRefs(playStore);
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
        ...playList.value[playList.value.playListId][playList.value.playId],
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
    console.log(res);

    if (res) {
      setList.value = JSON.parse(res).setBasic;
    }
  } catch (error) {
    console.log('获取config失败');
  }
  applyThemeColor();
};

export const initData = () => {
  getplayList();
  getConfig();
};
