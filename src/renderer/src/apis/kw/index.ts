import { getLyric } from './lyric';
import { apis } from '../api-source';
import { getPic } from './musicDetail';
import { config, getSongList, getSongListDetail } from './songList';

const wy = {
  config,
  getMusicUrl(songInfo, type) {
    return apis('kw').getMusicUrl(songInfo, type);
  },
  getPic,
  getLyric,
  getSongList,
  getSongListDetail
};

export default wy;
