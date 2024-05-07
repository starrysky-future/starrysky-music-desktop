<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { setCurrentTime } from '@r/plugins/player';
import { useAppStore } from '@r/store/app';

const playStore = usePlayStore();
const { curPlayInfo, playProgress } = storeToRefs(playStore);

const setProgress = (dragProgress: number) => {
  const nowPlayTime = dragProgress * playProgress.value.maxPlayTime;
  playStore.setNowPlayTime(nowPlayTime);
  setCurrentTime(nowPlayTime);
};

const appStore = useAppStore();
const { showLyricPage } = storeToRefs(appStore);

const goLyricPage = () => {
  showLyricPage.value = true;
};
</script>

<template>
  <div class="time_progress noDrag">
    <Progress :progress="playProgress.progress" @set-progress="setProgress" />
  </div>
  <div class="layout_bottom noDrag">
    <div class="main_left">
      <div @click="goLyricPage">
        <Tiptool text="点击去往歌词页">
          <img v-if="curPlayInfo.img" class="img" :src="curPlayInfo.img" />
          <div v-else class="img no_img">SKY</div>
        </Tiptool>
      </div>
      <div class="info singleTextHide">
        <div class="name singleTextHide">
          {{ curPlayInfo.name }} <i v-show="curPlayInfo.singer">-</i>{{ curPlayInfo.singer }}
        </div>
        <div class="statu singleTextHide">{{ curPlayInfo.statu }}</div>
      </div>
    </div>
    <PlayMod />
    <div class="main_right">
      <PlayStateMod />
    </div>
  </div>
</template>

<style lang="less" scoped>
.time_progress {
  height: 4px;
  position: relative;
}

.layout_bottom {
  display: flex;
  padding: 6px;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--color-font);
  .main_left {
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
        height: 20px;
        font-size: 12px;
        padding-bottom: 4px;
        color: var(--color-font-label);
      }
      .statu {
        height: 20px;
      }
    }
  }
  .main_right {
    width: 40%;
  }
}
</style>
