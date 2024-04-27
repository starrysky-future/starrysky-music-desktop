import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('useAppStore', () => {
  const showTip = ref<boolean>(false);
  const tipText = ref<string>('');
  const tipPosition = ref<SKY.SongList.Position>({
    x: 0,
    y: 0
  });

  return { showTip, tipText, tipPosition };
});
