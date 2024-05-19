import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUpdateStore = defineStore('useUpdateStore', () => {
  const appInfo = ref<SKY.AppInfo>({
    curVersion: '',
    lastVersion: '',
    updateSize: ''
  });

  const updateProgress = ref<SKY.UpdateProgress>({
    hasUpdate: false,
    percent: 0,
    transferred: '0M',
    bytesPerSecond: '0KB/s'
  });

  return { appInfo, updateProgress };
});
