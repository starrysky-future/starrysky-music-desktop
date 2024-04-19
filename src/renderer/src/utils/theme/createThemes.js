//! 更新默认主题配置后，需要执行 npm run build:theme 重新构建index.json

const fs = require('fs');
const path = require('path');
const { createThemeColors } = require('./utils');

const defaultThemes = [
  {
    id: 'blue',
    name: '蓝田生玉',
    isDark: false,
    config: {
      primary: 'rgb(52, 152, 219)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-700)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': '#5cbf9b',
      '--color-badge-tertiary': '#5cbf9b',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'green',
    name: '绿意盎然',
    isDark: false,
    config: {
      primary: 'rgb(77, 175, 124)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-700)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': '#4baed5',
      '--color-badge-tertiary': '#e7aa36',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'blue_plus',
    name: '蛋雅深蓝',
    isDark: false,
    config: {
      primary: 'rgb(77, 131, 175)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-600)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': 'rgba(66.6, 150.7, 171, 1)',
      '--color-badge-tertiary': 'rgba(54, 196, 231, 1)',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'orange',
    name: '橙黄橘绿',
    isDark: false,
    config: {
      primary: 'rgb(245, 171, 53)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-700)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': '#9ed458',
      '--color-badge-tertiary': '#9ed458',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'red',
    name: '热情似火',
    isDark: false,
    config: {
      primary: 'rgb(214, 69, 65)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-700)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': '#dfbb6b',
      '--color-badge-tertiary': '#dfbb6b',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'pink',
    name: '粉装玉琢',
    isDark: false,
    config: {
      primary: 'rgb(241, 130, 141)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-700)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': '#f5b684',
      '--color-badge-tertiary': '#f5b684',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'purple',
    name: '重斤球紫',
    isDark: false,
    config: {
      primary: 'rgb(155, 89, 182)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-700)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': '#e5a39f',
      '--color-badge-tertiary': '#e5a39f',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'grey',
    name: '灰常美丽',
    isDark: false,
    config: {
      primary: 'rgb(108, 122, 137)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-700)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': '#b19b9f',
      '--color-badge-tertiary': '#b19b9f',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'ming',
    name: '青出于黑',
    isDark: false,
    config: {
      primary: 'rgb(51, 110, 123)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-700)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': '#6376a2',
      '--color-badge-tertiary': '#6376a2',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'blue2',
    name: '清热板蓝',
    isDark: false,
    config: {
      primary: 'rgb(79, 98, 208)',
      font: 'rgb(33, 33, 33)',
      '--color-app-background': 'var(--color-primary-light-600-alpha-700)',
      '--color-main-background': 'rgba(255, 255, 255, 1)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary)',
      '--color-badge-secondary': '#b080db',
      '--color-badge-tertiary': '#b080db',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  },
  {
    id: 'black',
    name: '黑灯瞎火',
    isDark: true,
    config: {
      primary: 'rgb(150, 150, 150)',
      font: 'rgb(229, 229, 229)',
      '--color-app-background': 'rgba(0, 0, 0, 0)',
      '--color-main-background': 'rgba(19, 19, 19, 0.9)',
      '--color-nav-font': 'var(--color-primary)',
      '--background-image': 'none',
      '--background-image-position': 'center',
      '--background-image-size': 'cover',

      '--color-btn-hide': 'var(--color-primary)',
      '--color-btn-min': 'var(--color-primary)',
      '--color-btn-max': 'var(--color-primary)',
      '--color-btn-close': 'var(--color-primary)',
      '--color-btn-close-hover': '#F28F8F',

      '--color-badge-primary': 'var(--color-primary-dark-200)',
      '--color-badge-secondary': 'var(--color-primary)',
      '--color-badge-tertiary': 'var(--color-primary-dark-300)',

      '--color-font': 'var(--color-850)',
      '--color-font-label': 'var(--color-450)'
    }
  }
];

const themes = defaultThemes.map(({ config: { primary, font, ...extInfo }, ...themeInfo }) => {
  return {
    ...themeInfo,
    isCustom: false,
    config: {
      ...createThemeColors(primary, font, themeInfo.isDark),
      ...extInfo
    }
  };
});

fs.writeFileSync(path.join(__dirname, 'theme.json'), JSON.stringify(themes, null, 2));
