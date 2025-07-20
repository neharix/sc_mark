<script setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import UsersDataTable from "@/components/DataTables/UsersDataTable.vue";
import { useUsersStore } from "@/stores/api";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore)
const store = useUsersStore();
const { users: tableData, dataTablePageCount } = storeToRefs(store);

function updateData() {
  store.isLoading = true;
  store.getAll().then(() => {
    store.isLoading = false;
  })
}


onMounted(() => {
  updateData()
})

</script>

<template>
  <div class="mb-4 mx-2">
    <div class="flex w-full justify-between">
      <div>
        <button class="btn-base" @click="router.go(-1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" />
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m12 19l-7-7l7-7m7 7H5" />
          </svg>
        </button>
      </div>
      <router-link class="btn-base-without-p px-4 py-2 flex items-center space-x-2" :to="{ name: 'add-jury' }"
        v-if="user.config.canModeratorAddJury">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="none" />
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8m-4-4v8" />
          </g>
        </svg>
        <span>{{ $t('addJury') }}</span>
      </router-link>
    </div>
  </div>
  <div class="w-full">
    <div v-if="store.isLoading" class="h-[60vh] w-full flex items-center justify-center">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 mx-auto" viewBox="0 0 24 24">
          <rect width="24" height="24" fill="none" />
          <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity="0.25" />
          <path fill="currentColor"
            d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
            <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate"
              values="0 12 12;360 12 12" />
          </path>
        </svg>
        <h3 class="text-lg font-bold mt-2">{{ $t('loading') }}</h3>
      </div>
    </div>
    <div v-else>
      <UsersDataTable :data="tableData" @update="updateData" :total-pages="dataTablePageCount" />
    </div>
  </div>
</template>

<style scoped></style>
