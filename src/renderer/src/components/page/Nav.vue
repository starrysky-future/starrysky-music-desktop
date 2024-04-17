<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useSetStore } from '@r/store/setting';

const router = useRouter();
const route = useRoute();

const setStore = useSetStore();
const { isKeepList } = storeToRefs(setStore);

const changeCurPage = (path: string): void => {
  if (path === 'songList' && isKeepList.value) {
    router.push({
      name: 'songListDetail'
    });
  } else {
    router.push({ name: path });
  }
};
</script>

<template>
  <div class="nav">
    <div class="common_style icon_position logo">
      <div class="common_style_icon icon_WH">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use xlink:href="#icon-logo" />
        </svg>
      </div>
    </div>
    <div
      :class="{ active: route.name === 'songList' || route.name === 'songListDetail' }"
      class="common_style icon_position"
      @click="changeCurPage('songList')"
    >
      <div class="common_style_icon icon_WH">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use xlink:href="#icon-song-list" />
        </svg>
      </div>
    </div>
    <div
      :class="{ active: route.name === 'leaderBoard' }"
      class="common_style icon_position"
      @click="changeCurPage('leaderBoard')"
    >
      <div class="common_style_icon icon_WH">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use xlink:href="#icon-leaderboard" />
        </svg>
      </div>
    </div>
    <div
      :class="{ active: route.name === 'collect' }"
      class="common_style icon_position"
      @click="changeCurPage('collect')"
    >
      <div class="common_style_icon icon_WH">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use xlink:href="#icon-collect" />
        </svg>
      </div>
    </div>
    <div
      :class="{ active: route.name === 'search' }"
      class="common_style icon_position"
      @click="changeCurPage('search')"
    >
      <div class="common_style_icon icon_WH">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use xlink:href="#icon-search" />
        </svg>
      </div>
    </div>
    <div
      :class="{ active: route.name === 'setting' }"
      class="common_style icon_position"
      @click="changeCurPage('setting')"
    >
      <div class="common_style_icon icon_WH">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 36 36"
          space="preserve"
        >
          <use xlink:href="#icon-setting" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@icon-width: 60px;

.nav {
  display: flex;
  height: 60px;
  -webkit-app-region: no-drag;

  .common_style {
    width: @icon-width;
    .common_style_icon {
      color: var(--color-btn-min);
    }
    &:hover {
      background-color: var(--color-primary-light-400-alpha-500);
    }
  }

  .active {
    background-color: var(--color-primary-light-400-alpha-500);
    position: relative;
    &::after {
      content: '';
      width: 100%;
      height: 2px;
      position: absolute;
      left: 0;
      bottom: 0px;
      background-color: var(--color-primary-light-100-alpha-400);
    }
  }
  .icon_WH {
    width: 24px;
    height: 24px;
  }
  .icon_position {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .logo {
    &:hover {
      background: none;
    }
    cursor: default;
  }
}
</style>
