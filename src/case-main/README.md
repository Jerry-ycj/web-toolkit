## case-main 用法
这是一种通用后台管理页面的场景。
main.ts中：
```typescript
import Vue from 'vue';
import App from './App.vue';
// 加载所用组件，含core；组件可分开加载
import './plugin';
// 加载case-main中的路由拦截、请求拦截、菜单构建
import { routeIntercept, axiosIntercept, buildMenu} from 'web-toolkit/src/case-main';
// 菜单构建所需要的配置
import { mainMenuTitles } from './config';
import './scss/common.scss';
// 自定义路由配置
import { routes } from './router/routes';
// 路由生成工具
import { genRouter } from 'web-toolkit/src/case-main/router';
export const router = genRouter(routes);
buildMenu(routes, mainMenuTitles);
routeIntercept(router);
axiosIntercept(router);

const vm = new Vue({
  router,
  render: (h) => h(App),
});
// 可用于延迟加载
vm.$mount('#app');
```

## request
post请求、上传

## router
router的初步定义，router拦截器。
左侧菜单栏结构的构建。

## store
