<template>
  <el-dialog
          :modal-append-to-body='false'
          :close-on-click-modal="false"
          :visible.sync="modal.visible"
          :before-close="cancel"
          v-loading="modal.loading||false"
          :width="width">
    <div slot="title" class="flex center">
      <slot name="title" />
    </div>
    <slot/>
    <div slot="footer" class="flex column footer" v-if="!noFooter">
      <div class="flex center">
        <el-button type="info" plain @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm2">确定</el-button>
      </div>
      <kit-err-channel style="margin-top: 8px" :id="id" />
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { submitErrChanel, clearErrMsg} from '../case-main';
export default {
  props: {
    confirm: {
      type: Function,
      default: async () => { },
    },
    close: {
      type: Function,
      default: () => {},
    },
    modal: {
      type: Object,
      default: { visible: true },
    },
    width: {
      type: String,
      default: '',
    },
    noFooter: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: null,
    },
  },
  setup(props: any) {
    function cancel() {
      if (props.id) {
        clearErrMsg(props.id);
      }
      props.close();
      // 关闭后还原err channel
      submitErrChanel('');
      props.modal.visible = false;
    }
    async function confirm2() {
      if (props.id) {
        submitErrChanel(props.id);
      }
      await props.confirm();
    }
    return{
      cancel, confirm2,
    };
  },
};
</script>
<style lang="scss" scoped>
  .footer{
    .el-button:first-child{
      margin-right: 2rem;
    }
  }
  .el-dialog{
    z-index: 5000;
  }
</style>
