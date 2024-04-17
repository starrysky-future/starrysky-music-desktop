import { axiosHttp } from '../request';
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

export const getSongList = async (sortId, tagId, pageSize) => {
  let id;
  let type;
  if (tagId) {
    const arr = tagId.split('-');
    id = arr[0];
    type = arr[1];
  } else {
    id = null;
  }

  const res = await axiosHttp(getListUrl({ sortId, id, type, pageSize }), 'get', {});

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

export const getSongListDetail = async (id, page) => {
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
        return getAlbumListDetail(id, page);
      case '5':
      default:
        return getListDetailDigest5(id, page);
    }
  }
  return getSongListDetailDigest8(id, page);
};

const getSongListDetailDigest8 = async (id, page) => {
  const res = await axiosHttp(
    `http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=${id}&pn=${page - 1}&rn=${config.limit_song}&encode=utf8&keyset=pl2012&identity=kuwo&pcmp4=1&vipver=MUSIC_9.0.5.0_W1&newver=1`,
    'get',
    {}
  );

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
    page,
    limit: res.rn,
    total: res.total,
    source: 'kw'
  };
};

const getAlbumListDetail = async (id, page) => {
  let res = await axiosHttp(
    `http://search.kuwo.cn/r.s?pn=${page - 1}&rn=${config.limit_song}&stype=albuminfo&albumid=${id}&show_copyright_off=0&encoding=utf&vipver=MUSIC_9.1.0`,
    'get',
    {}
  );
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
    page,
    limit: config.limit_song,
    total: parseInt(res.songnum),
    source: 'kw'
  };
};

const getListDetailDigest5 = async (id, page) => {
  const detailId = await getListDetailDigest5Info(id);
  return getListDetailDigest5Music(detailId, page);
};

const getListDetailDigest5Info = async (id) => {
  const res = await axiosHttp(
    `http://qukudata.kuwo.cn/q.k?op=query&cont=ninfo&node=${id}&pn=0&rn=1&fmt=json&src=mbox&level=2`,
    'get',
    {}
  );

  return res.child.length ? res.child[0].sourceid : null;
};
const getListDetailDigest5Music = async (id, page) => {
  const res = await axiosHttp(
    `http://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=${id}&pn=${page - 1}}&rn=${config.limit_song}&encode=utf-8&keyset=pl2012&identity=kuwo&pcmp4=1`,
    'get',
    {}
  );

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
    page,
    limit: res.rn,
    total: res.total,
    source: 'kw'
  };
};

const objStr2JSON = (str) => {
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
