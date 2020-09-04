
// 菜单信息等
import {reactive} from '@vue/composition-api';

export interface IMenuItem {
  children?: IMenuItem[];
  icon?: string;
  privileges?: string[];
  authFunc?: Function;
  title?: string;
  name?: string;
  cTitle?: string;
}
export const storePageMenu = reactive<IMenuItem[]>([]);
// storePageMenu所属的router name（storePageMenu是对此router的children的抽象）
export const storePageMenuOption = reactive<any>({
  indexName: 'index'
})
