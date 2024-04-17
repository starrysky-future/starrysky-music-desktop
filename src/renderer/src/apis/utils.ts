import dns from 'dns';

const ipMap = new Map();
export const getHostIp = (hostname) => {
  const result = ipMap.get(hostname);
  if (typeof result === 'object') return result;
  if (result === true) return;
  ipMap.set(hostname, true);
  dns.lookup(
    hostname,
    {
      all: false
    },
    (err, address, family) => {
      if (err) return console.log(err);
      ipMap.set(hostname, { address, family });
    }
  );
};

export const dnsLookup = (hostname, options, callback) => {
  const result = getHostIp(hostname);
  if (result) return callback(null, result.address, result.family);

  dns.lookup(hostname, options, callback);
};

const encodeNames = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#039;': "'"
};
export const decodeName = (str = '') => {
  return (
    str?.replace(/(?:&amp;|&lt;|&gt;|&quot;|&apos;|&#039;|&nbsp;)/gm, (s) => encodeNames[s]) ?? ''
  );
};

export const formatSinger = (rawData) => rawData.replace(/&/g, '、');

/**
 * 格式化歌手
 * @param singers 歌手数组
 * @param nameKey 歌手名键值
 * @param join 歌手分割字符
 */
export const formatSingerName = (singers, nameKey = 'name', join = '、') => {
  if (Array.isArray(singers)) {
    const singer: Array<string> = [];
    singers.forEach((item) => {
      const name = item[nameKey];
      if (!name) return;
      singer.push(name);
    });
    return decodeName(singer.join(join));
  }
  return decodeName(String(singers ?? ''));
};

export const sizeFormate = (size) => {
  if (!size) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const number = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, Math.floor(number))).toFixed(2)} ${units[number]}`;
};

const numFix = (n) => (n < 10 ? `0${n}` : n.toString());

export const formatPlayTime = (time) => {
  const m = Math.trunc(time / 60);
  const s = Math.trunc(time % 60);
  return m == 0 && s == 0 ? '--/--' : numFix(m) + ':' + numFix(s);
};

export const getPlayTime = (time) => {
  if (!/(\d\d:\d\d:\d\d)$/.test(time)) return time;
  const [h, m, s] = time.split(':');
  console.log(time);

  return (~~h * 60 * 60 + ~~m * 60 + ~~s) * 1000;
};

// kg
export const filterImg = (img) => {
  if (!img) return '';
  return img.replace(/\{size\}/, 240);
};
