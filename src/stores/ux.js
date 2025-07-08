import { ref } from "vue";
import { defineStore } from "pinia";

export const useUxStore = defineStore("ux", () => {
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

  return {
    isSidebarOpen,
    isMobileMenuOpen,
    theme,
    toggleTheme,
    toggleSidebar,
    toggleMobileMenu,
  };
});
