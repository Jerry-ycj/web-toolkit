
## use-decrator
- useLoading: 接受loading（ref()）
- useLoadingDirect: modal（modal={loading:boolean}）
- useConfirm: 通用的确认框。
```typescript

return{ 
  login: useLoading(loading, login),
  confirm: useConfirm("msg", confirm),
}

```

## use-search
```html
<el-input class="search-bar" v-model="keywords" placeholder="搜索" clearable/>
<script>
/// filtered用于数据展示区域中显示，是原数据集过滤过后的。
const [keywords, filtered] = useSearch(list, {
  includeProps: ['name', 'tel', 'address', 'extend.no'],
});
</script>
```

## use-cache
todo

## use-autoresize
todo

## use-pagination
