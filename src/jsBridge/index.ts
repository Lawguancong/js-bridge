import { isArray, isFunction, isPlainObject, isString } from '../utils/checkType';
import { AnyFunction, MessageHandlers, CallNativeConfig, Config, RegisterHandleConfig, AnyObject } from '../typings';

type RequiredConfig = 'callNativeType' | 'protocolScheme' | 'messageHandlers';
export default class RuqiJSBridge {
  options: Pick<Config, Exclude<keyof Config, RequiredConfig>>;

  callNativeType: Required<Config>['callNativeType'];

  protocolScheme: string;

  messageHandlers: MessageHandlers; // 自定义的messageHandler

  windowCallbackHandlers: MessageHandlers; // 绑在window（todo是否替换为全局）的messageHandler

  messageReceiverName: Required<Config>['messageReceiverName'];

  messageReceiver: Required<Config>['messageReceiver'];

  mockData: Config['mockData']; // 用于测试的mock数据

  testTask: { [key: string]: () => void }; // 测试用例

  startTest: boolean;

  constructor(config?: Config) {
    const {
      callNativeType = 'urlScheme',
      customProtocolScheme = 'gactravel',
      messageReceiverName = 'onNativeEvent',
      messageReceiver = (...args: any[]) => {
        const [eventName, data] = args;
        return { eventName, data };
      },
      startTest = false,
      mockData,
      ...options
    } = config || {};

    this.options = options;
    this.messageReceiver = messageReceiver;
    this.messageReceiverName = messageReceiverName;
    this.callNativeType = callNativeType;
    this.protocolScheme = customProtocolScheme;
    this.startTest = startTest;
    this.messageHandlers = {};
    this.windowCallbackHandlers = window; // 默认handle在window方法下
    this.mockData = mockData;
    this.testTask = {};

    if (window.__RuqiJSBridge__) {
      return window.__RuqiJSBridge__;
    }
    // 本地注册给原生调用的方法
    this.initJSBridge();
  }

  async callNativeHandle<T extends AnyObject, U extends AnyObject>(config: CallNativeConfig<T, U>) {
    // 只实现通过scheme方式调用app
    const { callNativeType } = this;

    if (callNativeType === 'inject') {
      console.log('尚未实现');
      return;
    }
    return this.callNativeByScheme(config);
  }

  registerMessageHandler(eventName: string, handle: AnyFunction, config?: RegisterHandleConfig) {
    const { messageHandlerType = 'normal' } = config || {};
    if (messageHandlerType === 'normal') {
      this.messageHandlers[eventName] = handle;
      if (this.startTest) this.addMessageHandlerTask(eventName);
      return;
    }

    if (messageHandlerType === 'window') {
      this.windowCallbackHandlers[eventName] = this.registerWindowMessageHandler(handle);
      if (this.startTest) this.addWindowMessageHandlerTask(eventName);
    }
    // 如果没有container 则
  }

  unregisterMessageHandler(handler: AnyFunction) {
    if (this.unregisterMessageHandlerByType(this.messageHandlers, handler)) {
      return;
    }
    // messageHandlers 下查找
    this.unregisterMessageHandlerByType(this.windowCallbackHandlers, handler);
  }

  test(eventName: string) {
    // 测试工具
    if (isFunction(this.testTask[eventName])) this.testTask[eventName]();
  }

  // 初始化jsBridge
  private initJSBridge() {
    this.registerNativeEventHandler();
  }

  private unregisterMessageHandlerByType(messageHandlers: MessageHandlers, handler: AnyFunction) {
    // @ts-ignore
    return Object.entries(messageHandlers).some(([eventName, event]) => {
      const isTargetEvent = event === handler;
      if (isTargetEvent) {
        // @ts-ignore 释放内存
        messageHandlers[eventName] = null;
      }
      return isTargetEvent;
    });
  }

  private registerNativeEventHandler() {
    const { messageReceiverName, messageReceiver } = this;

    this.windowCallbackHandlers[messageReceiverName] = (...args: any[]) => {
      // todo message receiver 默认情况处理
      const { eventName, data } = messageReceiver(...args);
      const { messageReceiverInterceptor } = this.options;

      let formatData;
      if (isFunction(messageReceiverInterceptor)) {
        formatData = messageReceiverInterceptor(data);
      } else {
        formatData = this.deserializedData(data);
      }
      if (isFunction(this.messageHandlers[eventName])) this.messageHandlers[eventName](formatData);
    };
  }

  private registerWindowMessageHandler(handle: AnyFunction) {
    return (...args: any[]) => {
      const { messageReceiverInterceptor } = this.options;

      if (isFunction(messageReceiverInterceptor)) {
        handle(messageReceiverInterceptor(...args));
        return;
      }

      handle(...args);
    };
  }

