<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import sources from '@r/apis';
import { useSongListStore, useMusicListStore } from '@r/store/songList';
import { useSearchSongListStore, useSearchMusicListStore } from '@r/store/search';
import { usePlayStore } from '@r/store/play';
import { useNavStore } from '@r/store/nav';
import { playSong } from '@r/plugins/player/playList';

const router = useRouter();
const route = useRoute();

const pageName = route.query.pageName;

const songListStore = useSongListStore();
const musicListStore = useMusicListStore();
const { sourceId, curListId } = storeToRefs(songListStore);
const { musicList, musiclistId } = storeToRefs(musicListStore);

const searchSongListStore = useSearchSongListStore();
const searchMusicListStore = useSearchMusicListStore();
const { searchSourceId, searchCurListId } = storeToRefs(searchSongListStore);
const { searchMusicList, searchMusiclistId } = storeToRefs(searchMusicListStore);

const playStore = usePlayStore();
const { playList } = storeToRefs(playStore);

const navStore = useNavStore();
const { keepSearchDetail, keepSongListDetail } = storeToRefs(navStore);

let detailSourceId;
let detailList;
let listKey;
let pageKey;

if (pageName === 'search') {
  detailSourceId = searchSourceId.value;
  detailList = searchMusicList.value;
  listKey = searchCurListId.value;
  pageKey = searchMusiclistId.value;

  keepSearchDetail.value = 'search';
} else if (pageName === 'songList') {
  detailSourceId = sourceId.value;
  detailList = musicList.value;
  listKey = curListId.value;
  pageKey = musiclistId.value;

  keepSongListDetail.value = 'songList';
}

const loading = ref<boolean>(false);

const hasList = computed(() => {
  return (
    detailList[listKey].list[pageKey] &&
    detailList[listKey].list[pageKey].list &&
    detailList[listKey].list[pageKey].list.length > 0
  );
});

const noData = computed(() => {
  return (
    detailList[listKey].list[pageKey] &&
    detailList[listKey].list[pageKey].list &&
    detailList[listKey].list[pageKey].list.length === 0
  );
});

const setPlay = () => {
  if (noData.value) return;

  playList.value.playId = playList.value.defaultList.list.length;
  playList.value.playListId = 'defaultList';
  const newList: Array<SKY.MusicListItem> = ([] as Array<SKY.MusicListItem>).concat(
    playList.value.defaultList.list,
    detailList[listKey].list[pageKey].list
  );
  playList.value.defaultList.list = Array.from(new Set(newList));
  playList.value.playId =
    playList.value.playId >= playList.value.defaultList.list.length ? 0 : playList.value.playId;

  playSong(playList.value.defaultList.list[playList.value.playId]);
};

const setCollect = () => {
  if (noData.value || playList.value[pageKey]) return;
  const listSort = Object.keys(playList.value).length - 2;
  const collectList = {
    id: pageKey,
    name: detailList[listKey].list[pageKey].info.name,
    sort: listSort,
    list: detailList[listKey].list[pageKey].list
  };
  playList.value[pageKey] = collectList;
};

const goback = () => {
  router.push({ name: pageName as string });
  if (pageName === 'search') {
    keepSearchDetail.value = '';
  } else if (pageName === 'songList') {
    keepSongListDetail.value = '';
  }
};

const list = computed(() => {
  return detailList[listKey].list[pageKey] && detailList[listKey].list[pageKey].list;
});

const getData = async () => {
  if (hasList.value) return;

  loading.value = true;

  try {
    const data = await sources[detailSourceId].getSongListDetail(pageKey, 1);
    loading.value = false;
    detailList[listKey].pageSize = data.pageSize;
    detailList[listKey].limit = data.limit;
    detailList[listKey].total = data.total;
    detailList[listKey].source = data.source;
    detailList[listKey].list[pageKey] = data.list;
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};
getData();
</script>

<template>
  <div class="list_detail">
    <div class="header">
      <div class="header_left">
        <img
          v-if="detailList[listKey].list[pageKey]?.info.img"
          class="img"
          :src="detailList[listKey].list[pageKey]?.info.img"
        />
        <div v-else class="img no_img">SKY</div>
        <div class="info">
          <div class="name">
            <span class="select">{{ detailList[listKey].list[pageKey]?.info.name }}</span>
          </div>
          <div class="desc multipleTextHide-3">
            <span class="select">{{ detailList[listKey].list[pageKey]?.info.desc }}</span>
          </div>
        </div>
      </div>
      <div class="header_right">
        <div class="btn_style" @click="setPlay">播放</div>
        <div class="btn_style" @click="setCollect">收藏</div>
        <div class="btn_style" @click="goback">返回</div>
      </div>
    </div>
    <div class="main">
      <MusicList :loading="loading" :has-list="hasList" :list="list" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.list_detail {
  .header {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_left {
      display: flex;
      .img {
        flex-shrink: 0;
        display: block;
        border: 1px solid;
        border-color: var(--color-primary);
        border-radius: 4px;
        width: 80px;
        height: 80px;
      }
      .no_img {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--color-primary);
        background-color: var(--color-primary-light-400-alpha-700);
      }
      .info {
        padding: 2px 8px;
        .name {
          font-size: 14px;
        }
        .desc {
          padding-top: 6px;
          font-size: 12px;
          color: var(--color-font-label);
        }
      }
    }
    .header_right {
      display: flex;
      flex-shrink: 0;
      border-radius: 4px;
      background-color: var(--color-primary-light-400-alpha-700);
      overflow: hidden;
      .btn_style {
        cursor: pointer;
        width: 60px;
        height: 36px;
        font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--color-primary);
        &:hover {
          background-color: var(--color-primary-light-400-alpha-300);
        }
      }
    }
  }
  .main {
    height: 416px;
  }
}
</style>
