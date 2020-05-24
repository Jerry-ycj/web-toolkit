
/** m进制的num 转为n进制的  */
export function hexTransfer(num: string, m: number, n: number) {
  return parseInt(num, m).toString(n);
}
