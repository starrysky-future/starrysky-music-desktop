<script setup lang="ts">
import { initSet } from '@r/plugins/setting';
initSet();
</script>
<template>
  <div class="home">
    <div class="header">
      <Nav />
      <RightBtns />
    </div>
    <div class="mian">
      <router-view v-slot="{ Component }">
        <keep-alive exclude="songListDetail">
          <component :is="Component" :key="$route.fullPath" />
        </keep-alive>
      </router-view>
    </div>
    <div class="floor">
      <PlayMod />
    </div>
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
  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid;
    border-color: var(--color-primary-dark-100-alpha-500);
  }
  .mian {
    flex: 1;
    -webkit-app-region: no-drag;
  }
  .floor {
    border-top: 0.5px solid;
    border-color: var(--color-primary-light-900);
    height: 70px;
  }
}
</style>
