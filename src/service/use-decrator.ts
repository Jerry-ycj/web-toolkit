import { MessageBox } from 'element-ui';
import { Ref } from '@vue/composition-api';
import { AnyFunction } from '../types/common';

export function useLoading(loadingValue: Ref<boolean>, fn: AnyFunction) {
  // 环境变量不同
  // return useLoadingDirect(loadingValue.value, fn);
  return async function(this: any, ...rest: any[]) {
    loadingValue.value = true;
    try {
      await fn.apply(this, rest);
    } catch (e) {
      throw e;
    } finally {
      loadingValue.value = false;
    }
  };
}
// 用于modal.loading
export function useLoadingDirect(loadingModal: Ref<any>, fn: AnyFunction) {
  if (!loadingModal.value) { throw Error('useLoadingDirect: loadingModal is null'); }
  return async function(this: any, ...rest: any[]) {
    loadingModal.value.loading = true;
    try {
      await fn.apply(this, rest);
    } catch (e) {
      throw e;
    } finally {
      loadingModal.value.loading = false;
    }
  };
}
export function useConfirm(msg: string, fn: AnyFunction) {
  return async function(this: any, ...rest: any[]) {
    try {
      await MessageBox.confirm(msg);
      fn.apply(this, rest);
    } catch {}
  };
}

// store跨组件中的loading
export function useLoadingStore(store: any, fn: AnyFunction) {
  if (!store) { throw Error('useLoadingStore: store is null'); }
  return async function(this: any, ...rest: any[]) {
    store.loading = true;
    try {
      await fn.apply(this, rest);
    } catch (e) {
      throw e;
    } finally {
      store.loading = false;
    }
  };
}
