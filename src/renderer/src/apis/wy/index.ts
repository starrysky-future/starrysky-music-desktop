import { getLyric } from './lyric';
import { apis } from '../api-source';
import { config, getSongList, getSongListDetail } from './songList';

const wy = {
  config,
  getMusicUrl(songInfo, type) {
    return apis('wy').getMusicUrl(songInfo, type);
  },
  getLyric,
  getSongList,
  getSongListDetail
};

export default wy;
