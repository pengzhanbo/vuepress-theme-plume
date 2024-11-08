import type { ComputedRef } from 'vue'
import type {
  NavItemWithLink,
} from '../../shared/index.js'
import { computed } from 'vue'
import { resolveEditLink } from '../utils/index.js'
import { useData } from './data.js'
import { useThemeData } from './theme-data.js'

export function useEditLink(): ComputedRef<null | NavItemWithLink> {
  const { theme, page, frontmatter } = useData()
  const themeData = useThemeData()

  return computed(() => {
    const showEditLink
      = frontmatter.value.editLink ?? themeData.value.editLink ?? true
    if (!showEditLink)
      return null

    const {
      docsRepo,
      docsBranch = 'main',
      docsDir = '',
    } = themeData.value
    const { editLinkText } = theme.value

    if (!docsRepo)
      return null

    const editLink = resolveEditLink({
      docsRepo,
      docsBranch,
      docsDir,
      filePathRelative: page.value.filePathRelative,
      editLinkPattern:
        frontmatter.value.editLinkPattern ?? theme.value.editLinkPattern,
    })

    if (!editLink)
      return null

    return {
      text: editLinkText ?? 'Edit this page',
      link: editLink,
    }
  })
}
