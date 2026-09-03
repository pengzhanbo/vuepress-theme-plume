import type { ThemeReadAid } from '../../shared/index.js'
import { useEventListener, useMouseInElement, useResizeObserver } from '@vueuse/core'
import { computed, type CSSProperties, onMounted, shallowRef, watch } from 'vue'
import { useData } from '../composables/index.js'

interface Target {
  el: HTMLElement
  x: number
  y: number
  width: number
  height: number
}

const queries = [
  ':where(h2,h3,h4,h5,h6,p,table)', // 常规
  ':where(ul,ol) > li', // 列表项
  ':where(.vp-code-tabs,.code-block-title,div[class^="language-"],.code-repl)', // 代码块
  '.table-of-contents > ul > li', // 目录项
  '.footnotes > ol > li', // 页脚注
  ':where([class^="vp-card"],.vp-repo-card,.vp-link-card,.vp-image-card)',
  ':where(.vp-copyright,.vp-changelog-wrapper)', // 版权、变更日志
  '.hint-container', // 提示容器
  '.vp-field-group .vp-field', // 字段容器
  '.vp-field',
  '.vp-steps > :where(ul,ol) > li', // 步骤项
  ':where(.vp-align,.vp-flex,.window-wrapper)', // 对齐元素
  '.vp-demo-wrapper > div', // 代码演示
  ':where(.vp-file-tree,.vp-code-tree)', // 文件树、代码树容器
  ':where(.vp-tabs,.vp-table,.vp-qrcode)',
  '.vp-npm-badge',
  '.vp-swiper',
  '.vp-chat',
  ':where(.vp-encrypt-snippet,.decrypted-content)',
  '.vp-timeline .vp-timeline-item', // 时间线项
  '.vp-collapse .vp-collapse-item', // 折叠项
  ':where(.chartjs-wrapper,.echarts-wrapper,mermaid-wrapper,.flowchart-wrapper,.markmap-wrapper,.ciu_embed)', // 图表

  ':where(.read-aid,[data-read-aid])', // 额外元素，非内置支持元素可通过添加它们以获得支持
].map(query => `.vp-doc > div:not(.vp-read-aid) > ${query}`).join(',')

export function useReadAid() {
  const { page, collection, theme } = useData<'post', 'doc'>()

  const readAid = computed<ThemeReadAid>(() => {
    const opt = collection.value?.readAid ?? theme.value.readAid ?? false
    return typeof opt === 'boolean' ? 'left' : opt
  })

  const doc = shallowRef<HTMLElement>()
  const targets = shallowRef<Target[]>([])
  const { y, elementX, elementY, elementWidth, elementHeight, isOutside: isOutsideElement } = useMouseInElement(doc)

  const isOutside = computed(() => {
    if (isOutsideElement.value)
      return true
    // 继续收窄范围，避免内边距 padding 影响实际文档范围
    return elementX.value < 24 || elementX.value > elementWidth.value - 24
      || elementY.value < 0 || elementY.value > elementHeight.value
  })

  const current = computed(() => targets.value.find(t => y.value >= t.y && y.value < t.y + t.height))

  let offsetX = 0
  let offsetY = 0
  let prevStyle: CSSProperties | undefined

  const style = computed<CSSProperties | undefined>(() => {
    if (!readAid.value)
      return undefined
    if (!current.value || isOutside.value)
      return prevStyle
    let x = 0
    let y = 0
    let width = 0
    let height = 0
    if (readAid.value === 'mask') {
      width = current.value.width + 16
      height = current.value.height + 16
      y = current.value.y - offsetY - 8
      x = current.value.x - offsetX
    }
    else {
      y = current.value.y - offsetY
      width = 6
      height = current.value.height
    }
    prevStyle = { transform: `translate3d(${x}px,${y}px,0)`, width: `${width}px`, height: `${height}px` }
    return prevStyle
  })

  useEventListener('resize', initialize, { passive: true })
  useResizeObserver(doc, initialize)
  onMounted(() => void watch(() => page.value.path, initialize, { immediate: true }))

  function initialize() {
    doc.value = document.querySelector('.vp-doc') as HTMLElement
    const docRect = doc.value.getBoundingClientRect()
    offsetX = docRect.left + window.scrollX
    offsetY = docRect.top + window.scrollY

    targets.value = Array.from<HTMLElement>(document.querySelectorAll(queries))
      .map((el, index) => {
        const rect = el.getBoundingClientRect()
        const offset = el.tagName === 'H2' ? (index !== 0 ? 24 : 16) : 0
        return { el, x: rect.left + window.scrollX, y: rect.top + window.scrollY + offset, height: rect.height - offset, width: rect.width }
      })
  }

  return {
    isOutside,
    style,
    readAid,
  }
}
