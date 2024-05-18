<script lang="ts" setup>
import theme from '@r/utils/theme/theme.json';
import { useSetStore } from '@r/store/setting';
import { storeToRefs } from 'pinia';
import applyThemeColor from '@r/utils/theme/index.js';

const setStore = useSetStore();
const { setList } = storeToRefs(setStore);

const setTheme = (themeId: string) => {
  setList.value.themeId = themeId;
  applyThemeColor();
};
</script>

<template>
  <div class="set_basic">
    <SetTitle> 基本设置 </SetTitle>
    <div class="common_card">
      <div>主题颜色</div>
      <div class="theme">
        <template v-for="item in theme" :key="item.id">
          <div class="theme_item" @click="setTheme(item.id)">
            <div
              class="theme_item_border"
              :style="{
                borderColor: setList.themeId === item.id ? item.config['--color-primary'] : ''
              }"
            >
              <div
                class="theme_item_color"
                :style="{ backgroundColor: item.config['--color-primary'] }"
              ></div>
            </div>
            <div
              class="theme_item_name"
              :style="{
                color: setList.themeId === item.id ? item.config['--color-primary'] : ''
              }"
            >
              {{ item.name }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import './common.less';

.set_basic {
  .theme {
    display: flex;
    flex-wrap: wrap;
    .theme_item {
      margin: 20px;
      cursor: pointer;
      .theme_item_border {
        border: 2px solid transparent;
        border-radius: 3px;
        width: 46px;
        height: 46px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .theme_item_color {
        width: 40px;
        height: 40px;
        border-radius: 3px;
      }
      .theme_item_name {
        padding-top: 2px;
      }
    }
  }
}
</style>
