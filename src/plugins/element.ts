import Vue from 'vue';
import ElementUI, {Message} from 'element-ui';
Vue.use(ElementUI);
import { ElMessageOptions, ElMessageComponent } from 'element-ui/types/message';
import { isString, debounce } from '../utils';
import 'element-ui/lib/theme-chalk/index.css';
const messageBoxList = ['success', 'warning', 'error', 'info'];

declare module 'element-ui/types/message' {
  interface ElMessage {
    [index: string]: (text: string | ElMessageOptions) => ElMessageComponent;
  }
}
// declare module 'element-ui/types/message' {
//   interface ElMessage {
//     [index: string]: {
//       (text: string | ElMessageOptions): ElMessageComponent;
//       // (options: ElMessageOptions): ElMessageComponent;
//     };
//   }
// }

for (const method of messageBoxList) {
  const raw = Message[method];
  Message[method] = function(msg: string | ElMessageOptions) {
    if (isString(msg)) {
      return raw.call(this, {
        message: msg,
        showClose: true,
        customClass: 'lkt-message',
      });
    } else {
      return raw.call(this, msg);
    }
  };
}

function adapt() {
  const screenWidth = window.innerWidth;
  let size = '';
  if (screenWidth < 1080) {
    size = 'mini';
  } else if (screenWidth < 1280) {
    size = 'small';
  } else if (screenWidth < 1440) {
    size = 'medium';
  }
  Vue.prototype.$ELEMENT = { size };
}
window.addEventListener('resize', debounce(adapt));
adapt();
