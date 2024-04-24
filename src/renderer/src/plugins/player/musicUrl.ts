import sources from '@r/apis';
import { setResource, onLoadeddata } from '@r/plugins/player';
import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { searchMusicAll } from '@r/apis/search';

const playStore = usePlayStore(pinia);
const { curPlayInfo, statulyric } = storeToRefs(playStore);

export const getMusic = async (info) => {
  const url = await getMusicUrl(info);
  setResource(url);

  const stopLoadeddata = onLoadeddata(() => {
    curPlayInfo.value.isPlay = true;
    stopLoadeddata();
  });
};

const getMusicUrl = async (info) => {
  let url;

  try {
    url = await getUrl(curPlayInfo.value);
  } catch (error) {
    curPlayInfo.value.statu = '歌曲切换音源';

    if (!curPlayInfo.value.otherSource) {
      info.otherSource = await getOtherSource(curPlayInfo.value.source);
    }
    console.log('info.otherSource', info.otherSource);

    const reqList: Array<unknown> = [];
    info.otherSource.forEach((info) => {
      reqList.push(getUrl(info));
    });

    url = Promise.any(reqList);
  }

  // 请求成功歌词显示
  curPlayInfo.value.statu = statulyric.value['00:00'];
  return url;
};

const getUrl = async (info) => {
  let url;
  try {
    url = await sources[info.source].getMusicUrl(info, info.types[0].type);
  } catch (error) {
    return Promise.reject(error);
  }
  return url;
};

const getOtherSource = async (sourceid) => {
  const searchInfo = curPlayInfo.value.name + ' ' + curPlayInfo.value.singer;
  const allList = await searchMusicAll(searchInfo, 1, sourceid);
  const set = new Set();

  return allList.list.filter((item) => {
    if (set.has(item.source)) return false;
    set.add(item.source);

    return curPlayInfo.value.name === item.name && curPlayInfo.value.singer === item.singer;
  });
};
