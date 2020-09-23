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

```

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

# case-main

# case-pc

# components
# filter
# plugins
# scss
# service
# utils
