import { config, getSongList, getSongListDetail } from './songList';
import { getLyric } from './lyric';

import { apis } from '../api-source';

const kg = {
  config,
  getMusicUrl(songInfo, type) {
    return apis('kg').getMusicUrl(songInfo, type);
  },
  getLyric,
  getSongList,
  getSongListDetail
};

export default kg;
