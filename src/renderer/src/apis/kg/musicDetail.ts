import { decodeName, formatPlayTime, sizeFormate, filterImg } from '../utils';
import http from '../request';

// 歌曲列表
export const getMusicList = (list) => {
  return getMusicInfos(list.map((item) => ({ hash: item.hash })));
};

export const getMusicInfos = async (hashs) => {
  return filterMusicInfoList(
    await Promise.all(createGetMusicInfosTask(hashs)).then((data) => data.flat())
  );
};

export const getPic = async (songInfo) => {
  try {
    const res = await http('http://media.store.kugou.com/v1/get_res_privilege', 'post', {
      headers: {
        'KG-RC': 1,
        'KG-THash': 'expand_search_manager.cpp:852736169:451',
        myUA: 'KuGou2012-9020-ExpandSearchManager'
      },
      data: {
        appid: 1001,
        area_code: '1',
        behavior: 'play',
        clientver: '9020',
        need_hash_offset: 1,
        relate: 1,
        resource: [
          {
            album_audio_id:
              songInfo.songmid.length == 32 ? songInfo.audioId.split('_')[0] : songInfo.songmid,
            album_id: songInfo.albumId,
            hash: songInfo.hash,
            id: 0,
            name: `${songInfo.singer} - ${songInfo.name}.mp3`,
            type: 'audio'
          }
        ],
        token: '',
        userid: 2626431536,
        vip: 1
      }
    });

    const info = res.data[0].info;
    const img = info.imgsize ? info.image.replace('{size}', info.imgsize[0]) : info.image;
    if (!img) throw new Error('获取图片失败');

    return img;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const createHttpFetch = async (url, method, options) => {
  let res;
  try {
    res = await http(url, method, options);
  } catch (err) {
    console.log(err);
  }
  if ((res.error_code ?? res.errcode ?? res.err_code) != 0) {
    console.log(res);
  }
  if (res.data) return res.data;
  if (Array.isArray(res.info)) return res.info;
  return res.body.info;
};

const createGetMusicInfosTask = (hashs) => {
  const data = {
    area_code: '1',
    show_privilege: 1,
    show_album_info: '1',
    is_publish: '',
    appid: 1005,
    clientver: 11451,
    mid: '1',
    dfid: '-',
    clienttime: Date.now(),
    key: 'OIlwieks28dk2k092lksi2UIkp',
    fields: 'album_info,author_name,audio_info,ori_audio_name,base,songname'
  };
  let list = hashs;
  const tasks = [];
  while (list.length) {
    // @ts-ignore
    tasks.push(Object.assign({ data: list.slice(0, 100) }, data));
    if (list.length < 100) break;
    list = list.slice(100);
  }
  const url = 'http://gateway.kugou.com/v3/album_audio/audio';
  return tasks.map((task) =>
    createHttpFetch(url, 'POST', {
      data: task,
      headers: {
        'KG-THash': '13a3164',
        'KG-RC': '1',
        'KG-Fake': '0',
        'KG-RF': '00869891',
        myUA: 'Android712-AndroidPhone-11451-376-0-FeeCacheUpdate-wifi',
        'x-router': 'kmr.service.kugou.com'
      }
    }).then((data) => data.map((s) => s[0]))
  );
};

export const filterMusicInfoList = (rawList) => {
  const ids = new Set();
  const list: Array<SKY.MusicListItem> = [];
  rawList.forEach((item) => {
    if (!item) return;
    if (ids.has(item.audio_info.audio_id)) return;
    ids.add(item.audio_info.audio_id);
    const types: Array<SKY.Apis.Types_kg> = [];
    const _types: SKY.Apis._types = { flac24bit: {}, flac: {} };
    if (item.audio_info.filesize !== '0') {
      const size = sizeFormate(parseInt(item.audio_info.filesize));
      types.push({ type: '128k', size, hash: item.audio_info.hash });
      _types['128k'] = {
        size,
        hash: item.audio_info.hash
      };
    }
    if (item.audio_info.filesize_320 !== '0') {
      const size = sizeFormate(parseInt(item.audio_info.filesize_320));
      types.push({ type: '320k', size, hash: item.audio_info.hash_320 });
      _types['320k'] = {
        size,
        hash: item.audio_info.hash_320
      };
    }
    if (item.audio_info.filesize_flac !== '0') {
      const size = sizeFormate(parseInt(item.audio_info.filesize_flac));
      types.push({ type: 'flac', size, hash: item.audio_info.hash_flac });
      _types.flac = {
        size,
        hash: item.audio_info.hash_flac
      };
    }
    if (item.audio_info.filesize_high !== '0') {
      const size = sizeFormate(parseInt(item.audio_info.filesize_high));
      types.push({ type: 'flac24bit', size, hash: item.audio_info.hash_high });
      _types.flac24bit = {
        size,
        hash: item.audio_info.hash_high
      };
    }

    list.push({
      singer: decodeName(item.author_name),
      name: decodeName(item.songname),
      albumName: decodeName(item.album_info.album_name),
      albumId: item.album_info.album_id,
      songmid: item.audio_info.audio_id,
      source: 'kg',
      interval: formatPlayTime(parseInt(item.audio_info.timelength) / 1000),
      _interval: item.audio_info.timelength,
      img: filterImg(item.album_info.sizable_cover),
      lrc: null,
      hash: item.audio_info.hash,
      otherSource: null,
      types,
      _types,
      typeUrl: {}
    });
  });
  return list;
};
