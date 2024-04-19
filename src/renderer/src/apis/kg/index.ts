import { config, getSongList, getSongListDetail } from './songList';
import { getLyric } from './lyric';
import { lbConfig, getLeaderBoardList } from './leaderBoard';
import { apis } from '../api-source';

const kg = {
  config,
  lbConfig,
  getMusicUrl(songInfo, type) {
    return apis('kg').getMusicUrl(songInfo, type);
  },
  getLyric,
  getSongList,
  getSongListDetail,

  getLeaderBoardList
};

export default kg;
