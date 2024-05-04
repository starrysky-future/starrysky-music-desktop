<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import {
  playSong,
  playLater,
  addList,
  deleteMusic,
  deleteMusicAll
} from '@r/plugins/player/playList';
import { useListpopupStore } from '@r/store/app';

const route = useRoute();

const playStore = usePlayStore();
const { curPlayInfo } = storeToRefs(playStore);

const listpopupStore = useListpopupStore();
const { showListpopup, listpopupPosition, listpopupData, listpopupOpr } =
  storeToRefs(listpopupStore);

const props = defineProps<{
  list: Array<SKY.MusicListItem> | undefined;
  hasList: boolean | undefined;
  loading?: boolean;
}>();

const curInfo = ref<SKY.MusicListItem>();
const active = ref<string>('');
const nowNum = ref<number>(0);
const popupList: Array<SKY.SongList.PopupListItem> = [
  {
    id: 'play',
    name: '播放',
    ishow: true
  },
  {
    id: 'nextPlay',
    name: '稍后播放',
    ishow: true
  },
  {
    id: 'loveList',
    name: '添加到我的',
    ishow: route.name !== 'collect'
  },
  {
    id: 'delete',
    name: '删除',
    ishow: route.name === 'collect'
  },
  {
    id: 'deleteAll',
    name: '清空列表',
    ishow: route.name === 'collect'
  }
];

const setListOpr = (id: string) => {
  if (id === 'play') playSong(curInfo.value, nowNum.value);
  if (id === 'nextPlay') playLater(curInfo.value!);
  if (id === 'loveList') addList(curInfo.value!, id);
  if (id === 'delete') deleteMusic(nowNum.value);
  if (id === 'deleteAll') deleteMusicAll();

  showListpopup.value = false;
};

const getMenu = (songInfo: SKY.MusicListItem, index, $event) => {
  nowNum.value = index;
  active.value = songInfo.songmid;
  curInfo.value = songInfo;

  listpopupData.value = popupList;
  listpopupOpr.value = setListOpr;
  showListpopup.value = true;
  listpopupPosition.value.x = $event.clientX;
  listpopupPosition.value.y = $event.clientY;
};

const stopActive = watch(showListpopup, (val) => {
  if (!val && active.value) {
    active.value = '';
  }
});

onBeforeUnmount(() => {
  stopActive();
});
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
      <template v-if="props.hasList">
        <div
          v-for="(item, index) in props.list"
          :key="item.songmid"
          class="music_item"
          :class="{ active: active === item.songmid && showListpopup }"
          :data-song-info="JSON.stringify(item)"
          @dblclick="playSong(item, index)"
          @click.right="getMenu(item, index, $event)"
        >
          <div class="w_5">
            <div v-if="curPlayInfo.songmid === item.songmid" class="commom_icon">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xlink="http://www.w3.org/1999/xlink"
                height="100%"
                viewBox="0 0 16 16"
                space="preserve"
              >
                <use xlink:href="#icon-list-play" />
              </svg>
            </div>
            <template v-else>
              {{ index + 1 }}
            </template>
          </div>
          <div class="w_30 pd_right singleTextHide">
            <span class="select" @click.stop>
              <Tiptool :text="item.name">
                {{ item.name }}
              </Tiptool>
            </span>
          </div>
          <div class="w_20 pd_right singleTextHide">
            <span class="select" @click.stop>
              <Tiptool :text="item.singer">
                {{ item.singer }}
              </Tiptool>
            </span>
          </div>
          <div class="w_35 pd_right singleTextHide">
            <span class="select" @click.stop>
              <Tiptool :text="item.albumName">
                {{ item.albumName }}
              </Tiptool>
            </span>
          </div>
          <div class="w_10">{{ item.interval }}</div>
        </div>
      </template>
      <Loading v-else-if="props.loading" />
      <NoData v-else />
    </div>
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
  .commom_icon {
    width: 16px;
    height: 16px;
    color: var(--color-primary);
  }
  .pd_right {
    padding-right: 6px;
  }
}
</style>
