<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import {
  sortList,
  useSearchSongListStore,
  useSearchMusicListStore,
  useSearchMusicStore
} from '@r/store/search';
import sources from '@r/apis';

const router = useRouter();

const searchSongListStore = useSearchSongListStore();
const searchMusicListStore = useSearchMusicListStore();
const searchMusicStore = useSearchMusicStore();

const { searchSongList, searchSourceId, searchSortId, searchCurListId, searchPageSize } =
  storeToRefs(searchSongListStore);
const { searchMusiclistId } = storeToRefs(searchMusicListStore);
const { searchMusic } = storeToRefs(searchMusicStore);

const searchValue = ref<string>('');
const loading = ref<boolean>(false);

const totalSize = computed(() => {
  if (searchSortId.value === 'searchMusic') {
    return Math.ceil(
      searchMusic.value[searchCurListId.value].total /
        searchMusic.value[searchCurListId.value].limit
    );
  }

  return Math.ceil(
    searchSongList.value[searchCurListId.value].total /
      searchSongList.value[searchCurListId.value].limit
  );
});

const size = computed(() => {
  return totalSize.value >= 10 ? 10 : totalSize.value;
});

const hasSongList = computed(() => {
  return (
    searchSongList.value[searchCurListId.value].list[searchPageSize.value - 1] &&
    searchSongList.value[searchCurListId.value].list[searchPageSize.value - 1].length > 0
  );
});
const hasMusic = computed(() => {
  return (
    searchMusic.value[searchCurListId.value].list[searchPageSize.value - 1] &&
    searchMusic.value[searchCurListId.value].list[searchPageSize.value - 1].length > 0
  );
});
const musicList = computed(() => {
  return searchMusic.value[searchCurListId.value].list[searchPageSize.value - 1];
});

const goDetail = (id: string) => {
  searchMusiclistId.value = id;
  router.push({
    name: 'songListDetail',
    query: { pageName: 'search' }
  });
};

const setSourceId = (id: string) => {
  searchSourceId.value = id;
  searchPageSize.value = 1;
};
const setSort = (id: string) => {
  searchSortId.value = id;
  searchPageSize.value = 1;
};
const setSearchValue = (val: string) => {
  resetData();
  searchValue.value = val;
};

const resetData = () => {
  searchPageSize.value = 1;

  searchSongListStore.resetSongList();
  searchMusicListStore.resetMusicList();
  searchMusicStore.resetMusic();
};

const getSongList = async () => {
  if (hasSongList.value) return;
  loading.value = true;
  try {
    const data = await sources[searchSourceId.value].searchSongList(
      searchValue.value,
      searchPageSize.value
    );

    loading.value = false;
    if (searchSongList.value[searchCurListId.value].list.length) {
      searchSongList.value[searchCurListId.value].list[searchPageSize.value - 1] = [...data.list];
    } else {
      searchSongList.value[searchCurListId.value].limit = data.limit;
      searchSongList.value[searchCurListId.value].list[searchPageSize.value - 1] = [...data.list];
      searchSongList.value[searchCurListId.value].pageSize = data.pageSize;
      searchSongList.value[searchCurListId.value].source = data.source;
      searchSongList.value[searchCurListId.value].total = data.total;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

const getMusic = async () => {
  if (hasMusic.value) return;
  loading.value = true;
  try {
    const data = await sources[searchSourceId.value].searchMusic(
      searchValue.value,
      searchPageSize.value
    );

    loading.value = false;
    if (searchMusic.value[searchCurListId.value].list.length) {
      searchMusic.value[searchCurListId.value].list[searchPageSize.value - 1] = [...data.list];
    } else {
      searchMusic.value[searchCurListId.value].limit = data.limit;
      searchMusic.value[searchCurListId.value].list[searchPageSize.value - 1] = [...data.list];
      searchMusic.value[searchCurListId.value].pageSize = data.pageSize;
      searchMusic.value[searchCurListId.value].source = data.source;
      searchMusic.value[searchCurListId.value].total = data.total;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

const stopWatch = watch(
  [searchValue, searchSortId, searchPageSize, searchSourceId],
  ([val, sortVal]) => {
    if (!val) return;
    if (sortVal === 'searchSongList') {
      getSongList();
    } else {
      getMusic();
    }
  }
);

onBeforeUnmount(() => {
  stopWatch();
});
</script>

<template>
  <Tabs
    is-page="search"
    :active-source-id="searchSourceId"
    :sort-list="sortList"
    :active-sort-id="searchSortId"
    has-border
    has-search
    @set-source-id="setSourceId"
    @set-sort="setSort"
    @set-search-value="setSearchValue"
  />
  <div v-if="!searchValue" class="search_default content_heigth">
    <div class="search_icon">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
        height="100%"
        viewBox="0 0 36 36"
        space="preserve"
      >
        <use xlink:href="#icon-search" />
      </svg>
    </div>
  </div>
  <div v-else class="search_content content_heigth">
    <div class="main scroll">
      <template v-if="searchSortId === 'searchSongList'">
        <div v-if="hasSongList" class="songList">
          <template
            v-for="item in searchSongList[searchCurListId].list[searchPageSize - 1]"
            :key="item.id"
          >
            <SongListItem :list="item" @click="goDetail(item.id)" />
          </template>
        </div>
        <Loading v-else-if="loading" />
        <NoData v-else />
      </template>
      <template v-else>
        <MusicList :loading="loading" :has-list="hasMusic" :list="musicList" />
      </template>
    </div>
    <div class="floor">
      <Pagination v-model="searchPageSize" :size="size" :total-size="totalSize" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.content_heigth {
  height: 476px;
}
.search_default {
  display: flex;
  justify-content: center;
  align-items: center;
  .search_icon {
    width: 80px;
    height: 80px;
    color: var(--color-primary);
  }
}
.search_content {
  .main {
    height: 430px;
    .songList {
      padding: 10px 0 0 10px;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
    }
  }

  .floor {
    padding-top: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
