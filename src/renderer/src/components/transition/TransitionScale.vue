<script lang="ts" setup></script>

<template>
  <Transition name="TransitionScale">
    <slot></slot>
  </Transition>
</template>

<style lang="less" scoped>
.TransitionScale-enter-from,
.TransitionScale-leave-to {
  transform: scale(0);
}
.TransitionScale-enter-to,
.TransitionScale-leave-from {
  transform: scale(1);
}
.TransitionScale-enter-active,
.TransitionScale-leave-active {
  transition: transform 0.3s ease;
}
</style>
