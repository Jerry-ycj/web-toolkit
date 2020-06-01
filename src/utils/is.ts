import {AnyFunction} from '../types/common';

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
