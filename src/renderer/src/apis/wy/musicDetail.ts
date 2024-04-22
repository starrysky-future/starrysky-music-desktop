import http from '../request';
import { weapi } from '../crypto';
import { sizeFormate, formatPlayTime } from '../utils';

// 获取歌曲详情列表
export const getMusicList = async (ids: Array<string> = [], tryNum) => {
  if (tryNum > 2) throw new Error('歌单详情列表获取失败');

  let res;
  try {
    res = await http('https://music.163.com/weapi/v3/song/detail', 'post', {
      headers: {
        myUA: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
        myOrigin: 'https://music.163.com',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: weapi({
        c: '[' + ids.map((id) => '{"id":' + id + '}').join(',') + ']',
        ids: '[' + ids.join(',') + ']'
      })
    });
  } catch (error) {
    return getMusicList(ids, tryNum + 1);
  }

  return filterMusicList(res.songs, res.privileges);
};

// 获取单个歌曲信息
export const getMusicInfo = async (songmid: string) => {
  const res = await http('https://music.163.com/weapi/v3/song/detail', 'post', {
    headers: {
      myUA: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
      myReferer: 'https://music.163.com/song?id=' + songmid,
      myOrigin: 'https://music.163.com',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: weapi({
      c: `[{"id":${songmid}}]`,
      ids: `[${songmid}]`
    })
  });

  return res.songs[0];
};

export const getSinger = (singers) => {
  const arr: Array<string> = [];
  singers?.forEach((singer) => {
    arr.push(singer.name);
  });
  return arr.join('、');
};

export const filterMusicList = (songs, privileges) => {
  const list: Array<SKY.MusicListItem> = [];
  songs.forEach((item, index) => {
    const types: Array<SKY.Apis.Types> = [];
    const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };
    let size;
    let privilege = privileges[index];
    if (privilege.id !== item.id) privilege = privileges.find((p) => p.id === item.id);
    if (!privilege) return;

    if (privilege.maxBrLevel == 'hires') {
      size = item.hr ? sizeFormate(item.hr.size) : null;
      types.push({ type: 'flac24bit', size });
      _types.flac24bit = {
        size
      };
    }
    switch (privilege.maxbr) {
      case 999000:
        size = item.sq ? sizeFormate(item.sq.size) : null;
        types.push({ type: 'flac', size });
        _types.flac = {
          size
        };
        break;
      case 320000:
        size = item.h ? sizeFormate(item.h.size) : null;
        types.push({ type: '320k', size });
        _types['320k'] = {
          size
        };
        break;
      case 192000:
      case 128000:
        size = item.l ? sizeFormate(item.l.size) : null;
        types.push({ type: '128k', size });
        _types['128k'] = {
          size
        };
    }

    list.push({
      singer: getSinger(item.ar),
      name: item.name ?? '',
      albumName: item.al?.name,
      albumId: item.al?.id,
      source: 'wy',
      interval: formatPlayTime(item.dt / 1000),
      _interval: item.dt,
      songmid: item.id,
      img: item.al?.picUrl,
      lrc: null,
      otherSource: null,
      types,
      _types,
      typeUrl: {}
    });
  });
  return list;
};
