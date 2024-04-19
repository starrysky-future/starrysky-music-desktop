import { getLyric } from './lyric';
import { apis } from '../api-source';
import { config, getSongList, getSongListDetail } from './songList';
import { lbConfig, getLeaderBoardList } from './leaderBoard';
import { searchMusic, searchSongList } from './search';

const wy = {
  config,
  lbConfig,
  getMusicUrl(songInfo, type) {
    return apis('wy').getMusicUrl(songInfo, type);
  },
  getLyric,
  getSongList,
  getSongListDetail,

  getLeaderBoardList,

  searchMusic,
  searchSongList
};

export default wy;
