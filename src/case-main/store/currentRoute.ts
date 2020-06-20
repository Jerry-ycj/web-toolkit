// 实时保存当前路由对象
import {reactive} from '@vue/composition-api';

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
export function updateStoreCurrentRoute(route: any) {
  storeCurrentRoute.meta = route.meta;
  storeCurrentRoute.name = route.name;
  storeCurrentRoute.path = route.path;
  storeCurrentRoute.query = route.query;
  storeCurrentRoute.params = route.params;
}
