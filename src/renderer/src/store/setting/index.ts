import { defineStore } from 'pinia';
import { ref, defineAsyncComponent } from 'vue';

export const useSetStore = defineStore('useSetStore', () => {
  const setList = ref({
    themeId: 'blue',
    apiSource: 'local',
    apiSourceList: [{ name: '本地音源', id: 'local' }]
  });

  return { setList };
});

export const setLabelList = [
  {
    id: 'SetBasic',
    name: '基本设置',
    com: defineAsyncComponent(() => import('@r/views/setting/components/SetBasic.vue'))
  },
  {
    id: 'bfsz',
    name: '播放设置',
    com: defineAsyncComponent(() => import('@r/views/setting/components/SetPlay.vue'))
  }
];
