<script lang="ts" setup>
const props = defineProps<{ list: SKY.SongList.ListItemType }>();
</script>

<template>
  <div class="list_item">
    <img v-if="props.list.img" class="img" :src="props.list.img" />
    <div v-else class="img no_img">SKY</div>
    <div class="right">
      <div class="name multipleTextHide-2">{{ props.list.name }}</div>
      <div class="labelStyle">{{ props.list.author }}</div>
      <div class="labelStyle">{{ props.list.time }}</div>
      <div class="data labelStyle">
        <div>{{ props.list.total }}</div>
        <div>{{ props.list.play_count }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.list_item {
  width: 320px;
  padding-right: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  &:hover {
    opacity: 0.6;
  }
  .img {
    width: 120px;
    height: 120px;
    display: block;
    border: 1px solid;
    border-color: var(--color-primary);
    border-radius: 4px;
  }
  .no_img {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-primary);
    background-color: var(--color-primary-light-400-alpha-700);
  }
  .right {
    padding-left: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .name {
      font-size: 14px;
    }
    .labelStyle {
      font-size: 12px;
      color: var(--color-font-label);
    }
    .data {
      display: flex;
    }
  }
}
</style>
