import { axiosHttp } from '../request';
import { sizeFormate, formatSingerName, formatPlayTime } from '../utils';

export const lbConfig = {
  topList: [
    { id: 'tx__4', name: '流行指数榜', bangid: '4' },
    { id: 'tx__26', name: '热歌榜', bangid: '26' },
    { id: 'tx__27', name: '新歌榜', bangid: '27' },
    { id: 'tx__62', name: '飙升榜', bangid: '62' },
    { id: 'tx__58', name: '说唱榜', bangid: '58' },
    { id: 'tx__57', name: '喜力电音榜', bangid: '57' },
    { id: 'tx__28', name: '网络歌曲榜', bangid: '28' },
    { id: 'tx__5', name: '内地榜', bangid: '5' },
    { id: 'tx__3', name: '欧美榜', bangid: '3' },
    { id: 'tx__59', name: '香港地区榜', bangid: '59' },
    { id: 'tx__16', name: '韩国榜', bangid: '16' },
    { id: 'tx__60', name: '抖快榜', bangid: '60' },
    { id: 'tx__29', name: '影视金曲榜', bangid: '29' },
    { id: 'tx__17', name: '日本榜', bangid: '17' },
    { id: 'tx__52', name: '腾讯音乐人原创榜', bangid: '52' },
    { id: 'tx__36', name: 'K歌金曲榜', bangid: '36' },
    { id: 'tx__61', name: '台湾地区榜', bangid: '61' },
    { id: 'tx__63', name: 'DJ舞曲榜', bangid: '63' },
    { id: 'tx__64', name: '综艺新歌榜', bangid: '64' },
    { id: 'tx__65', name: '国风热歌榜', bangid: '65' },
    { id: 'tx__67', name: '听歌识曲榜', bangid: '67' },
    { id: 'tx__72', name: '动漫音乐榜', bangid: '72' },
    { id: 'tx__73', name: '游戏音乐榜', bangid: '73' },
    { id: 'tx__75', name: '有声榜', bangid: '75' },
    { id: 'tx__131', name: '校园音乐人排行榜', bangid: '131' }
  ],
  regExps: {
    periodList:
      /<i class="play_cover__btn c_tx_link js_icon_play" data-listkey=".+?" data-listname=".+?" data-tid=".+?" data-date=".+?" .+?<\/i>/g,
    period: /data-listname="(.+?)" data-tid=".*?\/(.+?)" data-date="(.+?)" .+?<\/i>/
  },
  limit_song: 300,
  periods: {}
};

export const getLeaderBoardList = async (bangid, pageSize, tryNum = 0) => {
  if (tryNum > 2) return Promise.reject(new Error('排行榜列表获取失败'));
  bangid = parseInt(bangid);
  let period;
  if (lbConfig.periods[bangid]) {
    period = lbConfig.periods[bangid].period;
  } else {
    period = await getPeriods(bangid, tryNum);
  }

  let res;
  try {
    res = await axiosHttp('https://u.y.qq.com/cgi-bin/musicu.fcg', 'post', {
      headers: {
        myUA: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0)'
      },
      body: {
        toplist: {
          module: 'musicToplist.ToplistInfoServer',
          method: 'GetDetail',
          param: {
            topid: bangid,
            num: lbConfig.limit_song,
            period
          }
        },
        comm: {
          uin: 0,
          format: 'json',
          ct: 20,
          cv: 1859
        }
      }
    });

    if (res.code !== 0) throw new Error('获取失败');
  } catch (error) {
    return getLeaderBoardList(bangid, pageSize, tryNum + 1);
  }
  console.log('排行榜', res);

  return {
    total: res.toplist.data.songInfoList.length,
    list: filterData(res.toplist.data.songInfoList),
    limit: lbConfig.limit_song,
    pageSize,
    source: 'tx'
  };
};

const getPeriods = async (bangid, tryNum) => {
  if (tryNum > 2) throw new Error('period获取失败');
  let period;

  try {
    const res = await axiosHttp('https://c.y.qq.com/node/pc/wk_v15/top.html', 'get', {});
    let result = res.match(lbConfig.regExps.periodList);
    if (!result) throw new Error('result获取失败');

    result.forEach((item) => {
      result = item.match(lbConfig.regExps.period);
      if (!result) return;
      lbConfig.periods[result[2]] = {
        name: result[1],
        bangid: result[2],
        period: result[3]
      };
    });
    const info = lbConfig.periods[bangid];
    if (!info || !info.period) throw new Error('period获取失败');
    period = info.period;
  } catch (error) {
    return getPeriods(bangid, tryNum + 1);
  }

  return period;
};

const filterData = (rawList) => {
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
      _interval: item.interval,
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
