import http from '../request';
import { weapi, linuxapi } from '../crypto';
import { formatPlayCount, dateFormat } from '@r/utils';
import { getMusicList, filterMusicList } from './musicDetail';

export const config = {
  sortList: [
    {
      name: '最热',
      id: 'hot'
    }
    // {
    //   name: '最新',
    //   id: 'new',
    // },
  ],
  pageNo: 30,
  limit_song: 100000
};

// 获取歌单列表数据
export const getSongList = async (sortId, tagId, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('歌单列表获取失败');

  let res;
  try {
    res = await http('https://music.163.com/weapi/playlist/list', 'post', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: weapi({
        cat: tagId || '全部', // 全部,华语,欧美,日语,韩语,粤语,小语种,流行,摇滚,民谣,电子,舞曲,说唱,轻音乐,爵士,乡村,R&B/Soul,古典,民族,英伦,金属,朋克,蓝调,雷鬼,世界音乐,拉丁,另类/独立,New Age,古风,后摇,Bossa Nova,清晨,夜晚,学习,工作,午休,下午茶,地铁,驾车,运动,旅行,散步,酒吧,怀旧,清新,浪漫,性感,伤感,治愈,放松,孤独,感动,兴奋,快乐,安静,思念,影视原声,ACG,儿童,校园,游戏,70后,80后,90后,网络歌曲,KTV,经典,翻唱,吉他,钢琴,器乐,榜单,00后
        order: sortId, // hot,new
        limit: config.pageNo,
        offset: config.pageNo * (pageSize - 1),
        total: true
      })
    });
  } catch (error) {
    return getSongList(sortId, tagId, pageSize, tryNum + 1);
  }

  return {
    list: filterSongList(res.playlists),
    total: parseInt(res.total),
    pageSize,
    limit: config.pageNo,
    source: 'wy'
  };
};

// 获取歌单列表内的音乐
export const getSongListDetail = async (id, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('歌单详情列表获取失败');
  // 先获取歌单所有音乐id
  let idRes;
  try {
    idRes = await http('https://music.163.com/api/linux/forward', 'post', {
      headers: {
        myUA: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: linuxapi({
        method: 'POST',
        url: 'https://music.163.com/api/v3/playlist/detail',
        params: {
          id,
          n: config.limit_song,
          s: 8
        }
      })
    });
  } catch (error) {
    return getSongListDetail(id, pageSize, tryNum + 1);
  }

  const limit = 1000;
  const rangeStart = (pageSize - 1) * limit;
  let list;
  if (idRes.playlist.trackIds.length == idRes.privileges.length) {
    list = filterMusicList(idRes.playlist.tracks, idRes.privileges);
  } else {
    try {
      const ids = idRes.playlist.trackIds
        .slice(rangeStart, limit * pageSize)
        .map((trackId) => trackId.id);
      list = await getMusicList(ids, tryNum);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    list: {
      list,
      info: {
        play_count: formatPlayCount(idRes.playlist.playCount),
        name: idRes.playlist.name,
        img: idRes.playlist.coverImgUrl,
        desc: idRes.playlist.description,
        author: idRes.playlist.creator.nickname
      }
    },
    pageSize,
    limit,
    total: idRes.playlist.trackIds.length,
    source: 'wy'
  };
};

export const filterSongList = (rawData) => {
  return rawData.map((item) => ({
    play_count: formatPlayCount(item.playCount),
    id: String(item.id),
    author: item.creator.nickname,
    name: item.name,
    time: item.createTime ? dateFormat(item.createTime, 'Y-M-D') : '',
    img: item.coverImgUrl,
    grade: item.grade,
    total: item.trackCount,
    desc: item.description,
    source: 'wy'
  }));
};
