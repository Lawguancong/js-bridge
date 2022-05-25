# 如祺 js-bridge

运行在如祺司机 App，如祺乘客 App，如祺企业端 App 的 H5 常需要 H5 和 App 通信，当前 H5 和这仨 App 约定的通信的方式是：H5 通过 Scheme 和 App 通信，App 通过调用 H5 定义在 window 下的方法和 H5 通信。

## H5 和 App 通信方式简介

hybrid App 里 H5 和 App 通信的两种方式：

- **urlScheme：** H5 通过 Scheme 和 App 通信，App 捕获对应的协议进行响应
- **inject：** H5 通过 App 注入在 window 下的方法和 App 通信，具体到代码层面就是 H5 调用和 app 约定的注册在 window 下的方法

hybrid App 里 App 和 H5 通信的两种方式（实际上是一种方式的两种实现）：

- **byFunction：** H5 每接收 App 一种消息，就在 window 下注册一个方法给 app 调用（一种消息一个方法）
- **byEventType：** H5 在 window 下注册一个方法，做为接收 app 消息使用，消息类型通过 app 返回的消息类型（H5 和 app 约定消息类型名称），多种消息一个方法，通过消息名称区分消息

## RuqiJsBridge 功能简介

> H5 使用 scheme 和如祺 App 通信  
> H5 注册全局方法让如祺 App 和 H5 通信

## 安装

### npm 安装（推荐）

```node
# npm
npm i ruqi-jsbridge -S --registry=http://npm.perseus.ruqimobility.com/

# yarn
yarn add ruqi-jsbridge --registry=http://npm.perseus.ruqimobility.com/

```

## 在如祺司机端 app 使用

### 初始化

```js
import RuqiJsBridge, { ruqiMainCallNativeInterceptor, ruqiMainMessageReceiverInterceptor } from 'ruqiJsBridge';

// 创建实例
const ruqiJsBridge = new RuqiJsBridge({
  callNativeInterceptor: ruqiMainCallNativeInterceptor,
  messageReceiverInterceptor: ruqiMainMessageReceiverInterceptor,
});
```

### H5 调用 App

```js
// 调用app方法： 需要回调, app返回的数据为字符串，经过ruqiMainCallNativeInterceptor.response序列化之后数据格式为：{msg: string, code: number, data: object}
// 跟app获取用户信息
const getUserInfo = () =>
  ruqiJsBridge.callNativeHandle({
    eventName: 'user/info', // 和app约定的协议path，完整协议是"gactravel://user/info"
    callback: true, // 是否有回调，默认无，true为有，有回调数据，可以用await获取异步回调数据
  });
const res = await getUserInfo();
// res输出：{msg: '', code:0 data: {"deviceId": "357595090368646","deviceType": "Lt20",...}}

// 调用app方法：不需要回调, params带参数
// 打开app指定页面，
const openNativeView = (params) =>
  ruqiJsBridge.callNativeHandle({
    eventName: 'router/navigation', // 和app约定的协议path，完整协议是"gactravel://router/navigation"
    params, // 需要在params传入的参数，在scheme上拼接在params这个参数上，表现为“gactravel://router/navigation?params=xxxx”
  });
// 打开app导航页面
openNativeView({
  path: '/map/navigate', // app路由：导航页面路由
  args: {
    map_latitude: 0, // 额外参数：纬度
    map_longitude: 0,  // 额外参数：经度
  },
});

// 调用app方法：data带参数
const clientOpenMiniProgram = (data = { urlLink: 'path', userName: 'userName' }) =>
  ruqiJsBridge.callNativeHandle({
    eventName: 'wechat/miniprogram', // 和app约定的协议path，完整协议是"gactravel://wechat/miniprogram"
    data, // 直接在url中拼接参数, 表现为"gactravel://wechat/miniprogram?urlLink=path&userName=userName"
  });

// 调用app方法：app返回数据有encode, params传参，app返回的数据是字符串，某些场景数据带有特殊字符串，需要app 使用encodeURIComponent 编码后给H5， H5需要decodeURIComponent解码数据，这时候需要在data里配置encode:1
const clientOpenMiniProgram = (params) =>
  ruqiJsBridge.callNativeHandle({
    eventName: 'wechat/miniprogram', // 和app约定的协议path，完整协议是"gactravel://wechat/miniprogram"
    data: { encode: 1 },
    params,
  }); // 协议调用表现为"gactravel://wechat/miniprogram?encode=1&params=xxxx"
```

