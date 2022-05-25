export type AnyObject = Record<string, unknown>;
export type AnyFunction = (...args: any[]) => any;
export interface Response<T, U> {
  data: T;
  config: U;
}

export interface MessageHandlers {
  [key: string]: (...args: any[]) => any;
}

export interface CallNativeConfig<T extends Record<string, unknown>, U extends Record<string, unknown>> {
  eventName: string;
  data?: T;
  params?: U;
  callback?: boolean;
}

export interface CallNativeReqInterceptor<T> {
  (config?: T): Promise<Record<string, unknown>>;
}

export interface CallNativeResInterceptor<T> {
  (response: T): Promise<T>;
}


export interface Config {
  callNativeType?: 'urlScheme' | 'inject'; // h5调用native 使用哪种方式
  customProtocolScheme?: string; // 使用urlScheme时可以自定义url域名
  callNativeInterceptor?: {
    request?: CallNativeReqInterceptor<CallNativeConfig<AnyObject, AnyObject>>;
    response?: CallNativeResInterceptor<Response<any, CallNativeConfig<AnyObject, AnyObject>>>;
  };
  messageReceiver?: (...args: any[]) => { eventName: string; data: any };
  messageReceiverName?: string;
  messageReceiverInterceptor?: AnyFunction; // todo 类型定义
  mockData?: { [k: string]: any };
  startTest?: boolean;
}

export interface RegisterHandleConfig {
  messageHandlerType?: 'normal' | 'window'; // 默认messageHandler
}
