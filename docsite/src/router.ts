import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import HomeView from "./views/HomeView.vue"
import { libName } from "./conf"

const baseTitle = libName;

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: HomeView,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/apidoc/:file+",
    component: () => import("./views/MdApiFileView.vue"),
    meta: {
      title: "Apidoc"
    }
  },
  {
    path: "/ts/get",
    component: () => import("./views/ts/TsGetView.vue"),
    meta: {
      title: "Get request"
    }
  },
  {
    path: "/ts/post",
    component: () => import("./views/ts/TsPostView.vue"),
    meta: {
      title: "Post request"
    }
  },
  {
    path: "/ts/put",
    component: () => import("./views/ts/TsPutView.vue"),
    meta: {
      title: "Put request"
    }
  },
  {
    path: "/ts/patch",
    component: () => import("./views/ts/TsPatchView.vue"),
    meta: {
      title: "Patch request"
    }
  },
  {
    path: "/ts/error",
    component: () => import("./views/ts/TsErrorView.vue"),
    meta: {
      title: "Request error"
    }
  },
  {
    path: "/ts/csrf",
    component: () => import("./views/CsrfView.vue"),
    meta: {
      title: "Csrf tokens"
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.afterEach((to, from) => { // eslint-disable-line
  document.title = `${baseTitle} - ${to.meta?.title}`
});

export default router