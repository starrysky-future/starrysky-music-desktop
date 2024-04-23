import { config, getSongList, getSongListDetail } from './songList';
import { apis } from '../api-source';
import { lbConfig, getLeaderBoardList } from './leaderBoard';
import { searchMusic, searchSongList } from './search';

const mg = {
  config,
  lbConfig,
  getMusicUrl(songInfo, type) {
    return apis('mg').getMusicUrl(songInfo, type);
  },
  getSongList,
  getSongListDetail,

  getLeaderBoardList,

  searchMusic,
  searchSongList
};

export default mg;
