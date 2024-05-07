<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@r/store/app';

const appStore = useAppStore();
const { modalTitle, isModal, addInfo } = storeToRefs(appStore);

const closeModal = () => {
  isModal.value = false;
  addInfo.value = undefined;
};
</script>

<template>
  <div class="operate_popup">
    <div class="header">
      <div class="title">{{ modalTitle }}</div>
      <div class="close" @click="closeModal">
        <div class="close_icon">
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
      </div>
    </div>
    <div class="main">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
@headerheight: 30px;

.operate_popup {
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  .header {
    font-size: 14px;
    border-bottom-width: 0.5px;
    border-bottom-style: solid;
    border-bottom-color: var(--color-primary);
    position: relative;
    .title {
      height: @headerheight;
      line-height: @headerheight;
      text-align: center;
      color: var(--color-primary);
    }
    .close {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      width: @headerheight;
      height: @headerheight;
      display: flex;
      justify-content: center;
      align-items: center;
      .close_icon {
        width: 16px;
        height: 16px;
        color: var(--color-btn-close);
      }
      &:hover {
        background-color: var(--color-primary-light-400-alpha-500);
      }
    }
  }
  .main {
    padding: 14px 0 0 14px;
  }
}
</style>
