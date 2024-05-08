<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useListpopupStore } from '@r/store/app';
import { VNodeRef, computed, ref, onMounted } from 'vue';

const listpopupStore = useListpopupStore();
const {
  showListpopup,
  listpopupPosition,
  listpopupData,
  listpopupOpr,
  listpopupActiveId,
  listpopupTransition
} = storeToRefs(listpopupStore);

let x;
let y;

const domListPopup = ref<VNodeRef | null>(null);
const APPDOM: HTMLElement = document.getElementById('app')!;

const transitionWH = computed(() => {
  return {
    width: listpopupPosition.value.width,
    height: listpopupPosition.value.height! * listpopupData.value.length
  };
});

onMounted(() => {
  x = computed(() => {
    if (
      domListPopup.value &&
      APPDOM?.clientWidth - 8 - listpopupPosition.value.x < domListPopup.value.clientWidth
    ) {
      return APPDOM?.clientWidth - 8 - domListPopup.value.clientWidth;
    }
    return listpopupPosition.value.x;
  });
  y = computed(() => {
    if (
      domListPopup.value &&
      APPDOM?.clientHeight - listpopupPosition.value.y < domListPopup.value.clientHeight
    ) {
      return APPDOM?.clientHeight - domListPopup.value.clientHeight;
    }
    return listpopupPosition.value.y;
  });
});
</script>

<template>
  <Popup
    v-model="showListpopup"
    :position="{ x: x, y: y }"
    :transition-name="listpopupTransition"
    :transition-w-h="transitionWH"
    has-listener
  >
    <div ref="domListPopup" class="list_popup">
      <div
        v-for="item in listpopupData"
        v-show="item.show"
        :key="item.id"
        class="list_popup_item"
        :style="{ width: listpopupPosition.width + 'px', height: listpopupPosition.height + 'px' }"
        :class="{ active: listpopupActiveId === item.id }"
        @click="listpopupOpr(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </Popup>
</template>

<style lang="less" scoped>
.list_popup {
  cursor: pointer;
  .list_popup_item {
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: var(--color-primary-light-400-alpha-500);
    }
  }
  .active {
    background-color: var(--color-primary-light-400-alpha-500);
  }
}
</style>
