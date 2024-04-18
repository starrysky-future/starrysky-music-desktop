import { config, getSongList, getSongListDetail } from './songList';
import { apis } from '../api-source';
import { lbConfig, getLeaderBoardList } from './leaderBoard';

const tx = {
  config,
  lbConfig,
  getMusicUrl(songInfo, type) {
    return apis('tx').getMusicUrl(songInfo, type);
  },
  getSongList,
  getSongListDetail,

  getLeaderBoardList
};

export default tx;
