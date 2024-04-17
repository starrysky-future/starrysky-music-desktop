<script lang="ts" setup></script>

<template>
  <div class="noData">
    <div class="icon_noData">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        height="100%"
        viewBox="0 0 80 80"
        space="preserve"
      >
        <use xlink:href="#icon-noData" />
      </svg>
    </div>
  </div>
</template>

<style lang="less" scoped>
.noData {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon_noData {
    width: 80px;
    height: 80px;
    color: var(--color-primary);
  }
}
</style>
