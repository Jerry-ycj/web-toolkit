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
