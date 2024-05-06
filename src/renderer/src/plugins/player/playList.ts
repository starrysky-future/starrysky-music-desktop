import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { debounce, addUnique, insertList } from '@r/utils';
import { useNavStore } from '@r/store/nav';
import { getLyric } from './lyric';
import { getPic } from './pic';
import { getMusicUrl } from './musicUrl';
import eventBus from '@r/plugins/eventBus';

const playStore = usePlayStore(pinia);
const navStore = useNavStore(pinia);
const { curPlayInfo, playList } = storeToRefs(playStore);
const { navName } = storeToRefs(navStore);

export const playSong = debounce(async (info: SKY.MusicListItem, index: number) => {
  if (navName.value !== 'collect') {
    const unique = addUnique(playList.value.defaultList.list, info, 'songmid');
    if (unique) {
      playList.value.playId = playList.value.defaultList.list.length - 1;
    }
  } else {
    playList.value.playId = index;
  }

  initPlayInfo(info);
}, 500);

export const playLater = (info: SKY.MusicListItem) => {
  const changePlayId = insertList(
    playList.value[playList.value.playListId].list,
    info,
    'songmid',
    playList.value.playId,
    navName.value === 'collect'
  );

  if (changePlayId) {
    playList.value.playId -= 1;
  }
};

export const deleteMusic = (index: number) => {
  playList.value[playList.value.playListId].list.splice(index, 1);
};

export const deleteMusicAll = () => {
  playList.value[playList.value.playListId].list = [];
};

export const deleteList = (id) => {
  if (id === playList.value.playListId) {
    playList.value.playListId = 'defaultList';
  }
  playList.value[id].list = [];
  delete playList.value[id];
};

export const addList = async (info: SKY.MusicListItem, listName: string) => {
  addUnique(playList.value[listName].list, info, 'songmid');
};

export const initPlayInfo = async (info: SKY.MusicListItem) => {
  eventBus.emit('setPause');

  playStore.setMaxplayTime(info._interval / 1000);
  curPlayInfo.value = { ...info, isPlay: curPlayInfo.value.isPlay, statu: curPlayInfo.value.statu };

  getPic(info);
  await getMusicUrl(info); // 先获取info.otherSource
  getLyric(info);
};
