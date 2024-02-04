# info

### 获取用户信息

请求方法 `GET`

中国大陆镜像地址

```
https://api.liyxi.com/node/v0/info
```

响应体

```json
{
  status: 200,
  msg: "获取用户基础信息成功",
  data: {}
}
```

data 如下

| 名称     | 类型   | 描述信息               |
| :------- | ------ | :--------------------- |
| uid      | String | 用户唯一标识符         |
| nickname | String | 用户昵称               |
| status   | Number | 用户当前在系统中的状态 |
| avatar   | String | 用户头像 url           |

