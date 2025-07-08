<script setup>
import { defineAsyncComponent, onBeforeMount, onMounted, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import LoaderLayout from "@/layouts/LoaderLayout.vue";
import { useUxStore } from "./stores/ux";
// import { useAuthStore } from "@/stores/auth.store.js";
// import { useTranslation } from "i18next-vue";
// import axiosInstance from "./api/axiosInstance";

const uxStore = useUxStore();

const layout = shallowRef(LoaderLayout)
const layoutName = ref('LoaderLayout');

const route = useRoute();
watch(route, (newValue, oldValue) => {
  if (newValue.meta.layout !== layoutName.value) {
    layoutName.value = newValue.meta.layout ?? 'LoaderLayout';

    layout.value = defineAsyncComponent(
      () =>
        import(`@/layouts/${layoutName.value}.vue`)
    );
  }
});
</script>

<template>
  <component :is="layout"></component>
</template>
