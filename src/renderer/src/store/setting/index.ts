import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSetStore = defineStore('useSetStore', () => {
  const themeId = ref<string>('blue');
  const apiSource = ref<string>('test');
  const isKeepList = ref<boolean>(false);

  return { themeId, isKeepList, apiSource };
});
