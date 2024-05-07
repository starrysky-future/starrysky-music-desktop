<script lang="ts" setup>
import { VNodeRef, computed, onMounted, ref, nextTick, onUpdated } from 'vue';
const props = defineProps<{
  position: SKY.SongList.Position;
  direction: string;
  arrowInfo?: SKY.Play.ArrowInfo;
  hasArrow?: boolean;
  transitionName?: string;
}>();

const isVisible = defineModel<boolean>();
const domPositionPopup = ref<VNodeRef | null>(null);
const popupWidth = ref<number>(0);
const popupHeight = ref<number>(0);

let x;
let y;

onMounted(() => {
  nextTick(() => {
    popupWidth.value = domPositionPopup.value?.clientWidth;
    popupHeight.value = domPositionPopup.value?.clientHeight;
  });

  x = computed(() => {
    if (props.direction === 'top' || props.direction === 'bottom') {
      return props.position.x + props.position.width! / 2 - popupWidth.value / 2;
    } else if (props.direction === 'left') {
      return props.position.x - popupWidth.value - (props.arrowInfo?.arrowSize || 5) - 14;
    } else {
      return props.position.x + props.position.width! + (props.arrowInfo?.arrowSize || 5) + 14;
    }
  });
  y = computed(() => {
    if (props.direction === 'top') {
      return props.position.y - popupHeight.value - (props.arrowInfo?.arrowSize || 5) - 14;
    } else if (props.direction === 'left' || props.direction === 'right') {
      return props.position.y + props.position.height! / 2 - popupHeight.value / 2;
    } else {
      return props.position.y + props.position.height! + (props.arrowInfo?.arrowSize || 5) + 14;
    }
  });
});

onUpdated(() => {
  nextTick(() => {
    popupWidth.value = domPositionPopup.value.clientWidth;
    popupHeight.value = domPositionPopup.value.clientHeight;
  });
});
</script>

<template>
  <Popup
    v-model="isVisible"
    :position="{ x: x, y: y }"
    :has-arrow="props.hasArrow"
    :arrow-info="props.arrowInfo"
    :direction="props.direction"
    :transition-name="props.transitionName"
    has-listener
  >
    <div ref="domPositionPopup">
      <slot></slot>
    </div>
  </Popup>
</template>

<style lang="less" scoped></style>
