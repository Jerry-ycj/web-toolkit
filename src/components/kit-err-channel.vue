<template>
  <div v-if="msg && msg!==''">
    <el-alert
            :title="msg"
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
      watch(() => storeErrMsg.time, () => {
        if (storeErrMsg.submitId === props.id) {
          msg.value = storeErrMsg.msg;
        }
      });
      return {
        msg,
      };
    },
  };
</script>
