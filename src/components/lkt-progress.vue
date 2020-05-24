<template>
  <div class="lkt-progress" :style="{ width: circle ? '' : '100%' }">
    <div v-if="!circle" class="lkt-progress--line" :style="{ height: strokeWidth + 'px', borderRadius: (strokeWidth / 2) + 'px', width: textInside ? '100%' : 'calc(100% - 50px)' }">
      <div class="lkt-progress--line--inner" :class="{ 'lkt-progress--line--transition': active }" :style="{ width: safePercentage + '%', borderRadius: (strokeWidth / 2) + 'px', lineHeight: strokeWidth + 'px' }"></div>
    </div>
    <svg v-else class="lkt-progress--circle" :width="viewBoxSize" :height="viewBoxSize" :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`">
      <path :d="`
          M ${viewBoxSize / 2} ${strokeWidth / 2}
          A ${radius},${radius} 0 1 1 ${viewBoxSize / 2},${viewBoxSize - strokeWidth / 2}
          A ${radius},${radius} 0 1 1 ${viewBoxSize / 2},${strokeWidth / 2}
        `"
        fill-opacity="0"
        :stroke="workPercentage < 100 ? '#cecdcf' : strokeColor"
        stroke-linecap="round"
        :stroke-width="strokeWidth"
      ></path>
      <path v-if="workPercentage && workPercentage < 100" :d="`
          M ${viewBoxSize / 2} ${strokeWidth / 2}
          A ${radius},${radius} 0 ${workPercentage > 50 ? '1' : '0'} 1 ${(endpoint[0] + 1) * radius + strokeWidth / 2},${(-endpoint[1] + 1) * radius + strokeWidth / 2}
        `"
        class="lkt-progress--circle--inner"
        fill-opacity="0"
        :stroke="strokeColor"
        stroke-linecap="round"
        :stroke-width="strokeWidth"
      ></path>
      <path v-if="active && workPercentage < 100 && activePercentage" :d="`
          M ${viewBoxSize / 2} ${strokeWidth / 2}
          A ${radius},${radius} 0 ${activePercentage > 50 ? '1' : '0'} 1 ${(activeEndPoint[0] + 1) * radius + strokeWidth / 2},${(-activeEndPoint[1] + 1) * radius + strokeWidth / 2}
        `"
        class="lkt-progress--circle--inner"
        fill-opacity="0"
        stroke="#fff"
        stroke-linecap="round"
        :stroke-opacity="activeOpacity"
        :stroke-width="strokeWidth"
      ></path>
    </svg>
    <span v-show="showText" :style="{ fontSize: fontSize || (circle ? '1.2rem' : '.8rem'), lineHeight: strokeWidth + 'px' }" class="lkt-progress--text" :class="{ 'lkt-progress--text--outside': !circle && !textInside, 'lkt-progress--text--center': circle }">{{ safePercentage }}%</span>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { computed, ref, watch, onMounted } from '@vue/composition-api';
import { sleep } from '../utils';
export default Vue.extend({
  props: {
    percentage: {
      type: Number,
      default: 0,
    },
    circle: Boolean,
    strokeWidth: {
      type: Number,
      default: 16,
    },
    strokeColor: {
      type: String,
      default: 'rgb(102, 177, 255)',
    },
    showText: {
      type: Boolean,
      default: true,
    },
    textInside: {
      type: Boolean,
      default: true,
    },
    fontSize: {
      type: String,
    },
    radius: {
      type: Number,
      default: 45,
    },
    disableTransition: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: Record<string, any>) {
    const viewBoxSize = computed(() => 2 * props.radius + props.strokeWidth);
    const safePercentage = computed(() => {
      return Math.min(100, Math.max(0, props.percentage));
    });
    const transitionPercentage = ref(props.percentage);
    let af = 0;
    !props.disableTransition && watch(safePercentage, percentage => {
      cancelAnimationFrame(af);
      function inc() {
        transitionPercentage.value = Math.min(transitionPercentage.value + 2, percentage);
        if (transitionPercentage.value < percentage) {
          af = requestAnimationFrame(inc);
        }
      }
      function dec() {
        transitionPercentage.value = Math.max(transitionPercentage.value - 2, percentage);
        if (transitionPercentage.value > percentage) {
          af = requestAnimationFrame(dec);
        }
      }
      af = requestAnimationFrame(percentage > transitionPercentage.value ? inc : dec);
    });
    const workPercentage = computed(() => props.disableTransition ? safePercentage.value : transitionPercentage.value);
    const endpoint = computed(() => {
      const PI = Math.PI;
      const arc = workPercentage.value / 100 * -2 * PI + 0.5 * PI;
      const result = [parseFloat(Math.cos(arc).toFixed(2)), parseFloat(Math.sin(arc).toFixed(2))];
      return result;
    });
    const activePercentage = ref(0);
    const activeEndPoint = computed(() => {
      const PI = Math.PI;
      const arc = activePercentage.value / 100 * -2 * PI + 0.5 * PI;
      const result = [parseFloat(Math.cos(arc).toFixed(2)), parseFloat(Math.sin(arc).toFixed(2))];
      return result;
    });
    const activeOpacity = ref(0.2);
    onMounted(() => {
      props.active && requestAnimationFrame(async function activeCircle() {
        const step = Math.max(0.05, workPercentage.value / 25 * 0.3);
        activePercentage.value = Math.min(activePercentage.value + step, workPercentage.value);
        const ratio = activePercentage.value / workPercentage.value;
        activeOpacity.value -= ratio < 0.7 ? (step / workPercentage.value / 7) : (step / workPercentage.value / 2);
        if (activePercentage.value === workPercentage.value) {
          activePercentage.value = 0;
          activeOpacity.value = 0.2;
          await sleep(500);
        }
        requestAnimationFrame(activeCircle);
      });
    });
    return {
      safePercentage,
      transitionPercentage,
      viewBoxSize,
      endpoint,
      activePercentage,
      activeEndPoint,
      activeOpacity,
      workPercentage,
    };
  },
});
</script>
<style lang="scss">
.lkt-progress {
  position: relative;
  display: inline-block;
}
.lkt-progress--line {
  border-radius: 50%;
  width: calc(100% - 50px);
  background-color: #cecdcf;
}
.lkt-progress--text {
  position: absolute;
  top: 0;
  left: 10px;
  color: #fff;
}
.lkt-progress--text--outside {
  left: calc(100% - 45px);
  color: #333;
}
.lkt-progress--text--center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
}
.lkt-progress--line--inner {
  position: relative;
  height: 100%;
  background-color: #0ae;
  color: #fff;
  transition: width .2s;
  overflow: hidden;
  &.lkt-progress--line--active::before {
    height: 100%;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    animation: lkt-progress-active 2.6s infinite cubic-bezier(.23, 1, .32, 1);
  }
}
@keyframes lkt-progress-active {
  0% {
    width: 0%;
    opacity: .2;
  }
  70% {
    opacity: .1;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
}
</style>

