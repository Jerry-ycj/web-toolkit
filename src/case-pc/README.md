# case-pc

## bridge的使用

demo:
```typescript
// bridge; router中需要query=port，将port传入init
init(router.currentRoute.query.port?parseInt(router.currentRoute.query.port):8000)

// 添加数据接收逻辑处理
addHandler("monitor-data", function (msg:MsgReq){
  console.log(msg)
})
```
