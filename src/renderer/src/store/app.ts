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

  const modalName = ref<string>('');
  const modalTitle = ref<string>('');
  const isModal = ref<boolean>(false);
  const addInfo = ref<SKY.MusicListItem>();

  return { showTip, tipText, tipPosition, showLyricPage, modalName, isModal, modalTitle, addInfo };
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
