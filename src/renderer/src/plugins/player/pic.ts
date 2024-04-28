import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import sources from '@r/apis';
import { usePlayStore } from '@r/store/play';

const playStore = usePlayStore(pinia);
const { curPlayInfo } = storeToRefs(playStore);

export const getPic = async (info) => {
  if (!curPlayInfo.value.img && sources[curPlayInfo.value.source].getPic) {
    try {
      const resImg = await sources[curPlayInfo.value.source].getPic(curPlayInfo.value);
      console.log(resImg);
      curPlayInfo.value.img = resImg;
      info.img = resImg;
    } catch (error) {
      console.log(error);
    }
  }
};
