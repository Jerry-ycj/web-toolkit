## kit-err-channel
错误信息提示，主要用于显示接口返回的错误信息，而不用Message.error。
配合使用case-main/store/errorMsgChannel.ts，submitErrMsg和pushMsgErr。
```html
<kit-err-channel style="margin-top: 8px" :id="id" />
<style lang="ts">
    import { submitErrChanel, clearErrMsg} from '../case-main';
    
    // 提交 error channel id，绑定
    submitErrChanel(id);
    // case-main/request中接口请求时，返回结果的处理中将会使用errorMsgChannel store
    // 如果有错误将会反馈到 kit-err-channel 组件
    
    // 清空错误信息，接触组件和id的绑定
    clearErrMsg(id);
</style>
```

## kit-dialog-simple

参数：
- confirm: 确定按钮的逻辑
- close: 取消按钮的逻辑
- modal: 结构中需要定义visible和loading，modal.loading可以用于useLoadingDirect中；
- width: 宽度
- noFooter: boolean，是否取消底部按钮显示。
- id: 主要用于errChannel的绑定，需要全局唯一。

内置了kit-err-channel。
```html
<kit-dialog-simple
  id="user"
  :modal="modal"
  :confirm="update"
  width="40%">
  <div slot="title"></div>
  <el-form ref="form" label-position="left" label-width="120px" :model="modal.data"></el-form>
</kit-dialog-simple>
```

## kit-table
表格：带分页, 用法相当于el-table和el-pagination的结合;

## kit-tip
用于说明信息，以图标+tooltip的方式。

## kit-chart
对vue-echarts组件的封装, 可将传入的数据转换为el-table形式, 默认提供图表类型的转换;
todo

## kit-date-picker
对el-date-picker的封装, 默认提供了一些快捷选项;
todo

## kit-scrollbar
一个具有美化滚动条的容器;
todo

## kit-select
对el-select的封装, 提供全选功能.
todo

