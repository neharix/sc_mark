import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { useTranslation } from "i18next-vue";
import { useUxStore } from "@/stores/ux";

async function anonGuard(to, from, next) {
  const { t, i18next } = useTranslation();

  while (!i18next.isInitialized) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  let titleMeta = to.meta.title || "";
  let title = t(titleMeta);
  document.title =
    title.length > 0 ? t(title) + " | Sanly Çözgüt" : "Sanly Çözgüt";

  return next();
}

async function defaultGuard(to, from, next) {
  const { t, i18next } = useTranslation();
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);

  if (!user.value) {
    await authStore.fetchUser();
  }

  while (!i18next.isInitialized) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  while (authStore.isLoading) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  let titleMeta = to.meta.title || "";
  let title = t(titleMeta);
  document.title =
    title.length > 0 ? t(title) + " | Sanly Çözgüt" : "Sanly Çözgüt";

  return next();
}

async function authGuard(to, from, next) {
  const { t, i18next } = useTranslation();
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const uxStore = useUxStore();

  if (!authStore.user) {
    await authStore.fetchUser();
  }

  while (!i18next.isInitialized) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  while (authStore.isLoading) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  if (
    "restriction" in to.meta &&
    to.meta.restriction in user.value.config &&
    !user.value.config[to.meta.restriction]
  ) {
    return uxStore.goToError("page-403");
  }

  if (!to.meta.roles.includes(authStore.role)) {
    return uxStore.goToError("page-403");
  }

  let title = to.meta.title || "";
  document.title =
    title.length > 0 ? t(title) + " | Sanly Çözgüt" : "Sanly Çözgüt";

  return next();
}

export default {
  authGuard,
  defaultGuard,
  anonGuard,
};
