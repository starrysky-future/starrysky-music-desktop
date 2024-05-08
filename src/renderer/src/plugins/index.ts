import { defineAsyncComponent } from 'vue';

export const modalConfig = {
  ListAddModal: defineAsyncComponent(() => import('@r/components/operate/ListAddModal.vue'))
};

export const transitionConfig = {
  TransitionScale: defineAsyncComponent(
    () => import('@r/components/transition/TransitionScale.vue')
  ),
  TransitionOpacity: defineAsyncComponent(
    () => import('@r/components/transition/TransitionOpacity.vue')
  ),
  TransitionPosition: defineAsyncComponent(
    () => import('@r/components/transition/TransitionPosition.vue')
  ),
  TransitionHeight: defineAsyncComponent(
    () => import('@r/components/transition/TransitionHeight.vue')
  )
};
