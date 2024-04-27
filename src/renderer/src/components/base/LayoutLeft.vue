<script lang="ts" setup>
const props = defineProps<{
  list: SKY.LeaderBoard.LayoutList;
  activeId: string;
}>();

const emits = defineEmits(['setActiveId']);
</script>

<template>
  <div class="layout_left">
    <template v-for="item in props.list" :key="item.id">
      <Tiptool :text="item.name">
        <div
          class="layout_left_name singleTextHide"
          :class="{ active: item.id === props.activeId }"
          @click="emits('setActiveId', item)"
        >
          {{ item.name }}
        </div>
      </Tiptool>
    </template>
  </div>
</template>

<style lang="less" scoped>
.layout_left {
  display: flex;
  flex-direction: column;
  .layout_left_name {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    padding: 0 8px;
    &:hover {
      color: var(--color-primary);
      background-color: var(--color-primary-light-400-alpha-500);
    }
  }
  .layout_left_name_span {
    max-width: 100%;
    display: inline-block;
  }
  .active {
    color: var(--color-primary);
    background-color: var(--color-primary-light-400-alpha-500);
  }
}
</style>
