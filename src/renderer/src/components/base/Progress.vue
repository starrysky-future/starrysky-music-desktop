<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, VNodeRef } from 'vue';

const props = defineProps<{
  progress: number;
}>();

const msEvent = {
  isMsDown: false,
  msDownX: 0,
  msDownProgress: 0
};
const domProgress = ref<VNodeRef | null>(null);
const dragProgress = ref<number>(0);
const dragging = ref<boolean>(false);

const emits = defineEmits(['setProgress']);

const handleMsDown = (event) => {
  msEvent.isMsDown = true;
  msEvent.msDownX = event.clientX;

  let val = event.offsetX / domProgress.value.clientWidth;

  if (val < 0) val = 0;
  if (val > 1) val = 1;

  dragProgress.value = msEvent.msDownProgress = val;
};
const handleMsUp = () => {
  if (msEvent.isMsDown) emits('setProgress', dragProgress.value);
  msEvent.isMsDown = false;
  dragging.value = false;
};
const handleMsMove = (event) => {
  if (!msEvent.isMsDown) return;
  dragging.value = true;
  let val =
    msEvent.msDownProgress + (event.clientX - msEvent.msDownX) / domProgress.value.clientWidth;
  if (val < 0) val = 0;
  if (val > 1) val = 1;
  dragProgress.value = val;
};

onMounted(() => {
  document.addEventListener('mousemove', handleMsMove);
  document.addEventListener('mouseup', handleMsUp);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMsMove);
  document.removeEventListener('mouseup', handleMsUp);
});
</script>

<template>
  <div ref="domProgress" class="progress" @click.stop>
    <div
      class="progress_type progress_cur cur_transition"
      :style="{ transform: `scaleX(${props.progress || 0})` }"
    ></div>
    <div
      v-show="dragging"
      class="progress_type progress_next"
      :style="{ transform: `scaleX(${dragProgress || 0})` }"
    ></div>
    <div ref="domProgress" class="progressMask" @mousedown="handleMsDown"></div>
  </div>
</template>

<style lang="less" scoped>
.progress {
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background-color: var(--color-primary-light-100-alpha-800);
  transition: 0.4 ease;
  transition-property: background-color;
  .progress_type {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-origin: 0;
  }
  .progress_cur {
    background-color: var(--color-primary-light-100-alpha-400);
  }

  .progress_next {
    will-change: transform;
    background-color: var(--color-primary-light-100-alpha-200);
  }
  .cur_transition {
    transition-property: transform;
    transition-timing-function: ease-out;
    transition-duration: 0.3s;
  }
  .progressMask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
