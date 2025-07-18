<script setup>
import { useUxStore } from '@/stores/ux';
import { storeToRefs } from 'pinia';


const uxStore = useUxStore();
const { isSidebarOpen } = storeToRefs(uxStore);
</script>
<template>
  <div class="space-y-4 px-4">
    <div :class="{ 'skeleton': isSidebarOpen }"
      class="flex items-center justify-center h-8 rounded-3xl dark:bg-gray-800 w-full" v-for="i in 13">
      <svg class="w-5 transition-opacity duration-300 ease-in-out" :class="[isSidebarOpen ? 'opacity-0' : 'opacity-50']"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <rect width="24" height="24" fill="none" />
        <path fill="currentColor"
          d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
          <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate"
            values="0 12 12;360 12 12" />
        </path>
      </svg>
    </div>
  </div>
</template>
