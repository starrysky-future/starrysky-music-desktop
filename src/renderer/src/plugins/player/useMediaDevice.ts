import { storeToRefs } from 'pinia';
import { setMediaDeviceId } from './index';
import { usePlayStore } from '@r/store/setting/play';

const playStore = usePlayStore();
const { prevDeviceLabel, prevDeviceId } = storeToRefs(playStore);

const getDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(({ kind }) => kind == 'audiooutput');
};

export const getMediaDevice = async (deviceId: string) => {
  const devices = await getDevices();
  let device = devices.find((device) => device.deviceId === deviceId);
  if (!device) {
    deviceId = 'default';
    device = devices.find((device) => device.deviceId === deviceId);
  }

  return device ? { label: device.label, deviceId: device.deviceId } : { label: '', deviceId: '' };
};

export const setMediaDevice = async (deviceId: string, label: string) => {
  prevDeviceLabel.value = label;
  setMediaDeviceId(deviceId)
    .then(() => {
      prevDeviceId.value = deviceId;
    })
    .catch((err: unknown) => {
      console.log(err);
      setMediaDeviceId('default').finally(() => {
        prevDeviceId.value = 'default';
      });
    });
};
