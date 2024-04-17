import { axiosHttp } from '../request';
import { decodeLyric } from './utils';
import { decodeName } from '../utils';

export const getLyric = async ({ name, hash, _interval }) => {
  const info = await searchLyric(name, hash, _interval);
  if (!info) {
    return Promise.reject(new Error('歌词获取失败'));
  }
  const res = await getLyricDownload(info.id, info.accessKey);

  console.log('获取歌词', res);

  return res;
};

export const searchLyric = async (name, hash, _interval) => {
  const res = await axiosHttp(
    `http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&keyword=${encodeURIComponent(name)}&hash=${hash}&timelength=${_interval}`,
    'get',
    {
      headers: {
        'KG-RC': 1,
        'KG-THash': 'expand_search_manager.cpp:852736169:451',
        'User-Agent': 'KuGou2012-9020-ExpandSearchManager'
      }
    }
  );
  if (res.candidates.length) {
    const info = res.candidates[0];
    return { id: info.id, accessKey: info.accesskey };
  }

  return null;
};

export const getLyricDownload = async (id, accessKey) => {
  const res = await axiosHttp(
    `http://lyrics.kugou.com/download?ver=1&client=pc&id=${id}&accesskey=${accessKey}&fmt=krc&charset=utf8`,
    'get',
    {
      headers: {
        'KG-RC': 1,
        'KG-THash': 'expand_search_manager.cpp:852736169:451',
        'User-Agent': 'KuGou2012-9020-ExpandSearchManager'
      }
    }
  );

  const lyric = await decodeLyric(res.content).then((result) => parseLyric(result));

  return lyric;
};

const headExp = /^.*\[id:\$\w+\]\n/;

const parseLyric = (str) => {
  str = str.replace(/\r/g, '');
  if (headExp.test(str)) str = str.replace(headExp, '');
  const trans = str.match(/\[language:([\w=\\/+]+)\]/);
  let rlyric;
  let tlyric;
  if (trans) {
    str = str.replace(/\[language:[\w=\\/+]+\]\n/, '');
    const json = JSON.parse(Buffer.from(trans[1], 'base64').toString());
    for (const item of json.content) {
      switch (item.type) {
        case 0:
          rlyric = item.lyricContent;
          break;
        case 1:
          tlyric = item.lyricContent;
          break;
      }
    }
  }
  let i = 0;
  let lxlyric = str.replace(/\[((\d+),\d+)\].*/g, (str) => {
    const result = str.match(/\[((\d+),\d+)\].*/);
    let time = parseInt(result[2]);
    const ms = time % 1000;
    time /= 1000;
    const m = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    time %= 60;
    const s = Math.floor(time).toString().padStart(2, '0');
    const t = `${m}:${s}.${ms}`;
    if (rlyric) rlyric[i] = `[${t}]${rlyric[i]?.join('') ?? ''}`;
    if (tlyric) tlyric[i] = `[${t}]${tlyric[i]?.join('') ?? ''}`;
    i++;
    return str.replace(result[1], t);
  });
  rlyric = rlyric ? rlyric.join('\n') : '';
  tlyric = tlyric ? tlyric.join('\n') : '';
  lxlyric = lxlyric.replace(/<(\d+,\d+),\d+>/g, '<$1>');
  lxlyric = decodeName(lxlyric);
  const lyric = lxlyric.replace(/<\d+,\d+>/g, '');
  rlyric = decodeName(rlyric);
  tlyric = decodeName(tlyric);
  return {
    lyric,
    tlyric,
    rlyric,
    lxlyric
  };
};
