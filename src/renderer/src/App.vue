<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@r/store/app';
import { initSet } from '@r/plugins/setting';

const appStore = useAppStore();
const { showLyricPage } = storeToRefs(appStore);

initSet();
</script>
<template>
  <div class="home">
    <div class="header">
      <Nav />
      <RightBtns />
    </div>

    <div class="mian noDrag">
      <router-view v-slot="{ Component }">
        <keep-alive exclude="songListDetail">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </div>
    <div class="floor"><LayoutBottom /></div>

    <div>
      <TipPopup />
    </div>

    <TransitionPosition>
      <LyricPage v-show="showLyricPage" />
    </TransitionPosition>
  </div>
  <Icons />
</template>

<style lang="less" scoped>
.home {
  margin: 8px;
  background-color: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  height: calc(~'100vh - 16px');
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid;
    border-color: var(--color-primary-dark-100-alpha-500);
  }
  .mian {
    flex: 1;
  }
  .floor {
    border-top: 0.5px solid;
    border-color: var(--color-primary-light-900);
    height: 70px;
  }
}
</style>
