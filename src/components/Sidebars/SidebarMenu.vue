<script setup>
import { useUxStore } from '@/stores/ux';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import useAnimations from '@/use/useAnimations';

const props = defineProps({
  header: String
});

const uxStore = useUxStore();
const { isSidebarOpen } = storeToRefs(uxStore);

const { enter, leave, beforeEnter } = useAnimations();

const isOpen = ref(false);

onMounted(() => {

})


</script>
<template>
  <div class="w-full">
    <div class="cursor-pointer" @click="isOpen = !isOpen">
      <div class="flex items-center justify-between" v-if="isSidebarOpen">
        <h3 class="text-lg text-gray-800 dark:text-neutral-400 font-bold">{{ header.toUpperCase() }}</h3>
        <div class="transition-all duration-300 ease-in-out" :class="{ '-rotate-90': isOpen }">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
            viewBox="0 0 24 24" class="w-6">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m15 18l-6-6l6-6"></path>
          </svg>
        </div>
      </div>
      <div v-else class="w-full flex justify-center">
        <slot name="icon" />
      </div>
    </div>
    <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-if="isOpen">
        <slot name="default" />
      </div>
    </transition>
  </div>
</template>
