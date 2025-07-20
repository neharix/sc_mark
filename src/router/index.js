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
      path: "/juries",
      name: "juries",
      component: () => import("../views/JuryViews/Juries.vue"),
      children: [
        {
          path: "",
          name: "juries-list",
          component: () => import("../views/JuryViews/List.vue"),
          meta: {
            layout: "MainLayout",
            roles: ["mod"],
            title: "juries",
          },
          beforeEnter: guards.authGuard,
        },
        {
          path: "add",
          name: "add-jury",
          component: () => import("../views/JuryViews/Add.vue"),
          meta: {
            layout: "MainLayout",
            roles: ["mod"],
            title: "addJury",
            restriction: "canModeratorAddJury",
          },
          beforeEnter: guards.authGuard,
        },
        {
          path: "edit/:id",
          name: "edit-jury",
          component: () => import("../views/JuryViews/Edit.vue"),
          meta: {
            layout: "MainLayout",
            roles: ["mod"],
            title: "editJury",
          },
          beforeEnter: guards.authGuard,
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
