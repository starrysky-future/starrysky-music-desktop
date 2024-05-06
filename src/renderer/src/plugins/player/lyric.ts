import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import sources from '@r/apis';
import { usePlayStore } from '@r/store/play';
import { getOtherSourceList } from './musicUrl';

const playStore = usePlayStore(pinia);
const { curPlayInfo, statulyric } = storeToRefs(playStore);

// 暂无歌词源
const lyricSources: Array<string> = ['tx', 'kw'];

export const getLyric = async (info) => {
  if (hasLyric(info)) {
    parseStatulyric(hasLyric(info));
    return;
  }

  // 歌词
  try {
    statulyric.value = {};
    let resLyric;
    if (lyricSources.indexOf(curPlayInfo.value.source) >= 0) {
      if (!info.otherSource) {
        info.otherSource = await getOtherSourceList(lyricSources);
      }
      if (info.otherSource.length > 0) {
        resLyric = await getOtherlyric(info.otherSource[0], info.otherSource, 0);
      }
    } else {
      resLyric = await sources[curPlayInfo.value.source].getLyric(curPlayInfo.value);
    }

    if (!resLyric && !resLyric.lyric) throw new Error('暂无歌词');
    info.lrc = resLyric.lyric;
    parseStatulyric(resLyric.lyric);
  } catch (error) {
    console.log(error);
  }
};

const hasLyric = (info) => {
  if (info.lrc) return info.lrc;

  return false;
};

const getOtherlyric = async (info, infoList, tryNum) => {
  if (tryNum >= infoList.length) {
    return {
      lyric: '',
      tlyric: '',
      rlyric: '',
      pagelyric: ''
    };
  }

  let res;
  try {
    if (lyricSources.indexOf(info.source) >= 0) throw new Error('该源无歌词');
    res = await sources[info.source].getLyric(info);
    return res;
  } catch (error) {
    return getOtherlyric(infoList[tryNum + 1], infoList, tryNum + 1);
  }
};

const parseStatulyric = (lyric: string) => {
  const lyricObj = {};
  const lyricArr = lyric.split('\n');

  const n = lyricArr.length;

  for (let i = 0; i < n; i++) {
    if (lyricArr[i]) {
      const [key, value] = lyricArr[i].split(']');
      if (!value) continue;
      lyricObj[parseTime(key)] = value;
    }
  }

  statulyric.value = lyricObj;
};

const parseTime = (key: string) => {
  const k = key.replace(/\[/, '');
  return k.split('.')[0];
};
