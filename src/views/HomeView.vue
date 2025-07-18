<script setup>
import LoadingDashboard from '@/components/Dashboards/LoadingDashboard.vue';
import ModeratorDashboard from '@/components/Dashboards/ModeratorDashboard.vue';
import { useDashboardStore } from '@/stores/api';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, shallowRef } from 'vue';

const authStore = useAuthStore();
const { role } = storeToRefs(authStore);
const dashboardStore = useDashboardStore();

const dashboard = shallowRef(LoadingDashboard);

onMounted(() => {
  switch (role.value) {
    case "mod":
      dashboard.value = ModeratorDashboard;
      break;
  }
})
</script>
<template>
  <Component :is="dashboard" />
</template>


<style scoped></style>
