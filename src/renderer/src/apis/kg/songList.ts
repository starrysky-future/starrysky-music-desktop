import http from '../request';
import { decodeName } from '../utils';
import { formatPlayCount, dateFormat } from '@r/utils';
import { getMusicList } from './musicDetail';

export const config = {
  sortList: [
    {
      name: '推荐',
      id: '5'
    },
    {
      name: '最热',
      id: '6'
    },
    {
      name: '最新',
      id: '7'
    },
    {
      name: '热藏',
      id: '3'
    },
    {
      name: '飙升',
      id: '8'
    }
  ],
  limit_song: 100000,
  regExps: {
    listData: /global\.data = (\[.+\]);/,
    listInfo: /global = {[\s\S]+?name: "(.+)"[\s\S]+?pic: "(.+)"[\s\S]+?};/
  }
};

export const getSongList = async (sortId, tagId, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('歌单列表获取失败');

  let res;
  let info;
  try {
    res = await http(
      `http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_ajax=1&cdn=cdn&t=${sortId}&c=${tagId}&p=${pageSize}`,
      'get',
      {}
    );
    info = await getListInfo(tagId);
  } catch (error) {
    return getSongList(sortId, tagId, pageSize, tryNum + 1);
  }

  return { list: filterList(res.special_db), ...info };
};

export const getSongListDetail = async (id, pageSize, tryNum = 0) => {
  if (tryNum > 2) throw new Error('歌单详情列表获取失败');

  let res;
  let listData;
  let listInfo;
  let list;

  try {
    res = await http(
      `http://www2.kugou.kugou.com/yueku/v9/special/single/${id}-5-9999.html`,
      'get',
      {}
    );
    listData = res.match(config.regExps.listData);
    listInfo = res.match(config.regExps.listInfo);
    list = await getMusicList(JSON.parse(listData[1]));
  } catch (error) {
    return getSongListDetail(id, pageSize, tryNum + 1);
  }

  let name;
  let pic;
  if (listInfo) {
    name = listInfo[1];
    pic = listInfo[2];
  }
  const desc = parseHtmlDesc(res);

  return {
    list: {
      list,
      info: {
        name,
        img: pic,
        desc
      }
    },
    pageSize,
    limit: 10000,
    total: list.length,
    source: 'kg'
  };
};

// 获取列表信息
const getListInfo = async (tagId) => {
  const url = getInfoUrl(tagId);
  const res = await http(url, 'get', {});

  return {
    limit: res.data.params.pagesize,
    pageSize: res.data.params.p,
    total: res.data.params.total,
    source: 'kg'
  };
};

const getInfoUrl = (tagId) => {
  return tagId
    ? `http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_smarty=1&cdn=cdn&t=5&c=${tagId}`
    : 'http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_smarty=1&';
};

const filterList = (rawData) => {
  return rawData.map((item) => ({
    play_count: item.total_play_count || formatPlayCount(item.play_count),
    id: item.specialid,
    author: item.nickname,
    name: item.specialname,
    time: dateFormat(item.publish_time || item.publishtime, 'Y-M-D'),
    img: item.img || item.imgurl,
    total: item.songcount,
    grade: item.grade,
    desc: item.intro,
    source: 'kg'
  }));
};
const parseHtmlDesc = (html) => {
  const prefix = '<div class="pc_specail_text pc_singer_tab_content" id="specailIntroduceWrap">';
  let index = html.indexOf(prefix);
  if (index < 0) return null;
  const afterStr = html.substring(index + prefix.length);
  index = afterStr.indexOf('</div>');
  if (index < 0) return null;
  return decodeName(afterStr.substring(0, index));
};
