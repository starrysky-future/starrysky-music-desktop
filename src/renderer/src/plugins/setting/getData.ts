import pinia from '@r/store';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { useSetStore } from '@r/store/setting';
import { useAppStore } from '@r/store/app';
import applyThemeColor from '@r/utils/theme/index.js';
import { setMute } from '../player/audio';
import { getDataIpc } from '@r/ipc/dataIpc';
import { getAppInfoIpc, getUpdateInfo } from '@r/ipc/updaterIpc';
import { formatSize } from '@r/utils';

const playStore = usePlayStore(pinia);
const { playList, curPlayInfo, volume, isMute, playState } = storeToRefs(playStore);
const setStore = useSetStore(pinia);
const { setList } = storeToRefs(setStore);
const appStore = useAppStore(pinia);
const { appInfo, modalInfo, updateProgress } = storeToRefs(appStore);

const getData = async (name: string) => {
  return await getDataIpc(name);
};

const getplayList = async () => {
  try {
    const res = await getData('playList');
    if (res) {
      playList.value = JSON.parse(res);

      curPlayInfo.value = {
        ...playList.value[playList.value.playListId].list[playList.value.playId],
        curLyric: '',
        isPlay: false
      };
    }
  } catch (error) {
    console.log('获取playList失败');
  }
};

const getConfig = async () => {
  try {
    const res = await getData('config');

    if (res) {
      const data = JSON.parse(res);

      setList.value = data.setBasic;
      setPlayConfig(data.playConfig);
    }
  } catch (error) {
    console.log('获取config失败');
  }
  applyThemeColor();
};

const getAppInfo = async () => {
  const mainAppInfo = await getAppInfoIpc();

  appInfo.value.curVersion = mainAppInfo.version;
};

const getUpdateInfoListener = (_event, updateInfo: SKY.UpdateInfo) => {
  console.log('updateInfo', updateInfo);
  if (updateInfo.updateStatus === 'update-available') {
    appInfo.value.lastVersion = updateInfo.version!;
    appInfo.value.updateSize = formatSize(updateInfo.size!);

    modalInfo.value.modalName = 'UpdateModal';
    modalInfo.value.modalTitle = '存在新版本';
    modalInfo.value.isModal = true;
  } else if (updateInfo.updateStatus === 'update-not-available') {
    appInfo.value.lastVersion = updateInfo.version!;
  } else if (updateInfo.updateStatus === 'error') {
    console.log(updateInfo.error);
  } else if (updateInfo.updateStatus === 'download-progress') {
    console.log('updateInfo.progress', updateInfo.progress);
    updateProgress.value.bytesPerSecond = formatSize(updateInfo.progress!.bytesPerSecond) + '/s';
    updateProgress.value.transferred = formatSize(updateInfo.progress!.transferred);
    updateProgress.value.percent = Math.trunc(updateInfo.progress!.percent) / 100;
  }
};

const setPlayConfig = (playConfig) => {
  volume.value = playConfig.volume;
  playState.value = playConfig.playState;
  isMute.value = playConfig.mute;

  setMute(playConfig.mute);
};

export const initData = () => {
  getplayList();
  getConfig();
  getAppInfo();
  getUpdateInfo(getUpdateInfoListener);
};
