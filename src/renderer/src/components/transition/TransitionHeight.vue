<script lang="ts" setup>
const props = defineProps<{ transitionWH: SKY.WH }>();
const height = props.transitionWH.height + 'px';
</script>

<template>
  <Transition name="TransitionHeight">
    <slot></slot>
  </Transition>
</template>

<style lang="less" scoped>
.TransitionHeight-enter-from,
.TransitionHeight-leave-to {
  height: 0;
  overflow: hidden;
}
.TransitionHeight-enter-to,
.TransitionHeight-leave-from {
  height: v-bind(height);
  overflow: hidden;
}
.TransitionHeight-enter-active,
.TransitionHeight-leave-active {
  transition: height 0.5s ease;
}
</style>
