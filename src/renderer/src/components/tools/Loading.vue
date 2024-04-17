<script lang="ts" setup></script>

<template>
  <div class="loading">
    <div class="icon">
      <LoadIcon />
    </div>
  </div>
</template>

<style lang="less" scoped>
.loading {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-primary-light-700);
  .icon {
    width: 80px;
    height: 80px;
  }
}
</style>
