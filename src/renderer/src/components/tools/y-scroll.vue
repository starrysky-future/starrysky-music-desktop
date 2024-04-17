<script lang="ts" setup>
import { ref, VNodeRef, onMounted } from 'vue';
const yDom = ref<VNodeRef | null>(null);
const props = defineProps<{
  size: number;
  total: number;
  space: number;
}>();
const pageSize = defineModel<number>();

onMounted(() => {
  yDom.value.addEventListener('scroll', (e) => {
    if (e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) > props.space) {
      (pageSize.value as number)++;
    }
  });
});
</script>

<template>
  <div ref="yDom" class="yScroll scroll">
    <slot></slot>
    <div class="floor">
      <div v-if="props.size < props.total" class="loading">加载中...</div>
      <div v-else>加载完成</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.yScroll {
  height: 100%;
  .floor {
    padding-bottom: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
