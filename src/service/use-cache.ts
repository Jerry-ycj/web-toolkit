import { isUndefined } from '../utils';
import { ref } from '@vue/composition-api';

const legalType = ['string', 'number', 'boolean', 'object'];
const PREFIX = 'use-cache-';
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  getItem(key: string) {
    return this.store.get(key) || null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  clear() {
    this.store.clear();
  }
  key(index: number) {
    const iter = this.store.keys();
    let i = 0;
    let result: IteratorResult<string>;
    result = iter.next();
    while (!result.done) {
      if (i === index) {
        return result.value;
      }
      i++;
      result = iter.next();
    }
    return null;
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
}
const memoryStorage = new MemoryStorage();
interface ICacheOptions {
  storage: 'session' | 'local' | 'memory';
  expire: number;
}
/**
 * 缓存指定id的数据, 存入storage
 * @param id 数据的在storage中储存时的key
 * @param initValue
 * @param opts
 */
// export function useCache(id: string, initValue: any, opts: Partial<ICacheOptions> = {}): [Ref<T>, (val: T) => T] {
//   const storage = opts.storage || 'session';
//   let store: Storage;
//   switch (storage) {
//     case 'local': store = localStorage; break;
//     case 'session': store = sessionStorage; break;
//     case 'memory': store = memoryStorage; break;
//     default: store = sessionStorage; break;
//   }
//   const expire = isUndefined(opts.expire) ? 0 : opts.expire;
//   const type = typeof initValue;
//   if (!legalType.includes(type)) {
//     throw new TypeError(`useCache: Illegal type <${type}> of ${id}.`);
//   }
//   const cache = store.getItem(PREFIX + id);
//   const lastModified = store.getItem(PREFIX + 'last-modified-' + id);
//   let data: Ref<T>;
//   if (cache !== null && (!expire || lastModified && Date.now() - new Date(lastModified).getTime() < expire)) {
//     if (type === 'object') {
//       try {
//         data = ref(JSON.parse(cache));
//       } catch (e) {
//         console.error(new SyntaxError(`In useCache: cache <${id}> is <${type}>, but JSON.parse cannot parse it correctly.`));
//         throw e;
//       }
//     } else {
//       data = ref(parseValueType(cache, type));
//     }
//   } else {
//     data = ref(initValue);
//   }
//   function update(val: T) {
//     let value: string;
//     if (type === 'object') {
//       value = val ? JSON.stringify(val) : '';
//     } else {
//       value = String(val);
//     }
//     store.setItem(PREFIX + id, value);
//     if (expire) {
//       store.setItem(PREFIX + 'last-modified-' + id, Date.now().toString());
//     }
//     data.value = val;
//     return val;
//   }
//   return [data, update];
// }
function parseValueType(str: string, type: string) {
  switch (type) {
    case 'string':
      return str;
    case 'boolean':
      return str === 'true' || false;
    case 'number':
      return Number(str);
    default:
      return str;
  }
}
