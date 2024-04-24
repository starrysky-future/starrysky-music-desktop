import themes from './theme.json';
import { storeToRefs } from 'pinia';
import { useSetStore } from '@r/store/setting/index';
import pinia from '@r/store';

const setStore = useSetStore(pinia);
const { setList } = storeToRefs(setStore);

const dom_style = document.createElement('style');
const setTheme = (style) => {
  dom_style.innerText = `:root {${Object.entries(style)
    .map(([key, value]) => `${key}:${value};`)
    .join('')}}`;
};

const applyThemeColor = () => {
  const theme = themeSearch(themes, setList.value.themeId);
  setTheme(theme);
  document.body.appendChild(dom_style);
};

const themeSearch = (themes, themeId) => {
  let left = 0;
  let right = themes.length - 1;
  let theme = themes[0].config;

  while (left <= right) {
    if (themes[left].id === themeId) {
      theme = themes[left].config;
    }
    if (themes[right].id === themeId) {
      theme = themes[right].config;
    }
    left++;
    right--;
  }

  return theme;
};

export default applyThemeColor;
