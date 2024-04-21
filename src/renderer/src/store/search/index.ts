import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import sources from '@r/apis';
import { deepCopy } from '@r/utils/index';

export const sortList = [
  { id: 'searchMusic', name: '歌曲' },
  { id: 'searchSongList', name: '歌单' }
];

const initList = (list) => {
  const res = {};
  sources.sources.forEach((source) => {
    sortList.forEach((sort) => {
      res[source.id + '_' + sort.id] = deepCopy(list);
    });
  });

  return res;
};

const initSongList: SKY.SongList.SongListSource = initList({
  limit: 30,
  list: [],
  pageSize: 1,
  source: 'wy',
  total: 0
});

const initMusicList: SKY.SongList.MusicObjSource = initList({
  list: {
    list: [],
    info: {
      play_count: 0,
      name: '',
      img: '',
      desc: '',
      author: ''
    }
  },
  pageSize: 1,
  limit: 100000,
  total: 0,
  source: 'wy'
});

const initMusic: SKY.SongList.SearchMusicList = initList({
  list: [],
  pageSize: 1,
  limit: 100000,
  total: 0,
  source: 'wy'
});

export const useSearchSongListStore = defineStore('useSearchSongListStore', () => {
  const searchSourceId = ref<string>(sources.sources[0].id);
  const searchSortId = ref<string>(sortList[0].id);
  const searchPageSize = ref<number>(1);

  const searchCurListId = computed(() => {
    return searchSourceId.value + '_' + searchSortId.value;
  });

  const searchSongList = ref<SKY.SongList.SongListSource>(initSongList);

  return { searchSongList, searchSourceId, searchSortId, searchPageSize, searchCurListId };
});

export const useSearchMusicListStore = defineStore('useSearchMusicListStore', () => {
  const searchMusicList = ref<SKY.SongList.MusicObjSource>(initMusicList);
  const searchMusiclistId = ref<string>('');

  return { searchMusicList, searchMusiclistId };
});

export const useSearchMusicStore = defineStore('useSearchMusicStore', () => {
  const searchMusicList = ref<SKY.SongList.SearchMusicList>(initMusic);

  return { searchMusicList };
});
