<script lang="ts" setup>
import { watchEffect, onBeforeUnmount, computed, ref, VNodeRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useLeaderBoardStore } from '@r/store/leaderBoard';
import sources from '@r/apis';
import { useListpopupStore } from '@r/store/app';

const leaderBoardStore = useLeaderBoardStore();
const { LBsourceId, LBsourceName, leaderBoardlistId, leaderBoardList } =
  storeToRefs(leaderBoardStore);

const listpopupStore = useListpopupStore();
const {
  showListpopup,
  listpopupPosition,
  listpopupData,
  listpopupOpr,
  listpopupActiveId,
  listpopupTransition
} = storeToRefs(listpopupStore);

const domSource = ref<VNodeRef | null>(null);
const loading = ref<boolean>(false);
const activeArrow = ref<boolean>(false);

const hasList = computed(() => {
  return (
    leaderBoardList.value[leaderBoardlistId.value] &&
    leaderBoardList.value[leaderBoardlistId.value].length > 0
  );
});
const list = computed(() => {
  return leaderBoardList.value[leaderBoardlistId.value];
});

const setListOpr = (item: SKY.SongList.PopupListItem) => {
  LBsourceId.value = item.id;
  LBsourceName.value = item.name;
  leaderBoardlistId.value = sources[LBsourceId.value].lbConfig.topList[0].id;

  showListpopup.value = false;
};

const getMenu = () => {
  if (activeArrow.value) {
    showListpopup.value = false;
    return;
  }

  const rect = domSource.value.getBoundingClientRect();

  listpopupPosition.value.x = rect.x;
  listpopupPosition.value.y = rect.y + rect.height;
  listpopupPosition.value.width = rect.width;
  listpopupData.value = sources.sources;
  listpopupOpr.value = setListOpr;
  listpopupActiveId.value = LBsourceId.value;
  listpopupTransition.value = 'TransitionHeight';
  showListpopup.value = true;

  activeArrow.value = true;
};

const setActiveId = (info) => {
  leaderBoardlistId.value = info.id;
};

const stopWatchShow = watch([showListpopup, listpopupData], ([val, listVal]) => {
  const sourceList = ['wy', 'tx', 'kg', 'mg', 'kw'];
  if (!val || sourceList.indexOf(listVal[0].id) < 0) {
    activeArrow.value = false;
  }
});

const stopGetData = watchEffect(async () => {
  if (
    leaderBoardList.value[leaderBoardlistId.value] &&
    leaderBoardList.value[leaderBoardlistId.value].length > 0
  )
    return;

  loading.value = true;

  try {
    const bangid = leaderBoardlistId.value.split('__')[1];
    const data = await sources[LBsourceId.value].getLeaderBoardList(bangid, 1);

    leaderBoardList.value.total = data.total;
    leaderBoardList.value.limit = data.limit;
    leaderBoardList.value.pageSize = data.pageSize;
    leaderBoardList.value.source = data.source;
    leaderBoardList.value[leaderBoardlistId.value] = data.list;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
});

onBeforeUnmount(() => {
  stopWatchShow();
  stopGetData();
});
</script>

<template>
  <div class="leaderBoard">
    <div class="leaderBoard_left">
      <div ref="domSource" class="source" @click="getMenu" @click.stop>
        <div class="source_name">{{ LBsourceName }}</div>
        <div class="arrow_icon" :class="{ arrowDirection: activeArrow }">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            height="100%"
            viewBox="0 0 24 24"
            space="preserve"
          >
            <use xlink:href="#icon-hide" />
          </svg>
        </div>
      </div>
      <div class="leaderBoard_left_content scroll">
        <LayoutLeft
          :list="sources[LBsourceId].lbConfig.topList"
          :active-id="leaderBoardlistId"
          @set-active-id="setActiveId"
        />
      </div>
    </div>
    <div class="leaderBoard_right">
      <MusicList :loading="loading" :has-list="hasList" :list="list" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.leaderBoard {
  height: 516px;
  display: flex;
  .leaderBoard_left {
    height: 100%;
    width: 100px;
    border-right: 0.5px solid;
    border-color: var(--color-primary-light-900);
    .source {
      cursor: pointer;
      height: 40px;
      padding: 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .source_name {
        font-size: 12px;
      }
      .arrow_icon {
        width: 16px;
        height: 16px;
        color: var(--color-primary);
        transform: rotateZ(0);
        transition: transform 0.3s;
      }
      .arrowDirection {
        transform: rotateZ(180deg);
        transform-origin: 50% 60%;
        transition: transform 0.3s;
      }
      &:hover {
        background-color: var(--color-primary-light-400-alpha-500);
      }
    }
    .leaderBoard_left_content {
      height: calc(~'100% - 40px');
    }
  }
  .leaderBoard_right {
    flex: 1;
    height: 100%;
  }
}
</style>
