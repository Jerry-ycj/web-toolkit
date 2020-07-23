// @ts-ignore
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import VueRouter from 'vue-router';
import { Route } from 'vue-router';
import { CancelTokenSources } from '../request';
import { listContainAnd } from '../../utils';
import { storeUserInfo, storePageMenu, initStoreUserInfo, updateStoreCurrentRoute } from '../store';
import { submitErrChanel } from '..';

/** 用于页面权限的校验 */
export function checkPrivilege(all: any[], need: any[]) {
  if (!need || need.length === 0) {
    return true;
  }
  if (!all || all.length === 0) { return false; }
  for (const e of need) {
    if ((typeof e) === 'string') {
      // or
      if (all.indexOf(e) > -1) { return true; }
    } else if (typeof e === 'object') {
      // []，and
      if (listContainAnd(all, ...e)) { return true; }
    }
  }
  return false;
}
// role.departments的检查 , or关系
// export function checkAuthDepartments(target: any, need: number[]) {
//   if (!need || need.length === 0) {
//     return true;
//   }
//   if (target === null || target === undefined) { return false; }
//   return need.indexOf(target) > -1;
//
// }

export function checkAuth(menu: any) {
  if (!storeUserInfo.user || !storeUserInfo.user.role) { return false; }
  if(menu.authFunc){
    return menu.authFunc()
  }else{
    return checkPrivilege((storeUserInfo.user as any).role.privileges, (menu.privileges as any[]))
  }
}

// 寻找本用户对应权限的第一个route
export function getMainRoute() {
  if (!storeUserInfo.user) { return null; }
  for (const menu of storePageMenu) {
    if (menu.children) {
      for (const m of menu.children) {
        if (checkAuth(m)) { return m.name ? {name: m.name} : null; }
      }
    } else if (checkAuth(menu)) { return menu.name ? {name: menu.name} : null; }
  }
}

export function routeIntercept(router: VueRouter) {
  router.beforeEach((to, from, next) => {
    // 取消请求
    for (const source of CancelTokenSources) {
      source.cancel();
    }
    CancelTokenSources.splice(0, CancelTokenSources.length);
    RouteInterceptConfig.beforePartFunc(to, from, next);
    next();
  });
  router.afterEach(to => {
    const lastMatch = to.matched[to.matched.length - 1];
    /**
     * 获取最后一个匹配的路由, 重写其路由组件的mounted钩子, 使其原本的mounted结束后调用NProgress.done()
     */
    if (lastMatch) {
      // 先保存当前路由至store
      updateStoreCurrentRoute(to);
      for (const component of Object.values(lastMatch.components)) {
        if (!component) {
          continue;
        }
        if (!(component as any).options && (!(component as any)._Ctor || !(component as any)._Ctor[0])) {
          continue;
        }
        const mounteds = (component as any).options ? (component as any).options.mounted : (component as any)._Ctor[0].options.mounted as Array<() => void> | void;
        if (mounteds && mounteds.length > 0) {
          const lastMounted = mounteds.pop();
          const nprogressDoneHandler = async function(this: any) {
            await lastMounted!.call(this);
            NProgress.done();
          };
          mounteds.push(nprogressDoneHandler);
        } else {
          (component as any).options.mounted = [() => NProgress.done()];
        }
      }
      const ins = lastMatch.instances.default;
      if (ins) {
        const mounteds = ins.$options.mounted as Array<() => void> | void;
        for (const mounted of (mounteds || [])) {
          mounted.call(ins);
        }
        ins.$emit('hook:mounted');
      }
    }
    /**
     * 由于相同路由的跳转不会重新挂载路由组件, 此时须要手动调用mounted, instances为路由组件的实例
     */
    //   if (to.name === from.name) {
    //     if (lastMatch) {
    //       for (const [key, component] of Object.entries(lastMatch.components)) {
    //         // @ts-ignore
    //         const mounteds = component.options.mounted as (() => void)[] | void;
    //         if (mounteds) {
    //           for (const mounted of mounteds) {
    //             mounted.call(lastMatch.instances[key]);
    //           }
    //         }
    //       }
    //     }
    //   }
  });
}

export const RouteInterceptConfig = {
  beforePartFunc(to: Route, from: Route, next: any) {
    if (to.name !== from.name && process.env.VUE_APP_REQUEST_MODE !== 'display') {
      NProgress.start();
    }
    if (!storeUserInfo.token) {
      initStoreUserInfo();
    }
    // 初始化err-msg-channel
    submitErrChanel('');
    // 指定默认第一个路由
    if (to.path === '/') {
      const menu = getMainRoute();
      if (menu) { next(menu); }
    }
    // 处理需要登录的
    if (to.matched.some((record) => !record.meta.authDisabled)) {
      if (!storeUserInfo.token) {
        // @ts-ignore
        storeUserInfo.redirect = (to as Route);
        next({name: 'login'});
      } else {
        // 用户权限
        if (
          !to.meta ||
          checkAuth(to.meta)
        ) {
          next();
        } else {
          if (from.name === '404') {
            next({name: 'index'});
          } else {
            next({name: '404', params: {msg: '当前页面无权限查看'}});
          }
        }
      }
    } else if (to.name === 'login' && from.path !== to.path && storeUserInfo.token) {
      // 直接访问login的
      // 说明是已经登录的就回原处
      next({name: 'index'});
    } else {
      next();
    }
  },
};
