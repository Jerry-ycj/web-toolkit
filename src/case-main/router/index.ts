import VueRouter from 'vue-router';
import { isNil } from '../../utils';
import Vue from 'vue';
Vue.use(VueRouter);

let mode = process.env.VUE_APP_ROUTE_MODE;
if (isNil(mode)) { mode = 'history'; }

export const genRouter = (routes: any) => {
  return new VueRouter({
    mode,
    base: process.env.VUE_APP_ROUTE_BASE,
    routes,
    // 跳转时 回到顶部
    scrollBehavior() {
      // savedPosition
      return {
        x: 0,
        y: 0,
      };
    },
  });
};
