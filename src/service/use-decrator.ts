import {MessageBox} from 'element-ui';
import {Ref} from '@vue/composition-api';
import {AnyFunction} from '../types/common';

export function useLoading(loadingValue: Ref<boolean>, fn: AnyFunction) {
  // 环境变量不同
  // return useLoadingDirect(loadingValue.value, fn);
  return async function (this: any, ...rest: any[]) {
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
  if (!loadingModal.value) {
    throw Error('useLoadingDirect: loadingModal is null');
  }
  return async function (this: any, ...rest: any[]) {
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
export function useConfirmNew(fn: AnyFunction, msg?: string) {
  return async function (this: any, ...rest: any[]) {
    try {
      const h2 = this.$createElement
      await MessageBox({
        message: h2('div', {style: 'margin: 20px;font-size: 15px;font-weight: 1200;'}, [h2('div', {
            class: 'flex align-center little-space',
            style: 'font-size: 18px;font-weight: bold;'
          }, [h2('i', {
            class: 'el-icon-warning-outline',
            style: 'margin-bottom:10px;font-size: 30px;color: #F5A400;'
          }, ''), h2('p', '你确定删除这项内容吗？', {style: 'margin-top:-20px;font-size: 18px;font-weight: bold;'})]),
            h2('div', {style: 'margin-left:40px;font-size: 14px;'}, msg?msg:'删除这条数据后，将无法恢复')]
        ),
        closeOnClickModal:false,
        closeOnPressEscape:false,
        showClose: false,
        showConfirmButton: true,
        confirmButtonText: '删除',
        confirmButtonClass: 'button-delete',
        showCancelButton: true
      })
      fn.apply(this, rest);
    } catch {
    }
  };
}

// store跨组件中的loading
export function useLoadingStore(store: any, fn: AnyFunction) {
  if (!store) {
    throw Error('useLoadingStore: store is null');
  }
  return async function (this: any, ...rest: any[]) {
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
