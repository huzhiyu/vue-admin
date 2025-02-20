import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Layout from "../layout/index.vue";
import { RouteItem } from "@/types";
import { initPermission } from "./permission";
import Page404 from "../views/page-404.vue";

Vue.use(VueRouter);

/**
 * 基础路由
 */
export const base: Array<RouteItem> = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login.vue"),
    meta: { hidden: true, title: "请登陆" }
  },
  {
    path: "/404",
    name: "page-404",
    component: Page404,
    meta: { hidden: true, title: "不存在该页面" }
  },
  {
    path: "/401",
    name: "page-401",
    component: () => import("../views/page-401.vue"),
    meta: { hidden: true, title: "暂无权限访问" }
  }
];

/**
 * 动态路由
 */
export const add: Array<RouteItem> = [
  {
    path: "/",
    name: "index",
    redirect: "/home",
    component: Layout,
    meta: { title: "首页", icon: "home" },
    children: [
      {
        path: "/home",
        meta: { title: "首页展示", icon: "guide" },
        component: () => import("../views/example/home.vue")
      },
      {
        path: "/nested",
        name: "nested",
        redirect: "/nested/menu-1",
        meta: { title: "多级菜单嵌套", icon: "tree" },
        component: () => import("../views/example/nested.vue"),
        children: [
          {
            path: "/nested/menu-1",
            name: "nested/menu-1",
            meta: { title: "菜单 2-1" },
            component: () => import("../views/example/menu-1.vue")
          },
          {
            path: "/nested/menu-2",
            name: "nested/menu-2",
            meta: { title: "菜单 2-2" },
            component: () => import("../views/example/menu-2.vue")
          },
          {
            path: "/nested/three-level",
            name: "nested/three-level",
            meta: { title: "三级菜单" },
            redirect: "/nested/three-level/menu-1",
            component: () => import("../views/example/nested.vue"),
            children: [
              {
                path: "/nested/three-level/menu-1",
                name: "/nested/three-level/menu-1",
                meta: { title: "菜单 3-1" },
                component: () => import("../views/example/menu-1.vue")
              },
              {
                path: "/nested/three-level/menu-2",
                name: "/nested/three-level/menu-2",
                meta: { title: "菜单 3-2" },
                component: () => import("../views/example/menu-2.vue")
              }
            ]
          },
          {
            path: "/nested/four-level",
            name: "nested/four-level",
            meta: { title: "三级菜单-2" },
            redirect: "/nested/four-level/menu-1",
            component: () => import("../views/example/nested.vue"),
            children: [
              {
                path: "/nested/four-level/menu-1",
                name: "/nested/four-level/menu-1",
                meta: { title: "菜单 3-2-1" },
                component: () => import("../views/example/menu-1.vue")
              },
              // {
              //   path: "/nested/four-level/menu-2",
              //   name: "/nested/four-level/menu-2",
              //   meta: { title: "菜单 3-2-2" },
              //   component: () => import("../views/example/menu-2.vue")
              // }
            ]
          },
          {
            path: "/nested/menu-3",
            name: "nested/menu-3",
            meta: { title: "菜单 2-3" },
            component: () => import("../views/example/column-1.vue")
          }
        ]
      },
      {
        path: "/menu-4",
        name: "menu-4",
        meta: { title: "换行菜单标题换行菜单标题", icon: "nested" },
        component: () => import("../views/example/column-2.vue")
      }
    ]
  },
  {
    path: "/example",
    name: "example",
    component: Layout,
    meta: { title: "示例页栏目", icon: "menu" },
    redirect: "/example/request",
    children: [
      {
        path: "/example/request",
        name: "example-request",
        meta: { title: "http-请求示例", keepAlive: true },
        component: () => import("../views/example/request.vue")
      },
      {
        path: "/example/components",
        name: "example-components",
        meta: { title: "自定义组件" },
        component: () => import("../views/example/the-components.vue")
      }
    ]
  },
  {
    path: "/icon",
    name: "icon",
    auth: [0],
    meta: { title: "图标栏目" },
    component: Layout,
    redirect: "/icon/svg-icons",
    children: [
      {
        path: "/icon/svg-icons",
        name: "svg-icons",
        component: () => import(/* webpackChunkName: "icons" */ "../views/icons.vue"),
        meta: { title: "svg-图标", icon: "svg-icon", keepAlive: true }
      }
    ]
  },
  {
    path: "/" + store.projectInfo.link,
    link: store.projectInfo.link,
    name: "GitHub-Hansen",
    component: Page404, // 这里必需给一个组件
    auth: [0],
    meta: { title: "项目地址", icon: "github" }
  }
];

/**
 * 过滤掉侧边导航栏不显示的路由
 * @param array 路由列表
 */
export const filterHidden = (array: Array<RouteItem>) => {
  array = JSON.parse(JSON.stringify(array));
  const result: Array<RouteItem> = [];
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (!item.meta || (item.meta && !item.meta.hidden)) {
      result.push(item);
      if (item.children && item.children.length > 0) {
        item.children = filterHidden(item.children);
      }
    }
  }
  return result;
};

/** `VueRouter`路由实例化对象 */
const router = new VueRouter({
  routes: base
});
initPermission(router, base, add);
export default router;
