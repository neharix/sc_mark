<script setup>
</script>
<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
    <!-- Dashboard Cards -->
    <div v-for="n in 56" :key="n"
      class="card bg-gray-200/30 border-gray-300/50 dark:bg-gray-900 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden">
      <div class="card-body p-4 sm:p-6 text-gray-800">
        <h2 class="card-title text-lg sm:text-xl">Card {{ n }}</h2>
        <p class="text-xs sm:text-sm opacity-70">Description for card {{ n
          }} content goes here.</p>
      </div>
    </div>
  </div>
</template>


<style scoped></style>
