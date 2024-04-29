<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { setCurrentTime } from '@r/plugins/player';

const playStore = usePlayStore();
const { curPlayInfo, playProgress } = storeToRefs(playStore);

const setProgress = (dragProgress: number) => {
  const nowPlayTime = dragProgress * playProgress.value.maxPlayTime;
  playStore.setNowPlayTime(nowPlayTime);
  setCurrentTime(nowPlayTime);
};
</script>

<template>
  <div class="lyric_page">
    <div class="header">
      <RightBtns />
    </div>
    <div class="mian">
      <div class="mian_left">
        <img v-if="curPlayInfo.img" class="img" :src="curPlayInfo.img" />
        <div v-else class="img no_img">SKY</div>
        <div class="pdTop10">歌曲名: {{ curPlayInfo.name }}</div>
        <div class="pdTop10">演唱者: {{ curPlayInfo.singer }}</div>
      </div>
      <div class="mian_right"></div>
    </div>
    <div class="floor">
      <div class="time_progress noDrag">
        <Progress :progress="playProgress.progress" @set-progress="setProgress" />
      </div>
      <PlayStateMod />
      <PlayMod />
    </div>
  </div>
</template>

<style lang="less" scoped>
.lyric_page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  .header {
    display: flex;
    justify-content: flex-end;
  }
  .mian {
    flex: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .mian_left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img {
        cursor: pointer;
        display: block;
        width: 300px;
        height: 300px;
        border: 1px solid;
        border-color: var(--color-primary);
        border-radius: 4px;
      }
      .no_img {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--color-primary);
        background-color: var(--color-primary-light-400-alpha-700);
      }
    }
    .mian_right {
      width: 500px;
    }
  }
  .floor {
    height: 70px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .time_progress {
      width: 560px;
      height: 4px;
    }
  }
}
.pdTop10 {
  padding-top: 10px;
}
</style>
