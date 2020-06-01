<template>
  <lkt-scrollbar class="lkt-chart">
    <v-chart class="lkt-chart--inner" v-if="!tableView" :options="mergedOptions" autoresize></v-chart>
    <el-table class="lkt-chart--table" :data="table.data" v-else>
      <el-table-column v-for="column of table.columns" :key="column.prop" :prop="column.prop" :label="column.label" align="center" sortable></el-table-column>
    </el-table>
    <span class="lkt-chart--toolbox--table flex column " @click="$emit('switch', !tableView)">
      <i v-if="!tableView" class="el-icon-notebook-2"></i>
      <i v-else class="el-icon-close"></i>
      <span v-show="!tableView">切换为表格</span>
    </span>
  </lkt-scrollbar>
</template>
<script lang="ts">
import Vue from 'vue';
import { computed } from '@vue/composition-api';
import { deepMerge } from '../utils';
interface Table {
  columns: Column[];
  data: any[];
}
interface Column {
  prop: string;
  label: string;
}
export default Vue.extend({
  props: {
    tableView: Boolean,
    options: Object,
    table: Object,
  },
  model: {
    event: 'switch',
    prop: 'tableView',
  },
  setup(props: Record<string, any>) {
    const mergedOptions = computed(() => deepMerge(props.options, {
      toolbox: {
        feature: {
          magicType: {
            type: ['line', 'bar'],
          },
        },
      },
    }));
    return { mergedOptions };
  },
});
</script>
<style lang="scss">
.lkt-chart {
  position: relative;
}
.lkt-chart--toolbox--table {
  position: absolute;
  right: 67px;
  top: 8px;
  cursor: pointer;
  span {
    position: absolute;
    min-width: 75px;
    top: 17px;
    right: -37px;
    visibility: hidden;
  }
  i {
    font-size: 16px;
  }
  &:hover {
    color: #0ae;
    span {
      visibility: visible;
    }
  }
}
.lkt-chart--inner {
  width: 100%;
  height: 100%;
}
.lkt-chart--table {
  border: none;
}
</style>

