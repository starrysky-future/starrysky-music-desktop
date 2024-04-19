import { axiosHttp } from '../request';
import { filterMusicInfoList } from './songList';

export const lbConfig = {
  topList: [
    { id: 'mg__27553319', name: '尖叫新歌榜', bangid: '27553319', webId: 'jianjiao_newsong' },
    { id: 'mg__27186466', name: '尖叫热歌榜', bangid: '27186466', webId: 'jianjiao_hotsong' },
    { id: 'mg__27553408', name: '尖叫原创榜', bangid: '27553408', webId: 'jianjiao_original' },
    { id: 'mg__23189800', name: '港台榜', bangid: '23189800', webId: 'hktw' },
    { id: 'mg__23189399', name: '内地榜', bangid: '23189399', webId: 'mainland' },
    { id: 'mg__19190036', name: '欧美榜', bangid: '19190036', webId: 'eur_usa' },
    { id: 'mg__23189813', name: '日韩榜', bangid: '23189813', webId: 'jpn_kor' },
    { id: 'mg__23190126', name: '彩铃榜', bangid: '23190126', webId: 'coloring' },
    { id: 'mg__15140045', name: 'KTV榜', bangid: '15140045', webId: 'ktv' },
    { id: 'mg__15140034', name: '网络榜', bangid: '15140034', webId: 'network' }
  ],
  limit_song: 200
};

export const getLeaderBoardList = async (bangid, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('排行榜列表获取失败');

  let res;
  try {
    res = await axiosHttp(
      `https://app.c.nf.migu.cn/MIGUM2.0/v1.0/content/querycontentbyId.do?columnId=${bangid}&needAll=0`,
      'get',
      {}
    );

    res = filterMusicInfoList(res.columnInfo.contents.map((m) => m.objectInfo));
  } catch (error) {
    return getLeaderBoardList(bangid, pageSize, tryNum + 1);
  }

  return {
    total: res.length,
    list: res,
    limit: lbConfig.limit_song,
    pageSize,
    source: 'mg'
  };
};
