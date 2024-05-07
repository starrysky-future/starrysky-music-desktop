<script lang="ts" setup></script>

<template>
  <Transition name="TransitionOpacity">
    <slot></slot>
  </Transition>
</template>

<style lang="less" scoped>
.TransitionOpacity-enter-from,
.TransitionOpacity-leave-to {
  opacity: 0;
}
.TransitionOpacity-enter-to,
.TransitionOpacity-leave-from {
  opacity: 1;
}
.TransitionOpacity-enter-active,
.TransitionOpacity-leave-active {
  transition: opacity 0.5s ease;
}
</style>
