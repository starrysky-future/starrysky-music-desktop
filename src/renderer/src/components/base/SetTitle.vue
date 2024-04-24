<script lang="ts" setup></script>

<template>
  <div class="set_title">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.set_title {
  position: relative;
  padding-left: 8px;
  &::after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: var(--color-primary-light-300);
  }
}
</style>
