import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { debounce, addUnique, insertList } from '@r/utils';
import { useNavStore } from '@r/store/nav';
import { getLyric } from './lyric';
import { getPic } from './pic';
import { getMusicUrl } from './musicUrl';
import eventBus from '@r/plugins/eventBus';
import { useAppStore, usePlayEvent } from '@r/store/app';
import { watch } from 'vue';
import { onEnded, onTimeupdate, getCurrentTime } from '@r/plugins/player/audio';

const playStore = usePlayStore(pinia);
const { curPlayInfo, playList, playProgress, statulyric, playState, collectListActiveId } =
  storeToRefs(playStore);

const navStore = useNavStore(pinia);
const { navName } = storeToRefs(navStore);

const appStore = useAppStore();
const { modalInfo } = storeToRefs(appStore);

const playEvent = usePlayEvent();
const { stopTimeupdate, stopEnded } = storeToRefs(playEvent);

let saveInfo;

export const playSong = debounce(async (info: SKY.MusicListItem, index: number) => {
  if (navName.value !== 'collect') {
    const unique = addUnique(playList.value.defaultList.list, info, 'songmid');
    if (unique) {
      playList.value.playId = playList.value.defaultList.list.length - 1;
    }
  } else {
    playList.value.playId = index;
    playList.value.playListId = collectListActiveId.value;
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
  playList.value[collectListActiveId.value].list.splice(index, 1);
};

export const deleteMusicAll = () => {
  playList.value[collectListActiveId.value].list = [];
};

export const deleteList = (id: string) => {
  // 当前列表
  if (id === collectListActiveId.value) {
    collectListActiveId.value = 'defaultList';
  }
  // 播放列表
  if (id === collectListActiveId.value) {
    playList.value.playListId = 'defaultList';
    playList.value.playId = 0;
    eventBus.emit('setPause');
  }

  playList.value[id].list = [];
  delete playList.value[id];
};

export const newList = () => {
  modalInfo.value.modalName = 'ListAddModal';
  modalInfo.value.modalTitle = '新增列表';
  modalInfo.value.isModal = true;
};

export const addList = async (info: SKY.MusicListItem) => {
  modalInfo.value.modalName = 'ListAddModal';
  modalInfo.value.modalTitle = '收藏到列表';
  modalInfo.value.addInfo = info;
  modalInfo.value.isModal = true;
};

export const initPlayInfo = (info: SKY.MusicListItem) => {
  eventBus.emit('setPause');

  playStore.setMaxplayTime(info._interval / 1000);
  curPlayInfo.value = { ...info, isPlay: curPlayInfo.value.isPlay, statu: curPlayInfo.value.statu };
  console.log('info', info);

  saveInfo = info;
  getPic(info);
  getMusicUrl(info); // 先获取info.otherSource
};

// 播放事件
watch(
  () => curPlayInfo.value.isPlay,
  (value, oldValue) => {
    if (value === oldValue) return;

    if (value) {
      // 歌曲请求成功后请求歌词
      saveInfo && getLyric(saveInfo);
    }

    if (!stopTimeupdate.value) {
      stopTimeupdate.value = onTimeupdate(() => {
        const currentTime = getCurrentTime();
        playStore.setProgress(currentTime, playProgress.value.maxPlayTime);

        if (currentTime > 0 && statulyric.value[playProgress.value.nowPlayTimeStr]) {
          curPlayInfo.value.statu = statulyric.value[playProgress.value.nowPlayTimeStr];
        }
      });
    }

    if (!stopEnded.value) {
      stopEnded.value = onEnded(() => {
        if (playState.value === 'loopOnce') return;
        eventBus.emit('nextPlay');
      });
    }
  }
);
