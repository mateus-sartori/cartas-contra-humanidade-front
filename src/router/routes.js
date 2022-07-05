import store from "../store";

function isAuthenticated(to, from, next) {
  if (store.getters.session) {
    next();
  } else {
    next("/login");
  }
}

function isNotAuthenticated(to, from, next) {
  if (!store.getters.session) {
    next();
  } else {
    next("/");
  }
}

const routes = [
  {
    path: "/",
    redirect: '/rooms',
    beforeEnter: isAuthenticated,
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/rooms", component: () => import("pages/Rooms.vue") },
      { path: "/room/:id", component: () => import("pages/RoomGame.vue") },
    ],
  },

  {
    path: "/login",
    beforeEnter: isNotAuthenticated,
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
