import pinia from '@r/store';
import { RouteRecordName } from 'vue-router';
import { storeToRefs } from 'pinia';
import sources from '@r/apis';
import { usePlayStore } from '@r/store/play';
import { useSongListStore } from '@r/store/songList';
import { useLeaderBoardStore } from '@r/store/leaderBoard';
import { debounce, addUnique, insertList } from '@r/utils';
import { setResource, onLoadeddata, setStop } from '@r/plugins/player';

const playStore = usePlayStore(pinia);
const songListStore = useSongListStore(pinia);
const leaderBoardStore = useLeaderBoardStore(pinia);
const { sourceId } = storeToRefs(songListStore);
const { curPlayInfo, statulyric, playList } = storeToRefs(playStore);
const { LBsourceId } = storeToRefs(leaderBoardStore);

export const playSong = debounce(
  async (info: SKY.MusicListItem, name: RouteRecordName | null | undefined) => {
    const isCollect = name === 'collect';

    if (!isCollect) {
      const unique = addUnique(playList.value.defaultList.list, info, 'songmid');
      if (unique) {
        playList.value.playId = playList.value.defaultList.list.length - 1;
      }
    }

    initPlayInfo(info, name);
  },
  500
);

export const playLater = (info: SKY.MusicListItem) => {
  insertList(
    playList.value[playList.value.playListId].list,
    info,
    'songmid',
    playList.value.playId
  );
};

export const addList = (info: SKY.MusicListItem, listName: string) => {
  addUnique(playList.value[listName].list, info, 'songmid');
};

export const initPlayInfo = async (
  info: SKY.MusicListItem,
  name: RouteRecordName | null | undefined
) => {
  setStop();
  const sourceid = name === 'leaderBoard' ? LBsourceId.value : sourceId.value;

  playStore.setMaxplayTime(info._interval / 1000);
  curPlayInfo.value = { ...info, isPlay: false, curLyric: '' };

  const resMusic = await sources[sourceid].getMusicUrl(info, info.types[0].type);

  // img
  if (!curPlayInfo.value.img && sources[sourceid].getPic) {
    try {
      const resImg = await sources[sourceid].getPic(info);
      console.log(resImg);
      curPlayInfo.value.img = resImg;
    } catch (error) {
      console.log(error);
    }
  }

  // 歌词
  try {
    statulyric.value = {};
    curPlayInfo.value.curLyric = '';
    const resLyric = await sources[sourceid].getLyric(info);
    parseStatulyric(resLyric.lyric);
  } catch (error) {
    console.log(error);
  }

  setResource(resMusic);

  const stopLoadeddata = onLoadeddata(() => {
    curPlayInfo.value.isPlay = true;
    stopLoadeddata();
  });
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
  console.log(statulyric.value);
  curPlayInfo.value.curLyric = statulyric.value['00:00'];
};

const parseTime = (key: string) => {
  const k = key.replace(/\[/, '');
  return k.split('.')[0];
};
