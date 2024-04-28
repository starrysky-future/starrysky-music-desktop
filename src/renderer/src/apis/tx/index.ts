import { config, getSongList, getSongListDetail } from './songList';
import { apis } from '../api-source';
import { lbConfig, getLeaderBoardList } from './leaderBoard';
import { searchMusic, searchSongList } from './search';
import { getPic } from './musicDetail';

const tx = {
  config,
  lbConfig,
  getPic,
  getMusicUrl(songInfo, type) {
    return apis('tx').getMusicUrl(songInfo, type);
  },
  getSongList,
  getSongListDetail,

  getLeaderBoardList,

  searchMusic,
  searchSongList
};

export default tx;
