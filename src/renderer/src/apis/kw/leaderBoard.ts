import http from '../request';
import { decodeName, formatSingerName, formatPlayTime } from '../utils';

export const lbConfig = {
  topList: [
    { id: 'kw__93', name: '飙升榜', bangid: '93' },
    { id: 'kw__17', name: '新歌榜', bangid: '17' },
    { id: 'kw__16', name: '热歌榜', bangid: '16' },
    { id: 'kw__158', name: '抖音热歌榜', bangid: '158' },
    { id: 'kw__292', name: '铃声榜', bangid: '292' },
    { id: 'kw__284', name: '热评榜', bangid: '284' },
    { id: 'kw__290', name: 'ACG新歌榜', bangid: '290' },
    { id: 'kw__286', name: '台湾KKBOX榜', bangid: '286' },
    { id: 'kw__279', name: '冬日暖心榜', bangid: '279' },
    { id: 'kw__281', name: '巴士随身听榜', bangid: '281' },
    { id: 'kw__255', name: 'KTV点唱榜', bangid: '255' },
    { id: 'kw__280', name: '家务进行曲榜', bangid: '280' },
    { id: 'kw__282', name: '熬夜修仙榜', bangid: '282' },
    { id: 'kw__283', name: '枕边轻音乐榜', bangid: '283' },
    { id: 'kw__278', name: '古风音乐榜', bangid: '278' },
    { id: 'kw__264', name: 'Vlog音乐榜', bangid: '264' },
    { id: 'kw__242', name: '电音榜', bangid: '242' },
    { id: 'kw__187', name: '流行趋势榜', bangid: '187' },
    { id: 'kw__204', name: '现场音乐榜', bangid: '204' },
    { id: 'kw__186', name: 'ACG神曲榜', bangid: '186' },
    { id: 'kw__185', name: '最强翻唱榜', bangid: '185' },
    { id: 'kw__26', name: '经典怀旧榜', bangid: '26' },
    { id: 'kw__104', name: '华语榜', bangid: '104' },
    { id: 'kw__182', name: '粤语榜', bangid: '182' },
    { id: 'kw__22', name: '欧美榜', bangid: '22' },
    { id: 'kw__184', name: '韩语榜', bangid: '184' },
    { id: 'kw__183', name: '日语榜', bangid: '183' },
    { id: 'kw__145', name: '会员畅听榜', bangid: '145' },
    { id: 'kw__153', name: '网红新歌榜', bangid: '153' },
    { id: 'kw__64', name: '影视金曲榜', bangid: '64' },
    { id: 'kw__176', name: 'DJ嗨歌榜', bangid: '176' },
    { id: 'kw__106', name: '真声音', bangid: '106' },
    { id: 'kw__12', name: 'Billboard榜', bangid: '12' },
    { id: 'kw__49', name: 'iTunes音乐榜', bangid: '49' },
    { id: 'kw__180', name: 'beatport电音榜', bangid: '180' },
    { id: 'kw__13', name: '英国UK榜', bangid: '13' },
    { id: 'kw__164', name: '百大DJ榜', bangid: '164' },
    { id: 'kw__246', name: 'YouTube音乐排行榜', bangid: '246' },
    { id: 'kw__265', name: '韩国Genie榜', bangid: '265' },
    { id: 'kw__14', name: '韩国M-net榜', bangid: '14' },
    { id: 'kw__8', name: '香港电台榜', bangid: '8' },
    { id: 'kw__15', name: '日本公信榜', bangid: '15' },
    { id: 'kw__151', name: '腾讯音乐人原创榜', bangid: '151' }
  ],
  limit_song: 100
};

export const getLeaderBoardList = async (bangid, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('排行榜列表获取失败');

  let res;
  try {
    res = await http(
      `http://kbangserver.kuwo.cn/ksong.s?from=pc&fmt=json&pn=${pageSize - 1}&rn=${lbConfig.limit_song}&type=bang&data=content&id=${bangid}&show_copyright_off=0&pcmp4=1&isbang=1`,
      'get',
      {}
    );

    if (!res.musiclist) throw new Error('排行榜列表获取失败');
  } catch (error) {
    return getLeaderBoardList(bangid, pageSize, tryNum + 1);
  }

  return {
    total: parseInt(res.num),
    list: filterData(res.musiclist),
    limit: lbConfig.limit_song,
    pageSize,
    source: 'mg'
  };
};

const filterData = (rawList) => {
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
      singer: formatSingerName(decodeName(item.artist)),
      name: decodeName(item.name),
      albumName: decodeName(item.album),
      albumId: item.albumid,
      songmid: item.id,
      source: 'kw',
      interval: formatPlayTime(parseInt(item.song_duration)),
      _interval: item.song_duration * 1000,
      img: item.pic,
      lrc: null,
      otherSource: null,
      types,
      _types,
      typeUrl: {}
    };
  });
};
