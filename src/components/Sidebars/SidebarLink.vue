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
  <router-link :to="{ name: name }" class="sidebar-link w-full flex items-center my-2 space-x-2"
    :class="{ 'btn-secondary': isExactActive, 'btn-ghost': !isExactActive, 'justify-center': !isSidebarOpen }"
    v-slot="{ isExactActive }">
    <div>
      <slot name="icon" />
    </div>
    <div v-if="isSidebarOpen">
      <slot name="default" />
    </div>
  </router-link>
</template>
