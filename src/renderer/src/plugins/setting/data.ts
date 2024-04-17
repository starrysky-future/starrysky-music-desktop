import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';

const playStore = usePlayStore(pinia);
const { playList, curPlayInfo } = storeToRefs(playStore);
const getData = async (name: string) => {
  return await window.api.getData(name);
};

export const initData = async () => {
  const res = await getData('playList');
  if (res) {
    playList.value = JSON.parse(res);
    curPlayInfo.value = {
      ...playList.value[playList.value.playListId][playList.value.playId],
      curLyric: '',
      isPlay: false
    };
  }
};
