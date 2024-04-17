import { config, getSongList, getSongListDetail } from './songList';
import { apis } from '../api-source';

const mg = {
  config,
  getMusicUrl(songInfo, type) {
    return apis('mg').getMusicUrl(songInfo, type);
  },
  getSongList,
  getSongListDetail
};

export default mg;
