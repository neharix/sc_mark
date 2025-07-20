import { ref } from "vue";
import { defineStore } from "pinia";
import { useTranslation } from "i18next-vue";
import router from "@/router";

export const useUxStore = defineStore("ux", () => {
  const { i18next } = useTranslation();

  const toasts = ref([]);
  const language = ref(localStorage.getItem("language") || "tk");
  const isSidebarOpen = ref(true);
  const isMobileMenuOpen = ref(false);
  const theme = ref(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );
  document.documentElement.setAttribute("data-theme", theme.value);
  localStorage.setItem("theme", theme.value);

  function changeLanguage(lng) {
    i18next.changeLanguage(lng);
    language.value = lng;

    localStorage.setItem("language", language.value);
  }

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
    if (isMobileMenuOpen.value) isMobileMenuOpen.value = false;
  };

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  }

  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme.value);
    localStorage.setItem("theme", theme.value);
  }

  function goToError(error) {
    console.error(error);
    router.push({ name: "login" });
  }

  function addToast(message, _type) {
    const id = toasts.value.length;
    toasts.value.push({ id, message, _type });
    setTimeout(() => {
      try {
        toasts.value.splice(
          toasts.value[
            toasts.value.indexOf(toasts.value.find((obj) => obj.id === id))
          ],
          1
        );
      } catch (e) {
        console.warn(e);
      }
    }, 5000);
  }
  function deleteToast(id) {
    toasts.value.splice(
      toasts.value[
        toasts.value.indexOf(toasts.value.find((obj) => obj.id === id))
      ],
      1
    );
  }

  return {
    isSidebarOpen,
    isMobileMenuOpen,
    theme,
    language,
    toasts,
    changeLanguage,
    toggleTheme,
    toggleSidebar,
    toggleMobileMenu,
    goToError,
    addToast,
    deleteToast,
  };
});
