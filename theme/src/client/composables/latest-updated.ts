import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watchEffect } from 'vue'
import { usePageLang } from 'vuepress/client'
import { useData } from './data.js'
import { useThemeData } from './theme-data.js'

export function useLastUpdated(): {
  datetime: Ref<string>
  isoDatetime: ComputedRef<string | undefined>
  lastUpdatedText: ComputedRef<string>
} {
  const { theme, page, frontmatter } = useData()
  const themeData = useThemeData()
  const lang = usePageLang()

  const date = computed(() => page.value.git?.updatedTime ? new Date(page.value.git.updatedTime) : null)
  const isoDatetime = computed(() => date.value?.toISOString())

  const datetime = ref('')

  const lastUpdatedText = computed(() => {
    if (themeData.value.lastUpdated === false)
      return ''
    return theme.value.lastUpdatedText || 'Last updated'
  })

  // 副作用在 setup 顶层创建，随组件作用域自动回收。
  // `flush: 'post'` 将首次执行推迟到首次渲染之后：`datetime` 依赖本地时区，
  // 必须保持 SSR 渲染为空，避免水合不一致。
  //
  // Create the effect at setup scope so it is disposed with the component.
  // `flush: 'post'` defers the first run until after the initial render:
  // `datetime` depends on the local timezone, so it must stay empty during SSR
  // to keep hydration consistent.
  watchEffect(() => {
    if (frontmatter.value.lastUpdated === false || themeData.value.lastUpdated === false)
      return

    datetime.value = date.value
      ? new Intl.DateTimeFormat(
          themeData.value.lastUpdated?.formatOptions?.forceLocale ? lang.value : undefined,
          themeData.value.lastUpdated?.formatOptions ?? {
            dateStyle: 'short',
            timeStyle: 'short',
          },
        ).format(date.value)
      : ''
  }, { flush: 'post' })

  return {
    datetime,
    isoDatetime,
    lastUpdatedText,
  }
}