  private generateRandomId() {
    return `nativecb_${Date.now()}`;
  }

  // 反序列化内容
  private deserializedData(data: any) {
    if (isPlainObject(data)) {
      return data;
    }
    if (isString(data)) {
      try {
        data = JSON.parse(data);
      } catch (error) {
        // todo 错误处理
        console.log(error);
      }
    }
    return data;
  }

  private async callNativeByScheme(config: CallNativeConfig<AnyObject, AnyObject>) {
    const { eventName, data, params, callback } = config;

    // 请求拦截器格式化拼接到urlScheme的参数
    const { request: requestInterceptor } = this.options.callNativeInterceptor || {};
    // 在这里自定义事件
    try {
      const query = requestInterceptor ? await requestInterceptor(config) : { ...data, ...(params && { params }) };

      // 如果是没有callback，直接resolve, resolve undefined
      // 没有callback是指注册了callback，app不会调用的情况，和app的交互存在单向的情况，这种情况不确定返回内容，直接resolve回去
      if (!callback) {
        const schemeUrl = this.formatScheme(eventName, query);
        this.openSchemeByIframe(schemeUrl);
        return;
      }
      const { callbackName, callbackFn } = this.registerRandomCallback(config);
      query.callbackName = callbackName;
      if (this.startTest) this.addCallNativeBySchemeTask(callbackName, eventName);
      const schemeUrl = this.formatScheme(eventName, query);
      this.openSchemeByIframe(schemeUrl);
      return callbackFn();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private queryString(query: AnyObject): string {
    const queryArr = Object.entries(query);
    const queryLength = queryArr.length;
    return queryArr.reduce((querystring, [key, value], index) => {
      let formatValue;
      if (isPlainObject(value) || isArray(value)) {
        formatValue = JSON.stringify(value);
      } else if (isFunction(value)) {
        formatValue = value();
      } else {
        formatValue = value;
      }

      const encodeValue = encodeURIComponent(formatValue);

      return `${querystring}${key}=${encodeValue}${index + 1 < queryLength ? '&' : ''}`;
    }, '' as string);
  }

  private formatScheme(path: string, query?: AnyObject) {
    // @ts-ignore
    const queryStr = query ? this.queryString(query) : '';
    return `${this.protocolScheme}://${path}?${queryStr}`;
  }

  private openSchemeByIframe(url: string) {
    console.log('协议调用', url); // todo 配置是否打开log
    let iframe = document.createElement('iframe');
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    document.body.removeChild(iframe);
    // @ts-ignore
    iframe = null;
  }

  // 和app通信后临时回调的方法注册，返回的数据格式
  private registerRandomCallback(config: CallNativeConfig<AnyObject, AnyObject>) {
    const callbackName = this.generateRandomId(); // todo callbackName 获取
    // 回传config内容
    const callbackFn = () =>
      new Promise((resolve, reject) => {
        this.windowCallbackHandlers[callbackName] = async (res) => {
          // app 回调
          const { callNativeInterceptor } = this.options;
          const { response: responseInterceptor } = callNativeInterceptor || {};
          let result;
          try {
            result = isFunction(responseInterceptor)
              ? await responseInterceptor({ data: res, config })
              : this.deserializedData(res);
            resolve(result);
          } catch (error) {
            reject(error);
          }

          // @ts-ignore 内存释放 todo正确类型，
          this.windowCallbackHandlers[callbackName] = null;
        };
      });

    return { callbackName, callbackFn }; // return 一个callbackName
  }

  private addWindowMessageHandlerTask(eventName: string) {
    this.testTask[eventName] = () => {
      if (this.mockData && this.mockData[eventName]) {
        window[eventName](this.mockData[eventName]);
        return;
      }
      console.log('没有mock数据，请在mockData中配置mock数据');
    };
  }

  private addMessageHandlerTask(eventName: string) {
    const { messageReceiverName } = this;
    this.testTask[eventName] = () => {
      if (this.mockData && this.mockData[eventName]) {
        // todo 待完善数据转化，暂时只满足如期 onNativeEvent
        window[messageReceiverName](eventName, this.mockData[eventName]);
        return;
      }
      console.log('没有mock数据，请在mockData中配置mock数据');
    };
  }

  private addCallNativeBySchemeTask(callbackName: string, eventName: string) {
    this.testTask[eventName] = () => {
      if (this.mockData && this.mockData[eventName]) {
        // todo 待完善数据转化，暂时只满足如期 onNativeEvent
        window[callbackName](this.mockData[eventName]);
        return;
      }
      console.log('没有mock数据，请在mockData中配置mock数据');
    };
  }
}
