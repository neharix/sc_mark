<template>
  <div class="flex min-h-screen"
    :class="isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-100 to-gray-200'">
    <!-- Sidebar -->
    <div :class="[
      'fixed z-50 transition-all duration-300 backdrop-blur-lg border-r',
      isDarkTheme ? 'bg-white/10 border-white/20' : 'bg-gray-200/30 border-gray-300/50',
      isSidebarOpen ? 'w-64' : 'w-16',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      'h-screen' // Full height
    ]">
      <div class="h-full">
        <!-- Header with Toggle and Theme Switch -->
        <div class="p-4 flex justify-between items-center backdrop-blur-lg"
          :class="isDarkTheme ? 'bg-white/10' : 'bg-gray-200/30'">
          <button class="btn btn-circle btn-ghost"
            :class="isDarkTheme ? 'text-white hover:bg-white/20' : 'text-gray-800 hover:bg-gray-300/50'"
            @click="toggleSidebar">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                :d="isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"></path>
            </svg>
          </button>
          <button v-show="isSidebarOpen" class="btn btn-circle btn-ghost"
            :class="isDarkTheme ? 'text-white hover:bg-white/20' : 'text-gray-800 hover:bg-gray-300/50'"
            @click="toggleTheme">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                :d="isDarkTheme ? 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' : 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'">
              </path>
            </svg>
          </button>
          <button class="btn btn-circle btn-ghost md:hidden"
            :class="isDarkTheme ? 'text-white hover:bg-white/20' : 'text-gray-800 hover:bg-gray-300/50'"
            @click="toggleMobileMenu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Menu Items -->
        <nav class="flex flex-col flex-1 h-23/25">
          <ul class="menu p-2 overflow-y-auto">
            <li v-for="n in 100" :key="n">
              <a class="flex items-center gap-3 rounded-lg transition-colors" :class="[
                isDarkTheme ? 'text-white/90 hover:bg-white/20' : 'text-gray-800 hover:bg-gray-300/50',
                { 'justify-center': !isSidebarOpen }
              ]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                  </path>
                </svg>
                <span v-show="isSidebarOpen" class="text-sm font-medium">Menu Item {{ n }}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 md:hidden"
      :class="isDarkTheme ? 'bg-black/50' : 'bg-gray-500/50'" @click="toggleMobileMenu"></div>

    <!-- Main Content -->
    <div class="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto" :class="[
      isSidebarOpen ? 'md:ml-64' : 'md:ml-16'
    ]">
      <div class="flex justify-between items-center mb-6 md:hidden">
        <h1 class="text-xl font-semibold" :class="isDarkTheme ? 'text-white' : 'text-gray-800'">Dashboard</h1>
        <button class="btn btn-circle btn-ghost"
          :class="isDarkTheme ? 'text-white hover:bg-white/20' : 'text-gray-800 hover:bg-gray-300/50'"
          @click="toggleMobileMenu">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Dashboard Cards -->
        <div v-for="n in 56" :key="n" class="card backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden"
          :class="isDarkTheme ? 'bg-white/10 border-white/20' : 'bg-gray-200/30 border-gray-300/50'">
          <div class="card-body p-4 sm:p-6" :class="isDarkTheme ? 'text-white' : 'text-gray-800'">
            <h2 class="card-title text-lg sm:text-xl">Card {{ n }}</h2>
            <p class="text-xs sm:text-sm" :class="isDarkTheme ? 'opacity-80' : 'opacity-70'">Description for card {{ n
              }} content goes here.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isSidebarOpen = ref(true)
const isMobileMenuOpen = ref(false)
const isDarkTheme = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  if (isMobileMenuOpen.value) isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
}

// Handle responsive sidebar behavior
const checkMobile = () => {
  if (window.innerWidth < 768) {
    isSidebarOpen.value = false
    isMobileMenuOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.card {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.menu li a:hover {
  transition: background-color 0.3s ease;
}

.card-body {
  transition: padding 0.3s ease;
}

/* Custom scrollbar for sidebar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>