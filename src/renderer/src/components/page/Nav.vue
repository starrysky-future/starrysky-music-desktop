<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useNavStore } from '@r/store/nav';

const router = useRouter();

const navStore = useNavStore();
const { keepSearchDetail, keepSongListDetail, navName } = storeToRefs(navStore);

const changeCurPage = (path: string): void => {
  if (path === 'songList' && keepSongListDetail.value) {
    router.push({
      name: 'songListDetail',
      query: {
        pageName: 'songList'
      }
    });
  } else if (path === 'search' && keepSearchDetail.value) {
    router.push({
      name: 'songListDetail',
      query: {
        pageName: 'search'
      }
    });
  } else {
    router.push({ name: path });
  }

  navName.value = path;
};
</script>

<template>
  <div class="nav noDrag">
    <div class="common_style icon_position logo">
      <div class="common_style_icon icon_WH">
        <Tiptool text="星空">
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
        </Tiptool>
      </div>
    </div>
    <div
      :class="{ active: navName === 'songList' }"
      class="common_style icon_position"
      @click="changeCurPage('songList')"
    >
      <div class="common_style_icon icon_WH">
        <Tiptool text="歌单">
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
        </Tiptool>
      </div>
    </div>
    <div
      :class="{ active: navName === 'leaderBoard' }"
      class="common_style icon_position"
      @click="changeCurPage('leaderBoard')"
    >
      <div class="common_style_icon icon_WH">
        <Tiptool text="排行榜">
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
        </Tiptool>
      </div>
    </div>
    <div
      :class="{ active: navName === 'collect' }"
      class="common_style icon_position"
      @click="changeCurPage('collect')"
    >
      <div class="common_style_icon icon_WH">
        <Tiptool text="收藏">
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
        </Tiptool>
      </div>
    </div>
    <div
      :class="{ active: navName === 'search' }"
      class="common_style icon_position"
      @click="changeCurPage('search')"
    >
      <div class="common_style_icon icon_WH">
        <Tiptool text="搜索">
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
        </Tiptool>
      </div>
    </div>
    <div
      :class="{ active: navName === 'setting' }"
      class="common_style icon_position"
      @click="changeCurPage('setting')"
    >
      <div class="common_style_icon icon_WH">
        <Tiptool text="设置">
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
        </Tiptool>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@icon-width: 60px;

.nav {
  display: flex;
  height: 60px;

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
      display: block;
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
