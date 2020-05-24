<template>
  <el-select :value="value" :value-key="valueKey" :loading="loading" :disabled="disabled" :filterable="filterable" :clearable="clearable" :multiple="multiple" :placeholder="placeholder" :collapse-tags="collapseTags" @change="update">
    <div v-if="multiple && list && list.length>0 " class="flex align-center lkt-select--all">
      <el-checkbox :value="value && value.length === list.length" @change="selectAll">全选</el-checkbox>
    </div>
    <el-option
            v-for="(item, index) of list" :key="`lkt-select-option-${index}`" :label="item[valueKey]"
            :value="optionValueKey ? item[optionValueKey] : item"/>
  </el-select>
</template>
<script lang="ts">
export default {
  props: {
    value: {},
    valueKey: {
      type: String,
      default: 'name',
    },
    optionValueKey: {
      type: String,
      default: '',
    },
    filterable: {
      type: Boolean,
      default: true,
    },
    multiple: Boolean,
    clearable: {
      type: Boolean,
      default(this: any) {
        return !this.multiple;
      },
    },
    disabled: Boolean,
    collapseTags: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    list: {
      type: Array,
      default: () => [],
    },
    loading: Boolean,
  },
  setup(props: Record<string, any>, ctx: any) {
    const update = (val: any) => {
      ctx.emit('input', val);
      ctx.emit('select', val);
      ctx.emit('change', val);
    };
    const selectAll = (all: boolean) => {
        if (props.optionValueKey) {
            update(all ? props.list.map((item: any) => item[props.optionValueKey]) : []);
        } else {
            update(all ? props.list.slice() : []);
        }
    };
    return { update, selectAll };
  },
};
</script>
<style lang="scss">
.lkt-select--all {
  padding: 5px 20px;
}
</style>

