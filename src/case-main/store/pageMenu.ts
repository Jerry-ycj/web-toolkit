
// 菜单信息等
import {reactive} from '@vue/composition-api';

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
