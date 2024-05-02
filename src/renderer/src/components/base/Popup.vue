<script lang="ts" setup>
import { onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue';

const props = defineProps<{
  position: SKY.SongList.Position;
  direction?: string;
  hasArrow?: boolean;
  arrowInfo?: SKY.Play.ArrowInfo;
  hasListener?: boolean;
  transitionName?: string;
}>();

const transitionConfig = {
  TransitionScale: defineAsyncComponent(() => import('@r/components/tools/TransitionScale.vue'))
};

let arrow_size;
let arrow_position;
let transitionCom;

if (props.transitionName) {
  transitionCom = transitionConfig[props.transitionName];
}

if (props.hasArrow) {
  arrow_size = props.arrowInfo?.arrowSize ? `${props.arrowInfo.arrowSize}px` : '10px';

  if (props.arrowInfo?.arrowPosition) {
    arrow_position = `popup_arrow_${props.arrowInfo.arrowPosition}_mid`;
  } else if (props.direction) {
    const getDirection = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    };
    arrow_position = `popup_arrow_${getDirection[props.direction]}_mid`;
  }
}

const isVisible = defineModel<boolean>();

const setVisible = () => {
  isVisible.value = false;
};

onMounted(() => {
  if (props.hasListener) {
    document.addEventListener('click', setVisible);
  }
});
onBeforeUnmount(() => {
  if (props.hasListener) {
    document.removeEventListener('click', setVisible);
  }
});
</script>

<template>
  <Teleport to="#app">
    <component :is="transitionCom || 'div'">
      <div
        v-show="isVisible"
        class="popup"
        :style="{ left: props.position.x + 'px', top: props.position.y + 'px' }"
        @click.stop
      >
        <div v-if="hasArrow" class="popup_arrow" :class="arrow_position"></div>
        <slot></slot>
      </div>
    </component>
  </Teleport>
</template>

<style lang="less" scoped>
.popup {
  z-index: 10;
  position: fixed;
  border-radius: 4px;
  filter: drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.12));
  background-color: #fff;
  .popup_arrow {
    border-top: v-bind(arrow_size) solid transparent;
    border-bottom: v-bind(arrow_size) solid transparent;
    border-left: v-bind(arrow_size) solid transparent;
    border-right: v-bind(arrow_size) solid transparent;
    position: absolute;
  }
  .popup_arrow_top_mid {
    left: 50%;
    transform: translate(-50%, -100%);
    border-bottom: v-bind(arrow_size) solid #fff;
  }
  .popup_arrow_left_mid {
    top: 50%;
    transform: translate(-100%, -50%);
    border-right: v-bind(arrow_size) solid #fff;
  }
  .popup_arrow_bottom_mid {
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 100%);
    border-top: v-bind(arrow_size) solid #fff;
  }
  .popup_arrow_right_mid {
    right: 0;
    top: 50%;
    transform: translate(100%, -50%);
    border-left: v-bind(arrow_size) solid #fff;
  }
}
</style>
