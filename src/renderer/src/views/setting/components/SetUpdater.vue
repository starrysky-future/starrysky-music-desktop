<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@r/store/app';

const appStore = useAppStore();
const { appInfo } = storeToRefs(appStore);
</script>

<template>
  <div class="set_updater">
    <SetTitle> 软件更新 </SetTitle>
    <div class="common_card">
      <div>当前版本: {{ appInfo.curVersion }}</div>
      <div>最新版本: {{ appInfo.lastVersion }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import './common.less';

.set_updater {
}
</style>
