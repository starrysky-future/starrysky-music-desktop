<script lang="ts" setup>
import { ref } from 'vue';
import { setLabelList } from '@r/store/setting';

const activeId = ref<string>(setLabelList[0].id);
let activeCom = setLabelList[0].com;

const setActiveId = (info) => {
  activeId.value = info.id;
  activeCom = info.com;
};
</script>

<template>
  <div class="setting">
    <div class="setting_left scroll">
      <LayoutLeft :list="setLabelList" :active-id="activeId" @set-active-id="setActiveId" />
    </div>
    <div class="setting_right scroll">
      <component :is="activeCom"></component>
    </div>
  </div>
</template>

<style lang="less" scoped>
.setting {
  height: 516px;
  display: flex;
  .setting_left {
    height: 100%;
    width: 100px;
    border-right: 0.5px solid;
    border-color: var(--color-primary-light-900);
  }
  .setting_right {
    flex: 1;
    height: 100%;
    padding: 10px 20px;
  }
}
</style>
