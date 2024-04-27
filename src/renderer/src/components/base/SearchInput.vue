<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  placeholder: string;
}>();
const value = ref<string>('');
const isFocus = ref<boolean>(false);

const emits = defineEmits(['setValue']);

const clearValue = () => {
  value.value = '';
  emits('setValue', '');
};

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
    <div v-if="value" class="search_input_btn">
      <div class="search_input_btn_icon search_input_btn_clear" @click="clearValue">
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
    <div class="search_input_btn" @click="emits('setValue', value)">
      <div class="search_input_btn_icon">
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
    flex: 1 0 80%;
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
    flex: 0 0 10%;
    height: 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: var(--color-primary-light-300);
    }
    .search_input_btn_icon {
      width: 20px;
      height: 20px;
      color: var(--color-primary);
    }
    .search_input_btn_clear {
      width: 18px;
      height: 18px;
    }
  }
}
.searchInputActive {
  background-color: var(--color-primary-light-500);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}
</style>
