import Vue from 'vue';
import { isNumber, formatDate, formatDateTime, formatMilliseconds, isDate } from '../utils';
import {leftFill0} from '../utils/index';

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
Vue.filter('datetime', (value?: number | Date | String) => {
  if (isNumber(value)) {
    const date = new Date(value);
    if (date.toString().includes('Invalid')) {
      return '-';
    } else {
      return formatDateTime(date);
    }
  } else if (isDate(value)) {
    return formatDateTime(value as Date);
  } else {
    const d = new Date(value as any);
    if (isDate(d)) {
      return formatDateTime(d);
    } else {
      return '- -';
    }
  }
});
Vue.filter('date', (value?: number | Date | String) => {
  if (isNumber(value)) {
    const date = new Date(value);
    if (date.toString().includes('Invalid')) {
      return '- -';
    } else {
      return formatDate(date);
    }
  } else if (isDate(value)) {
    return formatDate(value as Date);
  } else {
    const d = new Date(value as any);
    if (isDate(d)) {
      return formatDate(d);
    } else {
      return '- -';
    }
  }
});
Vue.filter('dateMD', (value?: number | Date | String) => {
  if (isNumber(value)) {
    const date = new Date(value);
    if (date.toString().includes('Invalid')) {
      return '- -';
    } else {
      return leftFill0(date.getMonth() + 1) + '-' + leftFill0(date.getDate());
    }
  } else if (isDate(value)) {
    return leftFill0((value as Date).getMonth() + 1) + '-' + leftFill0((value as Date).getDate());
  } else {
    const d = new Date(value as any);
    if (isDate(d)) {
      return leftFill0(d.getMonth() + 1) + '-' + leftFill0(d.getDate());
    } else {
      return '- -';
    }
  }
});

