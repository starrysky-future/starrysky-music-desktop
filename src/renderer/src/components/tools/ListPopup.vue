<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { VNodeRef, computed, ref, onMounted } from 'vue';
import { playSong, playLater, addList } from '@r/plugins/player/playList';

const props = defineProps<{
  position: SKY.SongList.Position;
  curInfo: SKY.MusicListItem;
}>();

const route = useRoute();
const noCollect = route.name !== 'collect';

const isVisible = defineModel<boolean>();

const list = [
  {
    id: 'play',
    name: '播放',
    ishow: true
  },
  {
    id: 'nextPlay',
    name: '稍后播放',
    ishow: true
  },
  {
    id: 'loveList',
    name: '添加到我的',
    ishow: noCollect
  }
];
let x;
let y;

const domListPopup = ref<VNodeRef | null>(null);
const APPDOM: HTMLElement = document.getElementById('app')!;

onMounted(() => {
  x = computed(() => {
    if (APPDOM?.clientWidth - 16 - props.position.x < domListPopup.value.clientWidth) {
      return APPDOM?.clientWidth - 16 - domListPopup.value.clientWidth;
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

const getClick = (id: string) => {
  if (id === 'play') playSong(props.curInfo, route.name);
  if (id === 'nextPlay') playLater(props.curInfo);
  if (id === 'loveList') addList(props.curInfo, id);
  isVisible.value = false;
};
</script>

<template>
  <Popup v-model="isVisible" :position="{ x: x, y: y }">
    <div ref="domListPopup" class="list_popup">
      <div
        v-for="item in list"
        v-show="item.ishow"
        :key="item.id"
        class="list_popup_item"
        @click="getClick(item.id)"
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
