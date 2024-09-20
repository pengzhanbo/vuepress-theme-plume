import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { useData } from '../composables/data.js'
import { toArray } from '../utils/index.js'

export function useContributors(): ComputedRef<string[]> {
  const { theme, page, frontmatter } = useData()

  return computed(() => {
    const config = frontmatter.value.contributors ?? theme.value.contributors ?? true

    if (config === false)
      return []

    const contributors = config === true ? [] : toArray(config)
    const gitContributors = (page.value.git?.contributors ?? []).map(({ name }) => name)

    return Array.from(new Set([...gitContributors, ...contributors]))
  })
}
