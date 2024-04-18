<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { ref, reactive } from 'vue';
import { playSong } from '@r/plugins/player/playList';

const props = defineProps<{
  list: Array<SKY.MusicListItem> | undefined;
  showList: boolean | undefined;
  loading?: boolean;
}>();

const curInfo = ref<SKY.MusicListItem>();
const active = ref<string>('');

const isVisible = ref<boolean>(false);
const position = reactive({
  x: 0,
  y: 0
});

const route = useRoute();

const getMenu = (songInfo: SKY.MusicListItem, $event) => {
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
      <template v-if="props.showList">
        <div
          v-for="(item, index) in props.list"
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
      </template>
      <Loading v-else-if="props.loading" />
      <NoData v-else />
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
    padding-right: 6px;
  }
}
</style>
