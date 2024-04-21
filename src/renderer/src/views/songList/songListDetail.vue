<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import sources from '@r/apis';
import { useSongListStore, useMusicListStore } from '@r/store/songList';
import { usePlayStore } from '@r/store/play';
import { useSetStore } from '@r/store/setting';
import { playSong } from '@r/plugins/player/playList';

const router = useRouter();
const route = useRoute();

const songListStore = useSongListStore();
const musicListStore = useMusicListStore();
const setStore = useSetStore();
const playStore = usePlayStore();
const { sourceId, curListId } = storeToRefs(songListStore);
const { musicList, musiclistId } = storeToRefs(musicListStore);
const { isKeepList } = storeToRefs(setStore);
const { playList } = storeToRefs(playStore);

const loading = ref<boolean>(false);

const hasList = computed(() => {
  return (
    musicList.value[curListId.value] &&
    musicList.value[curListId.value].list[musiclistId.value] &&
    musicList.value[curListId.value].list[musiclistId.value].list &&
    musicList.value[curListId.value].list[musiclistId.value].list.length > 0
  );
});

const noData = computed(() => {
  return (
    musicList.value[curListId.value] &&
    musicList.value[curListId.value].list[musiclistId.value] &&
    musicList.value[curListId.value].list[musiclistId.value].list &&
    musicList.value[curListId.value].list[musiclistId.value].list.length === 0
  );
});

// 页面保存
isKeepList.value = true;

const setPlay = () => {
  if (noData.value) return;

  playList.value.playId = playList.value.defaultList.list.length;
  playList.value.playListId = 'defaultList';
  const newList: Array<SKY.MusicListItem> = ([] as Array<SKY.MusicListItem>).concat(
    playList.value.defaultList.list,
    musicList.value[curListId.value].list[musiclistId.value].list
  );
  playList.value.defaultList.list = Array.from(new Set(newList));
  playList.value.playId =
    playList.value.playId >= playList.value.defaultList.list.length ? 0 : playList.value.playId;

  playSong(playList.value.defaultList.list[playList.value.playId], route.name);
};

const setCollect = () => {
  if (noData.value) return;
  const collectList = {
    id: musiclistId.value,
    name: musicList.value[curListId.value].list[musiclistId.value].info.name,
    list: musicList.value[curListId.value].list[musiclistId.value].list
  };
  playList.value[musiclistId.value] = collectList;
};

const goback = () => {
  router.push({ name: 'songList' });
  isKeepList.value = false;
};

const list = computed(() => {
  return (
    musicList.value[curListId.value].list[musiclistId.value] &&
    musicList.value[curListId.value].list[musiclistId.value].list
  );
});

const getData = async () => {
  if (hasList.value) return;

  loading.value = true;

  try {
    const data = await sources[sourceId.value].getSongListDetail(musiclistId.value, 1);
    loading.value = false;
    musicList.value[curListId.value].pageSize = data.pageSize;
    musicList.value[curListId.value].limit = data.limit;
    musicList.value[curListId.value].total = data.total;
    musicList.value[curListId.value].source = data.source;
    musicList.value[curListId.value].list[musiclistId.value] = data.list;
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
          v-if="musicList[curListId].list[musiclistId]?.info.img"
          class="img"
          :src="musicList[curListId].list[musiclistId]?.info.img"
        />
        <div v-else class="img no_img">SKY</div>
        <div class="info">
          <div class="name">
            <span class="select">{{ musicList[curListId].list[musiclistId]?.info.name }}</span>
          </div>
          <div class="desc multipleTextHide-3">
            <span class="select">{{ musicList[curListId].list[musiclistId]?.info.desc }}</span>
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
      <MusicList :loading="loading" :show-list="hasList" :list="list" />
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
