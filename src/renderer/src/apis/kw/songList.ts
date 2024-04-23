import http from '../request';
import { formatPlayCount } from '@r/utils';
import { decodeName, formatPlayTime } from '../utils';

export const config = {
  sortList: [
    {
      name: '最新',
      id: 'new'
    },
    {
      name: '最热',
      id: 'hot'
    }
  ],
  pageNo: 30,
  limit_song: 100000,
  regExps: {
    mInfo: /level:(\w+),bitrate:(\d+),format:(\w+),size:([\w.]+)/,
    listDetailLink: /^.+\/playlist(?:_detail)?\/(\d+)(?:\?.*|&.*$|#.*$|$)/
  }
};

export const getSongList = async (sortId, tagId, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('歌单列表获取失败');
  let id;
  let type;
  if (tagId) {
    const arr = tagId.split('-');
    id = arr[0];
    type = arr[1];
  } else {
    id = null;
  }

  let res;
  try {
    res = await http(getListUrl({ sortId, id, type, pageSize }), 'get', {});
  } catch (error) {
    return getSongList(sortId, tagId, pageSize, tryNum + 1);
  }

  if (!id || type == '10000') {
    return {
      list: filterList(res.data.data),
      total: res.data.total,
      page: res.data.pn,
      limit: res.data.rn,
      source: 'kw'
    };
  }
  return {
    list: filterList2(res),
    total: 1000,
    pageSize,
    limit: 1000,
    source: 'kw'
  };
};

export const getSongListDetail = (id, pageSize, tryNum = 0) => {
  if (/[?&:/]/.test(id)) id = id.replace(config.regExps.listDetailLink, '$1');
  else if (/^digest-/.test(id)) {
    const idArr = id.split('__');
    id = idArr[1];
    let digest = idArr[0];

    digest = digest.replace('digest-', '');
    switch (digest) {
      case '8':
        break;
      case '13':
        return getAlbumListDetail(id, pageSize, tryNum);
      case '5':
      default:
        return getListDetailDigest5(id, pageSize, tryNum);
    }
  }
  return getSongListDetailDigest8(id, pageSize, tryNum);
};

const getSongListDetailDigest8 = async (id, pageSize, tryNum) => {
  if (tryNum > 2) throw new Error('歌单详情列表获取失败');

  let res;
  try {
    res = await http(
      `http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=${id}&pn=${pageSize - 1}&rn=${config.limit_song}&encode=utf8&keyset=pl2012&identity=kuwo&pcmp4=1&vipver=MUSIC_9.0.5.0_W1&newver=1`,
      'get',
      {}
    );
    if (res.result !== 'ok') throw new Error('再次请求');
  } catch (error) {
    return getSongListDetail(id, pageSize, tryNum + 1);
  }

  return {
    list: {
      list: filterListDetail(res.musiclist),
      info: {
        name: res.title,
        img: res.pic,
        desc: res.info,
        author: res.uname,
        play_count: formatPlayCount(res.playnum)
      }
    },
    pageSize,
    limit: res.rn,
    total: res.total,
    source: 'kw'
  };
};

const getAlbumListDetail = async (id, pageSize, tryNum) => {
  if (tryNum > 2) throw new Error('歌单详情列表获取失败');

  let res;
  try {
    res = await http(
      `http://search.kuwo.cn/r.s?pn=${pageSize - 1}&rn=${config.limit_song}&stype=albuminfo&albumid=${id}&show_copyright_off=0&encoding=utf&vipver=MUSIC_9.1.0`,
      'get',
      {}
    );
  } catch (error) {
    return getAlbumListDetail(id, pageSize, tryNum + 1);
  }

  res = objStr2JSON(res);
  res.name = decodeName(res.name);
  return {
    list: {
      list: albumfilterListDetail(res.musiclist, res.name, res.albumid),
      info: {
        name: res.name,
        img: res.img || res.hts_img,
        desc: decodeName(res.info),
        author: decodeName(res.artist)
      }
    },
    pageSize,
    limit: config.limit_song,
    total: parseInt(res.songnum),
    source: 'kw'
  };
};

const getListDetailDigest5 = async (id, pageSize, tryNum) => {
  const detailId = await getListDetailDigest5Info(id, tryNum);
  return getListDetailDigest5Music(detailId, pageSize, tryNum);
};

const getListDetailDigest5Info = async (id, tryNum) => {
  if (tryNum > 2) throw new Error('歌单详情列表获取失败');

  let res;
  try {
    res = await http(
      `http://qukudata.kuwo.cn/q.k?op=query&cont=ninfo&node=${id}&pn=0&rn=1&fmt=json&src=mbox&level=2`,
      'get',
      {}
    );
  } catch (error) {
    return getListDetailDigest5Info(id, tryNum + 1);
  }

  return res.child.length ? res.child[0].sourceid : null;
};
const getListDetailDigest5Music = async (id, pageSize, tryNum) => {
  if (tryNum > 2) throw new Error('歌单详情列表获取失败');

  let res;
  try {
    res = await http(
      `http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=${id}&pn=${pageSize - 1}}&rn=${config.limit_song}&encode=utf-8&keyset=pl2012&identity=kuwo&pcmp4=1`,
      'get',
      {}
    );
  } catch (error) {
    return getListDetailDigest5Music(id, pageSize, tryNum + 1);
  }

  return {
    list: {
      list: filterListDetail(res.musiclist),
      info: {
        name: res.title,
        img: res.pic,
        desc: res.info,
        author: res.uname,
        play_count: formatPlayCount(res.playnum)
      }
    },
    pageSize,
    limit: res.rn,
    total: res.total,
    source: 'kw'
  };
};

export const objStr2JSON = (str) => {
  return JSON.parse(
    str.replace(/('(?=(,\s*')))|('(?=:))|((?<=([:,]\s*))')|((?<={)')|('(?=}))/g, '"')
  );
};

