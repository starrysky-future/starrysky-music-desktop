/**
 * 根据屏幕大小获取根节点大小
 * @param screenWidth
 * @returns
 */
export const getFontSizeWithScreen = (screenWidth: number = window.innerWidth): number => {
  return screenWidth <= 1440
    ? 16
    : screenWidth <= 1920
      ? 18
      : screenWidth <= 2560
        ? 20
        : screenWidth <= 2560
          ? 20
          : 22;
};

/**
 * 格式化播放数量
 * @param {*} num 数字
 */
export const formatPlayCount = (num: number): string => {
  if (num > 100000000) return `${Math.trunc(num / 10000000) / 10}亿`;
  if (num > 10000) return `${Math.trunc(num / 1000) / 10}万`;
  return String(num);
};

/**
 * 时间格式化
 * @param _date 时间
 * @param format Y-M-D h:m:s Y年 M月 D日 h时 m分 s秒
 */
export const dateFormat = (_date, format = 'Y-M-D h:m:s') => {
  const date = new Date(_date);

  const Y = date.getFullYear() + '';
  const M = date.getMonth() + 1 + '';
  const D = date.getDate() + '';

  if (format.length > 5) {
    const h = date.getHours() + '';
    const m = date.getMinutes() + '';
    const s = date.getSeconds() + '';

    return format
      .replace('Y', Y)
      .replace('M', M)
      .replace('D', D)
      .replace('h', h)
      .replace('m', m)
      .replace('s', s);
  }

  return format.replace('Y', Y).replace('M', M).replace('D', D);
};

const numFix = (n: number): string => (n < 10 ? `0${n}` : n.toString());

export const formatPlayTime = (time: number) => {
  const m = Math.trunc(time / 60);
  const s = Math.trunc(time % 60);
  return numFix(m) + ':' + numFix(s);
};

/**
 * 防抖
 * @param fn
 * @param delay
 * @param immediate
 * @returns
 */
export const debounce = (fn, delay: number, immediate: boolean = true) => {
  let timer: null | NodeJS.Timeout = null;
  return function (...args) {
    // @ts-expect-error
    const self = this;
    const nowTimer = !timer;
    if (timer) clearTimeout(timer);

    if (immediate) {
      if (nowTimer) {
        fn.apply(self, args);
      }
      timer = setTimeout(() => {
        timer = null;
      }, delay);
    } else {
      timer = setTimeout(() => {
        fn.apply(self, args);
        timer = null;
      }, delay);
    }
  };
};

/**
 * 重复判断
 * @param list
 * @param data
 * @param key 判断的key
 * @returns
 */
export const unique = (list, data, key: string) => {
  let l = 0;
  let r = list.length - 1;

  while (l <= r) {
    if (list[l][key] === data[key] || list[r][key] === data[key]) {
      return l;
    }
    if (list[r][key] === data[key]) {
      return r;
    }
    l++;
    r--;
  }

  return true;
};

/**
 * 加入前判断是否有重复数据
 * @param list
 * @param data 添加的数据
 * @param key 用于判断的key
 * @returns
 */
export const addUnique = (list, data, key: string) => {
  const reply = unique(list, data, key);
  if (typeof reply === 'number') {
    return false;
  }
  list.push(data);
  return true;
};

/**
 * 数据插入数组
 * @param list
 * @param data
 * @param key
 * @param id
 */
export const insertList = (list, data, key: string, id: number) => {
  const reply = unique(list, data, key);

  if (typeof reply === 'number') {
    list.splice(reply, 1);
  }

  list.splice(id, 0, data);
};

/**
 * 获取随机列表
 * @param list
 * @returns
 */
export const getRandomList = (list) => {
  for (let i = 0; i < list.length; i++) {
    const randomIndex = Math.round(Math.random() * (list.length - 1 - i)) + i;
    [list[i], list[randomIndex]] = [list[randomIndex], list[i]];
  }

  return list;
};

/**
 * 移除列表数据
 * @param list
 * @param key
 * @param id
 * @returns
 */
export const removeList = (list, key: string, id: string) => {
  for (let i = 0; i < list.length; i++) {
    if (list[i][key] === id) {
      list.splice(i, 1);
      return;
    }
  }
};

const isObject = (data) => {
  return (
    Object.prototype.toString.call(data) === '[object Object]' ||
    Object.prototype.toString.call(data) === '[object Array]'
  );
};

export const deepCopy = (data, map = new WeakMap()) => {
  if (!isObject(data)) return data;
  const res = Array.isArray(data) ? [] : {};

  if (map.has(data)) {
    return map.get(data);
  }
  map.set(data, res);

  Object.keys(data).forEach((key) => {
    if (isObject(data[key])) {
      res[key] = deepCopy(data[key], map);
    } else {
      res[key] = data[key];
    }
  });

  return res;
};
