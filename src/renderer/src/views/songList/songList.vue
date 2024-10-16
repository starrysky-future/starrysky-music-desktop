<script lang="ts" setup>
import { VNodeRef, computed, onActivated, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSongListStore, useMusicListStore } from '@r/store/songList';
import sources from '@r/apis';

const router = useRouter();

const songListStore = useSongListStore();
const musicListStore = useMusicListStore();
const { songList, sourceId, sortId, curListId, tagId, pageSize,songListScrollTop } = storeToRefs(songListStore);
const { musiclistId } = storeToRefs(musicListStore);

const loading = ref<boolean>(false);
const songListRef = ref<VNodeRef | null>(null)

const totalSize = computed(() => {
  return Math.ceil(songList.value[curListId.value].total / songList.value[curListId.value].limit);
});

const size = computed(() => {
  return totalSize.value >= 10 ? 10 : totalSize.value;
});

const hasList = computed(() => {
  return (
    songList.value[curListId.value].list[pageSize.value - 1] &&
    songList.value[curListId.value].list[pageSize.value - 1].length > 0
  );
});

const setSourceId = (id: string) => {
  initSongListScrollTop()

  sourceId.value = id;
  sortId.value = sources[sourceId.value].config.sortList[0].id;
  pageSize.value = 1;
};

const setSort = (id: string) => {
  initSongListScrollTop()

  sortId.value = id;
  pageSize.value = 1;
};

const goDetail = (id: string) => {
  songListScrollTop.value = songListRef.value.scrollTop

  musiclistId.value = id;

  router.push({
    name: 'songListDetail',
    query: { pageName: 'songList' }
  });
};

// tabs切换时清除滚动高度
const initSongListScrollTop = ()=>{
  songListScrollTop.value = 0
  songListRef.value.scrollTop = 0
}

watchEffect(async () => {
  if (hasList.value) return;

  loading.value = true;
  try {
    const data = await sources[sourceId.value].getSongList(
      sortId.value,
      tagId.value,
      pageSize.value
    );
    loading.value = false;

    if (songList.value[curListId.value].list.length) {
      songList.value[curListId.value].list[pageSize.value - 1] = [...data.list];
    } else {
      songList.value[curListId.value].limit = data.limit;
      songList.value[curListId.value].list[pageSize.value - 1] = [...data.list];
      songList.value[curListId.value].pageSize = data.pageSize;
      songList.value[curListId.value].source = data.source;
      songList.value[curListId.value].total = data.total;
    }
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
});

onActivated(()=>{
  songListRef.value.scrollTop = songListScrollTop.value
})
</script>

<template>
  <Tabs
    is-page="songList"
    :sort-list="sources[sourceId].config.sortList"
    :active-source-id="sourceId"
    :active-sort-id="sortId"
    @set-source-id="setSourceId"
    @set-sort="setSort"
  />
  <div ref="songListRef" class="songList scroll">
    <div v-if="hasList" class="main">
      <template v-for="item in songList[curListId].list[pageSize - 1]" :key="item.id">
        <SongListItem :list="item" @click="goDetail(item.id)" />
      </template>
    </div>
    <Loading v-else-if="loading" />
    <NoData v-else />
  </div>
  <div class="floor">
    <Pagination v-model="pageSize" :size="size" :total-size="totalSize" />
  </div>
</template>

<style lang="less" scoped>
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
</style>
