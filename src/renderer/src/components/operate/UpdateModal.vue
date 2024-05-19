<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUpdateStore } from '@r/store/setting/update';
import { downloadUpdate } from '@r/ipc/updaterIpc';

const updateStore = useUpdateStore();
const { appInfo, updateProgress } = storeToRefs(updateStore);

const download = () => {
  updateProgress.value.hasUpdate = true;
  downloadUpdate();
};
</script>

<template>
  <div class="update_modal">
    <div class="header">
      <div class="version">
        <div>当前版本: {{ appInfo.curVersion }}</div>
        <div>最新版本: {{ appInfo.lastVersion }}</div>
      </div>
      <div class="update_progress">
        <div class="progress">
          <Progress :progress="updateProgress.percent" :hidehandle-ms="true" />
        </div>
        <div class="progress_info">
          <div class="transferred">
            下载进度: {{ updateProgress.transferred }} / {{ appInfo.updateSize }}
          </div>
          <div class="bytesPerSecond">当前网速: {{ updateProgress.bytesPerSecond }}</div>
        </div>
      </div>
    </div>
    <!-- <div class="main"></div> -->
    <div class="floor" @click="download">立即更新</div>
  </div>
</template>

<style lang="less" scoped>
.update_modal {
  width: 600px;
  // height: 400px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  .header {
    display: flex;
    padding: 6px;
    .version {
    }
    .update_progress {
      flex: 1;
      padding: 0 0 0 6px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .progress {
        height: 4px;
      }
      .progress_info {
        padding-top: 4px;
        display: flex;
        justify-content: flex-end;
        .bytesPerSecond {
          padding-left: 10px;
        }
      }
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
