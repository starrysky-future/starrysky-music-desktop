import { getLyric } from './lyric';
import { apis } from '../api-source';
import { getPic } from './musicDetail';
import { config, getSongList, getSongListDetail } from './songList';
import { lbConfig, getLeaderBoardList } from './leaderBoard';
import { searchMusic, searchSongList } from './search';

const wy = {
  config,
  lbConfig,
  getMusicUrl(songInfo, type) {
    return apis('kw').getMusicUrl(songInfo, type);
  },
  getPic,
  getLyric,
  getSongList,
  getSongListDetail,

  getLeaderBoardList,

  searchMusic,
  searchSongList
};

export default wy;
