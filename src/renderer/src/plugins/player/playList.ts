import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { debounce, addUnique, insertList } from '@r/utils';
import { setStop } from '@r/plugins/player';
import { useNavStore } from '@r/store/nav';
import { getLyric } from './lyric';
import { getPic } from './pic';
import { getMusic } from './musicUrl';

const playStore = usePlayStore(pinia);
const navStore = useNavStore(pinia);
const { curPlayInfo, playList } = storeToRefs(playStore);
const { navName } = storeToRefs(navStore);

export const playSong = debounce(async (info: SKY.MusicListItem) => {
  if (navName.value !== 'collect') {
    const unique = addUnique(playList.value.defaultList.list, info, 'songmid');
    if (unique) {
      playList.value.playId = playList.value.defaultList.list.length - 1;
    }
  }

  initPlayInfo(info);
}, 500);

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

export const initPlayInfo = async (info: SKY.MusicListItem) => {
  setStop();

  playStore.setMaxplayTime(info._interval / 1000);
  curPlayInfo.value = { ...info, isPlay: false, statu: '歌曲请求中...' };

  getPic(info);
  getLyric(info);
  getMusic(info);
};
