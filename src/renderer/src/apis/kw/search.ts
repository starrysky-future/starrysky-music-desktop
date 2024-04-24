import http from '../request';
import { decodeName, formatSinger, formatPlayTime } from '../utils';
import { formatPlayCount } from '@r/utils';
import { objStr2JSON } from './songList';

const sConfig = {
  limit_song: 30,
  regExps: {
    mInfo: /level:(\w+),bitrate:(\d+),format:(\w+),size:([\w.]+)/
  }
};

export const searchMusic = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌曲失败');

  let res;
  try {
    res = await http(
      `http://search.kuwo.cn/r.s?client=kt&all=${encodeURIComponent(searchInfo)}&pn=${pageSize - 1}&rn=${sConfig.limit_song}&uid=794762570&ver=kwplayer_ar_9.2.2.1&vipver=1&show_copyright_off=1&newver=1&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&vermerge=1&mobi=1&issubtitle=1`
    );
  } catch (error) {
    return searchMusic(searchInfo, pageSize, tryNum + 1);
  }

  return {
    list: filterMusicList(res.abslist),
    pageSize: pageSize,
    limit: sConfig.limit_song,
    total: res.TOTAL,
    source: 'kw'
  };
};

export const searchSongList = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌单失败');

  let res;
  try {
    res = await http(
      `http://search.kuwo.cn/r.s?all=${encodeURIComponent(searchInfo)}&pn=${pageSize - 1}&rn=${sConfig.limit_song}&rformat=json&encoding=utf8&ver=mbox&vipver=MUSIC_8.7.7.0_BCS37&plat=pc&devid=28156413&ft=playlist&pay=0&needliveshow=0`
    );
    res = objStr2JSON(res);
  } catch (error) {
    return searchSongList(searchInfo, pageSize, tryNum + 1);
  }

  return {
    list: filterSongList(res.abslist),
    limit: sConfig.limit_song,
    total: parseInt(res.TOTAL),
    source: 'kw'
  };
};

const filterMusicList = (rawData) => {
  const result: Array<SKY.MusicListItem> = [];
  if (!rawData) return result;
  for (let i = 0; i < rawData.length; i++) {
    const info = rawData[i];
    const songId = info.MUSICRID.replace('MUSIC_', '');

    if (!info.N_MINFO) {
      console.log('N_MINFO is undefined');
      return null;
    }

    const types: Array<SKY.Apis.Types> = [];
    const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };

    const infoArr = info.N_MINFO.split(';');
    for (let info of infoArr) {
      info = info.match(sConfig.regExps.mInfo);
      if (info) {
        switch (info[2]) {
          case '4000':
            types.push({ type: 'flac24bit', size: info[4] });
            _types.flac24bit = {
              size: info[4].toLocaleUpperCase()
            };
            break;
          case '2000':
            types.push({ type: 'flac', size: info[4] });
            _types.flac = {
              size: info[4].toLocaleUpperCase()
            };
            break;
          case '320':
            types.push({ type: '320k', size: info[4] });
            _types['320k'] = {
              size: info[4].toLocaleUpperCase()
            };
            break;
          case '128':
            types.push({ type: '128k', size: info[4] });
            _types['128k'] = {
              size: info[4].toLocaleUpperCase()
            };
            break;
        }
      }
    }

    const interval = parseInt(info.DURATION);

    result.push({
      name: decodeName(info.SONGNAME),
      singer: formatSinger(decodeName(info.ARTIST)),
      source: 'kw',
      img: '',
      songmid: songId,
      albumId: decodeName(info.ALBUMID || ''),
      interval: (Number.isNaN(interval) ? 0 : formatPlayTime(interval)) as string,
      _interval: Number.isNaN(interval) ? 0 : interval * 1000,
      albumName: info.ALBUM ? decodeName(info.ALBUM) : '',
      lrc: null,
      otherSource: null,
      types,
      _types,
      typeUrl: {}
    });
  }
  return result;
};

const filterSongList = (data) => {
  return data.map((item) => {
    return {
      play_count: formatPlayCount(item.playcnt),
      id: String(item.playlistid),
      author: decodeName(item.nickname),
      name: decodeName(item.name),
      total: item.songnum,
      time: item.publish_time,
      img: item.pic,
      desc: decodeName(item.intro),
      source: 'kw'
    };
  });
};
