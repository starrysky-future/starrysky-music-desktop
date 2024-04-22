import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSetStore = defineStore('useSetStore', () => {
  const themeId = ref<string>('blue');
  const apiSource = ref<string>('test');
  const keepSearchDetail = ref<string>('');
  const keepSongListDetail = ref<string>('');

  return { themeId, keepSearchDetail, keepSongListDetail, apiSource };
});
