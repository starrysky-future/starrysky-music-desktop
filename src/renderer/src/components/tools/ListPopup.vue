<script lang="ts" setup>
import { VNodeRef, computed, ref, onMounted } from 'vue';

const props = defineProps<{
  position: SKY.SongList.Position;
  list: Array<SKY.SongList.PopupListItem>;
}>();

const isVisible = defineModel<boolean>();
const emits = defineEmits(['setListOpr']);

let x;
let y;

const domListPopup = ref<VNodeRef | null>(null);
const APPDOM: HTMLElement = document.getElementById('app')!;

onMounted(() => {
  x = computed(() => {
    if (APPDOM?.clientWidth - 8 - props.position.x < domListPopup.value.clientWidth) {
      return APPDOM?.clientWidth - 8 - domListPopup.value.clientWidth;
    }
    return props.position.x;
  });
  y = computed(() => {
    if (APPDOM?.clientHeight - props.position.y < domListPopup.value.clientHeight) {
      return APPDOM?.clientHeight - domListPopup.value.clientHeight;
    }
    return props.position.y;
  });
});
</script>

<template>
  <Popup
    v-model="isVisible"
    :position="{ x: x, y: y }"
    transition-name="TransitionOpacity"
    has-listener
  >
    <div ref="domListPopup" class="list_popup">
      <div
        v-for="item in props.list"
        v-show="item.ishow"
        :key="item.id"
        class="list_popup_item"
        @click="emits('setListOpr', item.id)"
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
    width: 80px;
    height: 30px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: var(--color-primary-light-400-alpha-500);
    }
  }
}
</style>
