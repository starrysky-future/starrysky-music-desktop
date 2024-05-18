<script lang="ts" setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayStore } from '@r/store/play';
import { generateRandom16 } from '@r/utils';
import { useAppStore } from '@r/store/app';

const playStore = usePlayStore();
const { playList } = storeToRefs(playStore);

const appStore = useAppStore();
const { modalInfo } = storeToRefs(appStore);

const showInput = ref<boolean>(false);
const inputVal = ref<string>('');

const vFocus = {
  mounted: (el) => el.focus()
};

const getListKey = () => {
  return inputVal.value.trim() + '_' + generateRandom16();
};

const newList = () => {
  let listKey = getListKey();
  while (playList.value[listKey]) {
    listKey = getListKey();
  }

  const listSort = labelList.value.length;

  playList.value[listKey] = {};
  playList.value[listKey].id = listKey;
  playList.value[listKey].name = inputVal.value.trim();
  playList.value[listKey].sort = listSort;
  playList.value[listKey].list = [];
};

const setInput = () => {
  showInput.value = true;
};
const setInputVal = () => {
  if (inputVal.value.trim()) {
    newList();
    inputVal.value = '';
    showInput.value = false;
  }
};
const setBlur = () => {
  inputVal.value = '';
  showInput.value = false;
};

const labelList = computed<Array<SKY.Play.PlayListItem>>(() => {
  if (!playList.value) return [];
  const showList: Array<SKY.Play.PlayListItem> = [];

  Object.entries(playList.value).map((item) => {
    const [key, list] = item;

    if (key !== 'playId' && key !== 'playListId') {
      showList.push(list as SKY.Play.PlayListItem);
    }
  });
  showList.sort((a, b) => a.sort - b.sort);

  return showList;
});

const hasMusic = (list: Array<SKY.MusicListItem>) => {
  if (!modalInfo.value.addInfo) return false;

  return list.find((info) => info.songmid === modalInfo.value.addInfo?.songmid);
};

const addList = (list: Array<SKY.MusicListItem>) => {
  if (hasMusic(list)) return;
  list.push(modalInfo.value.addInfo as SKY.MusicListItem);
};
</script>

<template>
  <div class="list_add_modal scroll">
    <template v-if="modalInfo.addInfo">
      <div
        v-for="item in labelList"
        :key="item.id"
        class="common_list"
        :class="{ active: hasMusic(item.list) }"
        @click="addList(item.list)"
      >
        <Tiptool :text="item.name">
          <span class="singleTextHide">
            {{ item.name }}
          </span>
        </Tiptool>
      </div>
    </template>

    <div class="new_list common_list" @click="setInput">
      <div v-if="showInput">
        <input
          v-model="inputVal"
          v-focus
          class="list_add_input"
          placeholder="输入列表名字"
          @keyup.enter="setInputVal"
          @blur="setBlur"
        />
      </div>
      <div v-else class="list_add_icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xlink="http://www.w3.org/1999/xlink"
          height="100%"
          viewBox="0 0 24 24"
          space="preserve"
        >
          <use xlink:href="#icon-new-list" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@inputWidth: 100px;
@inputHeight: 30px;

.list_add_modal {
  margin: 14px 0 0 14px;
  max-width: (@inputWidth + 14px) * 3 + 6px;
  max-height: (@inputHeight + 14px) * 3;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .new_list {
    border: 0.5px dashed;
    .list_add_input {
      display: block;
      width: @inputWidth;
      height: @inputHeight;
      padding: 4px;
      border: none;
      background-color: transparent;

      &::placeholder {
        color: var(--color-primary);
      }
      &:focus {
        outline: none;
        caret-color: var(--color-primary);
      }
    }
    .list_add_icon {
      width: 24px;
      height: 24px;
      color: var(--color-primary);
    }
  }
  .common_list {
    cursor: pointer;
    padding: 4px;
    width: @inputWidth;
    height: @inputHeight;
    border-color: var(--color-primary);
    background-color: var(--color-primary-light-400);
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 14px 14px 0;
    &:hover {
      background-color: var(--color-primary-light-600);
    }
  }
  .active {
    background-color: var(--color-primary-light-600);
    color: var(--color-primary);
  }
}
</style>
