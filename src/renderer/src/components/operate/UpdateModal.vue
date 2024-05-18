<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@r/store/app';
import { downloadUpdate } from '@r/ipc/updaterIpc';

const appStore = useAppStore();
const { appInfo } = storeToRefs(appStore);
</script>

<template>
  <div class="update_modal">
    <div class="header">
      <div class="version">
        <div>当前版本: {{ appInfo.curVersion }}</div>
        <div>最新版本: {{ appInfo.lastVersion }}</div>
      </div>
    </div>
    <div class="main"></div>
    <div class="floor" @click="downloadUpdate">立即更新</div>
  </div>
</template>

<style lang="less" scoped>
.update_modal {
  width: 600px;
  height: 400px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  .header {
    display: flex;
    padding: 6px;
    .version {
    }
  }
  .main {
    flex: 1;
  }
  .floor {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: var(--color-primary-light-600);
    &:hover {
      background-color: var(--color-primary-light-400);
    }
  }
}
</style>
