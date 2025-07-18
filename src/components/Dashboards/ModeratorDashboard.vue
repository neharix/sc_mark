<script setup>
import { useDashboardStore } from '@/stores/api';
import { useUxStore } from '@/stores/ux';
import { useTranslation } from 'i18next-vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';

const uxStore = useUxStore();
const { theme } = storeToRefs(uxStore);
const dashboardStore = useDashboardStore();
const { moderatorData } = storeToRefs(dashboardStore);

const { t } = useTranslation();

const totalProjectOptions = computed(() => {
  const isDark = theme.value === 'dark';
  const data = [
    { value: moderatorData.value.ratedProjects, name: t('rated'), itemStyle: { color: '#4285F4' } },
    { value: moderatorData.value.unratedProjects, name: t('unrated'), itemStyle: { color: '#c93b3b' } },
  ]

  return {
    title: {
      text: t('projects'),
      left: 'center',
      textStyle: {
        color: isDark ? '#fff' : '#000'
      }
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: isDark ? '#101828' : '#fff',
      textStyle: {
        color: isDark ? '#fff' : '#000'
      }
    },
    legend: {
      top: 'bottom',
      textStyle: {
        color: isDark ? '#fff' : '#000'
      }
    },
    backgroundColor: isDark ? '#101828' : '#fff',

    textStyle: {
      color: isDark ? '#fff' : '#000',
      fontFamily: 'Nunito'
    },

    series: [{
      type: 'pie',
      radius: '60%',
      label: {
        color: isDark ? '#fff' : '#000'
      },
      data: data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        label: {
          color: isDark ? '#fff' : '#000'
        }
      }
    }]
  };
});

onMounted(async () => {
  dashboardStore.get('mod')
})


</script>
<template>
  <h2 class="text-xl mx-3 mb-3 font-semibold">{{ $t('users') }}</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="info-cell">
      <p>{{ $t('juries') }}</p>
      <h3>{{ moderatorData.juries }}</h3>
    </div>
    <div class="info-cell">
      <p>{{ $t('spectators') }}</p>
      <h3>{{ moderatorData.spectators }}</h3>
    </div>
  </div>
  <h2 class="text-xl m-3 font-semibold">{{ $t('projects') }}</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="info-cell">
      <p>{{ $t('totalProjectsCount') }}</p>
      <h3>{{ moderatorData.projects }}</h3>
    </div>
    <div class="info-cell">
      <p>{{ $t('rated') }}</p>
      <h3>{{ moderatorData.ratedProjects }}</h3>
    </div>
    <div class="info-cell">
      <p>{{ $t('unrated') }}</p>
      <h3>{{ moderatorData.unratedProjects }}</h3>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 my-8">
    <div class="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
      <v-chart :option="totalProjectOptions" style="height: 400px;" autoresize />
    </div>
  </div>
</template>
