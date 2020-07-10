<template>
  <!--  <div v-if="msg && msg!==''">-->
  <div v-if="storeErrMsg.submitId===id && storeErrMsg.msg && storeErrMsg.msg!==''">
    <el-alert
            :title="storeErrMsg.msg"
            type="error"
            show-icon
            :closable="false"
            effect="dark">
    </el-alert>
  </div>
</template>
<script lang="ts">
import {ref, watch} from '@vue/composition-api';
import {storeErrMsg} from '../case-main';

export default {
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  setup(props: any) {
    const msg = ref<any>('');
    // watch(() => storeErrMsg.time, () => {
    //   console.log(storeErrMsg.submitId)
    //   if (storeErrMsg.submitId === props.id) {
    //     console.log(msg.value)
    //     msg.value = storeErrMsg.msg;
    //   }
    // });
    return {
      msg, storeErrMsg,
    };
  },
};
</script>
