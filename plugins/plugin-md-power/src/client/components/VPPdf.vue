<script setup lang="ts">
import type { EmbedPdfContainer, I18nPlugin, PluginRegistry, ScrollPlugin } from '@embedpdf/vue-pdf-viewer'
import type { PDFTokenMeta } from '../../shared/index.js'
import { useDarkMode } from '@vuepress/helper/client'
import { defineAsyncComponent, onMounted, shallowRef, toRefs, watch } from 'vue'
import { ClientOnly, usePageLang } from 'vuepress/client'
import { useSize } from '../composables/size.js'

const props = withDefaults(defineProps<PDFTokenMeta>(), {
  ratio: 1 / 0.9,
})

const PDFViewer = defineAsyncComponent(() =>
  import(/* webpackChunkName: "embed-pdf" */ '@embedpdf/vue-pdf-viewer').then(m => m.PDFViewer),
)

const options = toRefs(props)
const { el, width, height, resize } = useSize(options)
const isDark = useDarkMode()
const lang = usePageLang()

const pr = shallowRef<PluginRegistry | null>(null)
const container = shallowRef<EmbedPdfContainer | null>(null)

function init(c: EmbedPdfContainer) {
  container.value = c
}

function ready(r: PluginRegistry) {
  pr.value = r
  if (props.page) {
    const scroll = pr.value.getPlugin<ScrollPlugin>('scroll')?.provides()
    scroll?.onLayoutReady(() => {
      scroll?.scrollToPage({ pageNumber: Number(props.page) })
    })
  }
}

watch(isDark, () => {
  container.value?.setTheme(isDark.value ? 'dark' : 'light')
})

watch(lang, () => {
  const locale = pr.value?.getPlugin<I18nPlugin>('i18n')?.provides()
  locale?.setLocale(lang.value)
})

onMounted(() => resize())
</script>

<template>
  <div ref="el" class="vp-pdf" :style="{ width, height }">
    <ClientOnly>
      <PDFViewer
        class="pdf-viewer"
        :config="{
          src,
          zoom: { defaultZoomLevel: 'fit-width' as any },
          theme: { preference: isDark ? 'dark' : 'light' },
          i18n: { defaultLocale: lang, fallbackLocale: 'en' },
        }"
        @init="init"
        @ready="ready"
      />
    </ClientOnly>
  </div>
</template>

<style>
.vp-pdf {
  position: relative;
  overflow: hidden;
  border: solid 1px var(--vp-c-divider);
  border-radius: 4px;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
}
</style>
