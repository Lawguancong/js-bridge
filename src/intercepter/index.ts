import { isPlainObject, isString } from '../utils/checkType';
import { Response, CallNativeConfig, AnyObject } from '../typings';

export const ruqiMainCallNativeReqInterceptor = (config?: CallNativeConfig<AnyObject, AnyObject>) => {
  const { params, data } = config || {};
  const serializedParams = params && JSON.stringify(params);
  return Promise.resolve({
    ...data,
    ...(params && { params: serializedParams }),
  });
};

export const ruqiMainCallNativeResInterceptor = ({
  config,
  data,
}: Response<any, CallNativeConfig<AnyObject, AnyObject>>) => {
  const { data: reqConfigData = {} } = config || {};
  if (isPlainObject(data)) {
    return data;
  }

  if (isString(data)) {
    try {
      // @ts-ignore
      const { encode } = reqConfigData;
      if (Number(encode) === 1) data = decodeURIComponent(data);
      data = JSON.parse(data);
    } catch (error) {
      // todo 错误处理
      console.log('解析出错');
    }
  }

  return data;
};

export const ruqiMainCallNativeInterceptor = {
  request: ruqiMainCallNativeReqInterceptor,
  response: ruqiMainCallNativeResInterceptor,
};

export const ruqiMainMessageReceiverInterceptor = (data: any) => {
  if (isPlainObject(data)) {
    return data;
  }

  if (isString(data)) {
    try {
      data = JSON.parse(data);
    } catch (error) {
      // todo 错误处理
      console.log('解析出错');
    }
  }

  return data;
};
