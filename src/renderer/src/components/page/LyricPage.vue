<script lang="ts" setup>
import { ref, VNodeRef, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { setCurrentTime } from '@r/plugins/player/audio';

const playStore = usePlayStore();
const { curPlayInfo, playProgress, statulyric } = storeToRefs(playStore);

const setProgress = (dragProgress: number) => {
  const nowPlayTime = dragProgress * playProgress.value.maxPlayTime;
  playStore.setNowPlayTime(nowPlayTime);
  setCurrentTime(nowPlayTime);
};

const domLyric = ref<VNodeRef | null>(null);

const getPlayTime = (time) => {
  if (!/(\d\d:\d\d)$/.test(time)) return time;
  const [m, s] = time.split(':');

  return ~~m * 60 + ~~s;
};

const lyricList = computed(() => {
  return Object.entries(statulyric.value).map((item) => {
    const [time, lyric] = item;
    return {
      timeStr: time,
      time: getPlayTime(time),
      lyric
    };
  });
});

onMounted(() => {
  watch(
    () => playProgress.value.nowPlayTimeStr,
    (val) => {
      const index = lyricList.value.findIndex((item) => item.timeStr === val);
      if (index > 0) {
        const activeLyric = index * 30 - domLyric.value.clientHeight / 2;
        const scrollTop = Math.ceil(activeLyric / 30) * 30;
        domLyric.value.scrollTop = scrollTop;
      }
    }
  );
});
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
      <div ref="domLyric" class="mian_right scroll">
        <div v-if="lyricList.length > 5" class="mian_right_long">
          <div
            v-for="item in lyricList"
            :key="item.time"
            class="mian_right_lyric"
            :class="{ activeColor: playProgress.nowPlayTime > item.time }"
          >
            {{ item.lyric }}
          </div>
        </div>
        <div v-else-if="lyricList.length > 0" class="mian_right_short">
          <div
            v-for="item in lyricList"
            :key="item.time"
            class="mian_right_lyric"
            :class="{ activeColor: playProgress.nowPlayTime > item.time }"
          >
            {{ item.lyric }}
          </div>
        </div>
        <div v-else class="mian_right_short">暂无歌词</div>
      </div>
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
      height: 500px;
      .mian_right_long {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .mian_right_short {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .mian_right_lyric {
        height: 30px;
        line-height: 30px;
      }
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
  .activeColor {
    color: var(--color-primary);
  }
}
.pdTop10 {
  padding-top: 10px;
}
</style>
