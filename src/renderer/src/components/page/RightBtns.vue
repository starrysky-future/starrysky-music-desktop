<script lang="ts" setup>
import { ref, VNodeRef } from 'vue';
import { saveData } from '@r/plugins/setting/setData';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@r/store/app';

const appStore = useAppStore();
const { showLyricPage } = storeToRefs(appStore);

const hasHover = ref<boolean>(true);
const minDom = ref<VNodeRef | null>(null);

const setMinHover = () => {
  hasHover.value = true;
  minDom.value.removeEventListener('mousemove', setMinHover);
};

const changeWinState = (operate: string): void => {
  if (operate === 'min') {
    hasHover.value = false;

    minDom.value.addEventListener('mousemove', setMinHover);
  }

  if (operate === 'quit') {
    saveData();
  }
  window.api![operate]();
};

const hideLyricPage = () => {
  showLyricPage.value = false;
};
</script>

<template>
  <div class="rightBtns noDrag">
    <div v-show="showLyricPage" class="max icon_position" @click="hideLyricPage">
      <Tiptool text="关闭歌词页">
        <div class="max_icon icon_WH">
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
      </Tiptool>
    </div>
    <div
      ref="minDom"
      class="min icon_position"
      :class="{ minHover: hasHover }"
      @click="changeWinState('min')"
    >
      <Tiptool text="最小化">
        <div class="min_icon icon_WH">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            height="100%"
            viewBox="0 0 24 24"
            space="preserve"
          >
            <use xlink:href="#icon-min" />
          </svg>
        </div>
      </Tiptool>
    </div>
    <!-- <div @click="changeWinState('max')" class="max icon_position">
      <div class="max_icon icon_WH">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 24 24"
          space="preserve"
        >
          <use xlink:href="#icon-max" />
        </svg>
      </div>
    </div> -->
    <div class="close icon_position" @click="changeWinState('quit')">
      <Tiptool text="关闭">
        <div class="close_icon icon_WH">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xlink="http://www.w3.org/1999/xlink"
            height="100%"
            viewBox="0 0 24 24"
            space="preserve"
          >
            <use xlink:href="#icon-close" />
          </svg>
        </div>
      </Tiptool>
    </div>
  </div>
</template>

<style lang="less" scoped>
@icon-width: 40px;

.rightBtns {
  display: flex;
  height: 30px;
  .min {
    width: @icon-width;
    .min_icon {
      color: var(--color-btn-min);
    }
  }
  .minHover:hover {
    background-color: var(--color-primary-light-400-alpha-500);
  }

  .max {
    width: @icon-width;
    .max_icon {
      color: var(--color-btn-max);
    }
    &:hover {
      background-color: var(--color-primary-light-400-alpha-500);
    }
  }
  .close {
    width: @icon-width;
    .close_icon {
      color: var(--color-btn-close);
    }
    &:hover {
      background-color: var(--color-btn-close-hover);
    }
  }

  .icon_WH {
    width: 16px;
    height: 16px;
  }
  .icon_position {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
