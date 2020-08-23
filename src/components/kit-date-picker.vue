<template>
  <div>
    <div v-if="type === 'yearrange'" class="flex align-center">
      <el-date-picker type="year" v-model="year1" style="width: 100px"></el-date-picker>
      <div style="padding: 0 5px">-</div>
      <el-date-picker type="year" v-model="year2" style="width: 100px"></el-date-picker>
    </div>
    <el-date-picker
            v-else
            :type="type"
            :value="value"
            :picker-options="pickerOptions[type]"
            :start-placeholder="`开始${CNMap[type]}`"
            :end-placeholder="`结束${CNMap[type]}`"
            :placeholder="placeholder || `请选择${CNMap[type]}`"
            :format="format"
            :clearable="clearable"
            @input="update"/>
  </div>

</template>
<script lang="ts">
import { ref, onMounted, set, watch} from '@vue/composition-api';

export default {
  props: {
    type: {
      default: 'datetimerange',
      validator(val: string) {
        return [
          'datetime', 'date', 'month', 'year',
          'datetimerange', 'daterange', 'monthrange', 'yearrange',
        ].includes(val);
      },
    },
    value: [Date, Array],
    format: {
      type: String,
      default: undefined,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    placeholder: String,
  },
  setup(props: Record<string, any>, ctx: any) {
    const year1 = ref<Date>();
    const year2 = ref<Date>();
    watch([year2, year1], () => {
      // year range
      if (year1.value && year2.value) {
        if (year1.value.getTime() > year2.value.getTime()) { year1.value = year2.value; }
        // else if(year1.value.getTime()<year2.value.getTime()) year1.value = year2.value;
        ctx.emit('change', [year1.value, year2.value]);
        ctx.emit('input', [year1.value, year2.value]);
        ctx.emit('select', [year1.value, year2.value]);
      }
    });

    const update = (date: Date | Date[]) => {
      ctx.emit('change', date);
      ctx.emit('input', date);
      ctx.emit('select', date);
    };
    const pickerOptions = {
      datetimerange: {
        shortcuts: [{
          text: '最近1小时',
          onClick: (picker: Vue) => picker.$emit('pick', [ new Date( Date.now() - 3600000 ), new Date() ]),
        }, {
          text: '最近2小时',
          onClick: (picker: Vue) => picker.$emit('pick', [ new Date( Date.now() - 7200000 ), new Date() ]),
        }, {
          text: '今天',
          async onClick(picker: Vue) {
            const start = new Date();
            start.setHours(0);
            start.setSeconds(0);
            start.setMinutes(0);
            start.setMilliseconds(0);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, new Date() ]);
          },
        }, {
          text: '昨天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 24 * 3600000);
            const end = new Date();
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            // fillBaseTime(end, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '前天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 48 * 3600000);
            const end = new Date(Date.now() - 24 * 3600000);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            // fillBaseTime(end, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近3天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 72 * 3600000);
            const end = new Date();
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近7天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 168 * 3600000);
            const end = new Date();
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近30天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 720 * 3600000);
            const end = new Date();
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }],
      },
      daterange: {
        shortcuts: [{
          text: '今天',
          async onClick(picker: Vue) {
            const start = new Date();
            start.setHours(0);
            start.setSeconds(0);
            start.setMinutes(0);
            start.setMilliseconds(0);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, new Date() ]);
          },
        }, {
          text: '昨天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 24 * 3600000);
            const end = new Date();
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            end.setHours(0, 0, 0);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '前天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 48 * 3600000);
            const end = new Date(Date.now() - 24 * 3600000);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            end.setHours(0, 0, 0);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近3天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 72 * 3600000);
            const end = new Date();
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近7天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 168 * 3600000);
            const end = new Date();
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近30天',
          async onClick(picker: Vue) {
            const start = new Date(Date.now() - 720 * 3600000);
            const end = new Date();
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }],
      },
      monthrange: {
        shortcuts: [{
          text: '本月',
          async onClick(picker: Vue) {
            const start = new Date();
            const end = new Date();
            start.setDate(1);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '上个月',
          async onClick(picker: Vue) {
            const start = new Date();
            const end = new Date();
            // const currentMonth = start.getMonth() + 1;
            start.setMonth(start.getMonth() - 1, 1);
            end.setMonth(end.getMonth() - 1, 1);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近3个月',
          async onClick(picker: Vue) {
            const start = new Date();
            const end = new Date();
            const currentMonth = start.getMonth() + 1;
            start.setMonth(currentMonth - 3 <= 0 ? currentMonth + 9 : currentMonth - 3, 1);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近6个月',
          async onClick(picker: Vue) {
            const start = new Date();
            const end = new Date();
            const currentMonth = start.getMonth() + 1;
            start.setMonth(currentMonth - 6 <= 0 ? currentMonth + 6 : currentMonth - 6, 1);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近12个月',
          async onClick(picker: Vue) {
            const start = new Date();
            const end = new Date();
            const currentMonth = start.getMonth() + 1;
            start.setFullYear(start.getFullYear() - 1);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }],
      },
      yearrange: {
        shortcuts: [{
          text: '今年',
          async onClick(picker: Vue) {
            const start = new Date();
            const end = new Date();
            start.setMonth(1, 1);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '去年',
          async onClick(picker: Vue) {
            const start = new Date();
            const end = new Date();
            start.setFullYear(start.getFullYear() - 1, 1, 1);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            end.setMonth(1, 1);
            end.setHours(0, 0, 0);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '前年',
          async onClick(picker: Vue) {
            const start = new Date();
            const end = new Date();
            start.setFullYear(start.getFullYear() - 2, 1, 1);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            end.setFullYear(end.getFullYear() - 1, 1, 1);
            end.setHours(0, 0, 0);
            picker.$emit('pick', [ start, end ]);
          },
        }, {
          text: '最近3年',
          async onClick(picker: Vue) {
            const start = new Date();
            const end = new Date();
            start.setFullYear(start.getFullYear() - 3, 1, 1);
            // await store.dispatch(ACTIONS.WORK_SETTING_CHECK);
            // fillBaseTime(start, store.state.workSetting.startTime);
            picker.$emit('pick', [ start, end ]);
          },
        }],
      },
    };
    const CNMap = {
      datetime: '时间',
      datetimerange: '时间',
      date: '日期',
      daterange: '日期',
      month: '月份',
      monthrange: '月份',
      year: '年份',
      yearrange: '年份',
    };
    onMounted(function() {
      if (props.type === 'yearrange' && props.value && props.value.length > 0) {
        year1.value = props.value[0];
        year2.value = props.value[1];
      }
    });
    return { update, pickerOptions, CNMap, year1, year2 };
  },
};
</script>

