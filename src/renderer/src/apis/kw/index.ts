import { getLyric } from './lyric';
import { apis } from '../api-source';
import { getPic } from './musicDetail';
import { config, getSongList, getSongListDetail } from './songList';
import { lbConfig, getLeaderBoardList } from './leaderBoard';

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

  getLeaderBoardList
};

export default wy;
