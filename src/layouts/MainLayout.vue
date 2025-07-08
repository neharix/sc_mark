<script setup>
import ModeratorSidebar from '@/components/Sidebars/ModeratorSidebar.vue';
import LoadingSidebar from '@/components/Sidebars/LoadingSidebar.vue';
import { useUxStore } from '@/stores/ux';
import { storeToRefs } from 'pinia';
import { onMounted, ref, shallowRef, watch } from 'vue';

const uxStore = useUxStore();
const { isMobileMenuOpen, isSidebarOpen, theme } = storeToRefs(uxStore);

const sidebar = shallowRef(LoadingSidebar);

const role = ref('moderator');

watch(role, (newValue) => {
  switch (newValue) {
    case "moderator":
      sidebar.value = ModeratorSidebar;
      break;
  }
})

onMounted(() => {
  switch (role.value) {
    case "moderator":
      sidebar.value = ModeratorSidebar;
      break;
  }
})



</script>
<template>
  <div class="flex min-h-screen">
    <div :class="[
      'fixed z-50 transition-all border-white bg-white dark:bg-gray-900 dark:border-gray-900 duration-300 border-r',
      isSidebarOpen ? 'w-64' : 'w-20',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      'h-screen' // Full height
    ]">
      <div class="h-full">
        <!-- Header with Toggle and Theme Switch -->
        <div class="p-5 flex justify-between items-center mt-1">
          <button class="btn-base hidden lg:block" @click="uxStore.toggleSidebar()">

            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                :d="isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
            </svg>
          </button>
          <button class="btn-base block lg:hidden" @click="uxStore.toggleMobileMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Menu Items -->
        <nav class="flex flex-col flex-1 h-23/25 overflow-y-auto">
          <div class="join join-vertical">
            <Component :is="sidebar" />
          </div>
        </nav>
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 md:hidden"
      :class="theme === 'dark' ? 'bg-black/50' : 'bg-gray-500/50'" @click="uxStore.toggleMobileMenu()"></div>
    <div class="flex-1 overflow-y-hidden h-screen bg-white dark:bg-gray-900 transition-all ease-in-out duration-300"
      :class="[
        isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
      ]">
      <!-- Navbar -->
      <div class="flex justify-between items-center p-4">
        <h1 class="text-xl font-semibold text-sky-500">Sanly Çözgüt</h1>
        <div class="flex items-center space-x-2">
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn-base m-1">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
                role="img" viewBox="0 0 24 24" class="w-5">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path
                    d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2">
                  </path>
                  <circle cx="12" cy="12" r="3"></circle>
                </g>
              </svg>
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li><button @click="uxStore.toggleTheme()">Toggle Theme</button></li>
            </ul>
          </div>
          <button class="btn-base block lg:hidden" @click="uxStore.toggleMobileMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      <!-- Content -->
      <div
        class="bg-neutral-100/50 dark:bg-gray-700 p-4 border-t-2 border-l-2 border-gray-100 dark:border-gray-800 rounded-tl-none lg:rounded-tl-3xl overflow-y-auto pb-36 h-full">
        <div>
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
