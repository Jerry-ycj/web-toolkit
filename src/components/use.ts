import Vue from 'vue';
export enum ComponentName {
  Chart='kit-chart',
  DatePicker='kit-date-picker',
  DialogSimple='kit-dialog-simple',
  Empty='kit-empty',
  ErrChannel='kit-err-channel',
  Table='kit-table',
  Tip='kit-tip',
}

export function registerComponent(name:ComponentName) {
  Vue.component(name, () => import(`./${name}.vue`));
}
