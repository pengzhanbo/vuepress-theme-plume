import { computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue'
import { isLinkHttp } from 'vuepress/shared'
import { usePageData, usePageFrontmatter, useRoute, useSiteLocaleData, withBase } from 'vuepress/client'
import type { PlumeThemePageData, PlumeThemePageFrontmatter, WatermarkOptions } from '../../shared/index.js'
import { toArray } from '../utils/base.js'
import { useDarkMode } from './darkMode.js'
import { useThemeLocaleData } from './themeData.js'

const defaultWatermarkOptions: WatermarkOptions = {
  global: true,
  matches: [],
  width: 150,
  height: 100,
  rotate: -22,
  fullPage: true,
  gapX: 20,
  gapY: 20,
  opacity: 0.1,
  onlyPrint: false,
}

export function useWaterMark() {
  const isDark = useDarkMode()
  const site = useSiteLocaleData()
  const theme = useThemeLocaleData()
  const page = usePageData<PlumeThemePageData>()
  const frontmatter = usePageFrontmatter<PlumeThemePageFrontmatter>()
  const route = useRoute()

  const watermark = computed<WatermarkOptions>(() => {
    if (!theme.value.watermark)
      return {}

    const pageWatermark = typeof frontmatter.value.watermark === 'object' ? frontmatter.value.watermark : {}
    const content = site.value.title || theme.value.avatar?.name

    return {
      content,
      ...defaultWatermarkOptions,
      ...theme.value.watermark === true ? {} : theme.value.watermark,
      ...pageWatermark,
    }
  })

  const enableWatermark = computed(() => {
    if (!theme.value.watermark)
      return false

    const pageWatermark = frontmatter.value.watermark
    if (watermark.value.global)
      return pageWatermark !== false

    if (pageWatermark)
      return true

    const matches = toArray(watermark.value.matches!)
    return matches.some(toMatch)
  })

  function toMatch(match: string) {
    const relativePath = page.value.filePathRelative || ''
    if (match[0] === '^') {
      const regex = new RegExp(match)
      return regex.test(route.path) || (relativePath && regex.test(relativePath))
    }
    if (match.endsWith('.md'))
      return !!relativePath && relativePath.endsWith(match)

    return route.path.startsWith(match) || relativePath.startsWith(match)
  }

  const isFullPage = computed(() => !!watermark.value.fullPage)
  const onlyPrint = computed(() => !!watermark.value.onlyPrint)

  const svgRect = computed(() => ({
    width: watermark.value.width!,
    height: watermark.value.height!,
    gapX: watermark.value.gapX!,
    gapY: watermark.value.gapY!,
    svgWidth: watermark.value.width! + watermark.value.gapX!,
    svgHeight: watermark.value.height! + watermark.value.gapY!,
    opacity: watermark.value.opacity,
  }))

  const rotateStyle = computed(() => ({
    transformOrigin: 'center',
    transform: `rotate(${watermark.value.rotate}deg)`,
  }))

  const imageUrl = computed(() => {
    if (!enableWatermark)
      return ''
    const image = watermark.value.image || ''
    const source = typeof image === 'string' ? image : image[isDark.value ? 'dark' : 'light']
    return !source ? '' : isLinkHttp(source) ? source : withBase(source)
  })

  const svgElRef = ref<HTMLDivElement>()
  const watermarkUrl = ref('')
  const imageBase64 = ref('')
  const defaultTextColor = ref('')

  const content = computed(() => watermark.value.content)
  const textColor = computed(() => {
    if (!enableWatermark)
      return ''
    const textColor = watermark.value.textColor || defaultTextColor.value
    return typeof textColor === 'string' ? textColor : textColor[isDark.value ? 'dark' : 'light']
  })

  const makeImageToBase64 = (url: string) => {
    const canvas = document.createElement('canvas')
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.referrerPolicy = 'no-referrer'
    image.onload = () => {
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(image, 0, 0)
      imageBase64.value = canvas.toDataURL()
    }
    image.src = url
  }

  const makeSvgToBlobUrl = (svgStr: string) => {
    // svg MIME type: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    const svgBlob = new Blob([svgStr], {
      type: 'image/svg+xml',
    })
    return URL.createObjectURL(svgBlob)
  }

  const getDefaultTextColor = () => {
    const color = typeof document !== 'undefined' && typeof window !== 'undefined'
      ? window.getComputedStyle(document.documentElement).getPropertyValue('--vp-c-text-1')
      : ''
    defaultTextColor.value = color
  }

  watch(() => isDark.value, () => nextTick(getDefaultTextColor))

  onMounted(getDefaultTextColor)

  watchEffect(() => {
    if (imageUrl.value && enableWatermark.value)
      makeImageToBase64(imageUrl.value)
  })

  watch(
    () => [
      watermark.value,
      imageBase64.value,
      enableWatermark.value,
      textColor.value,
    ],
    () => {
      if (!enableWatermark.value)
        return

      nextTick(() => {
        if (svgElRef.value) {
          if (watermarkUrl.value)
            URL.revokeObjectURL(watermarkUrl.value)

          watermarkUrl.value = makeSvgToBlobUrl(svgElRef.value.innerHTML)
        }
      })
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (watermarkUrl.value)
      URL.revokeObjectURL(watermarkUrl.value)
  })

  return {
    enableWatermark,
    isFullPage,
    imageUrl,
    content,
    textColor,
    svgElRef,
    svgRect,
    rotateStyle,
    imageBase64,
    watermarkUrl,
    onlyPrint,
  }
}
