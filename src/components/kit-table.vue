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
            v-if="pageFromServer"
            background
            style="margin-top: 5px;text-align: center"
            layout="prev, pager, next, jumper, total"
            :current-page.sync="currentPageInner"
            @current-change="pageServerHandle0"
            :page-count="pageCount"
    />
    <el-pagination
            v-else
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
import { ref, watch, computed, onMounted } from '@vue/composition-api';
import {ElTable} from 'element-ui/types/table';
export default {
  props: {
    align: {
      type: String,
      default: 'center',
    },
    data: {
      type: Array,
      default: () => [],
    },
    selectChange: {
      type: Function,
      default: () => {},
    },
    // 分页
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
    // 服务端分页开关：在服务端分页模式，data也不需要填
    // eg: ref="table" :page-from-server="true" :page-server-handle="pageHandle"
    // 通过refresh触发初始和刷新
    pageFromServer: {
      type: Boolean,
      default: false,
    },
    // 服务端分页处理函数，必须返回 {data, pageCount}
    pageServerHandle: {
      type: Function,
      default: () => {},
    },
  },
  setup(props: Record<string, any>, ctx: any) {
    const currentPageInner = ref<number>(props.currentPage);
    watch(() => props.currentPage, currentPage => currentPageInner.value = currentPage);
    watch(currentPageInner, currentPageInner => ctx.emit('update:currentPage', currentPageInner));
    const pageSizeInner = ref<number>(props.pageSize);
    watch(() => props.pageSize, pageSize => pageSizeInner.value = pageSize);
    watch(pageSizeInner, pageSizeInner => ctx.emit('update:pageSize', pageSizeInner));

    const displayData = computed(() => {
      if (props.pageFromServer) {
        return dataList.value;
      } else {
        return props.data.slice((currentPageInner.value - 1) * pageSizeInner.value, currentPageInner.value * pageSizeInner.value);
      }
    });

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
    const table = ref<ElTable|null>(null);
    watch(table, () => {
      ctx.emit('ref', table.value);
    });

    // 服务端分页处理函数包装
    const dataList = ref<any[]>([]);
    const pageCount = ref<number>(1);
    async function pageServerHandle0(page: any) {
      currentPageInner.value = page;
      const data = await props.pageServerHandle(page);
      dataList.value = data.data;
      pageCount.value = data.pageCount;
    }
    // 服务端分页时外部调用刷新，也是初始触发的接口
    async function refresh() {
      await pageServerHandle0(currentPageInner.value);
    }
    return {
      currentPageInner,
      pageSizeInner,
      displayData,
      sortChange, table,
      pageServerHandle0, pageCount, refresh,
    };
  },
};
</script>
