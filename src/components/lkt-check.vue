<template>
  <span class="lkt-check">
    <i :class="check ? 'el-icon-check' : 'el-icon-close'"></i>
  </span>
</template>
<script lang="ts">
import Vue from 'vue';
const LktCheck = Vue.extend({
  props: {
    check: {
      type: Boolean,
      default: true,
    },
  },
});
export default LktCheck;
</script>
<style lang="scss">
.lkt-check {
  i {
    font-size: 1.3rem;
  }
  .el-icon-check {
    color: $green-6;
  }
  .el-icon-close {
    color: $red-6;
  }
}
</style>
