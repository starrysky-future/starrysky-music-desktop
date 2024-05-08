<script lang="ts" setup>
import sources from '@r/apis';

const props = defineProps<{
  isPage: string;
  activeSourceId: string;
  sortList?: SKY.SongList.SortList;
  activeSortId?: string | number;
  hasBorder?: boolean;
  hasSearch?: boolean;
}>();

const emits = defineEmits(['setSourceId', 'setSort', 'setSearchValue']);

const setSearchValue = (val: string) => {
  emits('setSearchValue', val);
};
</script>

<template>
  <div class="tabs" :class="{ has_border: props.hasBorder }">
    <div v-if="props.isPage === 'songList'" class="tag">默认</div>
    <div class="sources">
      <div
        v-for="item in sources.sources"
        v-show="item.show"
        :key="item.id"
        class="sourcesItlem"
        :class="{ active: item.id === props.activeSourceId }"
        @click="emits('setSourceId', item.id)"
      >
        {{ item.name }}
      </div>
    </div>
    <div v-if="props.isPage === 'songList' || props.isPage === 'search'" class="sort">
      <div
        v-for="item in props.sortList"
        :key="item.id"
        class="sourcesItlem"
        :class="{ active: item.id === props.activeSortId }"
        @click="emits('setSort', item.id)"
      >
        {{ item.name }}
      </div>
    </div>
    <div v-if="hasSearch" class="search">
      <SearchInput placeholder="搜索" @set-value="setSearchValue" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.tabs {
  display: flex;
  align-items: center;
  font-size: 14px;

  height: 40px;
  padding: 0 10px;
  .tag {
    margin-right: 30px;
    cursor: pointer;
  }
  .sources {
    display: flex;
  }
  .sourcesItlem {
    cursor: pointer;
    margin: 0 5px;
  }
  .sort {
    margin-left: 30px;
    display: flex;
    cursor: pointer;
  }
  .search {
    margin-left: 30px;
    width: 300px;
    height: 24px;
  }

  .active {
    color: var(--color-primary);
    position: relative;
    &::after {
      display: block;
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
.has_border {
  border-bottom: 0.5px solid;
  border-color: var(--color-primary-light-900);
}
</style>
