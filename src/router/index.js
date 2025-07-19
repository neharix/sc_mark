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
      path: "/users",
      name: "users",
      component: () => import("../views/UserViews/Users.vue"),
      children: [
        {
          path: "",
          name: "users-list",
          component: () => import("../views/UserViews/List.vue"),
          meta: {
            layout: "MainLayout",
            roles: ["mod"],
            title: "users",
          },
          beforeEnter: guards.authGuard,
        },
        {
          path: "add",
          name: "add-user",
          component: () => import("../views/UserViews/Add.vue"),
          meta: {
            layout: "MainLayout",
            roles: ["mod"],
            title: "addUser",
          },
        },
      ],
      meta: {
        layout: "MainLayout",
        roles: ["mod"],
        title: "users",
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
