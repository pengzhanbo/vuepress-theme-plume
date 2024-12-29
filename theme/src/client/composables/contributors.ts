import type { ComputedRef } from 'vue'
import type { GitContributor } from '../../shared/index.js'
import { computed } from 'vue'
import { isPlainObject } from 'vuepress/shared'
import { useData } from '../composables/data.js'
import { useThemeData } from './theme-data.js'

export function useContributors(): {
  mode: ComputedRef<'inline' | 'block'>
  contributors: ComputedRef<GitContributor[]>
} {
  const { page, frontmatter } = useData()
  const theme = useThemeData()

  const mode = computed(() => {
    const config = theme.value.contributors
    if (isPlainObject(config))
      return config.mode || 'inline'
    return 'inline'
  })

  const contributors = computed(() => {
    const config = frontmatter.value.contributors ?? !!theme.value.contributors

    if (config === false)
      return []

    return (page.value.git?.contributors ?? [])
  })

  return { mode, contributors }
}
