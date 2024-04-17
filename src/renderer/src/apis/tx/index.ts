import { config, getSongList, getSongListDetail } from './songList';
import { apis } from '../api-source';

const tx = {
  config,
  getMusicUrl(songInfo, type) {
    return apis('tx').getMusicUrl(songInfo, type);
  },
  getSongList,
  getSongListDetail
};

export default tx;
