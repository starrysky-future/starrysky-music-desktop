<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { sortList, useSearchSongListStore, useSearchMusicListStore } from '@r/store/search';
import sources from '@r/apis';

const router = useRouter();

const searchSongListStore = useSearchSongListStore();
const searchMusicListStore = useSearchMusicListStore();

const { searchSongList, searchSourceId, searchSortId, searchCurListId, searchPageSize } =
  storeToRefs(searchSongListStore);
const { searchMusiclistId } = storeToRefs(searchMusicListStore);

const searchValue = ref<string>('');
const loading = ref<boolean>(false);

const size = computed(() => {
  return searchSongList.value[searchCurListId.value].total >= 10
    ? 10
    : searchSongList.value[searchCurListId.value].total;
});
const totalSize = computed(() => {
  return Math.ceil(
    searchSongList.value[searchCurListId.value].total /
      searchSongList.value[searchCurListId.value].limit
  );
});

const hasSongList = computed(() => {
  return (
    searchSongList.value[searchCurListId.value].list[searchPageSize.value - 1] &&
    searchSongList.value[searchCurListId.value].list[searchPageSize.value - 1].length > 0
  );
});

const goDetail = (id: string) => {
  searchMusiclistId.value = id;
  router.push({
    name: 'songListDetail'
  });
};

const setSourceId = (id: string) => {
  searchSourceId.value = id;
};
const setSort = (id: string) => {
  searchSortId.value = id;
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

const stopWatch = watch([searchValue, searchSortId], ([val, sortVal]) => {
  if (!val) return;
  if (sortVal === 'searchSongList') {
    console.log(2222);
    getSongList();
  } else {
    console.log('歌曲');
  }
});

onBeforeUnmount(() => {
  stopWatch();
});
</script>

<template>
  <Tabs
    v-model="searchValue"
    is-page="search"
    :active-source-id="searchSourceId"
    :sort-list="sortList"
    :active-sort-id="searchSortId"
    has-border
    has-search
    @set-source-id="setSourceId"
    @set-sort="setSort"
  />
  <div class="search_default">
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
  <div class="search_songList">
    <div class="songList scroll">
      <div v-if="hasSongList" class="main">
        <template v-for="item in searchSongList.list[searchPageSize - 1]" :key="item.id">
          <SongListItem :list="item" @click="goDetail(item.id)" />
        </template>
      </div>
      <Loading v-else-if="loading" />
      <NoData v-else />
    </div>
    <div class="floor">
      <Pagination v-model="searchPageSize" :size="size" :total-size="totalSize" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.search_default {
  height: 476px;
  display: flex;
  justify-content: center;
  align-items: center;
  .search_icon {
    width: 80px;
    height: 80px;
    color: var(--color-primary);
  }
}
.search_songList {
  .songList {
    height: 430px;
    .main {
      margin: 10px 0 0 10px;
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
