<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@r/store/app';

const props = defineProps<{
  text: string;
}>();

const appStore = useAppStore();
const { tipPosition, tipText, showTip } = storeToRefs(appStore);

let tipTimeout;

const setTip = (event) => {
  if (showTip.value || tipTimeout) {
    showTip.value = false;
    clearTimeout(tipTimeout);
  }

  tipTimeout = setTimeout(() => {
    tipText.value = props.text;
    tipPosition.value.x = event.clientX;
    tipPosition.value.y = event.clientY;
    showTip.value = true;
    clearTimeout(tipTimeout);
    tipTimeout = null;
  }, 500);
};
const mouseenter = () => {
  document.addEventListener('mousemove', setTip);
};
const mouseleave = () => {
  clearTimeout(tipTimeout);
  tipTimeout = null;
  document.removeEventListener('mousemove', setTip);
  tipText.value = '';
  tipPosition.value.x = 0;
  tipPosition.value.y = 0;
  showTip.value = false;
};
</script>

<template>
  <span class="singleTextHide" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <slot></slot>
  </span>
</template>

<style lang="less" scoped></style>
