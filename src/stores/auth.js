import { defineStore } from "pinia";
import axiosInstance from "@/api/axiosInstance";
import { computed, ref } from "vue";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("access_token") || null);
  const isLoading = ref(true);
  const loginStatus = ref("unauthorized");
  const isAuthenticated = ref(false);

  const role = computed(() => {
    try {
      return user.value.role;
    } catch {
      return "def";
    }
  });

  async function login(credentials) {
    try {
      const response = await axiosInstance.post("/token/", credentials);

      token.value = response.data.access;

      localStorage.setItem("access_token", token.value);
      axiosInstance.defaults.headers["Authorization"] = `MARK ${token.value}`;
      loginStatus.value = "authorized";
      isAuthenticated.value = true;
    } catch (error) {
      loginStatus.value = "wrongCredentials";
      isAuthenticated.value = false;
      console.error("Login failed", error);
    }
  }

  async function fetchUser() {
    try {
      const response = await axiosInstance.get("/me/");
      user.value = response.data;
      if (response.status === 200) {
        loginStatus.value = "authorized";
        isAuthenticated.value = true;
      } else {
        loginStatus.value = "unauthorized";
        isAuthenticated.value = false;
      }
      isLoading.value = false;
    } catch (error) {
      isAuthenticated.value = false;
      console.error("Failed to fetch user", error);
    }
  }
  async function logout() {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    loginStatus.value = "unauthorized";
    localStorage.removeItem("access_token");
    delete axiosInstance.defaults.headers["Authorization"];
    router.push({ name: "login-page" });
  }

  return {
    user,
    token,
    isLoading,
    loginStatus,
    isAuthenticated,
    role,
    logout,
    login,
    fetchUser,
  };
});
