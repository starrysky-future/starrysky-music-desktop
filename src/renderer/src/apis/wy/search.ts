import { eapiRequest } from './utils';
import { filterSongList } from './songList';
import { getSinger } from './musicDetail';
import { sizeFormate, formatPlayTime } from '../utils';

const sConfig = {
  limit_song: 30
};

export const searchMusic = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌曲失败');

  let list;
  let total;
  try {
    const res = await eapiRequest('/api/cloudsearch/pc', {
      s: searchInfo,
      type: 1, // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
      limit: sConfig.limit_song,
      total: pageSize == 1,
      offset: sConfig.limit_song * (pageSize - 1)
    });

    if (!res || res.code! !== 200) throw new Error('搜索歌曲失败');

    list = filterMusicList(res.result.songs || []);
    total = res.result.songCount || 0;
    if (!list) throw new Error('搜索歌曲失败');
  } catch (error) {
    return searchMusic(searchInfo, pageSize, tryNum + 1);
  }

  return {
    list: list,
    pageSize: pageSize,
    limit: sConfig.limit_song,
    total,
    source: 'wy'
  };
};

export const searchSongList = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌单失败');

  let res;
  try {
    res = await eapiRequest('/api/cloudsearch/pc', {
      s: searchInfo,
      type: 1000, // 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频
      limit: sConfig.limit_song,
      total: pageSize == 1,
      offset: sConfig.limit_song * (pageSize - 1)
    });
    console.log('歌单', res);
  } catch (error) {
    return searchSongList(searchInfo, pageSize, tryNum + 1);
  }

  return {
    list: filterSongList(res.result.playlists),
    limit: sConfig.limit_song,
    total: res.result.playlistCount,
    source: 'wy'
  };
};

const filterMusicList = (rawList) => {
  if (!rawList) return [];
  return rawList.map((item) => {
    const types: Array<SKY.Apis.Types> = [];
    const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };
    let size;

    if (item.privilege.maxBrLevel == 'hires') {
      size = item.hr ? sizeFormate(item.hr.size) : null;
      types.push({ type: 'flac24bit', size });
      _types.flac24bit = {
        size
      };
    }
    switch (item.privilege.maxbr) {
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

    types.reverse();

    return {
      singer: getSinger(item.ar),
      name: item.name,
      albumName: item.al.name,
      albumId: item.al.id,
      source: 'wy',
      interval: formatPlayTime(item.dt / 1000),
      _interval: item.dt,
      songmid: item.id,
      img: item.al.picUrl,
      lrc: null,
      types,
      _types,
      typeUrl: {}
    };
  });
};
