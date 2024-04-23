import http from '../request';
import { md5 } from '../crypto';
import { formatPlayCount, dateFormat } from '@r/utils';
import { sizeFormate, formatSingerName, formatPlayTime } from '../utils';

const sConfig = {
  limit_song: 30
};

const createSignature = (time, str) => {
  const deviceId = '963B7AA0D21511ED807EE5846EC87D20';
  const signatureMd5 = '6cdc72a439cef99a3418d2a78aa28c73';
  const sign = md5(`${str}${signatureMd5}yyapp2d16148780a1dcc7408e06336b98cfd50${deviceId}${time}`);
  return { sign, deviceId };
};

export const searchMusic = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌曲失败');

  let res;
  try {
    const time = Date.now().toString();
    const signData = createSignature(time, searchInfo);
    res = await http(
      `https://jadeite.migu.cn/music_search/v3/search/searchAll?isCorrect=0&isCopyright=1&searchSwitch=%7B%22song%22%3A1%2C%22album%22%3A0%2C%22singer%22%3A0%2C%22tagSong%22%3A1%2C%22mvSong%22%3A0%2C%22bestShow%22%3A1%2C%22songlist%22%3A0%2C%22lyricSong%22%3A0%7D&pageSize=${sConfig.limit_song}&text=${encodeURIComponent(searchInfo)}&pageNo=${pageSize}&sort=0&sid=USS`,
      'get',
      {
        headers: {
          uiVersion: 'A_music_3.6.1',
          deviceId: signData.deviceId,
          timestamp: time,
          sign: signData.sign,
          channel: '0146921',
          myUA: 'Mozilla/5.0 (Linux; U; Android 11.0.0; zh-cn; MI 11 Build/OPR1.170623.032) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
        }
      }
    );
    console.log('搜索歌曲', res);
  } catch (error) {
    return searchMusic(searchInfo, pageSize, tryNum + 1);
  }

  return {
    list: filterMusicList(res.songResultData.resultList),
    pageSize: pageSize,
    limit: sConfig.limit_song,
    total: res.songResultData.totalCount,
    source: 'mg'
  };
};

export const searchSongList = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌单失败');

  let res;
  try {
    const timeStr = Date.now().toString();
    const signResult = createSignature(timeStr, searchInfo);
    res = await http(
      `https://jadeite.migu.cn/music_search/v3/search/searchAll?isCorrect=1&isCopyright=1&searchSwitch=%7B%22song%22%3A0%2C%22album%22%3A0%2C%22singer%22%3A0%2C%22tagSong%22%3A0%2C%22mvSong%22%3A0%2C%22bestShow%22%3A0%2C%22songlist%22%3A1%2C%22lyricSong%22%3A0%7D&pageSize=${sConfig.limit_song}&text=${encodeURIComponent(searchInfo)}&pageNo=${pageSize}&sort=0`,
      'get',
      {
        headers: {
          uiVersion: 'A_music_3.6.1',
          deviceId: signResult.deviceId,
          timestamp: timeStr,
          sign: signResult.sign,
          channel: '0146921',
          myUA: 'Mozilla/5.0 (Linux; U; Android 11.0.0; zh-cn; MI 11 Build/OPR1.170623.032) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
        }
      }
    );
    console.log('搜索歌单', res);
    if (
      res.statusCode !== 200 ||
      (res.code !== undefined
        ? res.code
        : res.returnCode !== undefined
          ? res.returnCode
          : res.code) !== '000000'
    )
      throw new Error('搜索歌单失败');
  } catch (error) {
    return searchSongList(searchInfo, pageSize, tryNum + 1);
  }

  return {
    list: filterSongList(res.songListResultData.result),
    limit: sConfig.limit_song,
    total: parseInt(res.songListResultData.totalCount),
    source: 'mg'
  };
};

const filterMusicList = (rawData) => {
  const list: Array<SKY.MusicListItem> = [];
  const ids = new Set();

  rawData.forEach((item) => {
    item.forEach((data) => {
      if (!data.songId || !data.copyrightId || ids.has(data.copyrightId)) return;
      ids.add(data.copyrightId);

      const types: Array<SKY.Apis.Types> = [];
      const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };
      data.audioFormats &&
        data.audioFormats.forEach((type) => {
          let size;
          switch (type.formatType) {
            case 'PQ':
              size = sizeFormate(type.asize ?? type.isize);
              types.push({ type: '128k', size });
              _types['128k'] = {
                size
              };
              break;
            case 'HQ':
              size = sizeFormate(type.asize ?? type.isize);
              types.push({ type: '320k', size });
              _types['320k'] = {
                size
              };
              break;
            case 'SQ':
              size = sizeFormate(type.asize ?? type.isize);
              types.push({ type: 'flac', size });
              _types.flac = {
                size
              };
              break;
            case 'ZQ24':
              size = sizeFormate(type.asize ?? type.isize);
              types.push({ type: 'flac24bit', size });
              _types.flac24bit = {
                size
              };
              break;
          }
        });

      let img = data.img3 || data.img2 || data.img1 || null;
      if (img && !/https?:/.test(data.img3)) img = 'http://d.musicapp.migu.cn' + img;

      list.push({
        singer: formatSingerName(data.singerList),
        name: data.name,
        albumName: data.album,
        albumId: data.albumId,
        songmid: data.songId,
        copyrightId: data.copyrightId,
        source: 'mg',
        interval: formatPlayTime(data.duration),
        _interval: data.duration * 1000,
        img,
        lrc: null,
        lrcUrl: data.lrcUrl,
        mrcUrl: data.mrcurl,
        trcUrl: data.trcUrl,
        otherSource: null,
        types,
        _types,
        typeUrl: {}
      });
    });
  });
  return list;
};

const filterSongList = (raw) => {
  const list: SKY.SongList.ListType = [];
  raw.forEach((item) => {
    if (!item.id) return;

    const playCount = parseInt(item.playNum);
    list.push({
      play_count: (isNaN(playCount) ? 0 : formatPlayCount(playCount)) as number,
      id: item.id,
      author: item.userName,
      name: item.name,
      time: dateFormat(item.createTime, 'Y-M-D'),
      img: item.musicListPicUrl,
      grade: item.grade,
      total: item.musicNum,
      desc: item.summary,
      source: 'mg'
    });
  });
  return list;
};
