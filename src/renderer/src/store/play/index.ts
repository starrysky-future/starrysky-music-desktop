import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { formatPlayTime } from '@r/utils';
import { getMute } from '@r/plugins/player';

export const usePlayStore = defineStore('usePlayStore', () => {
  const curPlayInfo = ref<SKY.Play.CurPlayInfo>({
    singer: '',
    name: '',
    albumName: '',
    albumId: '',
    source: '',
    interval: '',
    _interval: 0,
    songmid: '',
    img: '',
    lrc: null,
    otherSource: null,
    types: [],
    _types: {},
    typeUrl: {},
    statu: '',
    isPlay: false
  });
  const playList = ref<SKY.Play.PlayList>({
    playId: 0,
    playListId: 'defaultList',
    defaultList: {
      id: 'defaultList',
      name: '试听列表',
      list: []
    },
    loveList: {
      id: 'loveList',
      name: '我的列表',
      list: []
    }
  });

  const statulyric = ref({});
  const volume = ref<number>(1);
  console.log(getMute());

  const isMute = ref<boolean>(getMute());
  const playState = ref<string>('loop');

  const playProgress = reactive({
    nowPlayTime: 0,
    maxPlayTime: 0,
    progress: 0,
    nowPlayTimeStr: '00:00',
    maxPlayTimeStr: '00:00'
  });

  const setNowPlayTime = (time: number) => {
    playProgress.nowPlayTime = time;
    playProgress.nowPlayTimeStr = formatPlayTime(time);
    playProgress.progress = playProgress.maxPlayTime ? time / playProgress.maxPlayTime : 0;
  };

  const setMaxplayTime = (time: number) => {
    playProgress.maxPlayTime = time;
    playProgress.maxPlayTimeStr = formatPlayTime(time);
    playProgress.progress = time ? playProgress.nowPlayTime / time : 0;
  };

  const setProgress = (currentTime: number, totalTime: number) => {
    setMaxplayTime(totalTime);
    setNowPlayTime(currentTime);
  };
  return {
    curPlayInfo,
    playList,
    playProgress,
    statulyric,
    volume,
    isMute,
    playState,
    setNowPlayTime,
    setMaxplayTime,
    setProgress
  };
});
