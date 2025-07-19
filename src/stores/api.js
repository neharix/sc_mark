// oxlint-disable no-unused-vars
import axiosInstance from "@/api/axiosInstance";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useUxStore } from "./ux";
import router from "@/router";
import { useRoute } from "vue-router";
import { useTranslation } from "i18next-vue";

export const useDataTableStore = defineStore("data-table", () => {
  const isExporterLoading = ref(false);
  const isDeleting = ref(false);

  async function deleteSelectedItems(model, identificators) {
    isDeleting.value = true;
    try {
      const response = await axiosInstance.post("/delete/", {
        model,
        identificators,
      });
    } catch (e) {
      console.error("Error:", e);
    } finally {
      isDeleting.value = false;
    }
  }

  async function getExportedFile(model, identificators) {
    isExporterLoading.value = true;
    try {
      const response = await axiosInstance.post(
        `/export/`,
        {
          model,
          identificators,
        },
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([response.data], {
        type: response.headers["Content-Type"],
      });
      console.log(blob);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = `export-${model}.xlsx`;
      link.classList.add("hidden");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error", error);
    } finally {
      isExporterLoading.value = false;
    }
  }

  return {
    isExporterLoading,
    isDeleting,
    deleteSelectedItems,
    getExportedFile,
  };
});

export const useDashboardStore = defineStore("dashboard", () => {
  const moderatorData = ref({
    projects: 0,
    ratedProjects: 0,
    unratedProjects: 0,
    juries: 0,
    spectators: 0,
  });

  async function get(role) {
    try {
      const response = await axiosInstance.get("/home/");
      switch (role) {
        case "mod":
          moderatorData.value = response.data;
          break;
      }
    } catch (e) {
      console.error("Error:", e);
    }
  }
  return { moderatorData, get };
});

export const useUsersStore = defineStore("users", () => {
  const isLoading = ref(false);
  const dataTablePageCount = ref(1);
  const deleteStatus = ref(null);
  const updateStatus = ref(null);
  const createStatus = ref(null);
  const objectsCount = ref(0);

  const user = ref({});
  const users = ref([]);

  const route = useRoute();

  const uxStore = useUxStore();
  const { t } = useTranslation();

  async function create(data) {
    try {
      const response = await axiosInstance.post("/users/", data);
      if (response.status === 200) {
        createStatus.value = "success";
      } else {
        createStatus.value = "error";
      }
    } catch (e) {
      createStatus.value = "error";
    }
  }

  async function put(id, data) {
    try {
      const response = await axiosInstance.put(`/users/${id}/`, data);
      if (response.status === 200) {
        updateStatus.value = "success";
      } else {
        updateStatus.value = "error";
      }
    } catch (e) {
      updateStatus.value = "error";
    }
  }

  async function get(id) {
    isLoading.value = true;
    try {
      const response = await axiosInstance.get(`/users/${id}/`);
      console.log(response.status);
      if (!response.status) {
        router.go(-1);
        uxStore.addToast(
          t("notFoundToastError", { object: t("user") }),
          "error"
        );
      }
      user.value = response.data;
    } catch (e) {
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  }
  async function getAll() {
    let order = route.query.order ? route.query.order : "asc";
    let column = route.query.column ? route.query.column : "username";
    let search = route.query.search ? route.query.search : false;

    let page = route.query.page ? route.query.page : 1;
    let pageSize = localStorage.getItem("rowsPerPage");
    let response = null;
    if (search) {
      response = await axiosInstance.get("/users/", {
        params: {
          page,
          page_size: pageSize,
          order,
          column,
          search,
        },
      });
    } else {
      response = await axiosInstance.get("/users/", {
        params: { page, page_size: pageSize, order, column },
      });
    }

    users.value = response.data.results.data;
    dataTablePageCount.value = response.data.results.totalPages;
    objectsCount.value = response.data.count;
  }
  async function _delete(id) {
    try {
      const response = await axiosInstance.delete(`/users/${id}/`);
      deleteStatus.value = "success";
    } catch (e) {
      console.error("Error:", e);
    }
  }

  return {
    user,
    users,
    isLoading,
    dataTablePageCount,
    updateStatus,
    createStatus,
    deleteStatus,
    objectsCount,
    get,
    put,
    create,
    getAll,
    _delete,
  };
});