### H5 注册方法接收 app 消息（app 调用 H5）

```js
// 在onNativeEvent下注册事件给app调用
const onUpdateDriverInfo = (driverInfo) => {
  console.log(driverInfo);
};
ruqiJsBridge.registerMessageHandler(
  'updateDriverInfo', // 事件名称，和app约定的事件名称
  onUpdateDriverInfo, // 事件
);
// 注销方法
ruqiJsBridge.unregisterMessageHandler(onUpdateDriverInfo); // 参数是注册的函数

// 在window下注册事件给app调用，在第三个参数配置messageHandlerType: 'window'
const onHomeOrderModeChange = (status) => {
  console.log(status);
};
ruqiJsBridge.registerMessageHandler(
  'onHomeOrderModeChange', // 事件名称，和app约定的事件名称，
  onHomeOrderModeChange, // 事件
  {
    messageHandlerType: 'window', // 挂载在window下
  },
);
// 注销
ruqiJsBridge.unregisterMessageHandler(onHomeOrderModeChange);
```

### 本地配置 mock 测试方法调用，基于上面的例子

```js
const mockData = {
   "user/info": {
    "data": {
      "cityCode": "",
      "deviceId": "357595090368646",
      "deviceType": "Lt20",
      "driverType": 2,
      "iconUrl": "",
      "mobile": "15692406311",
      "name": "侯师傅",
      "token": "",
      "userId": "6837969",
      "version": "localH5"
    },
    "code": 0,
    "msg": "success"
  },
  "updateDriverInfo": {
    "homeOrderType": 1,
    "mobile": "13000000000",
    "name": "string",
    "relayOrderSwitch": 1,
    "userId": 10001
  },
  "onHomeOrderModeChange": {
    "data": { "isShow": true },
    "msg": "success",
    "code": 0
  }
}

const stringifyMockData = Object.entries(task).reduce((mockData, [key, data]) => {
    mockData[key] = JSON.stringify(data);
    return mockData;
  }, {})

// 创建实例时配置
const new ruqiJsBridge = new RuqiJsBridge({
  callNativeInterceptor: ruqiMainCallNativeInterceptor,
  messageReceiverInterceptor: ruqiMainMessageReceiverInterceptor,
  mockData: stringifyMockData, // 需要mock的数据
});

// 执行测试用例模拟app回调，以及模拟app调用h5
ruqiJsBridge.test('user/info'); // 执行用例，模拟app响应 'gactravel://user/info'
ruqiJsBridge.test('updateDriverInfo'); // 执行用例，模拟app向H5发送更新司机信息的消息
ruqiJsBridge.test('onHomeOrderModeChange'); // 执行用例，模拟app向H5发送回家单模式修改的消息
```

## RuqiJsBridge 初始化

### 初始化参数 **config**

config 里所有属性都是可选的

#### callNativeType

定义 H5 和 app 通信的方式

> **类型：**'urlScheme' ｜ 'inject'
>
> > 'urlScheme': H5 使用 scheme 同 app 通信  
> > 'inject': H5 使用 App 注入方式同 app 通信
>
> **默认值：** 'urlScheme'

#### customProtocolScheme

定义 H5 和 App 通信的协议名称

> **类型：** string  
> **默认：** 'gactravel'

#### messageReceiverName

定义 H5 使用 byEventType 方式接收 app 消息时注册在 window 下接收 App 消息的方法名

> **类型：** string  
> **默认：** 'onNativeEvent'

#### messageReceiver

H5 使用 byEventType 方式接收 app 消息时，格式化消息类型和消息内容的方法。在 RuqiJsBridge 默认接收到的信息是{eventName: string, data: any}这样的数据结构，而不同的 app 返回的数据格式不同，通过 messageReceiver 配置消息类型获取和返回数据格式化。

> **类型：**(...args: any[]) => {eventName: string, data:any}  
> **默认值：**

```ts
(...args: any[]) => {
  const [eventName, data] = args;
  return { eventName, data };
};
```

**例如：** 如祺司机端 App 中约定的返回回格式为 `window.onNativeEvent = (eventName:string, data: any) => {}`, 第一个参为事件名称，第二个参数为该消息带上的消息内容。通过默认的 MessageReceiver 处理后返回的格式为 {eventName: string, data: any}， RuqiJsBridge 根据 eventName 做消息分发。

