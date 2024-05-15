<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSetStore } from '@r/store/setting';

const setStore = useSetStore();
const { setList } = storeToRefs(setStore);

const setApiSource = (id: string) => {
  setList.value.apiSource = id;
};
</script>

<template>
  <div class="set_play">
    <SetTitle> 播放设置 </SetTitle>
    <div class="common_card">
      <div>音乐源</div>
      <div class="common_card_item">
        <div
          v-for="item in setList.apiSourceList"
          :key="item.id"
          class="source_name"
          :class="{ active: setList.apiSource === item.id }"
          @click="setApiSource(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.set_play {
  .source_name {
    cursor: pointer;
    padding-right: 10px;
  }

  .active {
    color: var(--color-primary);
  }
}
.common_card {
  padding-top: 10px;
  font-size: 12px;
  .common_card_item {
    display: flex;
    padding: 10px 0;
  }
}
</style>
