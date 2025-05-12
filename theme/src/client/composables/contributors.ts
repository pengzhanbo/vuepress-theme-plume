import type { ComputedRef } from 'vue'
import type { GitContributor } from '../../shared/index.js'
import { useContributors as _useContributors } from '@vuepress/plugin-git/client'
import { computed } from 'vue'
import { isPlainObject } from 'vuepress/shared'
import { useData } from '../composables/data.js'
import { useThemeData } from './theme-data.js'

interface useContributorsResult {
  mode: ComputedRef<'inline' | 'block'>
  contributors: ComputedRef<GitContributor[]>
  hasContributors: ComputedRef<boolean>
}

export function useContributors(): useContributorsResult {
  const { frontmatter } = useData()
  const list = _useContributors()

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

    return list.value
  })

  const hasContributors = computed(() => contributors.value.length > 0)

  return { mode, contributors, hasContributors }
}
