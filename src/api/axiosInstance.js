import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import router from "@/router/index";
import { baseUrl } from "@/api/base";
import { useUxStore } from "@/stores/ux";
import { useTranslation } from "i18next-vue";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `MARK ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const uxStore = useUxStore();
    const { t } = useTranslation();
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();

      if (router.currentRoute.value.name !== "login-page") {
        router.push({ name: "login-page" });
      }
    }
    if (error.response?.status === 429) {
      uxStore.goToError("page-429");
    }
    if (error.response?.status === 500) {
      uxStore.addToast(t("internalServerError"));
    }
    if (error.response?.status === 503) {
      if (router.currentRoute.value.name !== "page-503") {
        uxStore.goToError("page-503");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
