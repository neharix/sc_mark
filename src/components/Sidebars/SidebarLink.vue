<script setup>
import { useUxStore } from '@/stores/ux';
import { storeToRefs } from 'pinia';

const uxStore = useUxStore();
const { isSidebarOpen } = storeToRefs(uxStore);

const props = defineProps({
  name: String,
});
</script>
<template>
  <router-link :to="{ name: name }" v-slot="{ isExactActive }">
    <div class="sidebar-link flex items-center my-2"
      :class="{ 'rounded-full bg-gray-100 text-gray-600 dark:text-white dark:bg-gray-300/20  active:text-gray-400 active:scale-90 transition-all duration-300 ease-out': isExactActive, 'btn-ghost': !isExactActive, 'w-full space-x-2 px-4 py-2': isSidebarOpen, 'p-2 justify-center mx-auto w-max': !isSidebarOpen }">
      <div>
        <slot name="icon" />
      </div>
      <div v-if="isSidebarOpen" class="text-nowrap">
        <slot name="default" />
      </div>
    </div>
  </router-link>
</template>
