<template>
  <div class="lkt-scrollbar" ref="wrapper" @mousemove="onMousemove">
    <div
      ref="inner"
      class="lkt-scrollbar--inner"
      :class="innerClass"
      :style="innerStyle"
      @scroll="onScroll"
    >
      <slot></slot>
    </div>
    <div v-show="scrollThumbY < 100" class="lkt-scrollbar--pathway lkt-scrollbar--pathway--y" :class="{ 'lkt-scrollbar--pathway--always': showPathway }">
      <div
        onselectstart="return false"
        class="lkt-scrollbar--thumb"
        :style="{ transform: `translateY(${scrollTop}%)`, height: scrollThumbY + '%', backgroundColor: color || 'black' }"
        @mousedown="onMouseScrollStart($event, 'y')"
      ></div>
    </div>
    <div v-show="scrollThumbX < 100" class="lkt-scrollbar--pathway lkt-scrollbar--pathway--x" :class="{ 'lkt-scrollbar--pathway--always': showPathway }">
      <div
        onselectstart="return false"
        class="lkt-scrollbar--thumb"
        :style="{ transform: `translateX(${scrollLeft}%)`, width: scrollThumbX + '%', backgroundColor: color || 'black' }"
        @mousedown="onMouseScrollStart($event, 'x')"
      ></div>
    </div>
  </div>
</template>
<script lang='ts'>
import Vue from 'vue';
import { ref, computed, onMounted, onUnmounted } from '@vue/composition-api';
import { debounce } from '../utils';
export default Vue.extend({
  props: {
    color: String,
    innerClass: [Object, Array, String],
    innerStyle: [Object, String],
    showPathway: Boolean,
  },
  setup(props: Record<string, any>, ctx) {
    let scrolling = false;
    let scrollDirection: ScrollDirection = 'y'; // x or y
    const scrollThumbY = ref(100); // percentage of horizontal scrollbar
    const scrollThumbX = ref(100); // percentage of vertical scrollbar
    const scrollTop = ref(0); // mock property based on raw, it's a percentage used in translate
    const scrollLeft = ref(0); // mock property based on raw, it's a percentage used in translate
    const wrapper = ref<HTMLElement>();
    const inner = ref<HTMLElement>();
    let scrollStartPosition = { x: 0, y: 0, top: 0, left: 0 }; // state before scroll
    const maxScrollTop = computed(() => {
      if (!wrapper.value) {
        return 0;
      }
      const content = wrapper.value.children[0];
      if (!content) {
        return 0;
      }
      return (1 - content.clientHeight / content.scrollHeight) * 100 / scrollThumbY.value * 100;
    });
    const maxScrollLeft = computed(() => {
      if (!wrapper.value) {
        return 0;
      }
      const content = wrapper.value.children[0];
      if (!content) {
        return 0;
      }
      return (1 - content.clientWidth / content.scrollWidth) * 100 / scrollThumbX.value * 100;
    });
    const onMouseScrollStart = (e: MouseEvent, direction: ScrollDirection) => {
      scrolling = true;
      scrollDirection = direction;
      scrollStartPosition = {
        x: e.x,
        y: e.y,
        top: scrollTop.value,
        left: scrollLeft.value,
      };
    };
    const onScroll = () => {
      if (!scrolling && inner.value) {
        if (scrollThumbY.value < 100) {
          scrollTop.value = inner.value.scrollTop / inner.value.scrollHeight * 100 / scrollThumbY.value * 100;
        }
        if (scrollThumbX.value < 100) {
          scrollLeft.value = inner.value.scrollLeft / inner.value.scrollWidth * 100 / scrollThumbX.value * 100;
        }
      }
    };
    const onMouseScrollEnd = () => scrolling = false;
    const onMouseScroll = (e: MouseEvent) => {
      const direction = scrollDirection;
      if (scrolling) {
        const { x, y } = e;
        if (inner.value) {
          if (direction === 'y') {
            const dy = y - scrollStartPosition.y;
            const innerH = inner.value.clientHeight;
            const top = scrollStartPosition.top + dy / innerH * 100 / scrollThumbY.value * 100; // calc diff based on percentage of thumb
            scrollTop.value = Math.min(maxScrollTop.value, Math.max(0, top));
            inner.value.scrollTop = scrollTop.value / 100 * innerH * scrollThumbY.value * 0.01 / innerH * inner.value.scrollHeight;
          } else {
            const dx = x - scrollStartPosition.x;
            const innerW = inner.value.clientWidth;
            const left = scrollStartPosition.left + dx / innerW * 100 / scrollThumbX.value * 100;
            scrollLeft.value = Math.min(maxScrollLeft.value, Math.max(0, left));
            inner.value.scrollLeft = scrollLeft.value / 100 * innerW * scrollThumbX.value * 0.01 / innerW * inner.value.scrollWidth;
          }
        }
      }
    };
    const onMousemove = debounce(() => {
      if (inner.value) {
        const currentScrollThumbY = inner.value.clientHeight / inner.value.scrollHeight * 100;
        const currentScrollThumbX = inner.value.clientWidth / inner.value.scrollWidth * 100;
        if (scrollThumbY.value !== currentScrollThumbY || scrollThumbX.value !== currentScrollThumbX) {
          scrollThumbY.value = currentScrollThumbY;
          scrollThumbX.value = currentScrollThumbX;
          onScroll();
        }
      }
    }, { interval: 500 });
    onMounted(() => {
      document.addEventListener('mouseup', onMouseScrollEnd);
      document.addEventListener('mousemove', onMouseScroll);
      onMousemove();
    });
    onUnmounted(() => {
      document.removeEventListener('mouseup', onMouseScrollEnd);
      document.removeEventListener('mousemove', onMouseScroll);
    });
    return {
      inner,
      wrapper,
      scrollThumbX,
      scrollThumbY,
      scrollTop,
      scrollLeft,
      onMousemove,
      onScroll,
      onMouseScrollStart,
    };
  },
});
type ScrollDirection = 'x' | 'y';
</script>
<style lang="scss">
.lkt-scrollbar {
  position: relative;
  overflow: hidden;
  &:hover > .lkt-scrollbar--pathway {
    opacity: .3;
  }
}
.lkt-scrollbar--pathway {
  position: absolute;
  opacity: 0;
  transition: opacity .2s;
  cursor: pointer;
  user-select: none;
}
.lkt-scrollbar--pathway--always {
  opacity: .3;
}
.lkt-scrollbar--pathway--y {
  height: 100%;
  width: 7px;
  right: 0;
  top: 0;
}
.lkt-scrollbar--pathway--x {
  width: 100%;
  height: 7px;
  left: 0;
  bottom: 0;
}
.lkt-scrollbar--thumb {
  user-select: none;
  width: 100%;
  height: 100%;
  border-radius: 30px;
}
.lkt-scrollbar--inner {
  overflow: scroll;
  width: calc(100% + 17px);
  height: calc(100% + 17px);
  padding-right: 8px;
  &::-webkit-scrollbar {
    width: 17px;
    height: 17px;
    background-color: transparent;
  }
}
</style>
