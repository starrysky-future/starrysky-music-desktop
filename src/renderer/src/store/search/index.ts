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

export const useSearchSongListStore = defineStore('useSearchSongListStore', () => {
  const initSongList: SKY.SongList.SongListSource = initList({
    limit: 30,
    list: [],
    pageSize: 1,
    source: 'wy',
    total: 0
  });

  const searchSourceId = ref<string>(sources.sources[0].id);
  const searchSortId = ref<string>(sortList[0].id);
  const searchPageSize = ref<number>(1);
  const searchSongList = ref<SKY.SongList.SongListSource>(initSongList);

  const searchCurListId = computed(() => {
    return searchSourceId.value + '_' + searchSortId.value;
  });

  const resetSongList = () => {
    searchSongList.value = initList({
      limit: 30,
      list: [],
      pageSize: 1,
      source: 'wy',
      total: 0
    });
  };

  return {
    searchSongList,
    searchSourceId,
    searchSortId,
    searchPageSize,
    searchCurListId,
    resetSongList
  };
});

export const useSearchMusicListStore = defineStore('useSearchMusicListStore', () => {
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

  const searchMusicList = ref<SKY.SongList.MusicObjSource>(initMusicList);
  const searchMusiclistId = ref<string>('');

  const resetMusicList = () => {
    searchMusicList.value = initList({
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
  };

  return { searchMusicList, searchMusiclistId, resetMusicList };
});

export const useSearchMusicStore = defineStore('useSearchMusicStore', () => {
  const initMusic: SKY.SongList.SearchMusicList = initList({
    list: [],
    pageSize: 1,
    limit: 100000,
    total: 0,
    source: 'wy'
  });

  const searchMusic = ref<SKY.SongList.SearchMusicList>(initMusic);

  const resetMusic = () => {
    searchMusic.value = initList({
      list: [],
      pageSize: 1,
      limit: 100000,
      total: 0,
      source: 'wy'
    });
  };

  return { searchMusic, resetMusic };
});
