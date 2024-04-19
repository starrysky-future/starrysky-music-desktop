<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useSearchStore, sortList } from '@r/store/search';

const searchStore = useSearchStore();
const { SsourceId, sortId } = storeToRefs(searchStore);

const searchValue = ref<string>('');

const setSourceId = (id: string) => {
  SsourceId.value = id;
};
const setSort = (id: string) => {
  sortId.value = id;
};
</script>

<template>
  <Tabs
    v-model="searchValue"
    is-page="search"
    :active-source-id="SsourceId"
    :sort-list="sortList"
    :active-sort-id="sortId"
    has-border
    has-search
    @set-source-id="setSourceId"
    @set-sort="setSort"
  />
</template>

<style lang="less" scoped></style>
