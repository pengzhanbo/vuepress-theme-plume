<script setup lang="ts">
import type { SizeOptions } from '../../shared/index.js'
import { computed, onBeforeUnmount, onMounted, toRefs } from 'vue'
import { ClientOnly } from 'vuepress/client'
import { useSize } from '../composables/size.js'
import { createEmbedStatus } from '../utils/embedStatus.js'
import Loading from './icons/Loading.vue'

/**
 * Unified frame for third-party iframe embeds (CodePen / JSFiddle / CodeSandbox /
 * Replit / video embeds).
 *
 * It centralizes the shared concerns that used to be duplicated (and missing) in
 * each embed component:
 * - a loading placeholder while the embed is not ready,
 * - an error state with a fallback link when the embed fails (removed, blocked
 *   by region / CSP, or silently swallowed by the browser),
 * - a timeout guard: if the `load` event never fires within `timeout` ms the
 *   frame falls back to the error state instead of showing a blank box forever.
 *
 * 第三方 iframe 嵌入（CodePen / JSFiddle / CodeSandbox / Replit / 视频嵌入）的统一容器。
 * 集中处理各嵌入组件此前重复实现（甚至缺失）的职责：
 * - 未就绪时展示 loading 占位；
 * - 加载失败（被删除、区域限制、CSP 拦截，或被浏览器静默吞掉）时展示错误状态与兜底链接；
 * - 超时保护：`timeout` 毫秒内未触发 `load` 事件则回退到错误状态，避免永久空白或永久 loading。
 */
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  /** Embed URL / 嵌入地址 */
  src: string
  /** Accessible iframe title / iframe 无障碍标题 */
  title?: string
  /** Native lazy loading / 原生懒加载 */
  loading?: 'lazy' | 'eager'
  /** iframe sandbox attribute / iframe sandbox 属性 */
  sandbox?: string
  /** iframe allow attribute / iframe allow 属性 */
  allow?: string
  /** Allow fullscreen / 允许全屏 */
  allowfullscreen?: boolean
  /** Allow transparency / 允许透明背景 */
  allowtransparency?: boolean
  /**
   * Timeout in milliseconds; `<= 0` disables the guard.
   *
   * 超时时间（毫秒），`<= 0` 表示禁用超时保护。
   */
  timeout?: number
} & SizeOptions>(), {
  timeout: 15000,
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const options = toRefs(props)
const { el, width, height: sizedHeight, resize } = useSize<HTMLIFrameElement>(options)

/**
 * Whether the height must be measured from the width (video embeds without an
 * explicit height, using `ratio`).
 *
 * 是否需要根据宽度计算高度（未显式指定高度、依赖 `ratio` 的视频嵌入）。
 */
const responsive = computed(() => props.ratio !== undefined || props.height === undefined)
const frameWidth = computed(() => width.value)
const frameHeight = computed(() => props.height || sizedHeight.value)

const wrapperStyle = computed(() => ({
  width: frameWidth.value,
  // 非响应式时在容器上预留高度，保证 SSR / 首屏不产生抖动。
  // Reserve the height on the wrapper when not responsive so SSR / first paint
  // do not shift.
  height: responsive.value ? undefined : frameHeight.value,
}))

const iframeStyle = computed(() => ({
  width: '100%',
  height: responsive.value ? frameHeight.value : '100%',
}))

const { status, start, markLoaded, markError, dispose } = createEmbedStatus(props.timeout)

onMounted(start)
onBeforeUnmount(dispose)

function onLoad(event: Event): void {
  markLoaded()
  resize()
  emit('load', event)
}

function onError(event: Event): void {
  markError()
  emit('error', event)
}
</script>

<template>
  <div class="embed-frame" v-bind="$attrs" :style="wrapperStyle">
    <ClientOnly>
      <iframe
        ref="el"
        class="embed-frame-iframe"
        :src="src"
        :title="title"
        :style="iframeStyle"
        :loading="loading"
        :sandbox="sandbox"
        :allow="allow"
        :allowfullscreen="allowfullscreen"
        :allowtransparency="allowtransparency"
        @load="onLoad"
        @error="onError"
      />
      <Loading v-if="status === 'loading'" absolute />
      <div v-else-if="status === 'error'" class="embed-frame-error">
        <p class="embed-frame-error-text">
          Failed to load
        </p>
        <a class="embed-frame-error-link" :href="src" target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
      </div>
    </ClientOnly>
  </div>
</template>

<style>
.embed-frame {
  position: relative;
  margin: 16px auto;
  overflow: hidden;
  border: none;
}

.embed-frame-iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: none;
}

.embed-frame-error {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: var(--vp-c-text-2);
  text-align: center;
  background-color: var(--vp-c-bg-soft);
}

.embed-frame-error-text {
  margin: 0;
}

.embed-frame-error-link {
  color: var(--vp-c-brand-1);
}
</style>
