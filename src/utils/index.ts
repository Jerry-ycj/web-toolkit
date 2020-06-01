import { Message } from 'element-ui';
import { AnyFunction } from '../types/common';
import {isArray, isUndefined} from './is';

export * from './date';
export * from './is';
export * from './math';
export * from './regex';
export * from './array';

const { floor } = Math;
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
/**
 * 生成随机的长度为35的字符串id
 */
export function generateID() {
  let ID = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      const random = Math.random();
      const char = charset[floor(random * charset.length)];
      ID += char;
    }
    if (i !== 3) {
      ID += '-';
    }
  }
  return ID;
}

/**
 * 给定一个输入, 由给定的函数依次输出并作为输入传递到下一个函数直至返回
 * @param input 管道的输入
 * @param fns 管道的各个处理函数
 */
export function pipe<T>(input?: T, ...fns: AnyFunction[]) {
  for (const fn of fns) {
    input = fn(input);
  }
  return input;
}

/**
 * 将两个对象合并，嵌套对象会被展开合并
 * @param source target 会被合并到 source
 * @param target
 */
export const deepMerge = <S extends { [key: string]: any }, T extends { [key: string]: any }>(source: S, target: T): S & T => {
  for (const [key, val] of Object.entries(target)) {
    // @ts-ignore
    source[key] = isPlainObject(source[key]) && isPlainObject(val) ? deepMerge(source[key], target[key]) : target[key];
  }
  return source as S & T;
};

interface DebounceOptions {
  interval?: number;
  callLast?: boolean;
}
/**
 * 函数防抖/节流
 * @param fn
 * @param opts.interval default: 200
 * @param opts.callLast default: true
 */
export function debounce<F>(fn: F, opts?: DebounceOptions): F;
export function debounce<F extends AnyFunction>(fn: F, opts: DebounceOptions = {}): AnyFunction {
  const interval = isUndefined(opts.interval) ? 200 : opts.interval;
  const callLast = isUndefined(opts.callLast) || opts.callLast;
  let buffering = false;
  let lastArguments: IArguments | null;
  return function(this: any) {
    if (buffering) {
      lastArguments = arguments;
      return;
    } else {
      lastArguments = null;
      buffering = true;
      setTimeout(() => {
        buffering = false;
        if (callLast && lastArguments) {
          fn.call(this, ...lastArguments);
        }
      }, interval);
      fn.call(this, ...arguments);
    }
  };
}

/**
 * 命名模式转换 eg-name -> EgName
 */
export function kebabToPascal(kebab: string) {
  const tokens = kebab.split('-');
  const toFirstUpperCase = (str: string) => str.slice(0, 1).toUpperCase() + str.slice(1);
  return tokens.map((token) => toFirstUpperCase(token)).join('');
}

/**
 * 命名模式转换 EgName -> egName
 */
export function pascalToCamel(pascal: string) {
  return pascal.slice(0, 1).toLowerCase() + pascal.slice(1);
}

/**
 * 返回一个延迟给定时间resolve的Promise对象，用于使当前异步函数休眠
 * @param duration 持续时间（毫秒）
 */
export function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * 断言一个表达式，若为falsy值则抛出错误，中断js执行
 * @param exp 表达式
 * @param msg 断言失败的错误提示
 */
export function assert(exp: any, msg?: string) {
  if (!exp) {
    if (msg) {
      Message.error(msg);
    }
    throw new Error(msg || '断言失败');
  }
}

export const isRefType = (o: any) => o && typeof o === 'object';
// export interface IndexSignature {
//   [index: string]: any;
// }
/**
 * 深拷贝一个普通的js对象，采用非递归形式避免栈溢出
 * @param obj 源对象
 */
export function deepClone<T>(obj: T): T;
export function deepClone(obj: any) {
  if (!isRefType(obj)) {
    return obj;
  }
  const copy: Record<symbol | string | number, any> | any[] = isArray(obj) ? [] : {};
  const stack = [{
    copy,
    target: obj,
  }];
  const copiedRefs: Array<{ target: any, copy: any }> = [];
  const { set, ownKeys, getOwnPropertyDescriptor } = Reflect;
  while (stack.length) {
    const { target, copy } = stack.pop()!;
    const keys = ownKeys(target);
    for (const key of keys) {
      const desc = getOwnPropertyDescriptor(target, key);
      if (desc && !desc.enumerable) {
        continue;
      }
      const val = target[key];
      if (isRefType(val)) {
        const copied = copiedRefs.find(copied => copied.target === val);
        if (copied) {
          set(copy, key, copied.copy);
          continue;
        }
        const copyVal = isArray(val) ? [] : {};
        set(copy, key, copyVal);
        stack.push({
          target: val,
          copy: copyVal,
        });
      } else {
        set(copy, key, val);
      }
    }
    copiedRefs.push({
      target,
      copy,
    });
  }
  return copy;
}

/**
 * 截取给定位数的数字, 不足则左补0
 * @param num 需要截取的数字
 * @param n 截取的长度
 */
export function leftFill0(num: number, n = 2) {
  return (new Array(n).join('0') + num).slice(-n);
}

export function string2Download(content: string, title: string) {
  const blob = new Blob([content], {
    type: 'text/plain',
  });
  if ('download' in document.createElement('a')) { // 非IE下载
    const elink = document.createElement('a');
    elink.download = title;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else { // IE10+下载
    navigator.msSaveBlob(blob, title);
  }
}
