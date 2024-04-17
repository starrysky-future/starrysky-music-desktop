<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useMusicListStore } from '@r/store/songList';
import { usePlayStore } from '@r/store/play';
import { useRoute } from 'vue-router';
import { computed, ref, reactive } from 'vue';
import { playSong } from '@r/plugins/player/playList';
import { useSongListStore } from '@r/store/songList';

const curInfo = ref<SKY.SongList.MusicListItem>();
const active = ref<string>('');

const songListStore = useSongListStore();
const musicListStore = useMusicListStore();
const playStore = usePlayStore();
const { curListId } = storeToRefs(songListStore);
const { musicList, listId } = storeToRefs(musicListStore);
const { playList } = storeToRefs(playStore);

const isVisible = ref<boolean>(false);
const position = reactive({
  x: 0,
  y: 0
});

const route = useRoute();

const showList = computed(() => {
  if (route.name === 'songListDetail') {
    return musicList.value[curListId.value].list[listId.value].list;
  } else if (route.name === 'collect') {
    return playList.value[playList.value.playListId].list;
  } else {
    return [];
  }
});

const getMenu = (songInfo: SKY.SongList.MusicListItem, $event) => {
  active.value = songInfo.songmid;
  curInfo.value = songInfo;
  isVisible.value = true;
  position.x = $event.clientX;
  position.y = $event.clientY;
};
</script>

<template>
  <div class="music_list">
    <div class="header">
      <div class="w_5">#</div>
      <div class="w_30 singleTextHide">歌曲名</div>
      <div class="w_20 singleTextHide">演唱者</div>
      <div class="w_35 singleTextHide">专辑名</div>
      <div class="w_10">时长</div>
    </div>
    <div class="main scroll">
      <div
        v-for="(item, index) in showList"
        :key="item.songmid"
        class="music_item"
        :class="{ active: active === item.songmid }"
        :data-song-info="JSON.stringify(item)"
        @dblclick="playSong(item, route.name === 'collect')"
        @click.right="getMenu(item, $event)"
      >
        <div class="w_5">{{ index }}</div>
        <div class="w_30 pd_right singleTextHide">
          <span class="select" @click.stop>{{ item.name }}</span>
        </div>
        <div class="w_20 pd_right singleTextHide">
          <span class="select" @click.stop>{{ item.singer }}</span>
        </div>
        <div class="w_35 pd_right singleTextHide">
          <span class="select" @click.stop>{{ item.albumName }}</span>
        </div>
        <div class="w_10">{{ item.interval }}</div>
      </div>
    </div>
  </div>
  <div v-show="isVisible">
    <ListPopup v-model="isVisible" :position="position" :cur-info="curInfo" />
  </div>
</template>

<style lang="less" scoped>
.music_list {
  height: 100%;
  font-size: 12px;
  .header {
    padding-left: 18px;
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 0.5px solid;
    border-color: var(--color-primary-light-900);
  }
  .main {
    height: calc(~'100% - 40px');
    cursor: pointer;
    .music_item {
      padding-left: 18px;
      display: flex;
      align-items: center;
      height: 38px;
      &:hover {
        background-color: var(--color-primary-light-400-alpha-500);
      }
    }
  }
  .active {
    background-color: var(--color-primary-light-400-alpha-500);
  }
  .w_5 {
    flex: 0 0 5%;
    color: var(--color-font-label);
  }
  .w_10 {
    flex: 0 0 10%;
  }
  .w_20 {
    flex: 0 0 20%;
  }
  .w_30 {
    flex: 0 0 30%;
  }
  .w_35 {
    flex: 0 0 35%;
  }
  .pd_right {
    padding-right: 4px;
  }
}
</style>
