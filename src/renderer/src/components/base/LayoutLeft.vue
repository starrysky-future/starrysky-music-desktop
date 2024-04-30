<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { deleteList } from '@r/plugins/player/playList';

const props = defineProps<{
  list: SKY.LeaderBoard.LayoutList;
  activeId: string;
  hasMenu?: boolean;
}>();

const isVisible = ref<boolean>(false);
const labelId = ref<string>('');
const position = reactive({
  x: 0,
  y: 0
});

const popupList = computed(() => {
  return [
    {
      id: 'deleteList',
      name: '删除列表',
      ishow: labelId.value !== 'defaultList' && labelId.value !== 'loveList'
    }
  ];
});

const emits = defineEmits(['setActiveId']);

const getMenu = (id: string, $event) => {
  if (!props.hasMenu) return;
  labelId.value = id;

  isVisible.value = true;
  position.x = $event.clientX;
  position.y = $event.clientY;
};

const setListOpr = (id: string) => {
  if (id === 'deleteList') deleteList(labelId.value);

  isVisible.value = false;
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

  <div v-if="hasMenu">
    <ListPopup
      v-model="isVisible"
      :position="position"
      :list="popupList"
      @set-list-opr="setListOpr"
    />
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
