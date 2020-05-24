import { reactive } from '@vue/composition-api';
import { IUser } from '..';
import { Route } from 'vue-router';

// reactive的数据必须初始，否则无法响应？

// 实时保存当前路由对象
interface IStoreRoute {
  meta?: object;
  name: string;
  path: string;
  query?: object;
  params?: object;
}
export const storeCurrentRoute = reactive<IStoreRoute>({
  name: 'index',
  path: '/',
  meta: undefined,
});

interface IUserLoginInfo {
  user?: IUser;
  token?: string;
  // 用于跳转地址
  redirect?: Route;
  // 用于storage中的过期时间
  expire?: number;
  setting?: object;
}
export const storeUserInfo = reactive<IUserLoginInfo>({
  user: undefined,
  token: undefined,
  redirect: undefined,
});

// 菜单信息等
export interface IMenuItem {
  children?: IMenuItem[];
  icon?: string;
  privileges?: string[];
  // user.role.department 筛选
  authDepartments?: number[];
  title?: string;
  name?: string;
  cTitle?: string;
}
export const storePageMenu = reactive<IMenuItem[]>([]);

export function initStoreUserInfo() {
  const dataJson = localStorage.getItem(process.env.VUE_APP_APP_NAME + '-user');
  if (!dataJson) {
    storeUserInfo.user = undefined;
    storeUserInfo.token = undefined;
    storeUserInfo.setting = undefined;
  } else {
    const data = JSON.parse(dataJson);
    // 过期策略
    if (new Date().getTime() - data.expire > 0) {
      rmStoreUserInfo();
    } else {
      storeUserInfo.user = data.user;
      storeUserInfo.token = data.token;
      storeUserInfo.setting = data.setting;
    }
  }
}
export function updateStoreUserInfo(data: IUserLoginInfo) {
  storeUserInfo.user = data.user;
  storeUserInfo.token = data.token;
  storeUserInfo.setting = data.setting;
  storeUserInfo.expire = new Date().getTime() + 1000 * 60 * 60 * 20; // 过期时间 20h
  localStorage.setItem(process.env.VUE_APP_APP_NAME + '-user', JSON.stringify(storeUserInfo));
}
export function rmStoreUserInfo() {
  for (const key in storeUserInfo) {
    // @ts-ignore
    delete storeUserInfo[key];
  }
  localStorage.removeItem(process.env.VUE_APP_APP_NAME + '-user');
}

export function updateStoreCurrentRoute(route: any) {
  storeCurrentRoute.meta = route.meta;
  storeCurrentRoute.name = route.name;
  storeCurrentRoute.path = route.path;
  storeCurrentRoute.query = route.query;
  storeCurrentRoute.params = route.params;
}
