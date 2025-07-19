<script setup>
import ToastContainer from "./components/ToastContainer.vue";
import { defineAsyncComponent, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import LoaderLayout from "@/layouts/LoaderLayout.vue";
import { useTranslation } from "i18next-vue";
import axiosInstance from "./api/axiosInstance";


const { i18next, t } = useTranslation();
const route = useRoute();

i18next.on('languageChanged', (lng) => {
  let title = route.meta.title || "";
  document.title = title.length > 0 ? t(title) + " | Sanly Çözgüt" : "Sanly Çözgüt";
  axiosInstance.defaults.headers["Accept-Language"] = lng;
})


const layout = shallowRef(LoaderLayout)
const layoutName = ref('LoaderLayout');

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
  <transition name="fade" mode="out-in">
    <Component :is="layout" />
  </transition>
  <ToastContainer />
</template>
