<script lang="ts" setup>
import { usePlayStore } from '@r/store/play';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const playStore = usePlayStore();
const { playList } = storeToRefs(playStore);

const labelList = computed<Array<SKY.Play.PlayListItem>>(() => {
  if (!playList.value) return [];
  const showList: Array<SKY.Play.PlayListItem> = [];
  showList.push(playList.value.defaultList);
  showList.push(playList.value.loveList);
  playList.value.playListId;

  Object.entries(playList.value).map((item) => {
    const [key, list] = item;

    if (key !== 'playId' && key !== 'playListId' && key !== 'defaultList' && key !== 'loveList') {
      showList.push(list as SKY.Play.PlayListItem);
    }
  });

  return showList;
});

const hasList = computed(() => {
  return playList.value[playList.value.playListId].list.length > 0;
});

const contentList = computed(() => {
  return playList.value[playList.value.playListId].list;
});

const setPlayListId = (info) => {
  playList.value.playListId = info.id;
};
</script>

<template>
  <div class="collect">
    <div class="collect_left">
      <div class="collect_left_header">我的列表</div>
      <div class="collect_left_main scroll">
        <LayoutLeft
          :list="labelList"
          :active-id="playList.playListId"
          has-menu
          @set-active-id="setPlayListId"
        />
      </div>
    </div>
    <div class="collect_right">
      <MusicList :has-list="hasList" :list="contentList" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.collect {
  display: flex;
  font-size: 12px;
  .collect_left {
    width: 100px;
    .collect_left_header {
      padding-left: 8px;
      height: 40px;
      display: flex;
      align-items: center;
      border-bottom: 0.5px solid;
      border-color: var(--color-primary-light-900);
    }
    .collect_left_main {
      height: 476px;
      border-right: 0.5px solid;
      border-color: var(--color-primary-light-900);
    }
  }
  .collect_right {
    flex: 1;
    height: 516px;
  }
  .active {
    color: var(--color-primary);
    background-color: var(--color-primary-light-400-alpha-500);
  }
}
</style>
