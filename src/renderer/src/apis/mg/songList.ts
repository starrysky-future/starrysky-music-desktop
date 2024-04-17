import { axiosHttp } from '../request';
import { formatPlayCount, dateFormat } from '@r/utils';
import { sizeFormate, formatSingerName, getPlayTime } from '../utils';

export const config = {
  sortList: [
    {
      name: '推荐',
      id: '15127315'
    },
    {
      name: '最新',
      id: '15127272'
    }
  ],
  regExps: {
    list: /<li><div class="thumb">.+?<\/li>/g,
    listInfo:
      /.+data-original="(.+?)".*data-id="(\d+)".*<div class="song-list-name"><a\s.*?>(.+?)<\/a>.+<i class="iconfont cf-bofangliang"><\/i>(.+?)<\/div>/,

    // https://music.migu.cn/v3/music/playlist/161044573?page=1
    listDetailLink: /^.+\/playlist\/(\d+)(?:\?.*|&.*$|#.*$|$)/
  },
  cachedUrl: {},
  pageNo: 10,
  limit_song: 50
};

export const getSongList = async (sortId, tagId, page) => {
  const res = await axiosHttp(getSongListUrl(sortId, tagId, page), 'get', {});

  return {
    list: filterList(res.retMsg.playlist),
    total: parseInt(res.retMsg.countSize),
    page,
    limit: config.pageNo,
    source: 'mg'
  };
};

export const getSongListDetail = async (id, page) => {
  console.log(111);

  const res = await new Promise((resolve, reject) => {
    Promise.all([getSongListDetailList(id, page), getListDetailInfo(id)])
      .then(([listData, info]) => {
        listData.list.info = info;
        resolve(listData);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return res;
};

const getSongListDetailList = async (id, page) => {
  const res = await axiosHttp(
    `https://app.c.nf.migu.cn/MIGUM2.0/v1.0/user/queryMusicListSongs.do?musicListId=${id}&pageNo=${page}&pageSize=${config.limit_song}`,
    'get',
    {}
  );

  return {
    list: { list: filterMusicInfoList(res.list), info: {} },
    page,
    limit: config.limit_song,
    total: res.totalCount,
    source: 'mg'
  };
};

const getListDetailInfo = async (id) => {
  const res = await axiosHttp(
    `https://c.musicapp.migu.cn/MIGUM3.0/resource/playlist/v2.0?playlistId=${id}`,
    'get',
    {}
  );

  return {
    name: res.data.title,
    img: res.data.imgItem.img,
    desc: res.data.summary,
    author: res.data.ownerName,
    play_count: formatPlayCount(res.data.opNumItem.playNum)
  };
};

const getSongListUrl = (sortId, tagId, pageSize) => {
  if (!tagId) {
    return `https://m.music.migu.cn/migu/remoting/playlist_bycolumnid_tag?playListType=2&type=1&columnId=${sortId}&startIndex=${(pageSize - 1) * config.pageNo}`;
  }
  return `https://m.music.migu.cn/migu/remoting/playlist_bycolumnid_tag?playListType=2&type=1&tagId=${tagId}&startIndex=${(pageSize - 1) * config.pageNo}`;
};

const filterList = (rawData) => {
  return rawData.map((item) => ({
    play_count: formatPlayCount(item.playCount),
    id: String(item.playListId),
    author: item.createName,
    name: item.playListName,
    time: dateFormat(item.createTime, 'Y-M-D'),
    img: item.image,
    grade: item.grade,
    total: item.contentCount,
    desc: item.summary,
    source: 'mg'
  }));
};

export const filterMusicInfoList = (rawList) => {
  const ids = new Set();
  const list: Array<SKY.SongList.MusicListItem> = [];
  rawList.forEach((item) => {
    if (!item.songId || ids.has(item.songId)) return;
    ids.add(item.songId);
    const types: Array<SKY.Apis.Types> = [];
    const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };
    item.newRateFormats?.forEach((type) => {
      let size;
      switch (type.formatType) {
        case 'PQ':
          size = sizeFormate(type.size ?? type.androidSize);
          types.push({ type: '128k', size });
          _types['128k'] = {
            size
          };
          break;
        case 'HQ':
          size = sizeFormate(type.size ?? type.androidSize);
          types.push({ type: '320k', size });
          _types['320k'] = {
            size
          };
          break;
        case 'SQ':
          size = sizeFormate(type.size ?? type.androidSize);
          types.push({ type: 'flac', size });
          _types.flac = {
            size
          };
          break;
        case 'ZQ':
          size = sizeFormate(type.size ?? type.androidSize);
          types.push({ type: 'flac24bit', size });
          _types.flac24bit = {
            size
          };
          break;
      }
    });

    const intervalTest = /(\d\d:\d\d)$/.test(item.length);

    list.push({
      singer: formatSingerName(item.artists, 'name'),
      name: item.songName,
      albumName: item.album,
      albumId: item.albumId,
      songmid: item.songId,
      copyrightId: item.copyrightId,
      source: 'mg',
      interval: intervalTest ? RegExp.$1 : '',
      _interval: getPlayTime(item.length),
      img: item.albumImgs?.length ? item.albumImgs[0].img : null,
      lrc: null,
      lrcUrl: item.lrcUrl,
      mrcUrl: item.mrcUrl,
      trcUrl: item.trcUrl,
      otherSource: null,
      types,
      _types,
      typeUrl: {}
    });
  });
  return list;
};
