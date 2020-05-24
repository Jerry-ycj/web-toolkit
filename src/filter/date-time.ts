import Vue from 'vue';
import { formatDate, formatDateTime, formatMilliseconds } from '../utils';

Vue.filter('DD:hh:mm', (val: number) => {
  return formatMilliseconds(val, false, 'DD:hh:mm');
});
Vue.filter('mm:ss.m', (val: number) => {
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
Vue.filter('filter_datetime', (val: Date) => {
  return formatDateTime(val);
});
Vue.filter('date', (val: Date) => {
  return formatDate(val);
});
