import { defineStore } from 'pinia';
import { ref } from 'vue';
import sources from '@r/apis';

export const useLeaderBoardStore = defineStore('useLeaderBoardStore', () => {
  const LBsourceId = ref<string>('wy');
  const leaderBoardlistId = ref<string>(sources[LBsourceId.value].lbConfig.topList[0].id);
  const leaderBoardList = ref<SKY.LeaderBoard.LeaderBoardObj>({
    total: 0,
    list: {},
    limit: 0,
    pageSize: 1,
    source: 'wy'
  });

  return { leaderBoardList, LBsourceId, leaderBoardlistId };
});
