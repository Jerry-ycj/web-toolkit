<template>
  <el-tooltip
    :effect="effect"
    :content="content"
    placement="top-start">
    <i class="el-icon-warning tip" :style="{color: color}" />
  </el-tooltip>
</template>
<script lang="ts">
export default {
  props: {
    content: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#5a5a5a',
    },
    effect: {
      type: String,
      default: 'dark',
    },
  },
  setup() {
    return{};
  },
};
</script>
<style lang="scss" scoped>
  .tip{
    font-size: 1.5em;
    margin-left: 10px;
  }
</style>
