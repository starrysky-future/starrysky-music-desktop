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
    // @ts-ignore
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
    if (list[l][key] === data[key]) {
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
  return reply;
};

/**
 * 数据插入数组
 * @param list 插入的数组
 * @param data 插入的数据
 * @param key 检索数据的key
 * @param id 当前索引
 * @param isCollect 是否收藏界面
 * @returns 是否改变当前索引位置
 */
export const insertList = (list, data, key: string, id: number, isCollect?) => {
  console.log(id);
  list.splice(id + 1, 0, data);
  const reply = unique(list, data, key);

  if (typeof reply === 'number') {
    list.splice(reply, 1);

    if (isCollect && reply < id) {
      return true;
    }
  }

  return false;
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
 * @param key 检索数据的key
 * @param id 移除数据的id
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

/**
 * 深拷贝
 * @param data
 * @param map
 * @returns
 */
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

/**
 * 生成一个16位的随机数
 * @returns
 */
export const generateRandom16 = () => {
  const maxNumber = 10000000000000000; // 十六位的最大数
  const minNumber = 1000000000000000; // 十六位的最小数
  const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
  return randomNumber.toString();
};

/**
 * 格式化数据大小
 * @param limit
 * @returns
 */
export const formatSize = (limit) => {
  let size = '';
  if (limit < 1 * 1024) {
    //小于1KB，则转化成B
    size = limit.toFixed(2) + 'B';
  } else if (limit < 1 * 1024 * 1024) {
    //小于1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB';
  } else if (limit < 1 * 1024 * 1024 * 1024) {
    //小于1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }

  const sizeStr = size + ''; //转成字符串
  const index = sizeStr.indexOf('.'); //获取小数点处的索引
  const dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
  if (dou == '00') {
    //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2);
  }
  return size;
};
