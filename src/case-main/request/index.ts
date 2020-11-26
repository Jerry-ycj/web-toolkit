import axios, { AxiosError, CancelTokenSource } from 'axios';
import { Message } from 'element-ui';
import { sleep, isUndefined } from '../../utils';
import {pushErrMsg, storeErrMsg} from '..';
import Qs from 'qs';
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? process.env.VUE_APP_TEST_BASE_URL : process.env.VUE_APP_BASE_URL;
export const CancelTokenSources: CancelTokenSource[] = [];

export function getBaseUrl() {
  return axios.defaults.baseURL;
}

/// 重载配置项
export const RequestConfig = {
  contentType: 'form',
  getContentType(type: string) {
    if (type === 'form') {
      return 'application/x-www-form-urlencoded';
    } else if (type === 'json') {
      return 'application/json';
    }
  },
  errShowFunc(msg: string) {
    Message.error(msg);
  },
};

const errHandle = (e: AxiosError, url: string, config: any) => {
  const showMsg = isUndefined(config.showMsg) || config.showMsg;
  const throwable = isUndefined(config.throwable) || config.throwable;
  const response = e.response;
  const data = response ? response.data : undefined;
  const msg = data ? data.message : e.message;
  // 接口错误后的json数据处理
  if (data) {
    if (showMsg && msg) {
      pushErrMsg({
        src: url,
        msg,
      });
      // 如果未配置errMsgChannel则
      if (storeErrMsg.submitId === '') {
        RequestConfig.errShowFunc(msg);
      }
    }
    if (throwable) {
      throw new Error(msg);
    }
  } else if (throwable) {
    // 有可能是cancel todo
    // Message.error('网络错误');
    throw new Error(msg);
  }
  return {
    message: msg,
    code: e.code,
    result: data ? data.result || 0 : 0,
  };
};

/**
 * @param url request url
 * @param payload request body params
 * @param query url params
 * @param config action configuration: contentType-form/json, showMsg, throwable, headers
 */
export const postService = (
  url: string,
  payload: object = {},
  config: any = {},
) => {
  const headers = Object.assign({
    'Content-Type': RequestConfig.getContentType(config.contentType ? config.contentType : RequestConfig.contentType),
  }, config.headers || {});
  let data: any = payload;
  if (headers['Content-Type'].indexOf('x-www-form-urlencoded') > -1) {
    data = Qs.stringify(payload, {
      skipNulls: true,
    });
  }
  return axios.post(url, data, {
    headers,
    withCredentials: true,
  }).catch((e: AxiosError) => {
    return errHandle(e, url, config);
  }) as Promise<any>;
};

export async function postServiceRet(
  url: string,
  payload: object = {},
  config: any = {},
) {
  config.showMsg = false;
  config.throwable = false;
  return await postService(url, payload, config);
}

/**
 * 临时：此方法主要用于会出现请求频率限制的问题（还要兼容以前）
 */
export async function mesPostUntilSuccess(url: string, params: object = {}): Promise<any> {
  const res = await postService(url, params, {throwable: false, showMsg: false});
  if (res.result === 0 && res.message && res.message.includes('请求频率')) {
    await sleep(1000);
    return await mesPostUntilSuccess(url, params);
  }
  return res;
}

export interface IDownloadConfiguration {
  filename: string;
  showMsg?: boolean;
}

/**
 * Download file
 * @param url request url
 * @param params request body
 * @param config filename etc.
 */
export function download(
  url: string,
  params: object = {},
  config: IDownloadConfiguration,
) {
  return axios({
    method: 'post',
    url,
    data: params, // 参数
    responseType: 'blob', // 表明返回服务器返回的数据类型
    withCredentials: true,
  }).then((blob) => {
    if ('download' in document.createElement('a')) { // 非IE下载
      const elink = document.createElement('a');
      elink.download = config.filename;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else { // IE10+下载
      navigator.msSaveBlob(blob, config.filename);
    }
  }).catch((e: AxiosError) => {
    const showMsg = isUndefined(config.showMsg) || config.showMsg;
    // const throwable = isUndefined(config.throwable) || config.throwable;
    const response = e.response;
    const data = response ? response.data : undefined;
    const msg = response ? data.message : e.message;
    if (showMsg) {
      Message.error(msg || '');
    }
    return {
      message: msg,
      code: e.code,
      result: data ? data.result || 0 : 0,
      catchHandled: true,
    };
  });
}

export function upload(url: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const uploader = axios.create();
  return uploader.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });
}

export function uploadService(
  url: string,
  payload: object = {},
) {
  const param = new FormData(); // 创建form对象
  for (const key of Object.keys(payload)) {
    // @ts-ignore
    param.append(key, payload[key]);
  }
  return axios({
    method: 'post',
    url,
    data: param,
    headers: {'Content-Type': 'multipart/form-data'},
    withCredentials: true,
  }).catch((e: AxiosError) => {
    return errHandle(e, url, {showMsg: true, throwable: true});
  });
}
