<script setup></script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="i in 6" class="skeleton dark:bg-gray-800 rounded-3xl">
      <div class="h-24"></div>
    </div>
  </div>
  <div class="skeleton dark:bg-gray-800 rounded-3xl h-24 my-4"></div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div v-for="i in 2" class="skeleton dark:bg-gray-800 rounded-3xl">
      <div class="h-64"></div>
    </div>
  </div>
</template>
