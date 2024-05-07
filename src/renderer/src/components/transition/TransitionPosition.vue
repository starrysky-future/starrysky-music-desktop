<script lang="ts" setup></script>

<template>
  <Transition name="TransitionPosition">
    <slot></slot>
  </Transition>
</template>

<style lang="less" scoped>
.TransitionPosition-enter-from {
  transform: translateX(100%);
}
.TransitionPosition-enter-to {
  transform: translateX(0);
}

.TransitionPosition-leave-from {
  transform: translateY(0);
}
.TransitionPosition-leave-to {
  transform: translateY(100%);
}

.TransitionPosition-enter-active,
.TransitionPosition-leave-active {
  transition: transform 0.5s ease;
}
</style>
