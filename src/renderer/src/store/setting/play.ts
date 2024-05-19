import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlayStore = defineStore('usePlayStore', () => {
  const prevDeviceLabel = ref<string | null>(null);
  const prevDeviceId = ref<string>('default');

  return { prevDeviceLabel, prevDeviceId };
});
