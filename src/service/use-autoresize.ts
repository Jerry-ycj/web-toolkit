import { onUnmounted, onMounted, ref } from '@vue/composition-api';
import { SetupContext } from '@vue/composition-api';
interface IAutoResizeOptions {
  context: SetupContext;
  ref: string;
  pivot?: number;
}
/**
 * 使列表项自适应宽度
 * @param opts
 */
export function useAutoresize(opts: IAutoResizeOptions) {
  const pivot = opts.pivot || 360;
  const itemWidth = ref(pivot);
  const timer = 0;
  function onResize() {
    clearTimeout(timer);
    // timer = setTimeout(() => {
    //   const ref = opts.context.refs[opts.ref] as HTMLElement | HTMLElement[] | void;
    //   const ctn = Array.isArray(ref) ? ref[0] : ref;
    //   if (ctn) {
    //     const width = ctn.clientWidth;
    //     const col = Math.floor(width / pivot);
    //     itemWidth.value = width / col;
    //   }
    // }, 100);
  }
  onMounted(() => {
    window.addEventListener('resize', onResize);
    onResize();
  });
  onUnmounted(() => window.removeEventListener('resize', onResize));
  return itemWidth;
}