#### messageReceiverInterceptor

格式化 app 返回的消息内容，也就是经过 messageReceiver 后的 data 的格式化，可以合并在 messageReceiver 中一起使用

> **类型：** (data: any) => any  
> **默认值：** 无

#### callNativeInterceptor

H5 调用 App 方法时，请求之前的消息格式化，以及 app 返回数据的格式化

> **类型：** {
> response: (data:any, config:CallNativeConfig) => any,
> request: (config:CallNativeConfig) => any,
> }  
> **默认值：** 无

例如：在调用 app 时候需要在 data 配置一个公共参数 encode，在 app 返回的数据需要对数据按需要格式化，可以这么做

```js
const requestInterceptor = (config) => {...config, data: {config.data, ...encode: 1}}
const responseInterceptor = (data, config) => { if(config.encode === 1)){ return 'something'}; return data}
const new ruqiJsBridge = new RuqiJsBridge({
  callNativeInterceptor: {
    request: requestInterceptor,
    response: responseInterceptor
  }
});
```

#### mockData

配置在本地调式时候的 mock 数据

> **类型：**{[eventName]: any}  
> **默认值：** 无

测试 urlScheme 调用 app，eventName 为调用协议的 eventName，值为 app 返回的值，一般是 JSON 字符串，like this

```js
mockData = { 'user/info': '{"code":0,"data":{"userId":"124234324"},"msg":"success"}' };
```

测试接收 app 消息，eventName 为注册方法时候的 eventName，值为 app 返回的值，具体数据看和 app 约定的数据，下面有两个例子

```js
mockData = {
  onDriverStatusChange: '{"code":0,"msg":"success","data":{"statusPre":1,"statusNew":1}}',
  onServiceNotice:
    '{"noticeContent":"string","noticeId":1,"noticeTypeId":1,"remark":"string","status":1,"terminalTypeId":1,"updateTime":"string"}',
};
```

#### startTest

> 配置是否启动测试

> **类型：** boolean  
> **默认值：** false

需要配合 mock 数据一起使用

## RuqiJsBridge 方法

### `RuqiJsBridge.callNativeHandle(callNativeConfig)`

H5 通知 app

#### 参数说明

**callNativeConfig**:

- **eventName**: 事件名称，urlScheme 方式是和 app 约定的协议 path

  > 类型：string  
  > 默认值：无

- **callback**: 是否需要 app 回调

  > 类型：boolean
  > 默认值：false

- **data**: 传给 app 的数据（留意和 params 的区别 ），在 url scheme 中直接在 url 中拼接的参数，例如 data={path:'map-heat'} 调用 scheme 表现为'gactravel://eventName?path=map-heat'

  > 类型： object  
  > 默认值： 无

- **params** 传给 app 的数据（如祺 app 内约定的方式，app 已实现通过传 data 的方式传值），在 url scheme 中传入在 params 里的参数，例如 params={path:'map-heat'} 调用 scheme 表现为'gactravel://eventName?params={"path":"map-heat"}'

注：使用 urlScheme 和 app 通信时，如果需要 app 对放回的数据进行 encode，需要在 data 里配置 encode=1

### ` RuqiJsBridge.registerMessageHandler(eventName, handle, [config])`

注册接收 app 消息的事件

#### 参数说明

**eventName** ：事件名称，byEventType 方式接收 app 消息时 eventName 表示事件类型，byFunction 方式接收 app 消息，eventName 表示挂载在 window 的事件名称

> 类型：string

**handle**：处理事件

> 类型: (data: any) => void

**config**：

> 类型: object

- **messageHandlerType**: 'normal'| 'window'; window 表示使用 byFunction 的方式注册接收 app 消息的方法

### `RuqiJsBridge.unregisterMessageHandler(handle)`

注销注册给 app 调用的方法，在组件卸载之后需要把对应的方法注销

#### 参数说明

**handle**：注册的事件

### ` RuqiJsBridge.test(eventName)`

##### 参数说明

**eventName**：事件名称，测试的数据需要在 mockData 中配置，并且 mockData 对应的 key 值与 eventName 相同。

- 测试 callNativeHandle 时候是 callNativeConfig 里的 eventName
- 测试 registerMessageHandler 时候是注册的 eventName
