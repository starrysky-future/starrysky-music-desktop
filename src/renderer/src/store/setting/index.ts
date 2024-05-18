import { defineStore } from 'pinia';
import { ref, defineAsyncComponent } from 'vue';

export const useSetStore = defineStore('useSetStore', () => {
  const setList = ref({
    themeId: 'blue',
    apiSource: 'local'
  });
  const apiSourceList = ref([{ name: '本地音源', id: 'local' }]);

  return { setList, apiSourceList };
});

export const setLabelList = [
  {
    id: 'SetBasic',
    name: '基本设置',
    com: defineAsyncComponent(() => import('@r/views/setting/components/SetBasic.vue'))
  },
  {
    id: 'SetPlay',
    name: '播放设置',
    com: defineAsyncComponent(() => import('@r/views/setting/components/SetPlay.vue'))
  },
  {
    id: 'setUpdater',
    name: '软件更新',
    com: defineAsyncComponent(() => import('@r/views/setting/components/SetUpdater.vue'))
  }
];
