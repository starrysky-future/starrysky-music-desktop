import * as kg from './kg/search';
import * as kw from './kw/search';
import * as mg from './mg/search';
import * as tx from './tx/search';
import * as wy from './wy/search';

const searchSources = { kg: kg, kw: kw, mg: mg, tx: tx, wy: wy };

export const searchMusicAll = async (searchInfo, pageSize, excludeId?) => {
  const list: SKY.SongList.SearchAllMusic = {
    list: [],
    pageSize: pageSize,
    limit: 30,
    total: 0,
    source: 'all'
  };
  const reqList: Array<unknown> = [];
  Object.entries(searchSources).map(async (item) => {
    const [key, api] = item;

    if (excludeId.indexOf(key) >= 0) return;
    reqList.push(api.searchMusic(searchInfo, pageSize));
  });

  const res = await Promise.allSettled(reqList);
  res.forEach((item) => {
    if (item.status === 'fulfilled') {
      list.list.push(...(item.value as SKY.SongList.SearchAllMusic).list);
    }
  });

  list.total = list.list.length;

  return list;
};
