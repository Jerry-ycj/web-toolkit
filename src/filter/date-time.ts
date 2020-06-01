import Vue from 'vue';
import { isNumber, formatDate, formatDateTime, formatMilliseconds } from '../utils';

Vue.filter('DD:hh:mm', (val: number) => {
  return formatMilliseconds(val, false, 'DD:hh:mm');
});
Vue.filter('HMS', (val: number) => {
  return formatMilliseconds(val);
});
Vue.filter('hh:mm:ss', (val: number) => {
  return formatMilliseconds(val);
});
Vue.filter('DD:hh:mm:ss', (val: number) => {
  return formatMilliseconds(val, false, 'DD:hh:mm:ss');
});
Vue.filter('datetime', (value?: number | Date) => {
  if (isNumber(value)) {
    const date = new Date(value);
    if (date.toString().includes('Invalid')) {
      return '-';
    } else {
      return formatDateTime(date);
    }
  } else if (value instanceof Date) {
    return formatDateTime(value);
  } else {
    return '- -';
  }
});
Vue.filter('date', (value?: number | Date) => {
  if (isNumber(value)) {
    const date = new Date(value);
    if (date.toString().includes('Invalid')) {
      return '- -';
    } else {
      return formatDate(date);
    }
  } else if (value instanceof Date) {
    return formatDate(value);
  } else {
    return '- -';
  }
});
