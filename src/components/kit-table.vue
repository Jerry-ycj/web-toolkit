<template>
  <div class="lkt-table">
    <el-table
            ref="table"
            :stripe="true"
            :data="displayData"
            v-bind="$attrs"
            v-on="$listeners"
            @selection-change="selectChange"
            v-on:sort-change="sortChange">
      <slot/>
    </el-table>
    <el-pagination
            background
            layout="prev, pager, next, jumper, sizes, total"
            style="margin-top: 5px;text-align: center"
            :total="data.length"
            :page-size.sync="pageSizeInner"
            :page-sizes="pageSizes"
            :current-page.sync="currentPageInner"
    />
  </div>
</template>
<script lang="ts">
import { ref, watch, computed } from '@vue/composition-api';
import {ElTable} from 'element-ui/types/table';
export default {
  props: {
    align: {
      type: String,
      default: 'center',
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    data: {
      type: Array,
      default: () => [],
    },
    selectChange: {
      type: Function,
      default: () => {},
    },
  },
  setup(props: Record<string, any>, ctx: any) {
    const table = ref<ElTable|null>(null);
    const currentPageInner = ref<number>(props.currentPage);
    watch(() => props.currentPage, currentPage => currentPageInner.value = currentPage);
    watch(currentPageInner, currentPageInner => ctx.emit('update:currentPage', currentPageInner));
    const pageSizeInner = ref<number>(props.pageSize);
    watch(() => props.pageSize, pageSize => pageSizeInner.value = pageSize);
    watch(pageSizeInner, pageSizeInner => ctx.emit('update:pageSize', pageSizeInner));
    const displayData = computed(() => props.data.slice((currentPageInner.value - 1) * pageSizeInner.value, currentPageInner.value * pageSizeInner.value));
    function sortChange(p: any) {
      if (!p.prop) { return; }
      // 存在children
      const ps = p.prop.split('.');
      props.data.sort((a: any, b: any) => {
        let aa = a[ps[0]];
        let bb = b[ps[0]];
        for (let i = 1; i < ps.length; i++) {
          aa = aa[ps[i]];
          bb = bb[ps[i]];
        }
        if (p.order === 'ascending') {
          if ( aa > bb) { return 1; } else if (aa < bb) { return -1; } else { return 0; }
        } else {
          if ( aa > bb) { return -1; } else if (aa < bb) { return 1; } else { return 0; }
        }
      });
    }
    // 使用：v-on:ref="table = $event"
    watch(table, () => {
      ctx.emit('ref', table.value);
    });
    return {
      currentPageInner,
      pageSizeInner,
      displayData,
      sortChange,
      table,
    };
  },
};
</script>
