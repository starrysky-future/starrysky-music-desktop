import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('useAppStore', () => {
  const showLyricPage = ref<boolean>(false);
  const showTip = ref<boolean>(false);
  const tipText = ref<string>('');
  const tipPosition = ref<SKY.SongList.Position>({
    x: 0,
    y: 0
  });

  return { showTip, tipText, tipPosition, showLyricPage };
});

export const useListpopupStore = defineStore('useListpopupStore', () => {
  const showListpopup = ref<boolean>(false);
  const listpopupPosition = ref<SKY.SongList.Position>({
    x: 0,
    y: 0
  });
  const listpopupData = ref<Array<SKY.SongList.PopupListItem>>([]);
  const listpopupOpr = ref<(id: string) => void>(() => {});

  return { showListpopup, listpopupPosition, listpopupData, listpopupOpr };
});
