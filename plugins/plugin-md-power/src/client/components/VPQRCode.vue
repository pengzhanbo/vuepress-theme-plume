<script setup lang="ts">
import type { QRCodeToDataURLOptions, QRCodeToStringOptions } from 'qrcode'
import type { QRCodeProps } from '../../shared/index.js'
import { isLinkWithProtocol } from '@vuepress/helper/client'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { resolveRoute, usePage, withBase } from 'vuepress/client'

const { title, text, mode, align = 'left', reverse = false, svg = false, width, level, version, mask, margin = 2, scale = 4, light, dark } = defineProps<QRCodeProps>()

const page = usePage()

let qr: typeof import('qrcode') | null = null

const qrcode = ref('')
const parsedText = ref('')
const isLink = ref(false)

const styles = computed(() => {
  const size = typeof width === 'number' ? width : width ? Number.parseInt(width) : undefined
  return size ? { '--vp-qrcode-size': `${size}px` } : undefined
})

function parseText(): string | void {
  isLink.value = false
  if (!text || __VUEPRESS_SSR__)
    return ''

  if (text === '.') {
    isLink.value = true
    return location.href.split(/[?#]/)[0]
  }

  if (isLinkWithProtocol(text)) {
    isLink.value = true
    return text.startsWith('//') ? `${location.protocol}${text}` : text
  }

  if (text.startsWith('/') || text.startsWith('./')) {
    const [routePath, ...rest] = text.split(/([?#])/)
    const currentPath = page.value.filePathRelative ? `/${page.value.filePathRelative}` : undefined
    const { notFound, path } = resolveRoute(routePath, currentPath)
    if (notFound) {
      return text
    }
    isLink.value = true
    return new URL(`${withBase(path)}${rest.join('')}`, location.href).toString()
  }

  return text
}

onMounted(async () => {
  const callback = (_: any, url: string) => qrcode.value = url

  watch(
    () => [text, svg, level, version, mask, margin, scale, light, dark],
    async () => {
      const text = parseText()
      parsedText.value = text || ''
      if (!text) {
        qrcode.value = ''
        return
      }

      qr ??= (await import(/* webpackChunkName: "qrcode" */ 'qrcode')).default
      const opts: QRCodeToDataURLOptions & QRCodeToStringOptions = {
        version,
        maskPattern: mask,
        errorCorrectionLevel: (level ? level.toUpperCase() : 'M') as any,
        width: 300 * Math.round(window.devicePixelRatio || 1),
        margin,
        scale,
        color: { dark, light },
      }

      if (svg)
        qr.toString(text, { type: 'svg', ...opts }, callback)
      else
        qr.toDataURL(text, { type: 'image/png', ...opts }, callback)
    },
    { immediate: true },
  )
})

onUnmounted(() => {
  qr = null
})
</script>

<template>
  <div v-if="qrcode" class="vp-qrcode" :class="{ card: mode === 'card', reverse, [align]: true }">
    <div class="qrcode-content">
      <div v-if="svg" class="qrcode-svg" :style="styles" :title="parsedText" v-html="qrcode" />
      <img v-else class="qrcode-img" :src="qrcode" :alt="parsedText" :title="parsedText" :style="styles">
      <div v-if="title && mode !== 'card'" class="qrcode-label">
        {{ title }}
      </div>
    </div>

    <div v-if="mode === 'card'" class="qrcode-info">
      <p v-if="title" class="qrcode-title">
        {{ title }}
      </p>
      <p v-if="parsedText">
        <a v-if="isLink" :href="parsedText" rel="noopener noreferrer" target="_blank">
          {{ parsedText }}
        </a>
        <span v-else v-html="parsedText.replaceAll('\n', '<br>')" />
      </p>
    </div>
  </div>
</template>

<style scoped>
.vp-qrcode {
  --vp-qrcode-size: 128px;

  margin: 16px 0;
  overflow: hidden;
}

@media (min-width: 768px) {
  .vp-qrcode {
    --vp-qrcode-size: 150px;
  }
}

.vp-qrcode:not(.card).center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vp-qrcode:not(.card).right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.vp-qrcode .qrcode-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: max-content;
  max-width: 100%;
  overflow: hidden;
}

.vp-qrcode .qrcode-label {
  font-size: 14px;
  color: var(--vp-c-text-2);
  text-align: center;
  word-break: break-all;
}

.vp-qrcode.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
}

.vp-qrcode .qrcode-svg,
.vp-qrcode .qrcode-img {
  width: var(--vp-qrcode-size);
  max-width: 100%;
  height: var(--vp-qrcode-size);
  aspect-ratio: 1/1;
}

.vp-qrcode .qrcode-svg :deep(svg) {
  max-width: 100%;
  max-height: 100%;
}

.vp-qrcode .qrcode-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  text-align: center;
}

.vp-qrcode .qrcode-info > p {
  margin: 0;
  word-break: break-all;
}

.vp-qrcode .qrcode-info .qrcode-title {
  font-weight: 600;
}

@media (min-width: 960px) {
  .vp-qrcode.card {
    flex-direction: row;
    gap: 16px;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .vp-qrcode.card .qrcode-info {
    align-self: center;
    text-align: left;
  }

  .vp-qrcode.card:where(.reverse, .right) {
    flex-direction: row-reverse;
  }

  .vp-qrcode.card:where(.reverse, .right) .qrcode-info {
    text-align: right;
  }

  .vp-qrcode.card.center {
    align-items: center;
  }

  .vp-qrcode.card.center .qrcode-info {
    flex: initial;
  }
}
</style>
