<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '@r/store/app';
import { initSet } from '@r/plugins/setting';
import { modalConfig } from '@r/plugins';

const appStore = useAppStore();
const { showLyricPage, modalName, isModal } = storeToRefs(appStore);

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
      <ListPopup />

      <div class="operate_modal">
        <TransitionScale>
          <OperateModal v-if="isModal">
            <component :is="modalConfig[modalName]"></component>
          </OperateModal>
        </TransitionScale>
      </div>
    </div>

    <TransitionPosition>
      <LyricPage v-if="showLyricPage" />
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

  .operate_modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
