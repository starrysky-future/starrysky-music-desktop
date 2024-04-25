import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import sources from '@r/apis';
import { usePlayStore } from '@r/store/play';

const playStore = usePlayStore(pinia);
const { curPlayInfo, statulyric } = storeToRefs(playStore);

export const getLyric = async (info) => {
  console.log(info);

  // 歌词
  try {
    statulyric.value = {};
    const resLyric = await sources[curPlayInfo.value.source].getLyric(curPlayInfo.value);
    parseStatulyric(resLyric.lyric);
  } catch (error) {
    console.log(error);
  }
};

const parseStatulyric = (lyric: string) => {
  const lyricObj = {};
  const lyricArr = lyric.split('\n');

  const n = lyricArr.length;

  for (let i = 0; i < n; i++) {
    if (lyricArr[i]) {
      const [key, value] = lyricArr[i].split(']');
      lyricObj[parseTime(key)] = value;
    }
  }

  statulyric.value = lyricObj;
};

const parseTime = (key: string) => {
  const k = key.replace(/\[/, '');
  return k.split('.')[0];
};
