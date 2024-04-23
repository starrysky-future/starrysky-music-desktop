import http from '../request';
import { decodeName, sizeFormate, formatSingerName, formatPlayTime } from '../utils';
import { filterList as filterSongList } from './songList';

const sConfig = {
  limit_song: 30
};

export const searchMusic = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌曲失败');

  let res;
  try {
    res = await http(
      `https://songsearch.kugou.com/song_search_v2?keyword=${encodeURIComponent(searchInfo)}&page=${pageSize}&pagesize=${sConfig.limit_song}&userid=0&clientver=&platform=WebFilter&filter=2&iscorrection=1&privilege_filter=0&area_code=1`
    );

    console.log('搜索歌曲', res);
  } catch (error) {
    return searchMusic(searchInfo, pageSize, tryNum + 1);
  }

  return {
    list: filterMusicList(res.data.lists),
    pageSize: pageSize,
    limit: sConfig.limit_song,
    total: res.data.total,
    source: 'kg'
  };
};

export const searchSongList = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌单失败');

  let res;
  try {
    res = await http(
      `http://msearchretry.kugou.com/api/v3/search/special?keyword=${encodeURIComponent(searchInfo)}&page=${pageSize}&pagesize=${sConfig.limit_song}&showtype=10&filter=0&version=7910&sver=2`
    );
    console.log('搜索歌单', res);
  } catch (error) {
    return searchSongList(searchInfo, pageSize, tryNum + 1);
  }

  return {
    list: filterSongList(res.data.info),
    limit: sConfig.limit_song,
    total: res.data.total,
    source: 'kg'
  };
};

const filterData = (rawData) => {
  const types: Array<SKY.Apis.Types_kg> = [];
  const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };
  if (rawData.FileSize !== 0) {
    const size = sizeFormate(rawData.FileSize);
    types.push({ type: '128k', size, hash: rawData.FileHash });
    _types['128k'] = {
      size,
      hash: rawData.FileHash
    };
  }
  if (rawData.HQFileSize !== 0) {
    const size = sizeFormate(rawData.HQFileSize);
    types.push({ type: '320k', size, hash: rawData.HQFileHash });
    _types['320k'] = {
      size,
      hash: rawData.HQFileHash
    };
  }
  if (rawData.SQFileSize !== 0) {
    const size = sizeFormate(rawData.SQFileSize);
    types.push({ type: 'flac', size, hash: rawData.SQFileHash });
    _types.flac = {
      size,
      hash: rawData.SQFileHash
    };
  }
  if (rawData.ResFileSize !== 0) {
    const size = sizeFormate(rawData.ResFileSize);
    types.push({ type: 'flac24bit', size, hash: rawData.ResFileHash });
    _types.flac24bit = {
      size,
      hash: rawData.ResFileHash
    };
  }
  return {
    singer: decodeName(formatSingerName(rawData.Singers, 'name')),
    name: decodeName(rawData.SongName),
    albumName: decodeName(rawData.AlbumName),
    albumId: rawData.AlbumID,
    songmid: rawData.Audioid,
    source: 'kg',
    interval: formatPlayTime(rawData.Duration),
    _interval: rawData.Duration * 1000,
    img: '',
    lrc: null,
    otherSource: null,
    hash: rawData.FileHash,
    types,
    _types,
    typeUrl: {}
  };
};
const filterMusicList = (rawData) => {
  const ids = new Set();
  const list: Array<SKY.MusicListItem> = [];
  rawData.forEach((item) => {
    const key = item.Audioid + item.FileHash;
    if (ids.has(key)) return;
    ids.add(key);
    list.push(filterData(item));
    for (const childItem of item.Grp) {
      const key = item.Audioid + item.FileHash;
      if (ids.has(key)) continue;
      ids.add(key);
      list.push(filterData(childItem));
    }
  });
  return list;
};
