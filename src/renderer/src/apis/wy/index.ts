import { getLyric } from './lyric';
import { apis } from '../api-source';
import { config, getSongList, getSongListDetail } from './songList';
import { lbConfig, getLeaderBoardList } from './leaderBoard';
import { searchMusic, searchSongList } from './search';
import { getMusicInfo } from './musicDetail';

const wy = {
  config,
  lbConfig,
  getMusicUrl(songInfo, type) {
    return apis('wy').getMusicUrl(songInfo, type);
  },
  async getPic(songInfo) {
    const res = await getMusicInfo(songInfo.songmid);
    return res?.al?.picUrl;
  },
  getLyric,
  getSongList,
  getSongListDetail,

  getLeaderBoardList,

  searchMusic,
  searchSongList
};

export default wy;
