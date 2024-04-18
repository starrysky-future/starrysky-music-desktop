import { axiosHttp } from '../request';
import { formatPlayCount, dateFormat } from '@r/utils';
import { decodeName, sizeFormate, formatSingerName, formatPlayTime } from '../utils';

export const config = {
  sortList: [
    {
      name: '最热',
      id: 5
    },
    {
      name: '最新',
      id: 2
    }
  ],
  pageNo: 30,
  limit_list: 100000
};

export const getSongList = async (sortId, tagId, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('歌单列表获取失败');

  let res;
  try {
    res = await axiosHttp(getListUrl(sortId, tagId, pageSize), 'get', {});
  } catch (error) {
    return getSongList(sortId, tagId, pageSize, tryNum + 1);
  }

  if (tagId) {
    return filterList2(res.playlist.data, pageSize);
  }
  return filterList(res.playlist.data, pageSize);
};

export const getSongListDetail = async (id, tryNum = 0) => {
  if (tryNum > 2) throw new Error('歌单详情列表获取失败');

  let res;
  try {
    res = await axiosHttp(
      `https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?type=1&json=1&utf8=1&onlysong=0&new_format=1&disstid=${id}&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0`,
      'get',
      {
        headers: {
          myOrigin: 'https://y.qq.com',
          myReferer: `https://y.qq.com/n/yqq/playsquare/${id}.html`
        }
      }
    );
  } catch (error) {
    return getSongListDetail(id, tryNum + 1);
  }

  const cdlist = res.cdlist[0];

  return {
    list: {
      list: filterListDetail(cdlist.songlist),
      info: {
        name: cdlist.dissname,
        img: cdlist.logo,
        desc: decodeName(cdlist.desc).replace(/<br>/g, '\n'),
        author: cdlist.nickname,
        play_count: formatPlayCount(cdlist.visitnum)
      }
    },
    page: 1,
    limit: cdlist.songlist.length + 1,
    total: cdlist.songlist.length,
    source: 'tx'
  };
};

const getListUrl = (sortId, id, pageSize) => {
  if (id) {
    id = parseInt(id);
    return `https://u.y.qq.com/cgi-bin/musicu.fcg?loginUin=0&hostUin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=wk_v15.json&needNewCode=0&data=${encodeURIComponent(
      JSON.stringify({
        comm: { cv: 1602, ct: 20 },
        playlist: {
          method: 'get_category_content',
          param: {
            titleid: id,
            caller: '0',
            category_id: id,
            size: config.pageNo,
            page: pageSize - 1,
            use_page: 1
          },
          module: 'playlist.PlayListCategoryServer'
        }
      })
    )}`;
  }
  return `https://u.y.qq.com/cgi-bin/musicu.fcg?loginUin=0&hostUin=0&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=wk_v15.json&needNewCode=0&data=${encodeURIComponent(
    JSON.stringify({
      comm: { cv: 1602, ct: 20 },
      playlist: {
        method: 'get_playlist_by_tag',
        param: {
          id: 10000000,
          sin: config.pageNo * (pageSize - 1),
          size: config.pageNo,
          order: sortId,
          cur_page: pageSize
        },
        module: 'playlist.PlayListPlazaServer'
      }
    })
  )}`;
};

const filterList = (data, pageSize) => {
  return {
    list: data.v_playlist.map((item) => ({
      play_count: formatPlayCount(item.access_num),
      id: String(item.tid),
      author: item.creator_info.nick,
      name: item.title,
      time: item.modify_time ? dateFormat(item.modify_time * 1000, 'Y-M-D') : '',
      img: item.cover_url_small,
      grade: item.favorcnt / 10,
      total: item.song_ids?.length,
      desc: item.desc,
      source: 'tx'
    })),
    total: data.total,
    pageSize,
    limit: config.pageNo,
    source: 'tx'
  };
};
const filterList2 = ({ content }, pageSize) => {
  return {
    list: content.v_item.map(({ basic }) => ({
      play_count: formatPlayCount(basic.play_cnt),
      id: String(basic.tid),
      author: basic.creator.nick,
      name: basic.title,
      time: basic.publish_time,
      img: basic.cover.small_url || basic.cover.default_url,
      grade: basic.favorcnt / 10,
      desc: decodeName(basic.desc).replace(/<br>/g, '\n'),
      source: 'tx'
    })),
    total: content.total_cnt,
    pageSize,
    limit: config.pageNo,
    source: 'tx'
  };
};

const filterListDetail = (rawList) => {
  return rawList.map((item) => {
    const types: Array<SKY.Apis.Types> = [];
    const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };
    if (item.file.size_128mp3 !== 0) {
      const size = sizeFormate(item.file.size_128mp3);
      types.push({ type: '128k', size });
      _types['128k'] = {
        size
      };
    }
    if (item.file.size_320mp3 !== 0) {
      const size = sizeFormate(item.file.size_320mp3);
      types.push({ type: '320k', size });
      _types['320k'] = {
        size
      };
    }
    if (item.file.size_flac !== 0) {
      const size = sizeFormate(item.file.size_flac);
      types.push({ type: 'flac', size });
      _types.flac = {
        size
      };
    }
    if (item.file.size_hires !== 0) {
      const size = sizeFormate(item.file.size_hires);
      types.push({ type: 'flac24bit', size });
      _types.flac24bit = {
        size
      };
    }
    return {
      singer: formatSingerName(item.singer, 'name'),
      name: item.title,
      albumName: item.album.name,
      albumId: item.album.mid,
      source: 'tx',
      interval: formatPlayTime(item.interval),
      _interval: item.interval * 1000,
      songId: item.id,
      albumMid: item.album.mid,
      strMediaMid: item.file.media_mid,
      songmid: item.mid,
      img:
        item.album.name === '' || item.album.name === '空'
          ? item.singer?.length
            ? `https://y.gtimg.cn/music/photo_new/T001R500x500M000${item.singer[0].mid}.jpg`
            : ''
          : `https://y.gtimg.cn/music/photo_new/T002R500x500M000${item.album.mid}.jpg`,
      lrc: null,
      otherSource: null,
      types,
      _types,
      typeUrl: {}
    };
  });
};
