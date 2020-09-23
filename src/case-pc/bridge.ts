// @ts-ignore
import io from 'socket.io-client';
import {Message} from 'element-ui';
import {isUndefined} from '../utils';
import {pushErrMsg, storeErrMsg} from '../case-main/store';

let socket: any = null;

// client的req或是server的req
export interface MsgReq {
  code: string;
  data: any;
}

export interface MsgRes {
  result: boolean;
  message?: string;
  data: any;
}

const EventPublic = 'event:public';

// 需要在最外层的main的onMounted中初始化
export function init(port: number) {
  // socket = io(window.location.host);
  socket = io(window.location.hostname + ':' + port);
  socket.on('connect', function() {
    console.log('connect');
  });
  // 接收server传回的数据
  socket.on(EventPublic, function(data: string) {
    const json = JSON.parse(data) as MsgReq;
    if (eventHandlers[json.code]) {
      eventHandlers[json.code](json);
    }
  });
}

/// key:code
const eventHandlers = {} as any;

export function addHandler(code: string, fun: Function) {
  eventHandlers[code] = fun;
}

/// 重载配置项
export const RequestConfig = {
  errShowFunc(msg: string) {
    Message.error(msg);
  },
};

export function request(code: string, data: any, config?: any) {
  return new Promise(function(resolve, reject) {
    const data = {code: 'test', data: '1'};
    socket.emit(EventPublic, JSON.stringify(data), function(json: any) {
      const ret = JSON.parse(json) as MsgRes;
      if (ret.result) {
        resolve(ret.data);
      } else {
        const showMsg = isUndefined(config.showMsg) || config.showMsg;
        const throwable = isUndefined(config.throwable) || config.throwable;
        const msg = ret.message;
        if (showMsg && msg) {
          pushErrMsg({
            src: code,
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
      }
    });
  });
}

// todo request和await的处理，以及http后await接收处理
