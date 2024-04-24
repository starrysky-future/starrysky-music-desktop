import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNavStore = defineStore('useNavStore', () => {
  const keepSearchDetail = ref<string>('');
  const keepSongListDetail = ref<string>('');
  const navName = ref<string>('songList');

  return { keepSearchDetail, keepSongListDetail, navName };
});
