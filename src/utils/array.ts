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
