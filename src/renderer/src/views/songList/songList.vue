<script lang="ts" setup>
import { computed, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSongListStore, useMusicListStore } from '@r/store/songList';
import { useSetStore } from '@r/store/setting';
import sources from '@r/apis';

const router = useRouter();

const songListStore = useSongListStore();
const musicListStore = useMusicListStore();
const setStore = useSetStore();
const { songList, sourceId, sortId, curListId, tagId, pageSize } = storeToRefs(songListStore);
const { listId } = storeToRefs(musicListStore);
const { loadingErr } = storeToRefs(setStore);

const showList = computed(() => {
  return (
    (songList.value[curListId.value].list[pageSize.value - 1] &&
      songList.value[curListId.value].list[pageSize.value - 1].length > 0) ||
    loadingErr.value
  );
});

const goDetail = (item: SKY.SongList.ListItemType) => {
  listId.value = item.id;
  console.log(item);

  router.push({
    name: 'songListDetail',
    query: {
      img: item.img,
      name: item.name,
      desc: item.desc
    }
  });
};

watchEffect(async () => {
  if (
    songList.value[curListId.value].list[pageSize.value - 1] &&
    songList.value[curListId.value].list[pageSize.value - 1].length > 0
  )
    return;
  const data = await sources[sourceId.value].getSongList(sortId.value, tagId.value, pageSize.value);

  if (songList.value[curListId.value].list.length) {
    songList.value[curListId.value].list[pageSize.value - 1] = [...data.list];
  } else {
    songList.value[curListId.value].limit = data.limit;
    songList.value[curListId.value].list[pageSize.value - 1] = [...data.list];
    songList.value[curListId.value].pageSize = data.pageSize;
    songList.value[curListId.value].source = data.source;
    songList.value[curListId.value].total = data.total;
  }
});
</script>

<template>
  <Tabs />
  <div class="songList scroll">
    <div v-if="showList" class="main">
      <template v-for="item in songList[curListId].list[pageSize - 1]" :key="item.id">
        <SongListItem :list="item" @click="goDetail(item)" />
      </template>
    </div>
    <Loading v-else />
  </div>
  <div class="floor">
    <Pagination />
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
