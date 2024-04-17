<script lang="ts" setup>
import { usePlayStore } from '@r/store/play';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const playStore = usePlayStore();
const { playList } = storeToRefs(playStore);

const list = computed<Array<SKY.Play.PlayListItme>>(() => {
  if (!playList.value) return [];
  const showList: Array<SKY.Play.PlayListItme> = [];
  showList.push(playList.value.defaultList);
  showList.push(playList.value.loveList);
  playList.value.playListId;

  Object.entries(playList.value).map((item) => {
    const [key, list] = item;

    if (key !== 'playId' && key !== 'playListId' && key !== 'defaultList' && key !== 'loveList') {
      showList.push(list as SKY.Play.PlayListItme);
    }
  });

  return showList;
});

const setPlayListId = (id: string) => {
  playList.value.playListId = id;
};
</script>

<template>
  <div class="collect">
    <div class="collect_left">
      <div class="collect_left_header">我的列表</div>
      <div class="collect_left_main scroll">
        <div
          v-for="item in list"
          :key="item.id"
          class="list_label singleTextHide"
          :class="{ active: item.id === playList.playListId }"
          @click="setPlayListId(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="collect_right">
      <MusicList />
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
      height: 475px;
      border-right: 0.5px solid;
      border-color: var(--color-primary-light-900);
      display: flex;
      flex-direction: column;
      .list_label {
        padding: 0 6px;
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        padding-left: 8px;
        &:hover {
          color: var(--color-primary);
          background-color: var(--color-primary-light-400-alpha-500);
        }
      }
    }
  }
  .collect_right {
    flex: 1;
    height: 515px;
  }
  .active {
    color: var(--color-primary);
    background-color: var(--color-primary-light-400-alpha-500);
  }
}
</style>
