/** 错误信息的临时通道 */
import { reactive } from '@vue/composition-api';
import {deepClone} from '../../utils';

export interface ErrMsg {
  msg: string|null;
  src: string|null;
  level?: number;
  submitId?: string;
  time?: Date;
}

export const storeErrMsg = reactive<ErrMsg>({
  msg: null,
  // 来源，如接口：/xx/xxx
  src: null,
  // 1-serious, 2-warning
  level: 1,
  submitId: '',
  // 用于触发watch
  time: new Date(),
});

export function pushErrMsg(obj: ErrMsg) {
  storeErrMsg.msg = obj.msg;
  storeErrMsg.src = obj.src;
  storeErrMsg.level = obj.level !== undefined ? obj.level : 1;
  storeErrMsg.time = new Date();
}
// 只发送msg。外部api
export function pushMsgErr(msg: string) {
  pushErrMsg({
    msg,
    src: '',
  });
}
// 外部api
export function submitErrChanel(id: string) {
  clearErrMsg();
  storeErrMsg.submitId = id;
}

export function clearErrMsg(id?: string) {
  // id可用于特定的清空
  if (id && storeErrMsg.submitId !== id) { return ; }
  // const ret = deepClone(storeErrMsg);
  storeErrMsg.msg = null;
  storeErrMsg.src = null;
  storeErrMsg.time = new Date();
  // 不能清空 不然无法在目标位置触发清空
  // storeErrMsg.submitId='';
  // return ret;
}
