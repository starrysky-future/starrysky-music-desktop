<script lang="ts" setup>
import { onBeforeUnmount, reactive, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import {
  setPlay,
  setPause,
  onEnded,
  setCurrentTime,
  onTimeupdate,
  getCurrentTime,
  setVolume,
  getMute,
  setMute,
  setLoopPlay,
  isEmpty
} from '@r/plugins/player';
import { initPlayInfo, addList } from '@r/plugins/player/playList';
import { getRandomList, removeList } from '@r/utils';

const isVisible = ref<boolean>(false);
const randomList = ref<Array<SKY.Play.MusicListItem>>();
const isMute = ref<boolean>(false);
const setPopup = ref<string>('volume');
const position = reactive<SKY.SongList.Position>({
  x: 0,
  y: 0,
  width: 0,
  height: 0
});
isMute.value = getMute();

const playStore = usePlayStore();
const { curPlayInfo, statulyric, playProgress, playList, volume, playState } =
  storeToRefs(playStore);

const setProgress = (dragProgress: number) => {
  const nowPlayTime = dragProgress * playProgress.value.maxPlayTime;
  playStore.setNowPlayTime(nowPlayTime);
  setCurrentTime(nowPlayTime);
};

const setCollect = () => {
  if (!curPlayInfo.value.songmid) return;

  if (isCollect.value) {
    removeList(playList.value.loveList.list, 'songmid', curPlayInfo.value.songmid);
  } else {
    addList(curPlayInfo.value, 'loveList');
  }
};

const setPlayState = () => {
  if (playState.value === 'loop') {
    setLoopPlay(true);
    playState.value = 'loopOnce';
  } else if (playState.value === 'loopOnce') {
    playState.value = 'random';
  } else {
    playState.value = 'loop';
  }
};

const setPlayVolume = (dragProgress: number) => {
  volume.value = dragProgress;
  setVolume(dragProgress);
};

const setVolumeMute = () => {
  isMute.value = !isMute.value;
  setMute(isMute.value);
};

const setVolumePage = ($event) => {
  const rect = $event.target.getBoundingClientRect();
  position.x = rect.x;
  position.y = rect.y;
  position.width = rect.width;
  position.height = rect.height;

  setPopup.value = 'volume';
  isVisible.value = !isVisible.value;
};

const stopTimeupdate = onTimeupdate(() => {
  const currentTime = getCurrentTime();
  if (statulyric.value[playProgress.value.nowPlayTimeStr]) {
    curPlayInfo.value.curLyric = statulyric.value[playProgress.value.nowPlayTimeStr];
  }

  playStore.setProgress(currentTime, playProgress.value.maxPlayTime);
});

const stopEnded = onEnded(() => {
  if (playState.value === 'loopOnce') return;
  nextPlay();
});

const play = () => {
  if (isEmpty()) return;
  curPlayInfo.value.isPlay = true;
  setPlay();
};
const pause = () => {
  curPlayInfo.value.isPlay = false;
  setPause();
};

const prePlay = () => {
  pause();
  const curList = playList.value[playList.value.playListId].list;
  if (curList.length === 0) return;
  const nextId =
    playList.value.playId === 0
      ? (playList.value.playId = curList.length - 1)
      : (playList.value.playId -= 1);
  let playInfo;

  if (playState.value === 'random') {
    if (!randomList.value || randomList.value?.length === 0) {
      randomList.value = getRandomList([...playList.value[playList.value.playListId].list]);
    }

    playInfo = randomList.value![nextId];
  } else {
    playInfo = curList[nextId];
  }

  initPlayInfo(playInfo);
};

const nextPlay = () => {
  pause();
  const curList = playList.value[playList.value.playListId].list;
  if (curList.length === 0) return;
  const nextId =
    playList.value.playId === curList.length - 1
      ? (playList.value.playId = 0)
      : (playList.value.playId += 1);

  let playInfo;

  if (playState.value === 'random') {
    if (!randomList.value || randomList.value?.length === 0) {
      randomList.value = getRandomList([...playList.value[playList.value.playListId].list]);
    }

    playInfo = randomList.value![nextId];
  } else {
    playInfo = curList[nextId];
  }

  initPlayInfo(playInfo);
};

const iconVolume = computed(() => {
  if (isMute.value) return 'mute';

  const curVolume = Math.floor(volume.value * 100);
  if (curVolume >= 70) {
    return 'high';
  } else if (curVolume >= 40) {
    return 'middle';
  } else if (curVolume > 0) {
    return 'low';
  } else {
    return 'zero';
  }
});
const isCollect = computed(() => {
  if (!curPlayInfo.value.songmid) return false;
  const loveList = playList.value.loveList.list;
  return loveList.findIndex((item) => item.songmid === curPlayInfo.value.songmid) >= 0;
});

onBeforeUnmount(() => {
  stopTimeupdate();
  stopEnded();
});
</script>

<template>
  <div class="time_progress">
    <Progress :progress="playProgress.progress" @set-progress="setProgress" />
  </div>
  <div class="playMod">
    <div class="main-left">
      <img v-if="curPlayInfo.img" class="img" :src="curPlayInfo.img" />
      <div v-else class="img no_img">SKY</div>
      <div class="info singleTextHide">
        <div class="name singleTextHide">
          {{ curPlayInfo.name }} <i v-show="curPlayInfo.singer">-</i>{{ curPlayInfo.singer }}
        </div>
        <div class="singleTextHide">{{ curPlayInfo.curLyric }}</div>
      </div>
    </div>
    <div class="main-mid">
      <div class="commom_icon icon_WH" @click="prePlay">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 40 40"
          space="preserve"
        >
          <use xlink:href="#icon-play-pre" />
        </svg>
      </div>
      <div v-show="!curPlayInfo.isPlay" class="commom_icon icon_mid" @click="play">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 40 40"
          space="preserve"
        >
          <use xlink:href="#icon-play-play" />
        </svg>
      </div>
      <div v-show="curPlayInfo.isPlay" class="commom_icon icon_mid" @click="pause">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 40 40"
          space="preserve"
        >
          <use xlink:href="#icon-play-pause" />
        </svg>
      </div>
      <div class="commom_icon icon_WH" @click="nextPlay">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 40 40"
          space="preserve"
        >
          <use xlink:href="#icon-play-next" />
        </svg>
      </div>
    </div>
    <div class="main-right">
      <div class="time mgR">
        {{ playProgress.nowPlayTimeStr }} / {{ playProgress.maxPlayTimeStr }}
      </div>
      <div class="icon_common mgR" @click="setCollect">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use :xlink:href="`#icon-play-${isCollect ? 'collect' : 'noCollect'}`" />
        </svg>
      </div>
      <div class="icon_common mgR" @click="setVolumePage" @click.stop>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use :xlink:href="`#icon-volume-${iconVolume}`" />
        </svg>
      </div>
      <div class="icon_common" @click="setPlayState">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use :xlink:href="`#icon-play-${playState}`" />
        </svg>
      </div>
    </div>
  </div>
  <div v-show="isVisible">
    <PositionPopup v-model="isVisible" direction="top" :has-arrow="true" :position="position">
      <div v-if="setPopup === 'volume'" class="volume">
        <div class="volume_info">
          <div>{{ Math.floor(volume * 100) }}%</div>
          <div :class="{ muteActive: isMute }" @click="setVolumeMute">静音</div>
        </div>
        <div class="volume_progress">
          <Progress :progress="volume" @set-progress="setPlayVolume" />
        </div>
      </div>
      <div v-else>2222</div>
    </PositionPopup>
  </div>
</template>

<style lang="less" scoped>
.time_progress {
  height: 4px;
  position: relative;
  -webkit-app-region: no-drag;
}

.playMod {
  display: flex;
  padding: 6px;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--color-font);
  -webkit-app-region: no-drag;
  .main-left {
    width: 40%;
    display: flex;
    .img {
      cursor: pointer;
      display: block;
      width: 50px;
      height: 50px;
      border: 1px solid;
      border-color: var(--color-primary);
      border-radius: 4px;
      &:hover {
        opacity: 0.6;
      }
    }
    .no_img {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--color-primary);
      background-color: var(--color-primary-light-400-alpha-700);
    }
    .info {
      padding-left: 8px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name {
        font-size: 12px;
        padding-bottom: 4px;
        color: var(--color-font-label);
      }
    }
  }
  .main-mid {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    .commom_icon {
      cursor: pointer;
      width: 40px;
      height: 40px;
      color: var(--color-primary);
    }
    .icon_mid {
      margin: 0 10px;
    }
    .icon_WH {
      width: 30px;
      height: 30px;
    }
  }
  .main-right {
    width: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon_common {
      cursor: pointer;
      width: 24px;
      height: 24px;
      color: var(--color-primary);
    }
    .time {
      color: var(--color-550);
    }
  }
}
.mgR {
  margin-right: 20px;
}
.volume {
  padding: 8px;
  box-sizing: border-box;
  .volume_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding-bottom: 6px;
    .muteActive {
      cursor: pointer;
      color: var(--color-primary);
    }
  }
  .volume_progress {
    width: 200px;
    height: 6px;
    border-radius: 2px;
    overflow: hidden;
  }
}
</style>
