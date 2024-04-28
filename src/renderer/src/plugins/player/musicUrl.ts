import sources from '@r/apis';
import { setResource, onLoadeddata, getDuration, setStop } from '@r/plugins/player';
import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { searchMusicAll } from '@r/apis/search';
import eventBus from '@r/plugins/eventBus';

const playStore = usePlayStore(pinia);
const { curPlayInfo, statulyric } = storeToRefs(playStore);

export const getMusicUrl = async (info) => {
  try {
    const url = await getUrl(info);
    setMusicUrl(url, info, false);
  } catch (error) {
    curPlayInfo.value.statu = '歌曲切换音源';
    getOtherSource(info);
  }
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

const getOtherSource = async (info, tryNum = 0) => {
  if (!info.otherSource || info.otherSource.length === 0) {
    info.otherSource = await getOtherSourceList(curPlayInfo.value.source);
  }
  console.log('info.otherSource', info.otherSource);

  if (info.otherSource.length > 0) {
    getOtherSourceUrl(info.otherSource[tryNum], info.otherSource, tryNum + 1);
  } else {
    console.log('无其他源下一首');
    curPlayInfo.value.statu = '歌曲资源不存在，切换下一首';
    eventBus.emit('nextPlay');
  }
};

const getOtherSourceUrl = async (info, infoList, tryNum) => {
  if (tryNum > infoList.length) {
    console.log('其他源无资源下一首');
    curPlayInfo.value.statu = '歌曲资源不存在，切换下一首';
    eventBus.emit('nextPlay');
    return '';
  }

  let url;
  try {
    url = await getUrl(info);
  } catch (error) {
    url = await getOtherSourceUrl(infoList[tryNum], infoList, tryNum + 1);
  }

  if (url) {
    setMusicUrl(url, info, true, infoList, tryNum);
    return;
  }

  return url;
};

const getOtherSourceList = async (sourceid) => {
  const searchInfo = curPlayInfo.value.name + ' ' + curPlayInfo.value.singer;
  const allList = await searchMusicAll(searchInfo, 1, sourceid);
  const set = new Set();
  return allList.list.filter((item) => {
    if (set.has(item.source)) return false;
    set.add(item.source);

    return curPlayInfo.value.name === item.name && match(curPlayInfo.value.singer, item.singer);
  });
};

const setMusicUrl = (url, info, isUrl, infoList?, tryNum?) => {
  if (url) {
    setResource(url);
    const stopLoadeddata = onLoadeddata(() => {
      if (getDuration() < Math.floor(curPlayInfo.value._interval / 1000)) {
        console.log('歌曲资源时长太短，请求其他资源');
        setStop();

        if (isUrl) {
          getOtherSourceUrl(infoList[tryNum], infoList, tryNum + 1);
        } else {
          getOtherSource(info);
        }
      } else {
        curPlayInfo.value.isPlay = true;
        // 请求成功歌词显示
        curPlayInfo.value.statu = statulyric.value['00:00'];
      }
      stopLoadeddata();
    });
  }
};

const match = (searchName, repName) => {
  if (searchName.indexOf('、') >= 0 && repName.indexOf('、') >= 0) {
    const searchNameArr = searchName.split('、');
    const repNameArr = repName.split('、');

    return searchNameArr.sort().join('') === repNameArr.sort().join('');
  }

  return searchName === repName;
};
