<script setup>
import { useUxStore } from '@/stores/ux';
import FlagTm from '@/components/Icons/Flags/FlagTm.vue';
import FlagRu from '@/components/Icons/Flags/FlagRu.vue';
import FlagUs from '@/components/Icons/Flags/FlagUs.vue';

const uxStore = useUxStore();
</script>

<template>
  <div class="bg-white md:bg-gray-200 dark:bg-gray-900 min-h-screen flex items-center justify-center">
    <div class="absolute right-5 top-5">
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
            <button @click="uxStore.toggleTheme()" class="flex items-center rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" v-if="uxStore.theme === 'light'" class="w-6" viewBox="0 0 24 24">
                <rect width="24" height="24" fill="none" />
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <circle cx="12" cy="12" r="4" />
                  <path
                    d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </g>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" v-else class="w-6" viewBox="0 0 24 24">
                <rect width="24" height="24" fill="none" />
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9" />
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

    </div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