const filterList = (rawData) => {
  return rawData.map((item) => ({
    play_count: formatPlayCount(item.listencnt),
    id: `digest-${item.digest}__${item.id}`,
    author: item.uname,
    name: item.name,
    time: item.publish_time || '',
    total: item.total,
    img: item.img,
    grade: item.favorcnt / 10,
    desc: item.info,
    source: 'kw'
  }));
};

const filterList2 = (rawData) => {
  const list: Array<SKY.SongList.ListItemType> = [];
  rawData.forEach((item) => {
    if (!item.label) return;
    list.push(
      ...item.list.map((item) => ({
        play_count: item.play_count && formatPlayCount(item.listencnt),
        id: `digest-${item.digest}__${item.id}`,
        author: item.uname,
        name: item.name,
        total: item.total,
        time: item.publish_time || '',
        img: item.img,
        grade: item.favorcnt && item.favorcnt / 10,
        desc: item.info,
        source: 'kw'
      }))
    );
  });
  return list;
};

const formatSinger = (rawData) => rawData.replace(/&/g, '、');

const filterListDetail = (rawData) => {
  return rawData.map((item) => {
    const infoArr = item.N_MINFO.split(';');
    const types: Array<SKY.Apis.Types> = [];
    const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };
    for (let info of infoArr) {
      info = info.match(config.regExps.mInfo);
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

    return {
      singer: formatSinger(decodeName(item.artist)),
      name: decodeName(item.name),
      albumName: decodeName(item.album),
      albumId: item.albumid,
      songmid: item.id,
      source: 'kw',
      interval: formatPlayTime(parseInt(item.duration)),
      _interval: item.duration * 1000,
      img: null,
      lrc: null,
      otherSource: null,
      types,
      _types,
      typeUrl: {}
    };
  });
};

const albumfilterListDetail = (rawList, albumName, albumId) => {
  return rawList.map((item) => {
    const formats = item.formats.split('|');
    const types: Array<SKY.Apis.Types> = [];
    const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };
    if (formats.includes('MP3128')) {
      types.push({ type: '128k', size: '' });
      _types['128k'] = {
        size: null
      };
    }
    if (formats.includes('MP3H')) {
      types.push({ type: '320k', size: '' });
      _types['320k'] = {
        size: null
      };
    }
    if (formats.includes('ALFLAC')) {
      types.push({ type: 'flac', size: '' });
      _types.flac = {
        size: null
      };
    }
    if (formats.includes('HIRFLAC')) {
      types.push({ type: 'flac24bit', size: '' });
      _types.flac24bit = {
        size: null
      };
    }
    return {
      singer: formatSinger(decodeName(item.artist)),
      name: decodeName(item.name),
      albumName,
      albumId,
      songmid: item.id,
      source: 'kw',
      interval: null,
      _interval: 0,
      img: item.pic,
      lrc: null,
      otherSource: null,
      types,
      _types,
      typeUrl: {}
    };
  });
};

const getListUrl = ({ sortId, id, type, pageSize }) => {
  if (!id)
    return `http://wapi.kuwo.cn/api/pc/classify/playlist/getRcmPlayList?loginUid=0&loginSid=0&appUid=76039576&&pn=${pageSize}&rn=${config.pageNo}&order=${sortId}`;
  switch (type) {
    case '10000':
      return `http://wapi.kuwo.cn/api/pc/classify/playlist/getTagPlayList?loginUid=0&loginSid=0&appUid=76039576&pn=${pageSize}&id=${id}&rn=${config.pageNo}`;
    default: //43
      return `http://mobileinterfaces.kuwo.cn/er.s?type=get_pc_qz_data&f=web&id=${id}&prod=pc`;
  }
};
