<script lang="ts" setup>
import { reactive, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { setVolume, setMute, setLoopPlay } from '@r/plugins/player/audio';
import { addList } from '@r/plugins/player/playList';

const isVisible = ref<boolean>(false);
const setPopup = ref<string>('volume');
const position = reactive<SKY.SongList.Position>({
  x: 0,
  y: 0,
  width: 0,
  height: 0
});

const playStore = usePlayStore();
const { curPlayInfo, playProgress, volume, playState, isMute } = storeToRefs(playStore);

const setCollect = () => {
  if (!curPlayInfo.value.songmid) return;
  addList(curPlayInfo.value);
};

const setPlayState = (mode: string) => {
  if (playState.value === 'loop') {
    setLoopPlay(true);
  }

  playState.value = mode;
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

  if (!(setPopup.value === 'mode' && isVisible.value)) {
    isVisible.value = !isVisible.value;
  }

  setPopup.value = 'volume';
};

const showPlayState = ($event) => {
  const rect = $event.target.getBoundingClientRect();
  position.x = rect.x;
  position.y = rect.y;
  position.width = rect.width;
  position.height = rect.height;

  if (!(setPopup.value === 'volume' && isVisible.value)) {
    isVisible.value = !isVisible.value;
  }

  setPopup.value = 'mode';
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

const playStateText = computed(() => {
  if (playState.value === 'loop') {
    return '列表循环';
  } else if (playState.value === 'loopOnce') {
    return '单曲循环';
  } else {
    return '随机播放';
  }
});
</script>

<template>
  <div class="PlayStateMod">
    <div class="time mgR">
      {{ playProgress.nowPlayTimeStr }} / {{ playProgress.maxPlayTimeStr }}
    </div>
    <div class="icon_common mgR" @click="setCollect">
      <Tiptool text="收藏到...">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use xlink:href="#icon-play-collect" />
        </svg>
      </Tiptool>
    </div>
    <div class="icon_common mgR" @click="setVolumePage" @click.stop>
      <Tiptool text="音量">
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
      </Tiptool>
    </div>
    <div class="icon_common" @click="showPlayState" @click.stop>
      <Tiptool :text="playStateText">
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
      </Tiptool>
    </div>
  </div>
  <PositionPopup
    v-model="isVisible"
    direction="top"
    :has-arrow="true"
    :position="position"
    transition-name="TransitionOpacity"
  >
    <div v-if="setPopup === 'volume'" class="volume">
      <div class="volume_info">
        <div>{{ Math.floor(volume * 100) }}%</div>
        <div :class="{ muteActive: isMute }" @click="setVolumeMute">静音</div>
      </div>
      <div class="volume_progress">
        <Progress :progress="volume" @set-progress="setPlayVolume" />
      </div>
    </div>
    <div v-else class="mode">
      <div class="icon_common" @click="setPlayState('loop')">
        <Tiptool text="列表循环">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            height="100%"
            viewBox="0 0 36 36"
            space="preserve"
          >
            <use xlink:href="#icon-play-loop" />
          </svg>
        </Tiptool>
      </div>
      <div class="icon_common" @click="setPlayState('loopOnce')">
        <Tiptool text="单曲循环">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            height="100%"
            viewBox="0 0 36 36"
            space="preserve"
          >
            <use xlink:href="#icon-play-loopOnce" />
          </svg>
        </Tiptool>
      </div>
      <div class="icon_common" @click="setPlayState('random')">
        <Tiptool text="随机播放">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            height="100%"
            viewBox="0 0 36 36"
            space="preserve"
          >
            <use xlink:href="#icon-play-random" />
          </svg>
        </Tiptool>
      </div>
    </div>
  </PositionPopup>
</template>

<style lang="less" scoped>
.PlayStateMod {
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  .time {
    color: var(--color-550);
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
.mode {
  width: 140px;
  height: 40px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.icon_common {
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}
</style>
