<script lang="ts" setup>
import { watchEffect, onBeforeUnmount, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useLeaderBoardStore } from '@r/store/leaderBoard';
import sources from '@r/apis';

const leaderBoardStore = useLeaderBoardStore();
const { LBsourceId, leaderBoardlistId, leaderBoardList } = storeToRefs(leaderBoardStore);

const setSourceId = (id: string) => {
  LBsourceId.value = id;
  leaderBoardlistId.value = sources[LBsourceId.value].lbConfig.topList[0].id;
};
const setActiveId = (info) => {
  leaderBoardlistId.value = info.id;
};

const loading = ref<boolean>(false);

const hasList = computed(() => {
  return (
    leaderBoardList.value[leaderBoardlistId.value] &&
    leaderBoardList.value[leaderBoardlistId.value].length > 0
  );
});

const list = computed(() => {
  return leaderBoardList.value[leaderBoardlistId.value];
});

const stop = watchEffect(async () => {
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
  stop();
});
</script>

<template>
  <Tabs
    is-page="leaderBoard"
    :active-source-id="LBsourceId"
    has-border
    @set-source-id="setSourceId"
  />

  <div class="leaderBoard">
    <div class="leaderBoard_left scroll">
      <LayoutLeft
        :list="sources[LBsourceId].lbConfig.topList"
        :active-id="leaderBoardlistId"
        @set-active-id="setActiveId"
      />
    </div>
    <div class="leaderBoard_right scroll">
      <MusicList :loading="loading" :has-list="hasList" :list="list" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.leaderBoard_tabs {
  display: flex;
  justify-content: center;
}
.leaderBoard {
  height: 476px;
  display: flex;
  .leaderBoard_left {
    height: 100%;
    width: 100px;
    border-right: 0.5px solid;
    border-color: var(--color-primary-light-900);
  }
  .leaderBoard_right {
    flex: 1;
    height: 100%;
  }
}
</style>
