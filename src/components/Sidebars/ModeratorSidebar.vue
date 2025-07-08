<script setup>
import { useUxStore } from '@/stores/ux';
import SidebarMenu from './SidebarMenu.vue';
import SidebarLink from './SidebarLink.vue';

const uxStore = useUxStore();
</script>
<template>
  <div class="px-6 space-y-2">
    <sidebar-menu header="Control">
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="none" />
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M10 2v8l3-3l3 3V2" />
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
          </g>
        </svg>
      </template>
      <template #default>
        <sidebar-link name="about">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24">
              <rect width="24" height="24" fill="none" />
              <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                <path d="M18 21a8 8 0 0 0-16 0" />
                <circle cx="10" cy="8" r="5" />
                <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
              </g>
            </svg>
          </template>
          <template #default>
            Users
          </template>
        </sidebar-link>
      </template>
    </sidebar-menu>
    <!-- <sidebar-menu header="Control">
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="none" />
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path
              d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </g>
        </svg>
      </template>
      <template #default>
        <sidebar-link>
          <template #icon>
            A
          </template>
          <template #default>
            Next
          </template>
        </sidebar-link>
      </template>
    </sidebar-menu> -->
  </div>
</template>
