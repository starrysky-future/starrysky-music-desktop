import { screen } from 'electron';

export const windowSizeList: SKY.Config.WindowSize[] = [
  {
    id: 0,
    name: 'smaller',
    width: 828,
    height: 540
  },
  {
    id: 1,
    name: 'small',
    width: 920,
    height: 600
  },
  {
    id: 2,
    name: 'medium',
    width: 1020,
    height: 660
  },
  {
    id: 3,
    name: 'big',
    width: 1114,
    height: 718
  },
  {
    id: 4,
    name: 'larger',
    width: 1202,
    height: 776
  },
  {
    id: 5,
    name: 'oversized',
    width: 1385,
    height: 896
  },
  {
    id: 6,
    name: 'huge',
    width: 1700,
    height: 1070
  }
];

export const getScreenWH = (): SKY.Config.ScreenWH => {
  const primaryDisplay = screen.getPrimaryDisplay();
  return primaryDisplay.workAreaSize;
};

export const getAppWH = (): SKY.Config.WindowSize => {
  const { width } = getScreenWH();
  const fitWidth = width * (2 / 3);
  return fitWidth > 1700
    ? windowSizeList[6]
    : fitWidth > 1385
      ? windowSizeList[5]
      : fitWidth > 1202
        ? windowSizeList[4]
        : fitWidth > 1114
          ? windowSizeList[3]
          : fitWidth > 1020
            ? windowSizeList[2]
            : fitWidth > 920
              ? windowSizeList[1]
              : windowSizeList[0];
};
