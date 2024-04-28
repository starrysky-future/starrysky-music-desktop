import { config, getSongList, getSongListDetail } from './songList';
import { getLyric } from './lyric';
import { lbConfig, getLeaderBoardList } from './leaderBoard';
import { apis } from '../api-source';
import { searchMusic, searchSongList } from './search';
import { getPic } from './musicDetail';

const kg = {
  config,
  lbConfig,
  getPic,
  getMusicUrl(songInfo, type) {
    return apis('kg').getMusicUrl(songInfo, type);
  },
  getLyric,
  getSongList,
  getSongListDetail,

  getLeaderBoardList,

  searchMusic,
  searchSongList
};

export default kg;
