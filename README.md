# web-toolkit
应用于vue web项目的通用工具库

# case-main 用法
这是一种通用后台管理页面的场景。
main.ts中：
```typescript
import Vue from 'vue';
import App from './App.vue';
// 加载所用组件，含core
import './plugin';
// 加载case-main中的路由拦截、请求拦截、菜单构建
import { routeIntercept, axiosIntercept, buildMenu} from 'web-toolkit/src/case-main';
// 菜单构建所需要的配置
import { mainMenuTitles } from './config';
import './scss/common.scss';
// 自定义路由配置
import { routes } from './router/routes';
// 路由生成工具
import { genRouter } from 'web-toolkit/src/case-main/router';
export const router = genRouter(routes);
buildMenu(routes, mainMenuTitles);
routeIntercept(router);
axiosIntercept(router);

const vm = new Vue({
  router,
  render: (h) => h(App),
});
// 可用于延迟加载
vm.$mount('#app');
```

# Note
+ 编写页面请使用Vue 3.0的composition-api, class组件将在不久以后弃用, 请勿使用mixin, 这会随着class组件一起弃用;
+ 如需新增工具函数, 请在tests/unit中增加单元测试;
+ vue3-migaration目录用于存放vue 3编写的可复用功能，将来须完全替代目前的mixin、decorator;
+ 避免使用data-tables组件，请使用lkt-table;
+ element-ui按需引入，新增使用到的组件请在plugins/element-ui中注册；

# TODO
+ store有历史遗留代码，很多需要整理清除；
+ 默认页面须要用composition-api全部重构，vue 3正式发布时可以使用精简构建（不兼容IE 11），可以减少很多代码体积；
+ 可以使用monorepo方式拆分本库，可以解决更新一次库需要把所有依赖重新下载一次导致耗时较长的问题；

# Filter
+ DD:hh:mm: 参数为毫秒数;
+ mm:ss.m: 参数为毫秒数;
+ hh:mm:ss: 别名HMS, 参数为毫秒数;
+ DD:hh:mm:ss: 参数为毫秒数;
+ datetime: 参数为Date对象;
+ date: 参数为Date对象;

# Directive 
+ v-drag: 使一个元素可以拖拽, strict修饰符用于指定仅当事件触发的元素为该元素时才可拖动, pointer修饰符用于将cursor换为pointer, 可选地绑定一个布尔值, 为true时增加拖拽事件;

# Components
+ lkt-check: 根据bool值显示√或×;
+ lkt-chart: 对vue-echarts组件的封装, 可将传入的数据转换为el-table形式, 默认提供图表类型的转换;
+ lkt-date-picker: 对el-date-picker的封装, 默认提供了一些快捷选项;
+ lkt-progress: 表现类似el-progress, circle类型多出一个active选项, 进度条会有特效;
+ lkt-scrollbar: 一个具有美化滚动条的容器;
+ lkt-select: 对el-select的封装, 简化代码, 提供全选功能, 根据multiple的值有不同的默认表现;
+ lkt-table: 带分页, 用法相当于el-table和el-pagination的结合;
+ lkt-err-channel: 错误信息提示，主要用于显示接口返回的错误信息，而不用Message.error。配合使用submitErrMsg和pushMsgErr
+ lkt-dialog-simple: modal需要定义visible和loading，modal.loading可以用于useLoadingDirect中；内置了lkt-err-channel。

# CSS 类
+ flex
  + flex: 开启flex;
  + inline: 内联元素, 基本等同inline-block;
  + start: flex-start;
  + end: flex-end;
  + center: 水平垂直居中，可在后面接between等覆盖水平居中;
  + between: space-between;
  + around: space-around;
  + column: 开启列布局;
  + little-space: 使所有直接子元素带有较小的左右外边距（5px），可以用在center和start以及end的时候，避免元素挤到一块;
  + wrap: 开启换行，flex元素默认不换行，会无限挤压;
+ other
  + top-layer: 使元素处于所有定位元素的最顶级, 当Message未消失就弹出模态框时会用到, 避免Message被模态框遮罩掩盖;
  + search-bar: 搜索框的样式, 长度350px;

# 常见问题
## 请求接口时参数不正常
如上传formdata时。
参数会经过axios过滤器，注意查看过滤器的逻辑。
