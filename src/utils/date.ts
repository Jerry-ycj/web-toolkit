
export function clearHMS(dt: Date) {
  dt.setHours(0);
  dt.setMinutes(0);
  dt.setSeconds(0);
  dt.setMilliseconds(0);
}

/**
 * 根据dt获取其所在的一周时间范围 7天
 * @param dt
 */
export function getWeekDaysRange(dt: Date): Date[] {
  clearHMS(dt);
  // 0-周日，6-周一
  const dt1 = new Date();
  dt1.setTime(dt.getTime());
  let day = dt.getDay();
  if (day === 0) { day = 7; }
  dt1.setDate(dt.getDate() - day + 1);
  const res = [dt1];
  for (let i = 1; i < 7; i++) {
    res.push(datePlus(dt1, i));
  }
  return res;
}
function datePlus(dt: Date, plus: number): Date {
  const res = new Date(dt.getTime());
  res.setDate(res.getDate() + plus);
  return res;
}
