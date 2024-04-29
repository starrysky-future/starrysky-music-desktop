<script lang="ts" setup>
import { VNodeRef, ref, watch, computed, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@r/store/app';

const appStore = useAppStore();
const { tipPosition, tipText, showTip } = storeToRefs(appStore);

const tipWidth = ref<number>(0);
const tipHeight = ref<number>(0);
const domTipPopup = ref<VNodeRef | null>(null);
const APPDOM: HTMLElement = document.getElementById('app')!;

let x;
let y;
let stopWatch;

onMounted(() => {
  stopWatch = watch(showTip, (value) => {
    if (value) {
      nextTick(() => {
        tipWidth.value = domTipPopup.value.offsetWidth;
        tipHeight.value = domTipPopup.value.offsetHeight;
      });

      x = computed(() => {
        if (APPDOM?.clientWidth - tipPosition.value.x - 8 - 10 < tipWidth.value) {
          return tipPosition.value.x - tipWidth.value - 10;
        }
        return tipPosition.value.x + 10;
      });

      y = computed(() => {
        if (APPDOM?.clientHeight - tipPosition.value.y - 8 - 6 < tipHeight.value) {
          return tipPosition.value.y - tipHeight.value - 6;
        }
        return tipPosition.value.y + 6;
      });
    }
  });
});

onBeforeUnmount(() => {
  stopWatch();
});
</script>

<template>
  <Popup v-model="showTip" :position="{ x: x, y: y }">
    <div ref="domTipPopup" class="tip_Popup">
      {{ tipText }}
    </div>
  </Popup>
</template>

<style lang="less" scoped>
.tip_Popup {
  font-size: 12px;
  padding: 4px;
  max-width: 400px;
  word-wrap: break-word;
}
</style>
