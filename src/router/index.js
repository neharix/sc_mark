import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import guards from "./guards";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        layout: "MainLayout",
        roles: ["mod", "jr", "spec"],
        title: "mainPage",
      },
      beforeEnter: guards.authGuard,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
      meta: {
        layout: "MainLayout",
        roles: ["mod", "jr", "spec"],
        title: "mainPage",
      },
      beforeEnter: guards.authGuard,
    },
    {
      path: "/login",
      name: "login-page",
      component: () => import("../views/LoginView.vue"),
      meta: {
        layout: "EmptyLayout",
        title: "loginPage",
      },
      beforeEnter: guards.anonGuard,
    },
  ],
});

export default router;
