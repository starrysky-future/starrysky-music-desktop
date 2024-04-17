import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import sources from '@r/apis';
import { deepCopy } from '@r/utils/index';

const initList = (list) => {
  const res = {};
  sources.sources.forEach((source) => {
    sources[source.id].config.sortList.forEach((sort) => {
      res[source.id + '_' + sort.id] = deepCopy(list);
    });
  });

  return res;
};

export const useSongListStore = defineStore('useSongListStore', () => {
  const sourceId = ref<string>('wy');
  const tagId = ref<string>('');
  const sortId = ref<string>(sources[sourceId.value].config.sortList[0].id);

  const initlist: SKY.SongList.SongListSource = initList({
    limit: 30,
    list: [],
    pageSize: 1,
    source: 'wy',
    total: 0
  });

  const songList = ref<SKY.SongList.SongListSource>(initlist);

  const curListId = computed(() => {
    if (tagId.value) {
      return sourceId.value + '_' + sortId.value + '_' + tagId.value;
    }
    return sourceId.value + '_' + sortId.value;
  });

  const pageSize = ref<number>(1);

  return { songList, sourceId, sortId, tagId, pageSize, curListId };
});

export const useMusicListStore = defineStore('useMusicListStore', () => {
  const initlist: SKY.SongList.MusicObjSource = initList({
    list: {},
    page: 1,
    limit: 100000,
    total: 0,
    source: 'wy',
    info: {
      play_count: 0,
      name: '',
      img: '',
      desc: '',
      author: ''
    }
  });
  const musicList = ref<SKY.SongList.MusicObjSource>(initlist);
  const listId = ref<string>('');

  return { musicList, listId };
});
