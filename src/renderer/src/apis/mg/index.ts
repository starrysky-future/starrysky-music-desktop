import { config, getSongList, getSongListDetail } from './songList';
import { apis } from '../api-source';
import { lbConfig, getLeaderBoardList } from './leaderBoard';

const mg = {
  config,
  lbConfig,
  getMusicUrl(songInfo, type) {
    return apis('mg').getMusicUrl(songInfo, type);
  },
  getSongList,
  getSongListDetail,

  getLeaderBoardList
};

export default mg;
