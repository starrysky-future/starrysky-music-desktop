import { createRouter, RouteRecordRaw, Router, createWebHashHistory } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    name: 'songList',
    path: '/',
    component: () => import('@r/views/songList/songList.vue')
  },
  {
    name: 'songListDetail',
    path: '/songListDetail',
    component: () => import('@r/views/songList/songListDetail.vue')
  },
  {
    name: 'leaderBoard',
    path: '/leaderBoard',
    component: () => import('@r/views/leaderBoard/leaderBoard.vue')
  },
  {
    name: 'collect',
    path: '/collect',
    component: () => import('@r/views/collect/collect.vue')
  },
  {
    name: 'search',
    path: '/search',
    component: () => import('@r/views/search/search.vue')
  },
  {
    name: 'setting',
    path: '/setting',
    component: () => import('@r/views/setting/setting.vue')
  }
];

const router: Router = createRouter({
  history: createWebHashHistory(),
  routes: routes
});

export default router;
