import { computed, onMounted, ref, watchEffect } from 'vue'
import { usePageLang } from 'vuepress/client'
import { useData } from './data.js'

export function useLastUpdated() {
  const { theme, page, frontmatter } = useData()
  const lang = usePageLang()

  const date = computed(() => page.value.git?.updatedTime ? new Date(page.value.git.updatedTime) : null)
  const isoDatetime = computed(() => date.value?.toISOString())

  const datetime = ref('')

  const lastUpdatedText = computed(() => {
    if (theme.value.lastUpdated === false)
      return
    return theme.value.lastUpdated?.text || theme.value.lastUpdatedText || 'Last updated'
  })

  onMounted(() => {
    watchEffect(() => {
      if (frontmatter.value.lastUpdated === false || theme.value.lastUpdated === false)
        return

      datetime.value = date.value
        ? new Intl.DateTimeFormat(
          theme.value.lastUpdated?.formatOptions?.forceLocale ? lang.value : undefined,
          theme.value.lastUpdated?.formatOptions ?? {
            dateStyle: 'short',
            timeStyle: 'short',
          },
        ).format(date.value)
        : ''
    })
  })

  return {
    datetime,
    isoDatetime,
    lastUpdatedText,
  }
}
