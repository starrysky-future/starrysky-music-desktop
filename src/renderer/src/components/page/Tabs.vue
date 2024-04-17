<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSongListStore } from '@r/store/songList';
import sources from '@r/apis';

const songListStore = useSongListStore();
const { sourceId, sortId, pageSize } = storeToRefs(songListStore);

const setsourceId = (id: string) => {
  sourceId.value = id;
  sortId.value = sources[sourceId.value].config.sortList[0].id;
  pageSize.value = 1;
};

const setSort = (id: string) => {
  sortId.value = id;
  pageSize.value = 1;
};
</script>

<template>
  <div class="tabs">
    <div class="tag">默认</div>
    <div class="sources">
      <div
        v-for="item in sources.sources"
        :key="item.id"
        class="sourcesItlem"
        :class="{ active: sourceId === item.id }"
        @click="setsourceId(item.id)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="sort">
      <div
        v-for="item in sources[sourceId].config.sortList"
        :key="item.id"
        class="sourcesItlem"
        :class="{ active: sortId === item.id }"
        @click="setSort(item.id)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tabs {
  font-size: 14px;
  display: flex;
  padding: 10px;
  .tag {
    cursor: pointer;
  }
  .sources {
    margin: 0 30px;
    display: flex;
  }
  .sourcesItlem {
    cursor: pointer;
    margin: 0 5px;
  }
  .sort {
    display: flex;
    cursor: pointer;
  }

  .active {
    color: var(--color-primary);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -6px;
      width: 100%;
      height: 2px;
      background-color: var(--color-primary);
    }
  }
}
</style>
