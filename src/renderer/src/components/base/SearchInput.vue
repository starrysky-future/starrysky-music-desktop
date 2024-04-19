<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  placeholder: string;
}>();
const value = ref<string>();
const isFocus = ref<boolean>(false);

const emits = defineEmits(['setValue']);

const setFocus = () => {
  isFocus.value = true;
};
const setBlur = () => {
  isFocus.value = false;
};
</script>

<template>
  <div class="search_input" :class="{ searchInputActive: isFocus }">
    <input
      v-model="value"
      class="search_input_val"
      :placeholder="props.placeholder"
      @focus="setFocus"
      @blur="setBlur"
    />
    <div class="search_input_btn">关闭</div>
    <div class="search_input_btn" @click="emits('setValue', value)">搜索</div>
  </div>
</template>

<style lang="less" scoped>
.search_input {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 2px;
  background-color: var(--color-primary-light-700);
  .search_input_val {
    width: 80%;
    padding: 4px;
    height: 100%;
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

  .search_input_btn {
    width: 10%;
    height: 100%;
    cursor: pointer;
  }
}
.searchInputActive {
  background-color: var(--color-primary-light-500);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}
</style>
