import { Message } from 'element-ui';
import { AnyFunction } from '../types/common';

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
 * 便于ts类型推断
 */
export function isUndefined(v: any): v is void {
  return typeof v === 'undefined';
}
export function isNull(v: any): v is null {
  return typeof v === 'object' && !v;
}
export function isString(v: any): v is string {
  return typeof v === 'string';
}
export function isNumber(v: any): v is number {
  return typeof v === 'number';
}
export function isFunction(v: any): v is AnyFunction {
  return typeof v === 'function';
}
export function isPlainObject(v: any) {
  return typeof v === 'object' && v;
}
export const isArray = Array.isArray;
/** 判断这个值没有  */
export function isNil(v: any) {
  return v === undefined || v === null || v === '';
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
export interface IndexSignature {
  [index: string]: any;
}
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

function resolveFormatter(formatter: string) {
  const tokens = formatter.split(/[\.\:]/).filter(token => token.trim()).filter(Boolean).map(token => [token, true] as [string, boolean]);
  return new Map(tokens);
}
/**
 * 格式化毫秒数
 * @param ms
 * @param zh：是否中文
 * @param formatterStr
 */
export function formatMilliseconds(ms: number, zh?: boolean, formatterStr = 'hh:mm:ss') {
  if (isNaN(Number(ms))) { return '- -'; }

  const formatter = resolveFormatter(formatterStr);
  const MM = formatter.get('MM');
  const DD = formatter.get('DD');
  const hh = formatter.get('hh');
  const mm = formatter.get('mm');
  const ss = formatter.get('ss');
  const mmm = formatter.get('mmm');
  const m = formatter.get('m');

  ms = floor(ms);
  let day = floor(floor(ms / 3600000) / 24);
  let hour = floor(ms / 3600000);
  let min = floor(ms / 60000);
  let sec = floor(ms / 1000);
  day = MM ? day % 30 : day;
  hour = DD ? hour % 24 : hour;
  min = mm ? min % 60 : min;
  sec = ss ? sec % 60 : sec;
  ms = mmm ? ms % 1000 : ms;
  ms = m ? floor(ms % 1000 / 100) : ms;

  let ret = '';
  if (zh) {
    DD && (ret += day + '天');
    hh && (ret += hour + '时');
    mm && (ret += min + '分');
    ss && (ret += sec + '秒');
    mmm && (ret += ms + '毫秒');
  } else {
    DD && (ret += leftFill0(day));
    DD && hh && (ret += ':');
    hh && (ret += leftFill0(hour));
    hh && mm && (ret += ':');
    mm && (ret += leftFill0(min));
    mm && ss && (ret += ':');
    ss && (ret += leftFill0(sec));
    ss && (mmm || m) && (ret += '.');
    mmm && (ret += leftFill0(ms, 3));
    m && (ret += leftFill0(ms, 1));
  }
  return ret;
}

export function formatDate(date: Date) {
  return date.getFullYear() + '-' + leftFill0(date.getMonth() + 1) + '-' + leftFill0(date.getDate());
}

export function formatTime(date: Date) {
  const h = leftFill0(date.getHours());
  const m = leftFill0(date.getMinutes());
  const s = leftFill0(date.getSeconds());
  return h + ':' + m + ':' + s;
}

export function formatDateTime(date: Date) {
  return formatDate(date) + ' ' + formatTime(date);
}

/**
 * 截取给定位数的数字, 不足则左补0
 * @param num 需要截取的数字
 * @param n 截取的长度
 */
export function leftFill0(num: number, n = 2) {
  return (new Array(n).join('0') + num).slice(-n);
}

/**
 * 只要list中含有后面传入的所有参数中的一项就返回true
 * @param list
 * @param strs 第二个以及之后的所有参数集合
 */
export function listContainsOr(list: string[], ...strs: string[]) {
  return strs.some((str) => list.includes(str));
}
export function listContainAnd(list: any[], ...strs: any[]) {
  for (const e of strs) {
    if (list.indexOf(e) < 0) { return false; }
  }
  return true;
}

/**
 * 一个对象，根据数字得到中文， 0为星期日
 */
export const weekMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/**
 * 获取当前时间的格式化对象
 */
export function getClock() {
  const dt = new Date();
  return {
    dt: formatDate(dt),
    week: weekMap[dt.getDay()],
    time: formatTime(dt),
  };
}

/**
 * Test a string with phone number Reg.
 * @param phone
 */
export function regexPhone(phone: string): boolean {
  return /^1[34578]\d{9}$/.test(phone);
}

export function regexIP(ip: string): boolean {
  return /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/.test(ip);

}
// rule check
export function ruleCheckIP(rule: any, value: any, callback: any) {
  if (regexIP(value)) {
    callback();
  } else {
    callback(new Error('非IP格式'));
  }
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

/** 如果返回-1 表示未找到 */
export function findIndexOfArray(array: any[], val: any, key?: string): number {
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (item instanceof Object) {
      if (!key) { throw Error('findIndexOfArray_key_null'); }
      if (item[key] === val) { return i; }
    } else {
      if (item === val) { return i; }
    }
  }
  return -1;
}
