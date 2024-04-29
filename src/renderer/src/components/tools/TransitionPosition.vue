<script lang="ts" setup></script>

<template>
  <Transition name="fadePosition">
    <slot></slot>
  </Transition>
</template>

<style lang="less" scoped>
.fadePosition-enter-from {
  transform: translateX(100%);
}
.fadePosition-enter-to {
  transform: translateX(0);
}
.fadePosition-enter-active {
  transition: transform 0.5s ease;
}

.fadePosition-leave-from {
  transform: translateY(0);
}
.fadePosition-leave-to {
  transform: translateY(100%);
}
.fadePosition-leave-active {
  transition: transform 0.5s ease;
}
</style>
