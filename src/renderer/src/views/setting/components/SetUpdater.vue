<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useUpdateStore } from '@r/store/setting/update';

const updateStore = useUpdateStore();
const { appInfo, updateProgress } = storeToRefs(updateStore);
</script>

<template>
  <div class="set_updater">
    <SetTitle> 软件更新 </SetTitle>
    <div class="common_card version">
      <div>
        <div>当前版本: {{ appInfo.curVersion }}</div>
        <div>最新版本: {{ appInfo.lastVersion }}</div>
      </div>
      <div v-if="updateProgress.hasUpdate" class="update_progress">
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
  </div>
</template>

<style lang="less" scoped>
@import './common.less';

.set_updater {
  .version {
    display: flex;
    .update_progress {
      flex: 1;
      padding-left: 10px;
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
}
</style>
