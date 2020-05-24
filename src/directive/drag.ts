import Vue from 'vue';
import { DirectiveBinding } from 'vue/types/options';

export function extractCoord(transform: string): [number, number] {
  const reg = /translate\((?<x>[^\(\)\,]+), *(?<y>[^\(\)\,]+)\)/;
  let matched = transform.match(reg);
  if (!matched) {
    matched = transform.match(/translateX\( *(?<x>[^\(\)\,]+) *\)/);
  }
  if (!matched) {
    matched = transform.match(/translateY\( *(?<y>[^\(\)\,]+) *\)/);
  }
  const groups = matched ? matched.groups || {} : {};
  let x: number = 0;
  if (groups.x) {
    const digit = Number(groups.x.replace('px', ''));
    if (!isNaN(digit)) {
      x = digit;
    }
  }
  let y: number = 0;
  if (groups.y) {
    const digit = Number(groups.y.replace('px', ''));
    if (!isNaN(digit)) {
      y = digit;
    }
  }
  return [x, y];
}

type DragEventHandler = (e: MouseEvent) => any;
interface Modifiers {
  strict?: boolean;
  pointer?: boolean;
}
interface Handlers {
  dragstart: DragEventHandler;
  drag: DragEventHandler;
  dragend: DragEventHandler;
}

const handlerMap = new Map<HTMLElement, Handlers>();

let uid = 0;

const drag = {
  bind,
  componentUpdated: bind,
  unbind,
};

Vue.directive('drag', drag);

function bind(el: HTMLElement, binding: DirectiveBinding) {
  if (!binding.expression || binding.value) {
    _bind(el, binding.modifiers);
  } else {
    unbind(el, binding);
  }
}

function _bind(el: HTMLElement, modifiers: Modifiers) {
  if (handlerMap.has(el)) {
    return;
  }
  const { strict, pointer } = modifiers;
  let [translateX, translateY] = extractCoord(el.style.transform || '');
  let startX = 0;
  let startY = 0;
  let startTranslateX = 0;
  let startTranslateY = 0;
  let dx = 0;
  let dy = 0;
  let draggable = false;
  const thisId = uid++;

  if (pointer) {
    el.classList.add('lkt-draggable--pointer');
  }
  el.style.transform = `translate(${translateX}px, ${translateY}px)`;
  el.style.transition = 'none';
  el.dataset.lktDragId = thisId.toString();
  el.classList.add('lkt-draggable');
  const dragstart = ({ screenX, screenY, target }: MouseEvent) => {
    if (strict && (target as HTMLElement).dataset.lktDragId !== thisId.toString()) {
      return;
    }
    startX = screenX;
    startY = screenY;
    startTranslateX = translateX;
    startTranslateY = translateY;
    draggable = true;
  };
  const drag = ({ screenX, screenY }: MouseEvent) => {
    if (draggable) {
      dx = screenX - startX;
      dy = screenY - startY;
      translateX = startTranslateX + dx;
      translateY = startTranslateY + dy;
      el.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }
  };
  const dragend = () => draggable = false;
  handlerMap.set(el, {
    dragstart,
    drag,
    dragend,
  });
  el.addEventListener('mousedown', dragstart);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', dragend);
}

function unbind(el: HTMLElement, binding: DirectiveBinding) {
  const pointer = binding.modifiers.pointer;
  if (pointer) {
    el.classList.remove('lkt-draggable--pointer');
  }
  const handlers = handlerMap.get(el);
  if (handlers) {
    el.classList.remove('lkt-draggble');
    el.removeEventListener('mousedown', handlers.dragstart);
    document.removeEventListener('mousemove', handlers.drag);
    document.removeEventListener('mouseup', handlers.dragend);
    handlerMap.delete(el);
  }
}
