<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useSongListStore } from '@r/store/songList';

const songListStore = useSongListStore();
const { songList, curListId, pageSize } = storeToRefs(songListStore);

const size = computed(() => {
  return songList.value[curListId.value].total >= 10 ? 10 : songList.value[curListId.value].total;
});
const totalSize = computed(() => {
  return Math.ceil(songList.value[curListId.value].total / songList.value[curListId.value].limit);
});
const hidePre = computed(() => {
  return pageSize.value === 1;
});
const hideNext = computed(() => {
  return pageSize.value === totalSize.value;
});

const setPageSize = (size: number, opr?: string) => {
  if (
    (opr === 'prepro' && pageSize.value !== 1) ||
    (opr === 'nextpro' && pageSize.value !== totalSize.value)
  ) {
    pageSize.value = size;
  }
  if (
    (opr === 'pre' && pageSize.value! > 1) ||
    (opr === 'next' && pageSize.value! < totalSize.value)
  ) {
    pageSize.value! += size;
  }
  if (pageSize.value !== size && !opr) {
    pageSize.value = size;
  }
};
</script>

<template>
  <div class="pagination">
    <div class="sizeStyle" :class="{ hide: hidePre }" @click="setPageSize(1, 'prepro')">
      <div class="icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 16 16"
          space="preserve"
        >
          <use xlink:href="#icon-pagination-prepro" />
        </svg>
      </div>
    </div>
    <div class="sizeStyle" :class="{ hide: hidePre }" @click="setPageSize(-1, 'pre')">
      <div class="icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 16 16"
          space="preserve"
        >
          <use xlink:href="#icon-pagination-pre" />
        </svg>
      </div>
    </div>
    <div class="page">
      <div
        v-for="(item, index) in size"
        :key="index"
        class="sizeStyle"
        :class="{ active: pageSize === item }"
        @click="setPageSize(item)"
      >
        {{ item }}
      </div>
    </div>
    <div class="sizeStyle" :class="{ hide: hideNext }" @click="setPageSize(1, 'next')">
      <div class="icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 16 16"
          space="preserve"
        >
          <use xlink:href="#icon-pagination-next" />
        </svg>
      </div>
    </div>
    <div class="sizeStyle" :class="{ hide: hideNext }" @click="setPageSize(totalSize, 'nextpro')">
      <div class="icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 16 16"
          space="preserve"
        >
          <use xlink:href="#icon-pagination-nextpro" />
        </svg>
      </div>
    </div>
  </div>
  <div class="pageTotal">总页数 : {{ totalSize }}</div>
</template>

<style lang="less" scoped>
.pagination {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--color-primary);
  background-color: var(--color-primary-light-700-alpha-100);
  border-radius: 2px;
  .page {
    display: flex;
    border-radius: 2px;
  }
  .sizeStyle {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: var(--color-primary-light-300-alpha-100);
    }
  }
  .icon {
    width: 16px;
    height: 16px;
  }
  .active {
    background-color: var(--color-primary-light-300-alpha-100);
  }
  .hide {
    color: var(--color-primary-light-400);
  }
}
.pageTotal {
  margin-left: 10px;
  font-size: 12px;
}
</style>
