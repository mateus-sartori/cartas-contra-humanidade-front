import { Cookies } from "quasar";

function guardRoute(to, from, next) {
  var isAuthenticated = false;
  if (Cookies.get("session")) {
    isAuthenticated = true;
  } else {
    isAuthenticated = false;
  }

  if (isAuthenticated) {
    next();
  } else {
    next("/login");
  }
}

function guardNotRoute(to, from, next) {
  if (!Cookies.get("session")) {
    next();
  } else {
    next("/");
  }
}

const routes = [
  {
    path: "/",
    // beforeEnter: guardRoute,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/rooms", component: () => import("pages/Rooms.vue") },
      { path: "/room/:id", component: () => import("pages/RoomGame.vue") },
    ],
  },

  {
    path: "/login",
    beforeEnter: guardNotRoute,
    component: () => import("pages/Login.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
