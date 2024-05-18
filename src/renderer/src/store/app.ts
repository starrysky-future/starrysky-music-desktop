import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('useAppStore', () => {
  const appInfo = ref<SKY.AppInfo>({
    curVersion: '',
    lastVersion: ''
  });

  const showLyricPage = ref<boolean>(false);

  const showTip = ref<boolean>(false);
  const tipText = ref<string>('');
  const tipPosition = ref<SKY.SongList.Position>({
    x: 0,
    y: 0
  });

  const modalInfo = ref<SKY.ModalInfo>({
    modalName: '',
    modalTitle: '',
    isModal: false
  });

  return {
    showTip,
    tipText,
    tipPosition,
    showLyricPage,
    modalInfo,
    appInfo
  };
});

export const useListpopupStore = defineStore('useListpopupStore', () => {
  const showListpopup = ref<boolean>(false);
  const listpopupActiveId = ref<string>('');
  const listpopupPosition = ref<SKY.SongList.Position>({
    x: 0,
    y: 0,
    width: 80,
    height: 30
  });
  const listpopupData = ref<Array<SKY.SongList.PopupListItem>>([]);
  const listpopupOpr = ref<(item) => void>(() => {});
  const listpopupTransition = ref<string>('TransitionOpacity');

  return {
    showListpopup,
    listpopupPosition,
    listpopupData,
    listpopupOpr,
    listpopupActiveId,
    listpopupTransition
  };
});

export const usePlayEvent = defineStore('usePlayEvent', () => {
  const stopTimeupdate = ref<(() => void) | null>(null);
  const stopEnded = ref<(() => void) | null>(null);

  return { stopTimeupdate, stopEnded };
});
