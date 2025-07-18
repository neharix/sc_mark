import axiosInstance from "@/api/axiosInstance";
import { defineStore } from "pinia";
import { ref } from "vue";

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
      console.log(response);
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
