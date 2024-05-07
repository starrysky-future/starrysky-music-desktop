<script lang="ts" setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { deleteList, newList } from '@r/plugins/player/playList';
import { useListpopupStore } from '@r/store/app';

const listpopupStore = useListpopupStore();
const { showListpopup, listpopupPosition, listpopupData, listpopupOpr } =
  storeToRefs(listpopupStore);

const props = defineProps<{
  list: SKY.LeaderBoard.LayoutList;
  activeId: string;
  hasMenu?: boolean;
}>();

const labelId = ref<string>('');

const popupList = computed(() => {
  return [
    {
      id: 'newList',
      name: '新列表',
      ishow: true
    },
    {
      id: 'deleteList',
      name: '删除列表',
      ishow: labelId.value !== 'defaultList' && labelId.value !== 'loveList'
    }
  ];
});

const setListOpr = (id: string) => {
  if (id === 'deleteList') deleteList(labelId.value);
  if (id === 'newList') newList();

  showListpopup.value = false;
};

const emits = defineEmits(['setActiveId']);

const getMenu = (id: string, $event) => {
  if (!props.hasMenu) return;
  labelId.value = id;

  listpopupData.value = popupList.value;
  listpopupOpr.value = setListOpr;
  showListpopup.value = true;
  listpopupPosition.value.x = $event.clientX;
  listpopupPosition.value.y = $event.clientY;
};
</script>

<template>
  <div class="layout_left">
    <template v-for="item in props.list" :key="item.id">
      <Tiptool :text="item.name">
        <div
          class="layout_left_name singleTextHide"
          :class="{ active: item.id === props.activeId }"
          @click="emits('setActiveId', item)"
          @click.right="getMenu(item.id, $event)"
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
