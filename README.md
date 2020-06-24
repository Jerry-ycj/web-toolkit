# web-toolkit

应用于vue web项目的通用工具库

## 主要内容

- case-main: 主要后台管理场景的用法
- components: 通用的一些组件
- directive: vue.directive
- filter: vue.filter
- plugins: 主要插件
- scss
- service
- utils

## 基本用法

- 在项目中的plugins中加入web-toolkit.ts, 其中加载case、components、filter、plugins等。

```typescript
import Vue from 'vue';

// scss
import 'web-toolkit/src/scss/common.scss';
import 'web-toolkit/src/scss/vivify.scss';

// 注意加载顺序
import 'web-toolkit/src/plugins';
import 'web-toolkit/src/case-main';
import 'web-toolkit/src/filter/date-time';

// components
import lktTable from 'web-toolkit/src/components/lkt-table.vue';
Vue.component('lkt-table', lktTable);
import lktSelect from 'web-toolkit/src/components/lkt-select.vue';
Vue.component('lkt-select', lktSelect);
import LktDatePicker from 'web-toolkit/src/components/lkt-date-picker.vue';
Vue.component('lkt-date-picker', LktDatePicker);
import LktChart from 'web-toolkit/src/components/lkt-chart.vue';
Vue.component('lkt-chart', LktChart);
import LktCheck from 'web-toolkit/src/components/lkt-check.vue';
Vue.component('lkt-check', LktCheck);
import KitDialogSimple from 'web-toolkit/src/components/kit-dialog-simple.vue';
Vue.component('kit-dialog-simple', KitDialogSimple);
import KitErrChannel from 'web-toolkit/src/components/kit-err-channel.vue';
Vue.component('kit-err-channel', KitErrChannel);
import KitTip from 'web-toolkit/src/components/kit-tip.vue';
Vue.component('kit-tip', KitTip);
```

- service、utils的可以直接在项目中引用。

## 环境变量

- NODE_ENV: production
- BASE_URL in vue.config.js
- ENTRY in vue.config.js
- VUE_APP_ROUTE_BASE
- VUE_APP_ROUTE_MODE: hash or history
- VUE_APP_BASE_URL: 后端请求的base url
- VUE_APP_TEST_BASE_URL: dev环境下的后端请求的base url

# 常见问题

## 请求接口时参数不正常

如上传formdata时：
参数会经过axios过滤器，注意查看过滤器的逻辑。
