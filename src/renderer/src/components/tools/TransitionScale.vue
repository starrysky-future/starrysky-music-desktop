<script lang="ts" setup></script>

<template>
  <Transition name="TransitionScale">
    <slot></slot>
  </Transition>
</template>

<style lang="less" scoped>
.TransitionScale-enter-from {
  transform: scale(0);
}
.TransitionScale-enter-to {
  transform: scale(1);
}
.TransitionScale-enter-active {
  transition: transform 0.3s ease;
}

.TransitionScale-leave-from {
  transform: scale(1);
}
.TransitionScale-leave-to {
  transform: scale(0);
}
.TransitionScale-leave-active {
  transition: transform 0.3s ease;
}
</style>
