<script lang="ts" setup>
import { onBeforeUnmount, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { setPlay, setPause, isEmpty } from '@r/plugins/player/audio';
import { initPlayInfo } from '@r/plugins/player/playList';
import { getRandomList } from '@r/utils';
import eventBus from '@r/plugins/eventBus';

const playStore = usePlayStore();
const { curPlayInfo, playList, playState } = storeToRefs(playStore);

const play = () => {
  if (isEmpty()) {
    curPlayInfo.value.name && initPlayInfo(curPlayInfo.value);
  } else {
    curPlayInfo.value.isPlay = true;
    setPlay();
  }
};
const pause = () => {
  curPlayInfo.value.isPlay = false;
  setPause();
};

const prePlay = () => {
  const curList = playList.value[playList.value.playListId].list;
  if (curList.length === 0) return;
  const nextId =
    playList.value.playId === 0
      ? (playList.value.playId = curList.length - 1)
      : (playList.value.playId -= 1);
  let playInfo;

  if (playState.value === 'random') {
    playInfo = randomList.value[nextId];
  } else {
    playInfo = curList[nextId];
  }

  initPlayInfo(playInfo);
};

const nextPlay = () => {
  const curList = playList.value[playList.value.playListId].list;

  if (curList.length === 0) return;
  const nextId =
    playList.value.playId === curList.length - 1
      ? (playList.value.playId = 0)
      : (playList.value.playId += 1);

  let playInfo;

  if (playState.value === 'random') {
    playInfo = randomList.value[nextId];
  } else {
    playInfo = curList[nextId];
  }

  initPlayInfo(playInfo);
};

const randomList = computed(() => {
  return getRandomList([...playList.value[playList.value.playListId].list]);
});

eventBus.only('nextPlay', nextPlay);
eventBus.only('setPause', pause);

onBeforeUnmount(() => {
  eventBus.off('nextPlay', nextPlay);
  eventBus.off('setPause', pause);
});
</script>

<template>
  <div class="playMod">
    <div class="commom_icon icon_WH" @click="prePlay">
      <Tiptool text="上一首">
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
      </Tiptool>
    </div>
    <div v-show="!curPlayInfo.isPlay" class="commom_icon icon_mid" @click="play">
      <Tiptool text="播放">
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
      </Tiptool>
    </div>
    <div v-show="curPlayInfo.isPlay" class="commom_icon icon_mid" @click="pause">
      <Tiptool text="暂停">
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
      </Tiptool>
    </div>
    <div class="commom_icon icon_WH" @click="nextPlay">
      <Tiptool text="下一首">
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
      </Tiptool>
    </div>
  </div>
</template>

<style lang="less" scoped>
.playMod {
  font-size: 13px;
  color: var(--color-font);
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
</style>
