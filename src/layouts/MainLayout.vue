<script setup>
import ModeratorSidebar from '@/components/Sidebars/ModeratorSidebar.vue';
import LoadingSidebar from '@/components/Sidebars/LoadingSidebar.vue';
import { useUxStore } from '@/stores/ux';
import { storeToRefs } from 'pinia';
import { onMounted, ref, shallowRef, watch } from 'vue';
import FlagTm from '@/components/Icons/Flags/FlagTm.vue';
import FlagRu from '@/components/Icons/Flags/FlagRu.vue';
import FlagUs from '@/components/Icons/Flags/FlagUs.vue';
import SidebarLink from '@/components/Sidebars/SidebarLink.vue';
import { useAuthStore } from '@/stores/auth';

const uxStore = useUxStore();
const { isMobileMenuOpen, isSidebarOpen, theme } = storeToRefs(uxStore);
const authStore = useAuthStore();
const { role } = storeToRefs(authStore);

const sidebar = shallowRef(LoadingSidebar);


watch(role, (newValue) => {
  switch (newValue) {
    case "mod":
      sidebar.value = ModeratorSidebar;
      break;
  }
})

onMounted(() => {
  switch (role.value) {
    case "mod":
      sidebar.value = ModeratorSidebar;
      break;
  }
})

</script>
<template>
  <div class="flex min-h-screen">
    <div :class="[
      'fixed z-50 transition-all border-white bg-white dark:bg-gray-900 dark:border-gray-900 duration-300 border-r',
      isSidebarOpen ? 'w-64' : 'w-24',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      'h-screen'
    ]">
      <div class="h-full">
        <!-- Header with Toggle and Theme Switch -->
        <div class="p-5 flex justify-end md:justify-center items-center mt-1">
          <button class="btn-base hidden md:block" @click="uxStore.toggleSidebar()">

            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                :d="isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
            </svg>
          </button>
          <button class="btn-base block md:hidden" @click="uxStore.toggleMobileMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Menu Items -->
        <nav class="flex flex-col flex-1 h-23/25 overflow-y-auto">
          <div>
            <div class="px-3">
              <sidebar-link name="home">
                <template #icon>
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="none" />
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2">
                      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                      <path
                        d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </g>
                  </svg>
                </template>
                <template #default>
                  {{ $t('mainPage') }}
                </template>
              </sidebar-link>
            </div>
            <Component class="mt-4" :is="sidebar" />
          </div>
        </nav>
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 md:hidden"
      :class="theme === 'dark' ? 'bg-black/50' : 'bg-gray-500/50'" @click="uxStore.toggleMobileMenu()"></div>
    <div class="flex-1 overflow-y-hidden h-screen bg-white dark:bg-gray-900 transition-all ease-in-out duration-300"
      :class="[
        isSidebarOpen ? 'md:ml-64' : 'md:ml-24'
      ]">
      <!-- Navbar -->
      <div class="flex justify-between items-center p-4">
        <router-link :to="{ name: 'home' }">
          <h1 class="text-xl font-semibold text-sky-500">Sanly Çözgüt</h1>
        </router-link>
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
            <ul tabindex="0"
              class="dropdown-content bg-[#f6f6f6] dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 menu rounded-3xl z-1 w-52 p-2 shadow-sm">
              <li>
                <button @click="authStore.logout()"
                  class="flex items-center rounded-full text-red-600 dark:text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="none" />
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2" d="m16 17l5-5l-5-5m5 5H9m0 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  </svg>
                  <span>{{ $t('logout') }}</span>
                </button>
              </li>
              <li>
                <button @click="uxStore.toggleTheme()" class="flex items-center rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" v-if="uxStore.theme === 'light'" class="w-6"
                    viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="none" />
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2">
                      <circle cx="12" cy="12" r="4" />
                      <path
                        d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </g>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" v-else class="w-6" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="none" />
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2" d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9" />
                  </svg>
                  <span>{{ $t('toggleTheme') }}</span>
                </button>
              </li>
              <li>
                <div class="dropdown rounded-full">
                  <div tabindex="1" role="button" class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24">
                      <rect width="24" height="24" fill="none" />
                      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2" d="m5 8l6 6m-7 0l6-6l2-3M2 5h12M7 2h1m14 20l-5-10l-5 10m2-4h6" />
                    </svg>
                    <span>{{ $t('self') }}</span>
                  </div>
                  <ul tabindex="1"
                    class="dropdown-content bg-[#f6f6f6] dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 menu rounded-3xl z-1 w-52 p-2 shadow-sm">
                    <li v-if="uxStore.language !== 'tk'">
                      <button @click="uxStore.changeLanguage('tk')" class="flex items-center rounded-full">
                        <FlagTm class="w-6 rounded-md" />
                        <span>{{ $t('turkmen') }}</span>
                      </button>
                    </li>
                    <li v-if="uxStore.language !== 'ru'">
                      <button @click="uxStore.changeLanguage('ru')" class="flex items-center rounded-full">
                        <FlagRu class="w-6 rounded-md" />
                        <span>{{ $t('russian') }}</span>
                      </button>
                    </li>
                    <li v-if="uxStore.language !== 'en'">
                      <button @click="uxStore.changeLanguage('en')" class="flex items-center rounded-full">
                        <FlagUs class="w-6 rounded-md" />
                        <span>{{ $t('english') }}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <button class="btn-base block md:hidden" @click="uxStore.toggleMobileMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      <!-- Content -->
      <div
        class="bg-neutral-100/50 dark:bg-gray-700 p-4 border-t-2 border-l-2 border-gray-100 dark:border-gray-800 rounded-tl-none md:rounded-tl-3xl overflow-y-auto pb-36 h-full">
        <div>
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
