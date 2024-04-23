import http from '../request';
import { formatPlayCount, dateFormat } from '@r/utils';
import { filterListDetail } from './songList';

const sConfig = {
  limit_song: 30
};

export const searchMusic = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌曲失败');

  let res;
  try {
    res = await http('https://u.y.qq.com/cgi-bin/musicu.fcg', 'post', {
      headers: {
        myUA: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)'
      },
      data: {
        comm: {
          ct: 11,
          cv: '1003006',
          v: '1003006',
          os_ver: '12',
          phonetype: '0',
          devicelevel: '31',
          tmeAppID: 'qqmusiclight',
          nettype: 'NETWORK_WIFI'
        },
        req: {
          module: 'music.search.SearchCgiService',
          method: 'DoSearchForQQMusicLite',
          param: {
            query: searchInfo,
            search_type: 0,
            num_per_page: sConfig.limit_song,
            page_num: pageSize,
            nqc_flag: 0,
            grp: 1
          }
        }
      }
    });
  } catch (error) {
    return searchMusic(searchInfo, pageSize, tryNum + 1);
  }

  return {
    list: filterListDetail(res.req.data.body.item_song),
    pageSize: pageSize,
    limit: sConfig.limit_song,
    total: res.req.data.meta.estimate_sum,
    source: 'tx'
  };
};

export const searchSongList = async (searchInfo, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('搜索歌单失败');

  let res;
  try {
    res = await http(
      `http://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist?page_no=${pageSize - 1}&num_per_page=${sConfig.limit_song}&format=json&query=${encodeURIComponent(searchInfo)}&remoteplace=txt.yqq.playlist&inCharset=utf8&outCharset=utf-8`,
      'get',
      {
        headers: {
          myUA: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)',
          myReferer: 'http://y.qq.com/portal/search.html'
        }
      }
    );
    if (res.code !== 0) throw new Error('搜索歌单失败');
  } catch (error) {
    return searchSongList(searchInfo, pageSize, tryNum + 1);
  }

  return filterSongList(res.data, pageSize);
};

const filterSongList = (data, pageSize) => {
  return {
    list: data.list.map((item) => {
      return {
        play_count: formatPlayCount(item.listennum),
        id: String(item.dissid),
        author: item.creator.name,
        name: item.dissname,
        time: dateFormat(item.createtime, 'Y-M-D'),
        img: item.imgurl,
        grade: item.favorcnt / 10,
        total: item.song_count,
        desc: item.introduction,
        source: 'tx'
      };
    }),
    limit: sConfig.limit_song,
    pageSize,
    total: data.sum,
    source: 'tx'
  };
};
