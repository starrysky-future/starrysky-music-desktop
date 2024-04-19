import { defineStore } from 'pinia';
import { ref } from 'vue';
import sources from '@r/apis';

export const sortList = [
  { id: 'searchMusic', name: '歌曲' },
  { id: 'searchSongList', name: '歌单' }
];

export const useSearchStore = defineStore('useSearchStore', () => {
  const SsourceId = ref<string>(sources.sources[0].id);

  const sortId = ref<string>(sortList[0].id);

  return { SsourceId, sortId };
});
